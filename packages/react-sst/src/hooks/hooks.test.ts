import { test } from '@japa/runner'
import { getKey, makeKey, createProps } from './index'

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
		let { name, bar, items, nested } = createProps<Props>()

		expect(`${name}`).toEqual('{{props.name}}')
		expect(`${bar}`).toEqual('{{props.bar}}')
		expect(`${items}`).toEqual('{{props.items}}')
		expect(`${items.at(0)?.name}`).toEqual('{{props.items.[0].name}}')
		expect(`${items.at(0)?.['fuu-bar']}`).toEqual('{{props.items.[0].[fuu-bar]}}')
		expect(`${nested}`).toEqual('{{props.nested}}')
		expect(`${nested.fuu}`).toEqual('{{props.nested.fuu}}')
		expect(`${nested.bax}`).toEqual('{{props.nested.bax}}')
		expect(`${nested.bax.aaaa}`).toEqual('{{props.nested.bax.aaaa}}')
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
