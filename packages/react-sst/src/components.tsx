import { ReactNode } from "react";
import { fallback } from "./helpers/helpers";

type DocumentProps = {
	children?: ReactNode;
	title?: string;
	lang?: string;
};

export function Document(props: DocumentProps): JSX.Element {
	return (
		<html lang={fallback(props.lang, "en")}>
			<head>
				<meta charSet='UTF-8' />
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1.0'
				/>
				<meta
					httpEquiv='X-UA-Compatible'
					content='ie=edge'
				/>
				<title>{props.title ?? ""}</title>
				{"{{ENV_STYLES}}"}
			</head>
			{props.children}
		</html>
	);
}
