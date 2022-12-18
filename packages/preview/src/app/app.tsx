import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { List as ListIcon, XCircle } from "phosphor-react";
import styled from "@emotion/styled";
import { useMatchMedia } from "@biotic-ui/std";

import { SidebarLayout, Aside, Main, TopBar } from "~/src/component/layout";
import { Templates } from "~/src/component/templates";
import { Preview } from "~/src/component/preview";
import { ContentHeader } from "~/src/component/content_header";
import { RootState } from "~/src/store";
import { IconButton } from "~/src/component/button";
import { closeSidebar, toggleSidebar } from "~/src/store/layout.slice";
import { SendEmail } from "~/src/component/send_email";

let DRAWER_BREAKPOINT = "(max-width: 1080px)";

export let App = () => {
	let dispatch = useDispatch();
	let isOpen = useSelector((state: RootState) => state.layout.sidebar.open);

	let drawerSize = useMatchMedia(DRAWER_BREAKPOINT);
	let location = useLocation();

	let closeDrawer = () => {
		dispatch(closeSidebar());
	};

	useEffect(() => {
		if (drawerSize) {
			dispatch(closeSidebar());
		}
	}, [drawerSize, location]);

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
					<Aside drawer={DRAWER_BREAKPOINT} open={isOpen} onClose={closeDrawer}>
						<AsideContent>
							<Templates />
							{drawerSize && isOpen && (
								<CloseDrawerWrapper onClick={closeDrawer}>
									<XCircle size={32} />
								</CloseDrawerWrapper>
							)}
						</AsideContent>
					</Aside>
					<Main>
						<MainContent>
							<ContentContainer>
								<ContentHeader />
								<Preview />
							</ContentContainer>
						</MainContent>
					</Main>
				</SidebarLayout>
			</TopBar.Content>
		</StyledContainer>
	);
};

let AsideContent = styled.div`
	position: relative;
	background: var(--background);
	height: 100%;
	padding: 0 var(--size-3);
	padding-right: 0;

	.biotic-drawer {
		overflow-y: visible;
	}

	@media screen and ${DRAWER_BREAKPOINT} {
		width: 250px;
	}
`;

let CloseDrawerWrapper = styled(IconButton)`
	position: absolute;
	top: var(--size-3);
	right: calc(var(--size-3) * -1);

	svg {
		color: var(--background);
	}

	svg circle {
		fill: var(--color-copy);
	}
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
