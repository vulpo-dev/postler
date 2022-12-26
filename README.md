# Postler: Write Once, Render Anywhere*

Postler is a tool that allows you to create [type-safe](https://www.typescriptlang.org/) email templates using [React](https://reactjs.org/) inside a live preview. When you build your templates, the React code is converted to either [Handlebars](https://handlebarsjs.com) or [Mustache](https://mustache.github.io/).

## Getting Started

1.  Create a new project:
    -   npx: `npx create-postler my-email-templates`
    -   yarn `yarn create postler my-email-templates`

2.  Start the preview:
    1.  Install dependencies: `npm install`
    2.  Start the preview: `npm start`
    3.  Go to [http://localhost:47150](http://localhost:47150)

You can now create your first template.

## Building templates

Postler looks for templates in the `src/templates` directory. Each folder inside `src/templates` represents a separate template.


### `src/templates/<your-template>`

This is where you will store your templates. Postler expects to find an `index.ts` file that contains all the necessary exports for building the template.

Exports:
-   `<Template />`: a React component that will be converted to a Handlebars template
-   `<Plaintext />`: a plaintext fallback
-   `type TemplateProps`: the schema for rendering the template
-   `type Translation`: the schema for translations
-   `DefaultTranslation`: the default translations to use as a fallback
-   `Translations`: an array of translations

#### `<Template />`

```tsx
// src/templates/<your-template>/template.ts
import styled from "@emotion/styled";
import { Document, createProps } from "postler";

export type TemplateProps = {
  name: string;
};

let props = createProps<TemplateProps>();

export let Template = () => {
  return (
    <Document>
      <Body>
        <Title>Hello: {props.name}</Title>
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

**Note:** Emotion is supported by Postler and is the preferred way to style components. Emotion has built-in support for React's `renderToStaticMarkup` function, which simplifies the build process and eliminates the need for configuring a bundler.

```ts
// src/templates/<your-template>/index.ts
export { type TemplateProps, Template } from "./template.tsx"
```

### Build in helpers:
Since we are compiling to static handlebars, we are unable to use build in JavaScript constructs such as `if/else`, `array.map` or `??`.

#### `<If />`
```tsx
import { Document, createProps, If } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <If condition={props.name}>
            Render if {props.name} is truthy
        </If>
    )
}
```

#### `<Else />`
```tsx
import { Document, createProps, If, Else } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <If condition={props.name}>
            Render if {props.name} is truthy
            <Else>
                Render if name is falsy
            </Else>
        </If>
    )
}
```

#### `<Unless />`
```tsx
import { Document, createProps, Unless } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <Unless condition={props.name}>
            Render if name is falsey
        </Unless>
    )
}
```

#### `<Each />`
```tsx
import { Document, createProps, Each } from "postler";

type User = {
    username: string
};

export type TemplateProps = {
    users: Array<User>;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <ul>
            <Each
                items={props.users}
                render={(item: User) => <li>{ item.username }</li>}
            />
        </ul>
    )
}
```

#### `cx()`
```tsx
import { Document, createProps, cx } from "postler";

export type TemplateProps = {
    active: boolean;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <div
            className={cx(
                "component",
                { "component-active": props.active }
            )}
        />
    )
}
```

#### `fallback()`
```tsx
import { Document, createProps, fallback } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <div>
            Hello {fallback(props.name, "World")}
        </div>
    )
}
```

#### `html()`
```tsx
import { Document, createProps, html } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Template = () => {
    return (
        <div>
            Hello {html(props.name)}
        </div>
    )
}
```

### Arrays

#### Mapping items
You cannot use `array.map` to render arrays. Instead, use the `<Each />` helper.

#### Array indexing
You cannot use `array[index]` to access elements in an array. Instead, use the `array.at(index)` method.

### Plaintext

Use the `<Plaintext />` React component to create a plain text version of your template. This component supports all of the same helpers as the HTML version. `<br/>` will be replaced by newlines (`\n`) and all other HTML tags will be removed.

```tsx
import { Document, createProps, If } from "postler";

export type TemplateProps = {
    name?: string;
};

let props = createProps<TemplateProps>();

let Plaintext = () => {
    return (
        <p>
            <If condition={props.name}>
                Render if {props.name} is truthy
            </If>
        </p>
    )
}

let Template = () => {
    return (
        <Document>
            <If condition={props.name}>
                Render if {props.name} is truthy
            </If>
        </Document>
    )
}
```

### Translations
#### `src/templates/<your-template>/translations.ts`
```ts
import { GetTranslation, ToTranslations } from "postler";
import { props } from "./types";

export let DefaultTranslation = {
    lang: "en",
    translation: {
        hello: "Hello",
        withProp: `With Prop: ${props.name}`,
        buttonLabel: "This is a button",
    },
};

export type Translation = GetTranslation<typeof DefaultTranslation>;
export let Translations: ToTranslations<typeof DefaultTranslation> = [
    {
        lang: "de",
        translation: {
            hello: "Hallo",
            withProp: `Mit Prop: ${props.name}`,
            buttonLabel: "Das ist ein Knopf",
        },
    },
];
```

## Config
### `src/config.ts`

```ts
type TemplateEngine = "handlebars" | "mustache";

type Config = {
    // nodemailer settings, required when sending test emails
    smtp?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };

    // the email from where the test email will be send from
    email: {
        from: string;
    };

    // the template engine used to render the components
    templateEngine?: TemplateEngine;
};
```

## Light/Dark Mode

Postler automatically adapts to your system's preference for light or dark mode. To toggle between modes, you can use the built-in browser emulation for Firefox or Chrome.

-   Firefox: [Instructions](https://stackoverflow.com/questions/56401662/firefox-how-to-test-prefers-color-scheme)
-   Chrome: [Instructions](https://developer.chrome.com/docs/devtools/rendering/emulate-css/#emulate-css-media-feature-prefers-color-scheme)

## MJML

Postler has built-in support for [MJML](https://mjml.io/).

### Configuring MJML

1.  Install [@faire/mjml-react](https://github.com/Faire/mjml-react).
2.  Configure your template in `src/template/<your-template>/index.ts`.
```ts
export { Template } from "./template";
export { type TemplateProps } from "./types";
export {
    DefaultTranslation,
    Translations,
    type Translation,
} from "./translations";

export default {
    mjml: true, // additional per template config
}
```

3. Create mjml template
```tsx
import {
    Mjml,
    MjmlHead,
    MjmlTitle,
    MjmlPreview,
    MjmlBody,
    MjmlSection,
    MjmlColumn,
    MjmlButton,
    MjmlImage,
    MjmlRaw,
} from "@faire/mjml-react";
import { Each, createProps } from "postler";

export type TemplateProps = {
    label: string;
    img: string;
    items: Array<{ title: string }>;
};

let props = createProps<TemplateProps>();

export let Template = () => {

    return (
        <Mjml>
            <MjmlHead>
                <MjmlTitle>Last Minute Offer</MjmlTitle>
                <MjmlPreview>Last Minute Offer...</MjmlPreview>
            </MjmlHead>
            <MjmlBody width={500}>
                <MjmlSection fullWidth backgroundColor='#efefef'>
                    <MjmlColumn>
                        <MjmlImage src={`${props.img}`} />
                    </MjmlColumn>
                </MjmlSection>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlButton
                            padding='20px'
                            backgroundColor='#346DB7'
                            href='https://github.com/vulpo-dev/postler'
                        >
                            {props.label}
                        </MjmlButton>
                    </MjmlColumn>
                </MjmlSection>
                <MjmlRaw>
                    <ul>
                        <Each
                            items={props.items}
                            render={(item: { title: string }) => {
                                return (
                                    <li>
                                        <p>{item.title}</p>
                                    </li>
                                );
                            }}
                        />
                    </ul>
                </MjmlRaw>
            </MjmlBody>
        </Mjml>
    );
};
```

## Preview

### `src/templates/<your-template>/preview.ts`

In addition to your template, Postler will also look for a `preview.ts` file inside the template folder. This file should export an array called `Data`, which will be used inside the preview during development. You can have as many previews as you like.

```ts
import { faker } from "@faker-js/faker";

import { Previews, Item } from "postler";
import { TemplateProps } from "./template";

export let Data: Previews<TemplateProps> = [
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
- `Item` is a small wrapper around `{ title: string, props: TemplateProps }`
- You can use [fakerjs.dev](https://fakerjs.dev/) to generate fake data to ensure your designs will work for different kinds of data, or just hard code edge cases you want to handle

## Send Preview Emails

Before you can send any emails, make sure your SMTP and email settings are correctly configured (see [Config](#config)).

### Build your templates for production

When you are ready, run `npm run build` to convert your React components into Handlebars templates. Your templates will be output to the `/build` directory.

#### `/build/<your-template>`

This directory contains all of the content needed to render your template, including:

-   `template.hbs`: the Handlebars template
-   `props.schema.json`: the JSON schema for your props
-   `translation.schema.json`: the JSON schema for your translations
-   `translation/`: a directory containing all your translations
    -   `config.json`: information about the default language and available languages
    -   `<lang-code>.hbs`: a JSON-formatted Handlebars template for your translations

## Render your template

TODO: Node.js example

## CLI

The Postler CLI provides two commands: `serve` and `build`

### `postler serve`

### `postler build`

## How it works

`createProps` and `createTranslations` are recursive proxies that collect the properties you use until either `.toString()` or `.toPrimitive()` is called.  
`.toString()` returns the raw path, while `.toPrimitive()` returns the path wrapped in double curly brackets (`{{}}`).

```ts
import { createProps } from "postler";

type TemplateProps = {
    fuu: {
        bar: {
            baz: number,
        },
    }
}

let props = createProps<TemplateProps>()

console.log(props.fuu.bar.toString()) // "props.fuu.bar"
console.log(`${props.fuu.bar}`) // "{{props.fuu.bar}}"

console.log(props.fuu.bar.baz.toString()) // "props.fuu.bar.baz"
console.log(`${props.fuu.bar.baz}`) // "{{props.fuu.bar.baz}}"
```

## Motivation

While working on an [authentication server](https://auth.vulpo.dev), I realized that there needed to be a better way to allow people to customize email templates. My initial idea was to allow users to edit the templates from within the admin dashboard, but this had several drawbacks:

-   The editor was just a text field, making it difficult to use.
-   There was no preview available.
-   There was no version control.
-   Writing HTML email templates can be challenging.

Postler's goal is to be unobtrusive to the developer, which means development should happen within the tools that the developer is already familiar with and follows the same lifecycle as any other code.

\*Anywhere that supports handlebars or mustache.
