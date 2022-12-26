import React, { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "@japa/runner";
import { If, Else, Unless, Each, lookup } from "./helpers";
import Handlebars from "handlebars";
import { TemplateEngineCtx } from "../context";
import Mustache from "mustache";

let HandlebarsCtx = ({ children }: { children: ReactNode }) => {
	return (
		<TemplateEngineCtx.Provider value="handlebars">
			{children}
		</TemplateEngineCtx.Provider>
	);
};

test.group("Helpers: Handlebars", () => {
	test("If", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<HandlebarsCtx>
				<If condition={"cond"}>
					<div />
				</If>
			</HandlebarsCtx>,
		);

		expect(markup).toEqual("{{#if cond}}<div></div>{{/if}}");

		let render = Handlebars.compile(markup);
		expect(render({ cond: false })).toEqual("");
		expect(render({ cond: true })).toEqual("<div></div>");
	});

	test("If/Else", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<HandlebarsCtx>
				<If condition={"cond"}>
					<div />
					<Else>
						<p />
					</Else>
				</If>
			</HandlebarsCtx>,
		);

		expect(markup).toEqual("{{#if cond}}<div></div>{{else}}<p></p>{{/if}}");

		let render = Handlebars.compile(markup);
		expect(render({ cond: false })).toEqual("<p></p>");
		expect(render({ cond: true })).toEqual("<div></div>");
	});

	test("Unless", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<HandlebarsCtx>
				<Unless condition={"cond"}>
					<div />
				</Unless>
			</HandlebarsCtx>,
		);

		expect(markup).toEqual("{{#unless cond}}<div></div>{{/unless}}");

		let render = Handlebars.compile(markup);
		expect(render({ cond: false })).toEqual("<div></div>");
		expect(render({ cond: true })).toEqual("");
	});

	test("Each", ({ expect }) => {
		let Item = ({ name }: { name: number }): JSX.Element => {
			return <div>{name}</div>;
		};

		let markup = renderToStaticMarkup(
			<HandlebarsCtx>
				<Each items={"items"} render={Item} />
			</HandlebarsCtx>,
		);

		expect(markup).toEqual("{{#each items}}<div>{{this.name}}</div>{{/each}}");

		let render = Handlebars.compile(markup);
		let items = [{ name: "one" }, { name: "two" }, { name: "three" }];
		expect(render({ items })).toEqual(
			"<div>one</div><div>two</div><div>three</div>",
		);
	});
});

let MustacheCtx = ({ children }: { children: ReactNode }) => {
	return (
		<TemplateEngineCtx.Provider value="mustache">
			{children}
		</TemplateEngineCtx.Provider>
	);
};

test.group("Helpers: Mustache", () => {
	test("If", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<MustacheCtx>
				<If condition={"cond"}>
					<div />
				</If>
			</MustacheCtx>,
		);

		expect(markup).toEqual("{{#cond}}<div></div>{{/cond}}");

		let render = (args: { cond: boolean }) => Mustache.render(markup, args);
		expect(render({ cond: false })).toEqual("");
		expect(render({ cond: true })).toEqual("<div></div>");
	});

	test("If/Else", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<MustacheCtx>
				<If condition={"cond"}>
					<div />
					<Else>
						<p />
					</Else>
				</If>
			</MustacheCtx>,
		);

		expect(markup).toEqual(
			"{{#cond}}<div></div>{{/cond}}{{^cond}}<p></p>{{/cond}}",
		);

		let render = (args: { cond: boolean }) => Mustache.render(markup, args);
		expect(render({ cond: false })).toEqual("<p></p>");
		expect(render({ cond: true })).toEqual("<div></div>");
	});

	test("Unless", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<MustacheCtx>
				<Unless condition={"cond"}>
					<div />
				</Unless>
			</MustacheCtx>,
		);

		expect(markup).toEqual("{{^cond}}<div></div>{{/cond}}");

		let render = (args: { cond: boolean }) => Mustache.render(markup, args);
		expect(render({ cond: false })).toEqual("<div></div>");
		expect(render({ cond: true })).toEqual("");
	});

	test("Each", ({ expect }) => {
		let Item = ({ name }: { name: number }): JSX.Element => {
			return <div>{name}</div>;
		};

		let markup = renderToStaticMarkup(
			<MustacheCtx>
				<Each items={"items"} render={Item} />
			</MustacheCtx>,
		);

		expect(markup).toEqual("{{#items}}<div>{{name}}</div>{{/items}}");

		let items = [{ name: "one" }, { name: "two" }, { name: "three" }];
		let render = (args: { items: typeof items }) => Mustache.render(markup, args);
		expect(render({ items })).toEqual(
			"<div>one</div><div>two</div><div>three</div>",
		);
	});
});
