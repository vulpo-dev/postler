import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Viewport = {
	width: string | number;
	height: string | number;
};

export let DefaultViewport = {
	width: "100%",
	height: "100%",
};

type PreviewState = {
	viewport: Viewport;
};

let initialState: PreviewState = {
	viewport: DefaultViewport,
};

export let previewSlice = createSlice({
	name: "preview",
	initialState,
	reducers: {
		setViewport(state, action: PayloadAction<Partial<Viewport>>) {
			state.viewport = {
				...state.viewport,
				...action.payload,
			};
		},

		resetViewport(state) {
			state.viewport = DefaultViewport;
		},
	},
});

export let { setViewport, resetViewport } = previewSlice.actions;

export default previewSlice.reducer;
