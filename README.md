# Postler: Write Once, Render Anywhere*

Postler enables you to develop [type-safe](https://www.typescriptlang.org/) email templates in [react](https://reactjs.org/) and a live
preview. When you build your templates, the react code will get translated to
[handlebars](https://handlebarsjs.com) which will allow you to render your template in your language of
choice.

## Getting Started
1. Create the project:
	- npx: `npx create-postler my-email-templates`
	- yarn `yarn create postler my-email-templates`

2. Start the preview:
	1. Install packages: `npm install`
	2. `npm start`
	3. Go to http://localhost:47150

You are now ready and set to create your first template.

## Building templates
Postler will look at `src/templates` in order to detect your templates, each folder inside of `src/templates` is treated as a separate template. 

### `src/templates/<your-template>`
This is where all your templates will live, postler expects an `index.ts` file that contains all the necesary exports required to build your template. 

Exports:
- `<Template />` the react component will be converted to a handlebars template
- `type Props` the schema to render your template
- `type Translation` the schema for your translations
- `DefaultTranslation` the translations that should be used as a fallback
- `Translations` an array of translations

#### `<Template />`
```tsx
// src/templates/<your-template>/template.ts
import styled from "@emotion/styled";
import { Document, createProps } from "postler";

export type Props = {
	name: string;
};

let props = createProps<Props>();

export let Template = () => {
	return (
		<Document>
			<Body>
				<Title>Hello: { props.name }</Title>
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
```

**Notes:**
[Emotion](https://emotion.sh) is supported out of the box and the preffered way to style your components.
Q: Why Emotion?
A: Emotion comes with build in support for reacts `renderToStaticMarkup` which enables a simpler build process and no need to configure a bundler.

```ts
// src/templates/<your-template>/index.ts
export { type Props, Template } from "./template.tsx"
```

### Build in helpers:
Since we are compiling to static handlebars, we are unable to use build in JavaScript constructs such as `if/else`, `array.map` or `??`.
#### `<If />`
#### `<Else />`
#### `<Unless />`
#### `<Each />`
#### `lookup()`
#### `log()`
#### `cx()`
#### `fallback()`
#### `html()`

### Translations

## Light/Dark mode

### MJML



### `src/templates/<your-template>/preview.ts`
In additon to your template, postler will also look for a `preview.ts` file inside of any template folder. `preview.ts` should export a `Data` array which will be used inside the preview durring development. You can have as many previews as you like.

```ts
import { faker } from "@faker-js/faker";

import { Previews, Item } from "postler";
import { Props } from "./template";

export let Data: Previews<Props> = [
	Item("fullName", {
		name: faker.name.fullName(),
	}),
	Item("firstName", {
		name: faker.name.firstName(),
	}),
	Item("lastName", {
		name: faker.name.lastName(),
	}),
	Item("long name", {
		name: faker.lorem.words(),
	}),
];
```

**Notes:**
- `Previews` is a helper type to ensure your preview and your props won't go out of sync.
- `Item` is a small wrapper around `{ title: string, props: Props }`
- You can use [fakerjs.dev](https://fakerjs.dev/) to generate fake data to ensure your designs will work for different kinds of data, or just hard code edge cases you want to handle

## Send Preview Emails


### Build your templates for production
Once you are ready, you can run `npm run build` and turn your react components into handlebars templates. Your templates will be outputted to the `/build` directory. 

#### `/build/<your-template>`
All of the content to render your tempate will be located inside of this folder, which includes the following:
- `template.hbs` is the handlebars template
- `props.schema.json` is the json schema for your props
- `translation.schema.json` is the json schema for your translations
- `translation/` is the folder containing all your translations
	- `config.json` information about the default language and available languages
	- `<lang-code>.hbs` a json formatted handlebars template for your translations


## Render your template

## CLI
The postler CLI provides you with two commands: `serve` and `build`
### `postler serve`


### `postler build`


## How it works

## Motivation


\*Anywhere that supports handlebars
