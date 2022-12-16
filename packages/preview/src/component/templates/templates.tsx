import styled from "@emotion/styled";
import { NavLink, useNavigate } from "react-router-dom";
import {
	templatesApi,
	useGetTemplatesQuery,
} from "~/src/store/templates.slice";
import { useServerEvent, useCurrentTemplate } from "~src/utils";

export let Templates = () => {
	let templates = useGetTemplatesQuery();
	let [trigger] = templatesApi.endpoints.getTemplates.useLazyQuery();

	let navigate = useNavigate();
	let currentTemplate = useCurrentTemplate();

	useServerEvent("/api/updates", ({ data }) => {
		if (data.path.endsWith("template.js")) {
			trigger();

			let shouldRedirect =
				data.event === "remove" &&
				data.path.endsWith(`${currentTemplate}/template.js`);

			if (shouldRedirect) {
				let [next] = (templates.data?.items ?? []).filter((template) => {
					return template.name !== currentTemplate;
				});

				navigate(next?.name ?? "/");
			}
		}
	});

	return (
		<div>
			<Header>
				<Title>Templates</Title>
			</Header>
			{templates.isSuccess && (
				<TemplateList>
					{templates.data.items.map((item) => {
						return (
							<ListItem key={item.name}>
								<NavLink to={`/preview/${item.name}`}>{item.name}</NavLink>
							</ListItem>
						);
					})}
				</TemplateList>
			)}
		</div>
	);
};

let Header = styled.header`
	padding: 0 var(--size-3);
	height: var(--size-8);
	display: flex;
	align-items: center;
`;

let Title = styled.h4`
	margin: 0;
`;

let TemplateList = styled.ul`
	padding: 0;
	list-style-type: none;
`;

let ListItem = styled.li`
	margin-bottom: var(--size-1);

	a {
		padding: var(--size-1) var(--size-3);
		display: block;
		color: var(--color-copy);
		text-decoration: none;
	}

	a.active {
		font-weight: bold;
		background: var(--color-accent);
		border-radius: var(--size-5);
	}
`;
