import styled from "@emotion/styled"
import { Each, useProps } from 'postler'
import { Button } from '../../component/button'

export type Props = {
	name: string,
	email: string,
	items: Array<Item>
}

export type Item = {
	title: string
}

export let Template = () => {
	let props = useProps<Props>()
	return (
		<html lang="en">
		  <head>
		    <meta charSet="utf-8"/>
		    <title>Example Yoo</title>
		  </head>
		  <body>
		    <Title>Example</Title>
		    <p>Name: {props.name}</p>
		    <p>Email: {props.email}</p>
		    <hr />
		    <Button primary>Call to Action</Button>

		    <ul>
			    <Each
			    	items={props.items}
			    	render={(item: Item) => <li>{ item.title }</li>} />
		    </ul>
		  </body>
		</html>
	)
}

let Title = styled.h1`
	font-family: sans-serif;
`