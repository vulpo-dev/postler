import { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { templateApi } from "~/src/store/template.slice";
import { useServerEvent, useCurrentTemplate } from "~src/utils";
import { RootState, Store } from "~src/store";
import { useSelector } from "react-redux";
import { useCompiledTemplate, useCurrentPreview } from "~src/utils/template";
import { previewsApi } from "~src/store/previews.slice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

export let Preview = () => {
	let template = useCurrentTemplate();
	let [triggerPreviews] = previewsApi.endpoints.getPreviews.useLazyQuery();
	let [currentPreview] = useCurrentPreview();

	useServerEvent("/api/updates", ({ data }) => {
		Store.dispatch(templateApi.util.resetApiState());
		Store.dispatch(
			templateApi.util.prefetch(
				"getTemplate",
				[template, currentPreview, undefined],
				{ force: true },
			),
		);

		let isPreview = data.path.endsWith(`${template}/preview.js`);
		if (isPreview) {
			triggerPreviews(template);
		}
	});

	return <RenderView template={template} />;
};

type RenderViewProps = {
	template: string;
};

let RenderView = ({ template }: RenderViewProps) => {
	let { viewport } = useSelector((state: RootState) => state.preview);
	let [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
	let html = useCompiledTemplate(template);

	useEffect(() => {
		if (iframe?.contentWindow) {
			let elm = iframe.contentWindow;
			elm.document.open();

			let content = html.isError
				? renderError(html.error)
				: html.data?.value ?? "";

			elm.document.write(content);
			let htmlDoc = elm.document.querySelector("html");
			if (htmlDoc !== null) {
				htmlDoc.style.colorScheme = "light dark";
			}
		}
	}, [iframe, html]);

	let styles = {
		width: viewport.width,
		height: viewport.height,
		border:
			viewport.width === "100%" ? "none" : "2px solid var(--border-color)",
	};

	return (
		<Wrapper>
			<IFrame style={styles} ref={setIframe} />
		</Wrapper>
	);
};

let IFrame = styled.iframe`
	width: 100%;
	height: 100%;
	color-scheme: light dark;
`;

let Wrapper = styled.div`
	display: flex;
	justify-content: center;
	padding: var(--size-3);
	background: var(--foreground);
	border-top-left-radius: var(--size-3);
	border-top-right-radius: var(--size-3);
	height: 100%;
`;

function renderError(error: FetchBaseQueryError | SerializedError) {
	let message =
		"data" in error ? getErrorMessage(error.data) : getErrorMessage(error);

	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
			</head>
			<style>

				html,
				body {
					margin: 0;
					height: 100%;
				}

				body {
					font-family: sans-serif;
					border: 4px solid #c92a2a;
					padding: 32px;
					box-sizing: border-box;
				}
			</style>
			<body>
				<h1>Error:</h1>
				<p>${message}</p>
			</body>
		</html>

	`;
}

function getErrorMessage(error: any) {
	if ("message" in error) {
		return error.message as string;
	}

	return "";
}
