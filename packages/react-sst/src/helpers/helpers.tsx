import React, { ReactNode } from "react"

import { PropProxy, ToString } from '../types'
import { isProp } from "../hooks"

export type Condition = ToString | undefined

export type ConditionProps = {
	condition: Condition,
	children: ReactNode,
}

export let If = ({ condition, children }: ConditionProps) => {
	return (
		<>
			{`{{#if ${getCondition(condition)}}}`}
			{children}
			{'{{/if}}'}
		</>
	)
}

export let Else = ({ children }: { children: ReactNode }) => {
	return (
		<>
			{`{{else}}`}
			{children}
		</>
	)
}

export let Unless = ({ condition, children }: ConditionProps) => {
	return (
		<>
			{`{{#unless ${getCondition(condition)}}}`}
			{children}
			{'{{/unless}}'}
		</>
	)
}

export type EachProps<T> = {
	items: ToString,
	render: (props: PropProxy<T>) => ReactNode,
}

export let Each = <T extends Object,>({ items, render }: EachProps<T>) => {

	let proxy: PropProxy<T> = new Proxy({} as any, {
		get: (_, key) => {
			let value = `{{this.${key.toString()}}}`
			return Object.assign(value, {
				toString: () => value
			})
		}
	})

	let children = render(proxy)

	return (
		<>
			{`{{#each ${items.toString()}}}`}
			{ children }
			{`{{/each}}`}
		</>
	)
}

export function lookup(obj: string, value: string): string {
	return `(lookup ${obj} ${value})`
}

export function log<T extends Array<ToString>>(...args: T): string {
	return `{{log ${args.map(a => a.toString()).join(' ')}}}`
}

function getCondition(condition: Condition) {
	return condition ? condition.toString() : 'false'
}

export function cx(...args: Array<string | { [prop: string]: Condition }>): string {
	let classes = args.filter(str => typeof str === 'string')
	let objects = args.filter(obj => typeof obj === 'object')

	let templates = objects.flatMap(obj => {
		return Object.entries(obj).map(entry => {
			return `{{#if ${getCondition(entry[1])} }}${entry[0]}{{/if}}`
		})
	})

	return `${classes.join(' ')} ${templates.join(' ')}`
}

export function fallback(value: Condition, defaultValue: any) {

	let cond = isProp(value)
		? getCondition(value)
		: typeof value === 'string'
		? true
		: value
		
	return `{{#if ${cond}}}${value}{{else}}${defaultValue}{{/if}}`
}