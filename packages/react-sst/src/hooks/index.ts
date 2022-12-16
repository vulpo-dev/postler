import { PropProxy } from "../types";

/**
 * getKey gets an array of strings and joins them
 * together using a dot (.) turning them into
 * a property access
 */
export let getKey = (...args: Array<string | undefined>): string => {
	return args.filter((str) => str !== undefined).join(".");
};

type MakeKeyFn = (key: string) => string;

/**
 * makeKey accepts a string and returns a handlebars
 * compatible key
 */
export let makeKey: MakeKeyFn = (key: string) => {
	if (key.includes("-")) {
		return `[${key}]`;
	}

	return key;
};

/**
 * createProxyHandler returns getter proxy, @params level is an array
 * storing the current path of the accessed object
 */
export function createProxyHandler(
	level: Array<string | undefined>,
	// rome-ignore lint/suspicious/noExplicitAny: not sure how to type the proxy magic
): ProxyHandler<any> {
	// rome-ignore lint/suspicious/noExplicitAny: not sure how to type the proxy magic
	let handler: ProxyHandler<any> = {
		get: (target, key) => {
			/**
			 * We use the 'toString' method inside of conditions.
			 * to string returns the raw key.
			 */
			if (key === "toString") {
				return () => target.toString();
			}

			/**
			 * Adds support for array indexing, the limitation here is that
			 * instead of using the bracket syntax (array[index]), users will
			 * have to use the `.at` method: array.at(index)
			 *
			 * https://handlebarsjs.com/guide/expressions.html#literal-segments
			 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
			 */
			if (key === "at") {
				return (index: number) => {
					// we need to disable the linter, otherwise the proxy won't
					// work if we don't wrap the string inside of new String()
					// eslint-disable-next-line no-new-wrappers
					let str = new String(getKey(...level, `[${index}]`));
					let obj = new Proxy(
						str,
						createProxyHandler([...level, `[${index}]`]),
					);
					return obj;
				};
			}

			if (key === "isProp") {
				return true;
			}

			if (target[key] !== undefined) {
				return target[key];
			}

			/**
			 * React will call `toPrimitive` on the string, the
			 * primitive returned is the key, wrapped in curly braces.
			 * e.g: when key = name then primitive = {{name}}
			 */
			if (key === Symbol.toPrimitive) {
				return () => `{{${target?.toString() ?? ""}}}`;
			}

			let _key = makeKey(key.toString());
			// we need to disable the linter, otherwise the proxy won't
			// work if we don't wrap the string inside of new String()
			// eslint-disable-next-line no-new-wrappers
			let str = new String(getKey(...level, _key));
			let obj = new Proxy(str, createProxyHandler([...level, _key]));
			return obj;
		},
	};

	return handler;
}

export function createProps<T>(): PropProxy<T> {
	return new Proxy({}, createProxyHandler(["props"]));
}

export function createTranslations<T>(): PropProxy<T> {
	return new Proxy({}, createProxyHandler(["t"]));
}

export function isProp(value: unknown): boolean {
	if (typeof value === "string") {
		return hasProp(value) ? value.isProp : false;
	}

	return false;
}

function hasProp(value: unknown): value is { isProp: boolean } {
	return (value as { isProp?: boolean }).isProp !== undefined;
}
