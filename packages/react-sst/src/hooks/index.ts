import { PropProxy } from '../types'

export let getKey = (...args: Array<string | undefined>): string =>  {
	return args
		.filter(str => str !== undefined)
		.join('.')
}

type MakeKeyFn = (key: string) => string
export let makeKey: MakeKeyFn = key => {
	if (key.includes('-')) {
		return `[${key}]`
	}

	return key
}

export function handler(level: Array<string | undefined>): ProxyHandler<any> {
	return {
		get: (target, key) => {
			/**
			 * We use the 'toString' method inside of conditions.
			 * to string returns the raw key.
			 */
			if (key === 'toString') {
				return () => target.toString()
			}

			/**
			 * Adds support for array indexing, the limitation here is that
			 * instead of using the bracket syntax (array[index]), users will
			 * have to use the `.at` method: array.at(index)
			 * 
			 * https://handlebarsjs.com/guide/expressions.html#literal-segments
			 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at
		 	 */
			if (key === 'at') {
				return (index: number) => {
					let str = new String(getKey(...level, `[${index}]`))
					let obj = new Proxy(str, handler([...level, `[${index}]`]))
					return obj
				}
			}


			if (target[key]) {
				return target[key]
			}


			/**
             * React will call `toPrimitive` on the string, the
             * primitive returned is the key, wrapped in curly braces.
             * e.g: when key = name then primitive = {{name}}
			 */
			if (key === Symbol.toPrimitive) {
				return () => `{{${target?.toString() ?? ''}}}`
			}

			let _key = makeKey(key.toString())
			let str = new String(getKey(...level, _key))
			let obj = new Proxy(str, handler([...level, _key]))
			return obj
		},
	} as ProxyHandler<any>
}

export function useProps<T>(): PropProxy<T> {
	return new Proxy({}, handler([]))
}
