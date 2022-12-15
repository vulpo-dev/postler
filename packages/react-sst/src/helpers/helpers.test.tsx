import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "@japa/runner";
import { If, Else, Unless, Each } from "./helpers";

test.group("Helpers", () => {
	test("If", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<If condition={"fuuu"}>
				<div></div>
			</If>
		);

		expect(markup).toEqual("{{#if fuuu}}<div></div>{{/if}}");
	});

	test("If/Else", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<If condition={"fuuu"}>
				<div></div>
				<Else>
					<p></p>
				</Else>
			</If>
		);

		expect(markup).toEqual("{{#if fuuu}}<div></div>{{else}}<p></p>{{/if}}");
	});

	test("Unless", ({ expect }) => {
		let markup = renderToStaticMarkup(
			<Unless condition={"fuuu"}>
				<div></div>
			</Unless>
		);

		expect(markup).toEqual("{{#unless fuuu}}<div></div>{{/unless}}");
	});

	test("Each", ({ expect }) => {
		let Item = ({ name }: { name: number }): JSX.Element => {
			return <div>{name}</div>;
		};

		let markup = renderToStaticMarkup(
			<Each
				items={"items"}
				render={Item}
			/>
		);

		expect(markup).toEqual("{{#each items}}<div>{{this.name}}</div>{{/each}}");
	});
});
