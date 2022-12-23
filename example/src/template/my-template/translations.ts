import { GetTranslation, ToTranslations } from "postler";
import { props } from "./types";

export let DefaultTranslation = {
	lang: "en",
	translation: {
		hello: "Hello",
		withProp: `With Prop: ${props.name}`,
		buttonLabel: "This is a button",
	},
};

export type Translation = GetTranslation<typeof DefaultTranslation>;

export let Translations: ToTranslations<typeof DefaultTranslation> = [
	{
		lang: "de",
		translation: {
			hello: "Hallo",
			withProp: `Mit Prop: ${props.name}`,
			buttonLabel: "Das ist ein Knopf",
		},
	},
];
