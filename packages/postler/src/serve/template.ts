import { RouteOptions } from "fastify";
import { getTemplates } from "../utils/files";
import { buildTemplate, getTemplate } from "../utils/template";

export function createTemplateHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/template/:template",
		handler: async (req) => {
			let { template } = req.params as { template: string };
			let { Template, Config } = getTemplate(src, template);
			let markup = buildTemplate(Template, Config);
			return { markup };
		},
	};
}

export function createTemplatesHandler(src: string): RouteOptions {
	return {
		method: "GET",
		url: "/api/templates",
		handler: async () => {
			let templates = await getTemplates(src);
			return { items: templates };
		},
	};
}
