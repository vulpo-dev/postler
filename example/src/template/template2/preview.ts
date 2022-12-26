import { faker } from "@faker-js/faker";

import { Previews, Item } from "postler";
import { TemplateProps } from "./template";

export let Data: Previews<TemplateProps> = [
	Item("Fullname", {
		title: faker.name.fullName(),
		primary: true,
	}),
	Item("really long", {
		title: faker.lorem.paragraph(),
		primary: true,
	}),
	Item("Email", {
		title: faker.internet.email(),
		primary: true,
	}),
	Item("undefined title & secondary button", {}),
];
