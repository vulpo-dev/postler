import * as path from "path";
import * as fs from "fs/promises";
import { existsSync } from "fs";
import send from "send";
import { RouteOptions } from "fastify";
import slugify from "slugify";
import Mustache from "mustache";
import Handlebars from "handlebars";

import { getConfig, getTemplates } from "../utils/files";
import { Preview } from "../preview";
import { buildTemplate, getTemplate } from "../utils/template";

export async function serveFile(root: string, filePath: string) {
	let _filePath = filePath === "" ? "index.html" : filePath;
	let file = await fs
		.readFile(path.join(root, _filePath))
		.then((content) => ({
			content,
			type: send.mime.lookup(_filePath),
		}))
		.catch(async () => {
			let indexHtml = path.join(root, "index.html");
			let content = await fs.readFile(indexHtml);
			return { content, type: send.mime.lookup("index.html") };
		});
	return file;
}

export function createServeHandler(previewRoot: string): RouteOptions {
	return {
		method: "GET",
		url: "/preview*",
		handler: async (req, reply) => {
			let { "*": filePath } = req.params as { "*": string };
			let { type, content } = await serveFile(previewRoot, filePath);
			void reply.header("Content-Type", type);
			return content;
		},
	};
}

export function createRedirectHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/",
		handler: async (_, reply) => {
			let items = await getTemplates(src);
			let template = items.at(0);
			void reply.redirect(`/preview/${template?.name ?? ""}`);
		},
	};
}

export function createPreviewsHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/preview/list",
		handler: async ({ query }) => {
			try {
				let { template = "" } = query as { template?: string };
				let items = getPreviews(src, template);
				return { items };
			} catch (err) {
				return { items: [] };
			}
		},
	};
}

type Previews = Array<Preview<unknown>>;

function getPreviews(src: string, template: string): Previews {
	let previewPath = path.join(src, "template", template, "preview.js");

	if (!existsSync(previewPath)) {
		return [];
	}

	let { Data = [] } = require(previewPath);

	let items: Previews = Data.map((item: Preview<unknown>) => {
		return { ...item, title: slugify(item.title) };
	});

	return items;
}

export function createTranslationHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/preview/translations",
		handler: ({ query }) => {
			try {
				let { template = "" } = query as { template?: string };
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				let { Translations = [], DefaultTranslation = {} } = require(path.join(
					src,
					"template",
					template,
					"index.js",
				));
				return { items: Translations, default: DefaultTranslation };
			} catch (err) {
				return { items: [] };
			}
		},
	};
}

type RenderTemplateParams = {
	template?: string;
	preview?: string;
	lang?: string;
};

export function createRenderTemplateHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/preview/render",
		handler: async (req, reply) => {
			let query = req.query as RenderTemplateParams;

			if (!query.template) {
				return reply.status(400);
			}

			let templateConfig = getConfig(src);
			let { Template, Config } = getTemplate(src, query.template);
			let markup = buildTemplate(
				Template,
				Config,
				templateConfig?.templateEngine,
			);

			let preview = getPreviews(src, query.template).find((item) => {
				return item.title === query.preview;
			});

			let translations = getTranslations(src, query.template);
			let translation = !query.lang
				? translations.at(0)
				: translations.find((t) => t.lang === query.lang);

			let render =
				templateConfig?.templateEngine === "mustache"
					? compileMustache
					: compileHandlebars;

			return { value: render(markup, preview, translation) };
		},
	};
}

type Translation = {
	lang: string;
	translation: unknown;
};

function compileHandlebars(
	markup: string,
	preview?: Preview<unknown>,
	translation?: Translation,
) {
	let props = preview?.props ?? {};

	let compileTranslations = Handlebars.compile(
		JSON.stringify(translation?.translation ?? {}),
	);
	let compiledTranslation = JSON.parse(compileTranslations({ props }));

	let compileMarkup = Handlebars.compile(markup);
	return compileMarkup({ props, t: compiledTranslation });
}

function compileMustache(
	markup: string,
	preview?: Preview<unknown>,
	translation?: Translation,
) {
	let props = preview?.props ?? {};

	let translationTemplate = JSON.stringify(translation?.translation ?? {});
	let compiledTranslation = JSON.parse(
		Mustache.render(translationTemplate, { props }),
	);

	let values = {
		true: true,
		false: false,
		undefined: false,
		"0": false,
	};

	return Mustache.render(markup, { props, t: compiledTranslation, ...values });
}

function getTranslations(src: string, template: string) {
	let translationPath = path.join(src, "template", template, "translations.js");

	if (!existsSync(translationPath)) {
		return [];
	}

	let { DefaultTranslation, Translations = [] } = require(translationPath);

	return [DefaultTranslation, ...Translations].filter((item) => {
		return item !== undefined;
	});
}
