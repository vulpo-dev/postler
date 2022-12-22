import { createContext, useContext } from "react";

export type TemplateEngine = "handlebars" | "mustache";

export let TemplateEngineCtx = createContext<TemplateEngine>("handlebars");

export function useTemplateEngine(): TemplateEngine {
	return useContext(TemplateEngineCtx);
}
