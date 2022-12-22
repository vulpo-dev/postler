import { useQueryParams } from "@biotic-ui/std";
import Handlebars from "handlebars";
import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetPreviewsQuery } from "~src/store/previews.slice";
import { useGetTemplateQuery } from "~src/store/template.slice";

type UseCurrentPreview = [string | null, (preview: string) => void];

export function useCurrentPreview(): UseCurrentPreview {
	let navigate = useNavigate();
	let location = useLocation();
	let search = useQueryParams(location.search);
	let currentPreview = search.get("preview");

	let setPreview = useCallback(
		(preview: string) => {
			let s = new URLSearchParams(search);
			s.set("preview", preview);

			navigate({
				search: `?${s.toString()}`,
			});
		},
		[location, search],
	);

	return [currentPreview, setPreview];
}

export function usePreviewProps(template: string) {
	let [currentPreview, setPreview] = useCurrentPreview();

	let {
		data: { items = [] } = {},
	} = useGetPreviewsQuery(template);

	let entry = items.find((entry) => {
		return entry.title === currentPreview;
	});

	useEffect(() => {
		let entry = items.at(0);
		let hasPreview = items.find((preview) => preview.title === currentPreview);

		if (hasPreview !== undefined || !entry) {
			return;
		}

		setPreview(entry.title);
	}, [currentPreview, setPreview, items]);

	return entry;
}

export function useCompiledTemplate(template: string) {
	let [currentPreview] = useCurrentPreview();
	return useGetTemplateQuery([template, currentPreview, undefined]);
}

export function compileTemplate(
	markup: string,
	props: unknown,
	translation?: unknown,
) {
	let t = Handlebars.compile(markup);
	return t({ props, t: translation } ?? {});
}
