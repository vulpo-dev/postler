import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export type HasConfig = { hasConfig: boolean };

// Define a service using a base URL and expected endpoints
export const emailApi = createApi({
	reducerPath: "emailApi",
	baseQuery: fetchBaseQuery({ baseUrl: "/api/email" }),
	endpoints: (builder) => ({
		hasConfig: builder.query<HasConfig, void>({
			query: () => "/has_config",
			extraOptions: {
				refetchOnFocus: true,
			},
		}),
	}),
});

export const { useHasConfigQuery } = emailApi;
