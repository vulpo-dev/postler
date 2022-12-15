import { createSlice } from "@reduxjs/toolkit";

type LayoutState = {
	sidebar: {
		open: boolean;
	};
};

let initialState: LayoutState = {
	sidebar: {
		open: window.matchMedia("(min-width: 1400px)").matches,
	},
};

export let layoutSlice = createSlice({
	name: "preview",
	initialState,
	reducers: {
		toggleSidebar(state) {
			state.sidebar.open = !state.sidebar.open;
		},
	},
});

export let { toggleSidebar } = layoutSlice.actions;

export default layoutSlice.reducer;
