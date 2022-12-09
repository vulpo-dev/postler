import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type Template = { markup: string }

// Define a service using a base URL and expected endpoints
export const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:47150/api' }),
  endpoints: (builder) => ({
    getTemplate: builder.query<Template, string>({
      query: (template) => `template/${template}`,
    }),
  }),
})

export const { useGetTemplateQuery } = templateApi
