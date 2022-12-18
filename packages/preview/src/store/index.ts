import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { templatesApi } from "./templates.slice";
import { templateApi } from "./template.slice";
import { previewsApi } from "./previews.slice";
import { previewSlice } from "./preview.slice";
import { layoutSlice } from "./layout.slice";
import { emailApi } from "./email.slice";

export const Store = configureStore({
	reducer: {
		[templatesApi.reducerPath]: templatesApi.reducer,
		[templateApi.reducerPath]: templateApi.reducer,
		[previewsApi.reducerPath]: previewsApi.reducer,
		[emailApi.reducerPath]: emailApi.reducer,
		preview: previewSlice.reducer,
		layout: layoutSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(templatesApi.middleware)
			.concat(templateApi.middleware)
			.concat(previewsApi.middleware)
			.concat(emailApi.middleware),
});

setupListeners(Store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
