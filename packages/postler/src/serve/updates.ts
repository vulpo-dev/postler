import * as path from 'path'
import { RouteOptions } from 'fastify'
import watch from 'node-watch'

import { toRelativePath } from '../utils/path'

export function createUpdatesHandler(src: string): RouteOptions {
	return {
		method: 'GET',
		url: '/api/updates',
		handler: (request, reply) => {
			let headers = {
				'Content-Type': 'text/event-stream',
				'Connection': 'keep-alive',
				'Cache-Control': 'no-cache,no-transform',
			}

			reply.raw.writeHead(200, headers);

			let watcher = watch(src, { recursive: true }, (event, name) => {
				let filePath = toRelativePath(src, name).join(path.posix.sep)
				let data = JSON.stringify({ event, path: filePath })
				reply.raw.write(`data: ${data}\n\n`)
			})

			request.socket.on('close', () => watcher.close())
		}
	}
}