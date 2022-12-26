import { Previews, Item } from "postler";
import { TemplateProps } from "./types";

export let Data: Previews<TemplateProps> = [
	Item("name", {
		name: "{{projectName}}",
	}),
];
