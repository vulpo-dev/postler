import { createProps } from "postler";

export type TemplateProps = {
	name: string;
};

export let props = createProps<TemplateProps>();
