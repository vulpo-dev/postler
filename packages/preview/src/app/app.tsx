import { List as ListIcon } from "phosphor-react";
import styled from "@emotion/styled";

import { SidebarLayout, Aside, Main, TopBar } from "~/src/component/layout";
import { Templates } from "~/src/component/templates";
import { Previews } from "~/src/component/previews";
import { Preview } from "~/src/component/preview";
import { ContentHeader } from "~/src/component/content_header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/src/store";
import { IconButton } from "~/src/component/button";
import { toggleSidebar } from "~/src/store/layout.slice";
import { SendEmail } from "~/src/component/send_email";

let DRAWER_BREAKPOINT = "(max-width: 400px)";

export let App = () => {
	let dispatch = useDispatch();
	let isOpen = useSelector((state: RootState) => state.layout.sidebar.open);

	return (
		<StyledContainer>
			<StyledHeader>
				<HeaderSection>
					<IconButton onClick={() => dispatch(toggleSidebar())}>
						<ListIcon size={24} />
					</IconButton>
					<Title>Postler</Title>
				</HeaderSection>

				<HeaderSection>
					<SendEmail />
				</HeaderSection>
			</StyledHeader>
			<TopBar.Content>
				<SidebarLayout>
					<Aside
						drawer={DRAWER_BREAKPOINT}
						open={isOpen}
						onClose={() => {}}
					>
						<AsideContent>
							<Templates />
						</AsideContent>
					</Aside>
					<Main>
						<MainContent>
							<ContentContainer>
								<ContentHeader />
								<Content>
									<Previews />
									<Preview />
								</Content>
							</ContentContainer>
						</MainContent>
					</Main>
				</SidebarLayout>
			</TopBar.Content>
		</StyledContainer>
	);
};

let AsideContent = styled.div`
	background: var(--background);
	height: 100%;
	padding: 0 var(--size-3);
	padding-right: 0;
`;
let MainContent = styled.div`
	height: 100%;
	padding: 0 var(--size-3);
`;

let StyledContainer = styled(TopBar.Container)`
	grid-template-rows: var(--size-9) auto;

	@media screen ${DRAWER_BREAKPOINT} {
		grid-template-rows: var(--size-8) auto;
	}
`;

let StyledHeader = styled(TopBar.Header)`
	background: var(--background);
	border: none;
	padding-left: var(--size-7);
	padding-right: var(--size-3);
	display: flex;
	justify-content: space-between;
`;

let HeaderSection = styled.section`
	display: flex;
	align-items: center;
	gap: var(--size-3);
`;

let Title = styled.h4`
	margin: 0;
`;

let ContentContainer = styled(TopBar.Container)`
	grid-template-rows: var(--size-8) auto;
`;

let Content = styled(TopBar.Content)`
	background: #fff;
	display: grid;
	grid-template-columns: var(--size-14) auto;
`;
