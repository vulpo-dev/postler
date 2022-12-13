import { createApi } from '@reduxjs/toolkit/query/react'
import { fetchBaseQuery} from '@reduxjs/toolkit/query'

export type Preview<T> = { title: string, props: T } 
export type Previews<T> = Array<Preview<T>>

export type PreviewsState = {
  items: Previews<unknown>
}

type Translation = {
  lang: string,
  translation: unknown,  
}

export type TranslationsState = {
  default: Translation,
  items: Array<Translation>, 
}

// Define a service using a base URL and expected endpoints
export const previewsApi = createApi({
  reducerPath: 'previewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/preview' }),
  endpoints: (builder) => ({
    getPreviews: builder.query<PreviewsState, string>({
      query: (template) => `list?template=${template}`,
    }),

    getTranslations: builder.query<TranslationsState, string>({
      query: (template) => `translations?template=${template}`
    })
  }),
})

export const { useGetPreviewsQuery, useGetTranslationsQuery } = previewsApi
