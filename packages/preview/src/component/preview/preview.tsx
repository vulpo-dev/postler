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
		Store.dispatch(templateApi.util.prefetch("getTemplate", template, { force: true }));
	});

	return <RenderView template={template} />;
};

type RenderViewProps = {
	template: string;
};

let RenderView = ({ template }: RenderViewProps) => {
	let viewport = useSelector((state: RootState) => state.preview.viewport);
	let [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
	let html = useCompiledTemplate(template);

	useEffect(() => {
		if (iframe && iframe.contentWindow) {
			let elm = iframe.contentWindow;
			elm.document.open();
			elm.document.write(html);
		}
	}, [iframe, html]);

	let styles = {
		width: viewport.width,
		height: viewport.height,
		border: viewport.width === "100%" ? "none" : "2px solid var(--gray-10)",
	};

	return (
		<Wrapper>
			<IFrame
				style={styles}
				ref={setIframe}
			></IFrame>
		</Wrapper>
	);
};

let IFrame = styled.iframe`
	width: 100%;
	height: 100%;
`;

let Wrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-left: var(--size-10);
	margin-right: var(--size-3);
`;
