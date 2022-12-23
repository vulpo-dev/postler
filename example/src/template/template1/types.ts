import { createProps } from "postler";

export type Props = {
	name: string;
	propject: string;
	email: string;
	expire_in: number;
	items: Array<Item>;
};

export type Item = {
	title: string;
};

export let props = createProps<Props>();
