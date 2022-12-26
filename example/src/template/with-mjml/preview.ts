import { faker } from "@faker-js/faker";

import { Previews, Item } from "postler";
import { TemplateProps } from "./template";

export let Data: Previews<TemplateProps> = [
	Item("title", {
		label: faker.name.fullName(),
		img: faker.image.lorempicsum.image(),
		items: [
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
		],
	}),
	Item("title2", {
		label: "GitHub",
		img: faker.image.lorempicsum.image(),
		items: [
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
		],
	}),
];
