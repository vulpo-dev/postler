import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { useQueryParams } from "@biotic-ui/std";
import { cx } from "@emotion/css";

import { previewsApi, useGetPreviewsQuery } from "~/src/store/previews.slice";
import { useCurrentTemplate, useServerEvent } from "~src/utils";

let sentenceCache = new Map<string, string>();
let getSentence = (key: string): string => {
	let entry = sentenceCache.get(key);
	if (entry) {
		return entry;
	}

	let sentence = "";
	sentenceCache.set(key, sentence);
	return sentence;
};

export let Previews = () => {
	let template = useCurrentTemplate();
	let search = useQueryParams();
	let previews = useGetPreviewsQuery(template);
	let [trigger] = previewsApi.endpoints.getPreviews.useLazyQuery();

	useServerEvent("/api/updates", ({ data }) => {
		if (data.path.endsWith(`${template}/preview.js`)) {
			trigger(template);
		}
	});

	return (
		<ListWrapper>
			{previews.isSuccess && (
				<List>
					{previews.data.items.map((item) => (
						<ListItem key={item.title}>
							<Link
								to={`/preview/${template}?preview=${item.title}`}
								className={cx({
									active: search.get("preview") === item.title,
								})}
							>
								<Title className='biotic-text-ellipsis'>{item.title}</Title>
								<span className='biotic-text-ellipsis'>{getSentence(`${item.title}-top`)}</span>
								<span className='biotic-text-ellipsis'>{getSentence(`${item.title}-bottom`)}</span>
							</Link>
						</ListItem>
					))}
				</List>
			)}
		</ListWrapper>
	);
};

let ListWrapper = styled.div`
	border-right: 1px solid var(--stone-3);
	overflow: auto;
`;

let List = styled.ul`
	list-style-type: none;
	padding: 0;
	border-top: 1px solid var(--stone-3);
`;

let ListItem = styled.li`
	height: var(--size-10);
	border-bottom: 1px solid var(--stone-3);
	font-size: 14px;

	a {
		text-decoration: none;
		display: flex;
		flex-direction: column;
		padding: var(--size-2) var(--size-5);
		height: 100%;
		color: var(--color-copy);
		background: var(--stone-0);
	}

	a.active {
		background: var(--blue-0);
	}
`;

let Title = styled.span`
	font-weight: bold;
`;
