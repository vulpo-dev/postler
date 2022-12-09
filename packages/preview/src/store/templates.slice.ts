import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type Templates = Array<{ name: string }>

export type TemplatesState = {
  items: Templates
}

// Define a service using a base URL and expected endpoints
export const templatesApi = createApi({
  reducerPath: 'templatesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:47150/api' }),
  endpoints: (builder) => ({
    getTemplates: builder.query<TemplatesState, void>({
      query: () => `templates`,
    }),
  }),
})

export const { useGetTemplatesQuery } = templatesApi
