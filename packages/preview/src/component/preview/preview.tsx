import { useEffect, useState } from "react";
import styled from "@emotion/styled";

import { templateApi } from "~/src/store/template.slice";
import { useServerEvent, useCurrentTemplate } from "~src/utils";
import { RootState, Store } from "~src/store";
import { useSelector } from "react-redux";
import { useCompiledTemplate } from "~src/utils/template";

export let Preview = () => {
	let template = useCurrentTemplate();

	useServerEvent("/api/updates", () => {
		Store.dispatch(templateApi.util.resetApiState());
		Store.dispatch(
			templateApi.util.prefetch("getTemplate", template, { force: true }),
		);
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
			elm.document.write(html);
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
	background: #fff;
	color-scheme: light dark;
`;

let Wrapper = styled.div`
	display: flex;
	justify-content: center;
	padding-left: var(--size-10);
	padding-right: var(--size-3);
	background: var(--foreground);
`;
