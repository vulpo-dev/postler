import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery} from '@reduxjs/toolkit/query'

export type Preview<T> = { title: string, props: T } 
export type Previews<T> = Array<Preview<T>>

export type PreviewsState = {
  items: Previews<unknown>
}

// Define a service using a base URL and expected endpoints
export const previewsApi = createApi({
  reducerPath: 'previewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getPreviews: builder.query<PreviewsState, string>({
      query: (template) => `preview/list?template=${template}`,
    }),
  }),
})

export const { useGetPreviewsQuery } = previewsApi
