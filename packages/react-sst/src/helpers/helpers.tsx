import React, { createContext, ReactNode, useContext } from "react";

import { PropProxy, ToString } from "../types";
import { isProp } from "../hooks";
import { useTemplateEngine } from "../context";

export type Condition = ToString | undefined;

export type ConditionProps = {
	condition: Condition;
	children: ReactNode;
};

let IfCtx = createContext<{ cond: string }>({ cond: "" });

export let If = ({ condition, children }: ConditionProps) => {
	let engine = useTemplateEngine();
	let cond = getCondition(condition);

	if (engine === "mustache") {
		return (
			<IfCtx.Provider value={{ cond }}>
				{`{{#${cond}}}`}
				{children}
				{`{{/${cond}}}`}
			</IfCtx.Provider>
		);
	}

	return (
		<IfCtx.Provider value={{ cond }}>
			{`{{#if ${cond}}}`}
			{children}
			{"{{/if}}"}
		</IfCtx.Provider>
	);
};

export let Else = ({ children }: { children: ReactNode }) => {
	let engine = useTemplateEngine();
	let ctx = useContext(IfCtx);

	if (engine === "mustache") {
		return (
			<>
				{`{{/${ctx.cond}}}`}
				{`{{^${ctx.cond}}}`}
				{children}
			</>
		);
	}

	return (
		<>
			{"{{else}}"}
			{children}
		</>
	);
};

export let Unless = ({ condition, children }: ConditionProps) => {
	let engine = useTemplateEngine();

	if (engine === "mustache") {
		return (
			<>
				{`{{^${getCondition(condition)}}}`}
				{children}
				{`{{/${getCondition(condition)}}}`}
			</>
		);
	}

	return (
		<>
			{`{{#unless ${getCondition(condition)}}}`}
			{children}
			{"{{/unless}}"}
		</>
	);
};

export type EachProps<T> = {
	items: ToString;
	render: (props: PropProxy<T>) => ReactNode;
};

export let Each = <T extends Object>({ items, render }: EachProps<T>) => {
	let engine = useTemplateEngine();

	let scope = engine === "handlebars" ? "this." : "";

	let proxy: unknown = new Proxy(
		{},
		{
			get: (_, key) => {
				let value = `{{${scope}${key.toString()}}}`;
				return Object.assign(value, {
					toString: () => value,
				});
			},
		},
	);

	let children = render(proxy as PropProxy<T>);

	if (engine === "mustache") {
		return (
			<>
				{`{{#${items.toString()}}}`}
				{children}
				{`{{/${items.toString()}}}`}
			</>
		);
	}

	return (
		<>
			{`{{#each ${items.toString()}}}`}
			{children}
			{"{{/each}}"}
		</>
	);
};

export function lookup(obj: string, value: string): string {
	let engine = useTemplateEngine();

	if (engine === "mustache") {
		throw new Error("lookup is not supported when using mustache");
	}

	return `(lookup ${obj} ${value})`;
}

export function log<T extends Array<ToString>>(...args: T): string {
	let engine = useTemplateEngine();

	if (engine === "mustache") {
		throw new Error("log is not supported when using mustache");
	}

	return `{{log ${args.map((a) => a.toString()).join(" ")}}}`;
}

function getCondition(condition: Condition): string {
	return condition !== null && condition !== undefined
		? condition.toString()
		: "false";
}

export function cx(...args: Array<string | Record<string, Condition>>): string {
	let engine = useTemplateEngine();

	let classes = args.filter((str) => typeof str === "string");
	let objects = args.filter((obj) => typeof obj === "object");

	let templates = objects.flatMap((obj) => {
		return Object.entries(obj).map((entry) => {
			if (engine === "mustache") {
				let cond = getCondition(entry[1]);
				return `{{#${cond}}}${entry[0]}{{/${cond}}}`;
			}

			return `{{#if ${getCondition(entry[1])} }}${entry[0]}{{/if}}`;
		});
	});

	return `${classes.join(" ")} ${templates.join(" ")}`;
}

export function fallback(value: Condition, defaultValue: unknown): string {
	let engine = useTemplateEngine();

	let cond = isProp(value)
		? getCondition(value)
		: typeof value === "string"
		? true
		: value;

	if (engine === "mustache") {
		return `{{#${cond}}}${value}{{/${cond}}}{{^${cond}}}${defaultValue}{{/${cond}}}`;
	}

	return `{{#if ${cond}}}${value}{{else}}${defaultValue}{{/if}}`;
}

export function html(value: ToString): string {
	return `{${value}}`;
}
