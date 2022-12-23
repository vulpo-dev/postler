import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import * as path from "path";
import { createElement, FunctionComponent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import mjml2html from "mjml";
import { TemplateEngine, TemplateEngineCtx } from "react-sst";
import { stripHtml } from "string-strip-html";

let NoOp = () => null;

export type Config = {
	mjml: boolean;
};

export let DefaultConfig = { mjml: false };

export type Template = FunctionComponent<unknown>;

export type TemplateConfig = {
	Template: Template;
	Config: Config;
	Plaintext: FunctionComponent<unknown>;
};

export function getTemplate(dist: string, template: string): TemplateConfig {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	let { Template = NoOp, default: Config = DefaultConfig, Plaintext = NoOp } = require(path.join(
		dist,
		"template",
		template,
		"index.js",
	));

	return { Template, Config, Plaintext };
}

export function buildTemplate(
	template: Template,
	config: Config,
	templateEngine: TemplateEngine = "handlebars",
): string {
	let cache = createCache({ key: "template" });
	let { extractCriticalToChunks, constructStyleTagsFromChunks } =
		createEmotionServer(cache);

	let html = renderToStaticMarkup(
		createElement(
			TemplateEngineCtx.Provider,
			{ value: templateEngine },
			createElement(CacheProvider, { value: cache }, createElement(template)),
		),
	);

	if (config.mjml) {
		let rendered = mjml2html(html);
		return rendered.html;
	}

	let chunks = extractCriticalToChunks(html);
	let styles = constructStyleTagsFromChunks(chunks);

	let markup = `<!DOCTYPE html>
${html.replace("{{ENV_STYLES}}", styles)}
`;
	return markup;
}

export function buildPlaintext(
	template: Template,
	config: Config,
	templateEngine: TemplateEngine = "handlebars",
): string {
	let html = renderToStaticMarkup(
		createElement(
			TemplateEngineCtx.Provider,
			{ value: templateEngine },
			createElement(template),
		),
	);

	// TODO: strip possible html tags: https://www.npmjs.com/package/string-strip-html

	return stripHtml(html.replaceAll("<br/>", "\n")).result
}