import { GetTranslation, ToTranslations } from "postler";
import { props } from "./types";

export let DefaultTranslation = {
	lang: "en",
	translation: {
		subject: "Verify Email",
		headline: "Verify Email",
		label: "Verify Email",
		text: `Click on the link below to verify your ${props.propject} account.`,
		expire: `The link is valid for <span class="bold">${props.expire_in} minutes</span> and can only be used once`,
	},
};

export type Translation = GetTranslation<typeof DefaultTranslation>;

export let Translations: ToTranslations<typeof DefaultTranslation> = [
	{
		lang: "de",
		translation: {
			subject: "",
			headline: "",
			label: "",
			text: "",
			expire: "",
		},
	},
];
