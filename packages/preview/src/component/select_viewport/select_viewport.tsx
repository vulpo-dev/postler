import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "~src/store";
import { setViewport } from "~src/store/preview.slice";
import { Select, Option } from "~/src/component/input";

export let SelectViewport = () => {
	let dispatch = useDispatch();
	let { viewport } = useSelector((state: RootState) => state.preview);

	let handleViewportChange = (event: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setViewport({ width: event.target.value }));
	};

	return (
		<Select onChange={handleViewportChange} value={viewport.width}>
			<Option value='100%'>Default</Option>
			<Option value='390px'>Mobile</Option>
			<Option value='768px'>Tablet</Option>
		</Select>
	);
};
