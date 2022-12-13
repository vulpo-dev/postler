
type Translation<T = unknown> = { lang: string, translation: T } 

export type GetTranslation<T extends Translation> = T["translation"]
export type ToTranslations<T extends Translation> = Array<Translation<T["translation"]>>
