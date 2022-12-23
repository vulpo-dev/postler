import { Previews, Item } from "postler";
import { Props } from "./types";

export let Data: Previews<Props> = [
	Item("name", {
		name: "{{projectName}}",
	}),
];
