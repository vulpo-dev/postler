import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery} from '@reduxjs/toolkit/query'

export type TemplateResponse = { markup: string }

// Define a service using a base URL and expected endpoints
export const templateApi = createApi({
  reducerPath: 'templateApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTemplate: builder.query<TemplateResponse, string>({
      query: (template) => `template/${template}`,
    }),
  }),
})

export const { useGetTemplateQuery } = templateApi
