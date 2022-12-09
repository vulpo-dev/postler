import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { useMatchMedia } from '@biotic-ui/std'
import { Pulse } from '@biotic-ui/leptons'
import {
	SidebarLayout,
	Aside,
	Main,
	TopBar,
} from '@biotic-ui/layout'

import { Templates } from '~/src/component/templates'
import { Previews } from '~/src/component/previews'
import { Preview } from '~/src/component/preview'
import { RootState, Store } from '~/src/store'
import { useState } from 'react'

let DRAWER_BREAKPOINT = '(max-width: 400px)'

export let App = () => {
	let [isOpen] = useState(useMatchMedia('(min-width: 1400px)'))

	let isLoading = useSelector((state: RootState) => {
		let pending = Object
			.values(state.templateApi.queries)
			.filter(entry => entry?.status === 'pending')
			.length

		return pending > 0
	})

	return (
		<StyledContainer>
			<StyledHeader>
				<Title>Postler</Title>
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
								<ContentHeader>
									<ContentTitle>
										Previews
									</ContentTitle>

									<LoadingWrapper>
									{ isLoading &&
										<Pulse />
									}
									</LoadingWrapper>
								</ContentHeader>
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
	)
}

let AsideContent = styled.div`
	background: var(--basement);
	height: 100%;
	padding: 0 var(--size-3);
	padding-right: 0;
`
let MainContent = styled.div`
	height: 100%;
	padding: 0 var(--size-3);
`

let StyledContainer = styled(TopBar.Container)`
	grid-template-rows: var(--size-9) auto;

	@media screen ${DRAWER_BREAKPOINT} {
		grid-template-rows: var(--size-8) auto;
	}
`

let StyledHeader = styled(TopBar.Header)`
	background: var(--basement);
	border: none;
	display: flex;
	align-items: center;
	padding-left: var(--size-7);
	padding-right: var(--size-3);
`

let Title = styled.h4`
	margin: 0;
`

let ContentContainer = styled(TopBar.Container)`
	grid-template-rows: var(--size-8) auto;
`

let ContentHeader = styled(TopBar.Header)`
	background: #fff;
	border-top-left-radius: var(--size-3);
	border-top-right-radius: var(--size-3);
	border: none;
	padding: 0 var(--size-3);
	display: flex;
	align-items: center;
`

let ContentTitle = styled.h4`
	margin-bottom: 0;
`

let LoadingWrapper = styled.div`
	margin-left: auto;
	width: var(--size-7);
`

let Content = styled(TopBar.Content)`
	background: #fff;
	display: grid;
	grid-template-columns: var(--size-14) auto;
`