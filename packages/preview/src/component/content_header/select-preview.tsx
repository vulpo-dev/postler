import { Select, Option } from "~/src/component/input";
import { useGetPreviewsQuery } from "~src/store/previews.slice";
import { useCurrentTemplate } from "~src/utils";
import { useCurrentPreview } from "~/src/utils/template";
import { ChangeEvent } from "react";

export let Previews = () => {
	let template = useCurrentTemplate();
	let { data } = useGetPreviewsQuery(template);
	let [preview, setPreview] = useCurrentPreview();

	let handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setPreview(e.target.value);
	};

	return (
		<Select value={preview ?? ""} onChange={handleChange}>
			{data?.items.map((preview) => (
				<Option key={preview.title} value={preview.title}>
					{preview.title}
				</Option>
			))}
		</Select>
	);
};
