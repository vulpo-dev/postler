import * as fs from "fs/promises";
import * as path from "path";
import { Dirent, existsSync } from "fs";
import { createRequire } from "module";
import { Config } from "./types";

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

export function getPreviewDirectory(cwd: string): string {
	let req = createRequire(cwd);
	return path.dirname(req.resolve("postler-preview/package.json"));
}

export async function getTemplates(src: string): Promise<Array<Dirent>> {
	let templateDir = path.join(src, "template");
	let files = await fs.readdir(templateDir, { withFileTypes: true });
	return files.filter((file) => file.isDirectory());
}

export function getConfig(src: string): Config | null {
	let configPath = path.join(src, "config.js");
	if (!existsSync(configPath)) {
		return null;
	}

	/* TODO: actually typecheck this */
	let config = require(configPath);
	return config.default as Config;
}
