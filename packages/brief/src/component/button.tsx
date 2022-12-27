import styled from "@emotion/styled";
import { cx, fallback } from "postler";
import { ReactNode } from "react";

let StyledButton = styled.table`
	box-sizing: border-box;
	width: 100%;

	& > tbody > tr > td {
		padding-bottom: 1em;
	}

	& table {
		width: auto;
	}

	& table td {
		background-color: #ffffff;
		border-radius: 0.5em;
		text-align: center;
	}

	& a {
		background-color: #ffffff;
		border: solid 1px #000;
		border-radius: 0.5em;
		box-sizing: border-box;
		color: #000;
		cursor: pointer;
		display: inline-block;
		font-size: 14px;
		font-weight: bold;
		margin: 0;
		padding: 0.75em 1.5em;
		text-decoration: none;
		text-transform: capitalize;
	}

	.btn-primary table td {
		background-color: #000;
	}

	.btn-primary a {
		background-color: #000;
		border-color: #000;
		color: #ffffff;
	}
`;

type Align = "center" | "left" | "right";

export type ButtonProps = {
	children?: ReactNode;
	href?: string;
	primary?: boolean;
	align?: Align;
	className?: string;
};

export let Button = (props: ButtonProps) => {
	return (
		<StyledButton
			role='presentation'
			border={0}
			cellPadding='0'
			cellSpacing='0'
			className={props.className}
		>
			<tbody className={cx({ "btn-primary": props.primary })}>
				<tr>
					<td align={fallback(props.align, "left") as Align}>
						<table
							role='presentation'
							border={0}
							cellPadding='0'
							cellSpacing='0'
						>
							<tbody>
								<tr>
									<td>
										<a href={props.href} target='_blank' rel="noreferrer">
											{props.children}
										</a>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</StyledButton>
	);
};
