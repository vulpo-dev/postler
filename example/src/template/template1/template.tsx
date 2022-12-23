import styled from "@emotion/styled";
import { Each, createTranslations, Document, fallback, html } from "postler";
import { Button } from "../../component/button";
import { props, Item } from "./types";
import { Translation } from "./translations";

let t = createTranslations<Translation>();

export let Plaintext = () => {
	return (
		<>
			Name: {props.name}
			<br />
			Email: {props.email}
			<br />

			<Each
				items={props.items}
				render={(item: Item) => (
					<>
						- {item.title}
						<br />
					</>
				)}
			/>
		</>
	);
};

export let Template = () => {
	return (
		<Document lang='fuu'>
			<Body>
				<Title>{t.headline}</Title>
				<p>Name: {props.name}</p>
				<p>Email: {props.email}</p>

				<hr />

				<p>{t.text}</p>
				<p>{html(t.expire)}</p>

				<hr />

				<p>Fallback: {fallback(true, "fuu")}</p>

				<Button primary>{t.label}</Button>

				<ul>
					<Each
						items={props.items}
						render={(item: Item) => <li>{item.title}</li>}
					/>
				</ul>
			</Body>
		</Document>
	);
};

let Title = styled.h1`
	font-family: sans-serif;
`;

let Body = styled.body`
	.bold {
		font-weight: bold;
	}
`;
