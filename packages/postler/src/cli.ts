import * as yargs from 'yargs'
import { ArgumentsCamelCase } from 'yargs'
import serve, { ServeArgs } from './serve'
import build, { BuildArgs } from './build'

export function runCli() {
	yargs
		.scriptName('postler')
		.command({
			command: 'serve',
			describe: 'start the development server',
			builder: {
				port: {
					describe: 'Optional port to run the server',
					demandOption: false,
					type: 'number',
					default: 47150,
				},
				workingDirectory: {
					alias: 'src',
					describe: 'Templates directory',
					demandOption: false,
					type: 'string', 
				},
				tmpDir: {
					describe: 'Temporary build directory',
					demandOption: false,
					type: 'string', 
				}
			},
			handler(argv: ArgumentsCamelCase<ServeArgs>) {
				serve({
					workingDirectory: argv.workingDirectory,
					port: argv.port,
					tmpDir: argv.tmpDir,
				})
			}
		})
		.command({
			command: 'build',
			describe: 'build templates',
			builder: {
				workingDirectory: {
					alias: 'src',
					describe: 'Templates directory',
					demandOption: false,
					type: 'string', 
				},
				tmpDir: {
					describe: 'Temporary build directory',
					demandOption: false,
					type: 'string', 
				},
				outDir: {
					alias: 'out',
					describe: 'Output directory',
					demandOption: false,
					type: 'string',
				}
			},
			handler(argv: ArgumentsCamelCase<BuildArgs>) {
				build({
					workingDirectory: argv.workingDirectory,
					outDir: argv.outDir,
					tmpDir: argv.tmpDir,
				})
			}
		})
		.help()

	yargs.parse()
}
