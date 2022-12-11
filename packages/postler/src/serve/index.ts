import * as path from 'path'
import { fastify, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'
import watch from 'node-watch'



import { buildFiles } from '../utils/build'
import { getFiles, getPreviewDirectory } from '../utils/files'

import { onSrcChange, onDistChange } from './watch'
import { createServeHandler, createRedirectHandler, createPreviewsHandler } from './preview'
import { createUpdatesHandler } from './updates'
import { createTemplateHandler, createTemplatesHandler } from './template'

let TMP_DIR = '.postler'

export type ServeArgs = {
	workingDirectory?: string,
	port?: number,
	tmpDir?: string,
}

export default async function handler({
	workingDirectory = process.cwd(),
	port = 47150,
	tmpDir = TMP_DIR,
}: ServeArgs) {
	let cwd = path.isAbsolute(workingDirectory)
		? workingDirectory
		: path.resolve(workingDirectory)

	let src = path.join(cwd, 'src')
	let tmp = path.join(cwd, tmpDir)
	let previewRoot = path.join(getPreviewDirectory(cwd), 'dist')

	if (existsSync(tmp)) {
		console.log(`Clear ${tmpDir} directory`)
		await fs.rm(tmp, { recursive: true })
	}
	
	console.log('src: ', src)
	let files = await getFiles(src)
	await buildFiles(src, tmp, files)

	watch(src, { recursive: true }, onSrcChange(src, tmp))
	watch(tmp, { recursive: true }, onDistChange(tmp))

	let server = fastify()

	server.register(cors, { origin: '*' })

	// Preview
	server.route(createServeHandler(previewRoot))
	server.route(createRedirectHandler(src))
	server.route(createPreviewsHandler(tmp))

	// Send updates when something in the dist folder changes
	server.route(createUpdatesHandler(tmp))

	// Templates
	server.route(createTemplateHandler(tmp))
	server.route(createTemplatesHandler(src))

	server.get('/api/schema/:template', async () => {
		// TODO:
		// use https://github.com/YousefED/typescript-json-schema to extract the
		// props schema for a given template.
		// should return a JSON Schema
		return {}
	})

	let instance = await server.listen({ port })
	let runningPort = instance.split(':').reverse().at(0)
	console.log(`Postler server has started: http://localhost:${runningPort}`)
}

