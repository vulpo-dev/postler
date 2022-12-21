import { existsSync } from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import Mustache from "mustache";

async function main() {
	const projectName = process.argv.at(2);

	if (!projectName) {
		console.log(`Failed to create directory, project name missing:
npx create-postler <project-name>
yarn create postler <project-name>
`);
		return process.exit(1);
	}

	let templateDir = path.join(process.cwd(), "template");
	let files = await getFiles(templateDir);

	let sink = files.map(async (file) => {
		let content = await fs.readFile(file, { encoding: "utf8" });
		let outPath = path.join(
			process.cwd(),
			projectName,
			file.slice(templateDir.length),
		);
		let outDir = outPath.split(path.sep).slice(0, -1).join(path.sep);

		if (!existsSync(outDir)) {
			await fs.mkdir(outDir, { recursive: true });
		}

		let rendered = Mustache.render(content, { projectName });
		return fs.writeFile(outPath, rendered);
	});

	await Promise.all(sink);
}

main().catch((err) => {
	console.log("Something went wrong");
	console.error(err);
});

export async function getFiles(src: string): Promise<Array<string>> {
	let entries = await fs.readdir(src, { withFileTypes: true });

	let sink = await Promise.all(
		entries.map(async (entry) => {
			if (entry.isDirectory()) {
				let files = await getFiles(path.join(src, entry.name));
				return files.flat();
			}

			return [path.join(src, entry.name)];
		}),
	);

	return sink.flat();
}
