import * as path from 'path'
import * as swc from '@swc/core'
import { fastify, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import * as fs from 'fs/promises'
import { Dirent, existsSync } from 'fs'
import watch from 'node-watch'
import { createRequire } from 'module'
import send from 'send'
import slugify from 'slugify'

import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

import { Preview } from '../preview'

export type Templates = Array<{ name: string }>

export type TemplatesState = {
  items: Templates
}

let TMP_DIR = '.postler'

let server = fastify()

server.register(cors, {
	origin: '*'
})

let NoOp = () => null

export type ServeArgs = {
	workingDirectory?: string,
	port?: number,
}

export default async function handler({
	workingDirectory = process.cwd(),
	port = 47150,
}: ServeArgs) {
	let cwd = path.isAbsolute(workingDirectory)
		? workingDirectory
		: path.resolve(workingDirectory)

	let src = path.join(cwd, 'src')
	let dist = path.join(cwd, TMP_DIR)

	if (existsSync(dist)) {
		console.log(`Clear ${TMP_DIR} directory`)
		await fs.rm(dist, { recursive: true })
	}
	
	console.log('src: ', src)
	let files = await getFiles(src)
	await buildFiles(src, dist, files)

	watch(src, { recursive: true }, async (evt, name) => {
		switch(evt) {
			case 'remove': {
				let filePath = toRelativePath(src, name)
				let distPath = path.join(dist, ...filePath)
				await fs.rm(distPath, { recursive: true }).catch(err => {
					console.log('Failed to delete: ', err)
				})
			}
			break

			case 'update': {
				let stat = await fs.lstat(name)
				if (!stat.isDirectory()) {
					process.nextTick(async () => {
						await transpile(name, src, dist)
					})
				} else {
					await fs.mkdir(name, { recursive: true })
				}
			}
			break
		}
	})

	watch(dist, { recursive: true }, async (_evt, _name) => {
		let files = await getFiles(dist)
		files.forEach(file => {
			if (require.cache[file]) {
				delete require.cache[file]
			}
		})
	})

	let root = path.join(getPreviewDirectory(cwd), 'dist')
	let indexHtml = path.join(root, 'index.html')
	server.get('/preview*', async (req, reply) => {
		let { '*': filePath } = req.params as { '*': string }
		let _filePath = filePath === '' ? 'index.html' : filePath
		let file = path.join(root, _filePath)
		let { type, content } = await fs
			.readFile(file)
			.then(content => ({
				content,
				type: send.mime.lookup(_filePath),
			}))
			.catch(async () => {
				let content = await fs.readFile(indexHtml)
				return { content, type: send.mime.lookup('index.html') }
			})

		reply.header('Content-Type', type)

		return content
	})

	server.get('/', async (_, reply) => {
		let items = await getTemplates(src)
		let template = items.at(0)
		reply.redirect(`/preview/${template?.name ?? ''}`)
	})

	server.get('/api/updates', (request, reply) => {

		let headers = {
			'Content-Type': 'text/event-stream',
			'Connection': 'keep-alive',
			'Cache-Control': 'no-cache,no-transform',
		}

		reply.raw.writeHead(200, headers);

		let watcher = watch(dist, { recursive: true }, (event, name) => {
			let filePath = toRelativePath(dist, name).join(path.posix.sep)
			let data = JSON.stringify({ event, path: filePath })
			reply.raw.write(`data: ${data}\n\n`)
		})

		request.socket.on('close', () => watcher.close())
	})

	server.get('/api/template/:template', async (req, reply) => {
		let { template } = req.params as { template: string }
		let { Template = NoOp } = require(path.join(dist, 'template', template, 'template.js'))

		let cache = createCache({ key: 'template' })
		let { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache)

		let html = renderToStaticMarkup(
		  createElement(CacheProvider, { value: cache }, 
		  	createElement(Template)
		  )
		)

		let chunks = extractCriticalToChunks(html)
		let styles = constructStyleTagsFromChunks(chunks)

		let markup = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
			    <meta charset="UTF-8">
			    <meta name="viewport" content="width=device-width, initial-scale=1.0">
			    <meta http-equiv="X-UA-Compatible" content="ie=edge">
			    <title>My site</title>
			    ${styles}
			</head>
				${html}
			</html>
		`
		return {markup}
	})

	server.get('/api/templates', async (): Promise<TemplatesState> => {
		let items = await getTemplates(src)
		return { items }
	})

	server.get('/api/schema/:template', async () => {
		// TODO:
		// use https://github.com/YousefED/typescript-json-schema to extract the
		// props schema for a given template.
		// should return a JSON Schema
		return {}
	})

	server.get('/api/preview/list', async ({ query }: PreviewRequest) => {
		try {
			let { template = '' } = query
			let { Data = [] } = require(path.join(dist, 'template', template, 'preview.js'))
			let items = Data.map((item: Preview<any>) => {
				return { ...item, title: slugify(item.title)}
			})
			return { items }
		} catch(err) {
			return { items: [] }
		}
	})

	server.listen({
		port,
	})

	console.log(`Postler server has started on port: ${port}`)
}

type PreviewRequest = FastifyRequest<{
  Querystring: { template?: string }
}>

async function getFiles(src: string): Promise<Array<string>> {
	let entries = await fs.readdir(src, { withFileTypes: true })
	
	let sink = await Promise.all(
		entries.map(async entry => {
			if (entry.isDirectory()) {
				let files = await getFiles(path.join(src, entry.name))
				return files.flat()
			}

			return [path.join(src, entry.name)]
		})
	)

	return sink.flat()
}

function toRelativePath(src: string, file: string): Array<string> {
	let srcParts = src.split(path.sep)
	let fileParts = file.split(path.sep)
	return fileParts.slice(srcParts.length)
}

async function buildFiles(src: string, dist: string, files: Array<string>) {
	for (let file of files) {
		 await transpile(file, src, dist)
	}
}

async function transpile(file: string, src: string, dist: string) {
	let { code } = await swc
		.transformFile(file, {
			module: {
				type: 'commonjs'
			},
			jsc: {
				parser: {
					syntax: 'typescript',
					tsx: true,
				},
				target: 'es2022',
				transform: {
					react: {
						runtime: 'automatic'
					}
				}
			}
		})

	let parts = toRelativePath(src, file)
	let [fileName, ...filePath] = parts.reverse()
	let out = path.join(dist, ...filePath.reverse())

	if (!existsSync(out)) {
		await fs.mkdir(out, { recursive: true })
	}

	let outFile = path.join(
		out,
		`${path.parse(fileName).name}.js`
	)

	await fs.writeFile(outFile, code)
}

function getPreviewDirectory(cwd: string): string {
	let req = createRequire(cwd)
	return path.dirname(req.resolve('postler-preview/package.json'))
}

async function getTemplates(src: string): Promise<Array<Dirent>> {
	let templateDir = path.join(src, 'template')
	let files = await fs.readdir(templateDir, { withFileTypes: true })
	return files.filter(file => file.isDirectory())
}