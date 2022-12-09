import { test } from '@japa/runner'
import { getKey, makeKey, useProps } from './index'

test.group('Hooks', () => {
	test('getKey', ({ expect }) => {
		let args = [
			[[undefined, 'fuu'], 'fuu'],
			[['fuu', 'bar'], 'fuu.bar'],
			[['fuu', undefined, 'bar'], 'fuu.bar']
		]

		args.forEach(([args, result]) => {
			let key = getKey(...args)
			expect(key).toEqual(result)
		})
	})

	test('makeKey', ({ expect }) => {
		let args = [
			['fuu', 'fuu'],
			['fuu-bar', '[fuu-bar]']
		]

		args.forEach(([arg, result]) => {
			let key = makeKey(arg)
			expect(key).toEqual(result)
		})
	})

	test('useProps', ({ expect }) => {
		let { name, bar, items, nested } = useProps<Props>()

		expect(`${name}`).toEqual('{{name}}')
		expect(`${bar}`).toEqual('{{bar}}')
		expect(`${items}`).toEqual('{{items}}')
		expect(`${items.at(0)?.name}`).toEqual('{{items.[0].name}}')
		expect(`${items.at(0)?.['fuu-bar']}`).toEqual('{{items.[0].[fuu-bar]}}')
		expect(`${nested}`).toEqual('{{nested}}')
		expect(`${nested.fuu}`).toEqual('{{nested.fuu}}')
		expect(`${nested.bax}`).toEqual('{{nested.bax}}')
		expect(`${nested.bax.aaaa}`).toEqual('{{nested.bax.aaaa}}')
	})
})

type Props = {
	name: string,
	bar: number,
	items: Array<{ name: string, "fuu-bar": number }>,
	nested: Nested,
}

export type Nested = {
	fuu: string,
	bax: {
		aaaa: string,
	}
}
