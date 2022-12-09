import * as yargs from 'yargs'
import { ArgumentsCamelCase } from 'yargs'
import serve, { ServeArgs } from './serve'

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
				}
			},
			handler(argv: ArgumentsCamelCase<ServeArgs>) {
				console.log({ argv })
				serve({
					workingDirectory: argv.workingDirectory ?? process.cwd(),
					port: argv.port,
				})
			}
		})
		.help()

	yargs.parse()
}
