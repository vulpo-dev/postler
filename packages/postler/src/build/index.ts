import * as fs from 'fs/promises'
import { existsSync } from 'fs'
import * as path from 'path'
import { buildFiles } from '../utils/build'
import { getFiles, getTemplates } from '../utils/files'
import { buildTemplate, getTemplate } from '../utils/template'
import * as TJS from 'typescript-json-schema'

export type BuildArgs = {
	workingDirectory?: string,
	outDir?: string,
	tmpDir?: string,
}

let COMPILER_OPTIONS = {
	"target": "es6",
	"declaration": true,
	"lib": [
	  "dom",
	  "dom.iterable",
	  "esnext"
	],
	"allowJs": true,
	"skipLibCheck": true,
	"esModuleInterop": true,
	"allowSyntheticDefaultImports": true,
	"strict": true,
	"forceConsistentCasingInFileNames": true,
	"noFallthroughCasesInSwitch": true,
	"module": "commonjs",
	"moduleResolution": "node",
	"resolveJsonModule": true,
	"isolatedModules": true,
	"jsx": "preserve"
}

export default async function handler({
	workingDirectory = process.cwd(),
	outDir = 'build',
	tmpDir = '.postler'
}: BuildArgs) {
	let cwd = path.isAbsolute(workingDirectory) ? workingDirectory : path.resolve(workingDirectory)
	let src = path.join(cwd, 'src')
	let tmp = path.join(cwd, tmpDir)
	let out = path.isAbsolute(outDir) ? outDir : path.join(cwd, outDir)

	if (existsSync(tmp)) {
		console.log(`Clear ${tmpDir} directory`)
		await fs.rm(tmp, { recursive: true })
	}

	if (existsSync(out)) {
		console.log(`Clear ${outDir} directory`)
		await fs.rm(out, { recursive: true })
	}

	let files = await getFiles(src)
	await buildFiles(src, tmp, files)

	let templates = await getTemplates(tmp).then(items => {
		return items
			.filter(entry => entry.isDirectory())
			.map(({ name }) => ({ name, compile: getTemplate(tmp, name) }))
	})

	let items = templates.map(({ name, compile }) => {
		let html = buildTemplate(compile.Template, compile.Config)
		return { name, html }
	})

	console.log('\nBuild templates:')
	let sink = items.map(async ({ name, html }) => {
		let outDir = path.join(out, name)
		if (!existsSync(outDir)) {
			await fs.mkdir(outDir, { recursive: true })
		}

		let outFile = path.join(outDir, 'template.hbs')

		let templateSink = fs.writeFile(outFile, html)

		let program = TJS.getProgramFromFiles(
			[path.join(src, 'template', name, `template.tsx`)],
		 	COMPILER_OPTIONS,
		 	path.join(src)
		)

		let schema = TJS.generateSchema(program, 'Props', {}, ['template.tsx'])
		
		let schemaSink = fs.writeFile(
			path.join(outDir, 'props.schema.json'),
			JSON.stringify(schema, null, 2)
		)

		await Promise.all([templateSink, schemaSink])
		return name
	})

	await Promise.all(sink).then(templates => {
		templates.forEach(template => {
			console.log(`  ${outDir}/${template}`)
		})
	})
}