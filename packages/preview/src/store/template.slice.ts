import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export type TemplateResponse = { value: string };

// Define a service using a base URL and expected endpoints
export const templateApi = createApi({
	reducerPath: "templateApi",
	baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
	endpoints: (builder) => ({
		getTemplate: builder.query<
			TemplateResponse,
			[string, string | null, string | undefined]
		>({
			query: (args) => {
				let search = new URLSearchParams();
				search.set("template", args[0]);
				search.set("preview", args[1] ?? "");
				search.set("lang", args[2] ?? "");
				return `preview/render?${search.toString()}`;
			},
		}),
	}),
});

export const { useGetTemplateQuery } = templateApi;
