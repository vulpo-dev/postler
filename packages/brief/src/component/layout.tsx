import styled from "@emotion/styled";
import { fallback } from "postler";
import { HTMLAttributes, ReactNode } from "react";

export type ContainerProps = HTMLAttributes<HTMLTableElement> & {
	children?: ReactNode;
};

export let Container = ({ children, ...props }: ContainerProps) => {
	return (
		<StyledTable {...props}>
			<tbody>
				<tr>
					<td align="center">
						<StyledContentWrapper>
							<tbody>
								<tr>
									<td>{children}</td>
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
	padding: 0.5em;
`;

let StyledContentWrapper = styled.table`
	max-width: 39em;
	width: 100%;
	padding: 1em;
`;

export type RowProps = HTMLAttributes<HTMLTableRowElement> & {
	children?: ReactNode;
};

export let Row = ({ children, ...props }: RowProps) => {
	return (
		<tr {...props}>
			<td>{children}</td>
		</tr>
	);
};

export type SpacerProps = {
	height?: string;
};

export let Spacer = ({ height }: SpacerProps) => {
	return (
		<tr style={{ height: fallback(height, "1em") }}>
			<td />
		</tr>
	);
};
