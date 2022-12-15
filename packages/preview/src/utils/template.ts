import { useQueryParams } from "@biotic-ui/std";
import Handlebars from "handlebars";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPreviewsQuery, useGetTranslationsQuery } from "~src/store/previews.slice";
import { useGetTemplateQuery } from "~src/store/template.slice";

export function usePreviewProps(template: string) {
	let navigate = useNavigate();
	let search = useQueryParams();
	let currentPreview = search.get("preview");

	let { data: { items = [] } = {} } = useGetPreviewsQuery(template);
	let entry = items.find((entry) => {
		return entry.title === currentPreview;
	});

	useEffect(() => {
		let entry = items.at(0);
		if (currentPreview || !entry) {
			return;
		}

		let s = new URLSearchParams(search);
		s.set("preview", entry.title);

		navigate({
			search: `?${s.toString()}`,
		});
	}, [currentPreview, items]);

	return entry;
}

export function useCompiledTemplate(template: string) {
	let markup = useMarkup(template);
	let { data: translations } = useGetTranslationsQuery(template);
	let { props } = usePreviewProps(template) ?? {};
	return useMemo(() => {
		let t = Handlebars.compile(JSON.stringify(translations?.default?.translation ?? {}));
		let translated = t({ props });
		return compileTemplate(markup, props, JSON.parse(translated));
	}, [markup, props, translations]);
}

export function useMarkup(template: string) {
	let { data: { markup = "" } = {} } = useGetTemplateQuery(template);

	return markup;
}

export function compileTemplate(markup: string, props: unknown, translation?: unknown) {
	let t = Handlebars.compile(markup);
	return t({ props, t: translation } ?? {});
}
