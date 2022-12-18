import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "@emotion/styled";

import { RootState } from "~src/store";
import { setViewport } from "~src/store/preview.slice";
import { TopBar } from "~/src/component/layout";
import { Select, Option } from "~/src/component/input";

import { Previews } from "./select-preview";

export let ContentHeader = () => {
	let dispatch = useDispatch();
	let { viewport } = useSelector((state: RootState) => state.preview);

	let handleViewportChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setViewport({ width: event.target.value }));
	};

	return (
		<StyledContentHeader>
			<TitleSection>
				<ContentTitle>Preview</ContentTitle>
			</TitleSection>

			<SelectPreviewWrapper>
				<div>
					<Previews />
				</div>
			</SelectPreviewWrapper>

			<LeftSection>
				<SelectWrapper>
					<div>
						<Select onChange={handleViewportChange} value={viewport.width}>
							<Option value='100%'>Default</Option>
							<Option value='390px'>Mobile</Option>
							<Option value='768px'>Tablet</Option>
						</Select>
					</div>
				</SelectWrapper>
			</LeftSection>
		</StyledContentHeader>
	);
};

let StyledContentHeader = styled(TopBar.Header)`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	background: #fff;
	border-top-left-radius: var(--size-3);
	border-top-right-radius: var(--size-3);
	border: none;
	padding: 0 var(--size-3);
	background: var(--foreground);
`;

let TitleSection = styled.section`
	display: flex;
	align-items: center;
`;

let ContentTitle = styled.h4`
	margin-bottom: 0;
`;

let LeftSection = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

let SelectWrapper = styled.div`
	display: flex;
	gap: var(--size-2);
`;

let SelectPreviewWrapper = styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
`;
