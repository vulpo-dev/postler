import styled from "@emotion/styled";
import { createTranslations, Document } from "postler";
import { props } from "./types";
import { Translation } from "./translations";
import { Button } from "../../component/button";
import { ReactNode } from "react";

let t = createTranslations<Translation>();

export let Template = () => {
	return (
		<Document>
			<Body>
				<Container>
					<Title>
						{t.hello}: {props.name}
					</Title>
					<Text>{t.withProp}</Text>
					<Button align="center" primary>
						{t.buttonLabel}
					</Button>
				</Container>
			</Body>
		</Document>
	);
};

let Title = styled.h1`
	font-family: sans-serif;
`;

let Body = styled.body`
	margin: 0;

	.bold {
		font-weight: bold;
	}
`;

let Text = styled.p`
	font-size: 24px;
`

type ContainerProps = {
	children?: ReactNode;
};

let Container = ({ children }: ContainerProps) => {
	return (
		<StyledTable>
			<tbody>
				<tr>
					<td align="center">
						<StyledContentWrapper>
							<tbody>
								<tr>
									<td align="center">{children}</td>
								</tr>
							</tbody>
						</StyledContentWrapper>
					</td>
				</tr>
			</tbody>
		</StyledTable>
	);
};

let StyledTable = styled.table`
	width: 100%;
	padding: 8px;
`;

let StyledContentWrapper = styled.table`
	max-width: 600px;
	width: 100%;
	padding: 8px;
`;
