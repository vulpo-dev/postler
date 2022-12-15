import { faker } from "@faker-js/faker";

import { Previews, Item } from "postler";
import { Props } from "./template";

export let Data: Previews<Props> = [
	Item("title", {
		label: faker.name.fullName(),
		img: faker.image.lorempicsum.image(),
		items: [
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
			{ title: faker.lorem.words() },
		],
	}),
];
