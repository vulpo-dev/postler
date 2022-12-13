import * as path from 'path'
import * as fs from 'fs/promises'
import send from 'send'
import { RouteOptions } from 'fastify'
import slugify from 'slugify'

import { getTemplates } from '../utils/files'
import { Preview } from '../preview'

export async function serveFile(root: string, filePath: string) {
	let _filePath = filePath === '' ? 'index.html' : filePath
	let file = path.join(root, _filePath)
	return await fs
		.readFile(file)
		.then(content => ({
			content,
			type: send.mime.lookup(_filePath),
		}))
		.catch(async () => {
			let indexHtml = path.join(root, 'index.html')
			let content = await fs.readFile(indexHtml)
			return { content, type: send.mime.lookup('index.html') }
		})
}


export function createServeHandler(previewRoot: string): RouteOptions {
	return {
		method: 'GET',
		url: '/preview*',
		handler: async (req, reply) => {
			let { '*': filePath } = req.params as { '*': string }
			let { type, content } = await serveFile(previewRoot, filePath)
			reply.header('Content-Type', type)
			return content
		}
	}
}

export function createRedirectHandler(src: string): RouteOptions {
	return {
		method: 'GET',
		url: '/',
		handler: async (_, reply) => {
			let items = await getTemplates(src)
			let template = items.at(0)
			reply.redirect(`/preview/${template?.name ?? ''}`)
		}
	}
}


export function createPreviewsHandler(src: string): RouteOptions {
	return {
		method: 'GET',
		url: '/api/preview/list',
		handler: async ({ query }) => {
			try {
				let { template = '' } = query as { template?: string }
				let { Data = [] } = require(path.join(src, 'template', template, 'preview.js'))
				let items = Data.map((item: Preview<any>) => {
					return { ...item, title: slugify(item.title)}
				})
				return { items }
			} catch(err) {
				return { items: [] }
			}
		}
	}
}

export function createTranslationHandler(src: string): RouteOptions {
	return {
		method: 'GET',
		url: '/api/preview/translations',
		handler: ({ query }) => {
			try {
				let { template = '' } = query as { template?: string }
				let { Translations = [], DefaultTranslation = {} } = require(path.join(src, 'template', template, 'index.js'))
				return { items: Translations, default: DefaultTranslation }
			} catch(err) {
				return { items: [] }
			}
		}
	}
}