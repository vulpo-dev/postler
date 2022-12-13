import * as path from 'path'
import * as swc from '@swc/core'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'

import { toRelativePath } from './path'

export async function buildFiles(src: string, dist: string, files: Array<string>) {
	for (let file of files) {
		await transpile(file, src, dist).catch(err => {
			console.error(err)
		})
	}
}

export async function transpile(file: string, src: string, dist: string) {
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
