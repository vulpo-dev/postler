import { existsSync } from "fs";
import * as fs from "fs/promises";
import * as path from "path";
import Mustache from "mustache";
import axios from "axios";

export async function main(templateDir: string) {
	const projectName = process.argv.at(2);

	if (!projectName) {
		console.log(`Failed to create directory, project name missing:
npx create-postler <project-name>
yarn create postler <project-name>
`);
		return process.exit(1);
	}

	let outDir = path.join(
		process.cwd(),
		projectName,
	);

	if (existsSync(outDir)) {
		console.log(`Folder ${projectName} already exists`);
		return process.exit(2);
	}

	console.log(`Creating your project: ${projectName}`);

	await fs.mkdir(outDir);

	let packageJson = await generatePkgJson(projectName);

	await fs.writeFile(
		path.join(outDir, "package.json"),
		JSON.stringify(packageJson, null, 2)
	);

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

	console.log("Project created");
}

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

async function generatePkgJson(projectName: string) {
	let dependencies = [
		"@emotion/react",
		"@emotion/styled",
		"@types/react",
		"postler",
		"dotenv",
		"react"
	];

	let resolved = await Promise.all(dependencies.map(async dep => {
		let version = await resolveLatest(dep);
		return [dep, version];
	}));

	return {
		"name": projectName,
		"private": true,
		"version": "1.0.0",
		"scripts": {
			"start": "postler serve",
			"build": "postler build"
		},
		"dependencies": Object.fromEntries(resolved)
	}
}

type PackageInfo = {
	"dist-tags": {
		"latest": string
	}
}

async function resolveLatest(pkgName: string) {
	let url = `https://registry.npmjs.org/${pkgName}`
	let parsed = await axios.get<PackageInfo>(url);
	return parsed.data["dist-tags"].latest;
}