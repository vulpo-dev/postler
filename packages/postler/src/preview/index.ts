export type Preview<T> = { title: string; props: T };
export type Previews<T> = Array<Preview<T>>;

export function Item<T>(title: string, props: T): Preview<T> {
	return { title, props };
}
