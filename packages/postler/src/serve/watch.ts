import * as path from 'path'
import * as fs from 'fs/promises'

import { toRelativePath } from '../utils/path'
import { transpile } from '../utils/build'
import { getFiles } from '../utils/files'

type EventType = 'update' | 'remove'

export function onSrcChange(src: string, out: string) {
	return async function(evt: EventType, name: string) {
		switch(evt) {
			case 'remove': {
				let filePath = toRelativePath(src, name)
				let outPath = path.join(out, ...filePath)
				await fs.rm(outPath, { recursive: true }).catch(err => {
					console.log('Failed to delete: ', err)
				})
			}
			break

			case 'update': {
				let stat = await fs.lstat(name)
				if (!stat.isDirectory()) {
					process.nextTick(() => {
						transpile(name, src, out).catch(err => {
							console.error(err)
						})
					})
				} else {
					await fs.mkdir(name, { recursive: true })
				}
			}
			break
		}
	}
}

export function onDistChange(src: string) {
	return async function(_evt: EventType, _name: string) {
		let files = await getFiles(src)
		files.forEach(file => {
			if (require.cache[file]) {
				delete require.cache[file]
			}
		})
	}
}