import { ChangeEvent } from "react";
import styled from "@emotion/styled";

import { Select, Option } from "~/src/component/input";
import { useGetPreviewsQuery } from "~src/store/previews.slice";
import { useCurrentTemplate } from "~src/utils";
import { useCurrentPreview } from "~/src/utils/template";

export let SelectPreviews = () => {
	let template = useCurrentTemplate();
	let { data } = useGetPreviewsQuery(template);
	let [preview, setPreview] = useCurrentPreview();

	let handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setPreview(e.target.value);
	};

	let currentValue = preview ?? "";

	return (
		<StyledSelect
			title={currentValue}
			value={currentValue}
			onChange={handleChange}
		>
			{data?.items.map((preview) => (
				<Option key={preview.title} value={preview.title}>
					{preview.title}
				</Option>
			))}
		</StyledSelect>
	);
};

let StyledSelect = styled(Select)`
	width: var(--size-13);
	text-overflow: ellipsis;
`;
