import { TemplateEngine } from "@vulpo-dev/react-sst";

type Translation<T = unknown> = { lang: string; translation: T };

export type GetTranslation<T extends Translation> = T["translation"];
export type ToTranslations<T extends Translation> = Array<
	Translation<T["translation"]>
>;

export type Config = {
	smtp: {
		host: string;
		port: number;
		secure: boolean;
		auth: {
			user: string;
			pass: string;
		};
	};
	email: {
		from: string;
	};
	templateEngine?: TemplateEngine;
};
