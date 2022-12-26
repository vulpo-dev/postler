import * as fs from "fs/promises";
import { existsSync } from "fs";
import * as path from "path";
import { buildFiles } from "../utils/build";
import { getConfig, getFiles, getTemplates } from "../utils/files";
import { buildPlaintext, buildTemplate, getTemplate } from "../utils/template";
import * as TJS from "typescript-json-schema";

export type BuildArgs = {
	workingDirectory?: string;
	outDir?: string;
	tmpDir?: string;
};

let COMPILER_OPTIONS = {
	target: "es6",
	declaration: true,
	lib: ["dom", "dom.iterable", "esnext"],
	allowJs: true,
	skipLibCheck: true,
	esModuleInterop: true,
	allowSyntheticDefaultImports: true,
	strict: true,
	forceConsistentCasingInFileNames: true,
	noFallthroughCasesInSwitch: true,
	module: "commonjs",
	moduleResolution: "node",
	resolveJsonModule: true,
	isolatedModules: true,
	jsx: "preserve",
};

export default async function handler({
	workingDirectory = process.cwd(),
	outDir = "build",
	tmpDir = ".postler",
}: BuildArgs) {
	let cwd = path.isAbsolute(workingDirectory)
		? workingDirectory
		: path.resolve(workingDirectory);
	let src = path.join(cwd, "src");
	let tmp = path.join(cwd, tmpDir);
	let out = path.isAbsolute(outDir) ? outDir : path.join(cwd, outDir);

	if (existsSync(tmp)) {
		console.log(`Clear ${tmpDir} directory`);
		await fs.rm(tmp, { recursive: true });
	}

	if (existsSync(out)) {
		console.log(`Clear ${outDir} directory`);
		await fs.rm(out, { recursive: true });
	}

	let files = await getFiles(src);
	await buildFiles(src, tmp, files);

	let config = getConfig(tmp);
	let fileExt = config?.templateEngine === "mustache" ? "mustache" : "hbs";

	console.log("Template Engine: ", config?.templateEngine ?? "handlebars");

	let templates = await getTemplates(tmp).then((items) => {
		return items
			.filter((entry) => entry.isDirectory())
			.map(({ name }) => ({ name, compile: getTemplate(tmp, name) }));
	});

	let items = templates.map(({ name, compile }) => {
		let html = buildTemplate(
			compile.Template,
			compile.Config,
			config?.templateEngine,
		);

		let plaintext = buildPlaintext(
			compile.Plaintext,
			compile.Config,
			config?.templateEngine,
		);

		return { name, html, plaintext };
	});

	console.log("\nBuild templates:");
	let sink = items.map(async ({ name, html, plaintext }) => {
		let outDir = path.join(out, name);
		if (!existsSync(outDir)) {
			await fs.mkdir(outDir, { recursive: true });
		}

		let files: Array<[string, string]> = [
			[path.join(outDir, `template.${fileExt}`), html],
			[path.join(outDir, `plaintext.${fileExt}`), plaintext],
			[path.join(outDir, "props.schema.json"), buildPropsSchema(src, name)],
		];

		await Promise.all(
			files.map(async ([file, content]) => {
				return await fs.writeFile(file, content);
			}),
		);

		let translations = await getTranslations(tmp, name);

		if (translations.defaultLang !== undefined) {
			let translationOut = path.join(outDir, "translations");
			if (!existsSync(translationOut)) {
				await fs.mkdir(translationOut, { recursive: true });
			}

			await Promise.all(
				translations.translations.filter(Boolean).map((t) => {
					let file = path.join(translationOut, `${t.lang}.${fileExt}`);
					return fs.writeFile(file, JSON.stringify(t.translation, null, 2));
				}),
			);

			await fs.writeFile(
				path.join(translationOut, "config.json"),
				JSON.stringify(
					{
						defaultLang: translations.defaultLang,
						languages: translations.translations.map((t) => t.lang),
					},
					null,
					2,
				),
			);

			let translationSchema = buildTranslationSchema(src, name);
			await fs.writeFile(
				path.join(outDir, "translation.schema.json"),
				translationSchema,
			);
		}

		return name;
	});

	await Promise.all(sink).then((templates) => {
		templates.forEach((template) => {
			console.log(`  ${outDir}/${template}`);
		});
	});
}

function buildPropsSchema(src: string, name: string) {
	let templateDir = path
		.join(src, "template", name)
		.split(path.sep)
		.join(path.posix.sep);

	let program = TJS.getProgramFromFiles(
		[path.join(templateDir, "index.ts")],
		COMPILER_OPTIONS,
		path.join(src),
	);

	let schema = TJS.generateSchema(program, "TemplateProps", {}, ["index.ts"]);
	return JSON.stringify(schema, null, 2);
}

type TranslationConfig = {
	defaultLang?: string;
	translations: Array<{ lang: string; translation: unknown }>;
};

async function getTranslations(
	src: string,
	name: string,
): Promise<TranslationConfig> {
	let translationFile = path.join(src, "template", name, "index.js");
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	let { DefaultTranslation = {}, Translations = [] } = require(translationFile);
	return {
		defaultLang: DefaultTranslation.lang,
		translations: [DefaultTranslation, ...Translations],
	};
}

function buildTranslationSchema(src: string, name: string) {
	let program = TJS.getProgramFromFiles(
		[path.join(src, "template", name, "index.ts")],
		COMPILER_OPTIONS,
		path.join(src),
	);

	let schema = TJS.generateSchema(program, "Translation", {}, ["index.ts"]);
	return JSON.stringify(schema, null, 2);
}
