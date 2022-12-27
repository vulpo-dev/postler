# Brief

Brief is a typography-focused email toolkit based on typesettings.io. It includes components such as `<Typography />`, `<Container />`, `<Row />`, `<Spacer />`, and `<Button />` to help you create visually appealing and effective emails.


## Install Brief

To install Brief, run the following command in your terminal:

`npm install @vulpo-dev/brief`


## Usage

To use Brief in your project, you will need to import the desired components from the `@vulpo-dev/brief` package. Here is an example of how you might use the `<Typography />`, `<Container />`, and `<Row />` components:

```tsx
import { Document } from "postler";
import { Typography, Container, Row } from "@vulpo-dev/brief";

export let Template = () => {
  return (
    <Document>
      <Typography />
      <Container>
        <Row>
          <!-- Your email content goes here -->
        </Row>
      </Container>
    </Document>
  );
};
```

The `<Typography />` component provides global styles for typography in your email. The `<Container />` component can be used to create a container element that is centered on the page and has a maximum width. The `<Row />` component can be used to create a row of elements within the container.

You can also use the `<Spacer />` component to add vertical spacing between elements, and the `<Button />` component to create buttons in your email.
