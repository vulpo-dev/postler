import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useQueryParams } from '@biotic-ui/std'
import Handlebars from 'handlebars'

import { templateApi, useGetTemplateQuery } from '~/src/store/template.slice'
import { useGetPreviewsQuery } from '~/src/store/previews.slice'
import { useServerEvent, useCurrentTemplate } from '~src/utils'
import { RootState, Store } from '~src/store'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export let Preview = () => {
	let template = useCurrentTemplate()
	let {
		data: { markup = '' } = {}
	} = useGetTemplateQuery(template)

	useServerEvent('/api/updates', () => {
		Store.dispatch(templateApi.util.resetApiState())
		Store.dispatch(templateApi.util.prefetch('getTemplate', template, { force: true }))
	})

	return <RenderView markup={markup} template={template} />
}

type RenderViewProps = {
	markup: string,
	template: string,
}

let RenderView = ({ markup, template }: RenderViewProps) => {
	let viewport = useSelector((state: RootState) => state.preview.viewport)
	let [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
	let props = usePreviewProps(template)

	let html = useMemo(() => {
		let t = Handlebars.compile(markup)
		return t({ props } ?? {})
	}, [markup, props])

	useEffect(() => {
		if (iframe && iframe.contentWindow) {
			let elm = iframe.contentWindow
			elm.document.open()
			elm.document.write(html)
		}
	}, [iframe, html])

	let styles = {
		width: viewport.width,
		height: viewport.height,
		border: viewport.width === '100%' ? 'none' : '2px solid var(--gray-10)',
	}

	return (
		<Wrapper>
			<IFrame
				style={styles}
				ref={setIframe}
			></IFrame>
		</Wrapper>
	)
}

let IFrame = styled.iframe`
	width: 100%;
	height: 100%;
`

function usePreviewProps(template: string) {
	let navigate = useNavigate()
	let search = useQueryParams()
	let currentPreview = search.get('preview')

	let { data: { items = [] } = {} } = useGetPreviewsQuery(template)
	let entry = items.find(entry => {
		return entry.title === currentPreview
	})

	useEffect(() => {
		let entry = items.at(0)
		if (currentPreview || !entry) {
			return
		}

		let s = new URLSearchParams(search)
		s.set('preview', entry.title)

		navigate({
			search: `?${s.toString()}`
		})

	}, [currentPreview, items])

	return entry?.props
}

let Wrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-left: var(--size-10);
	margin-right: var(--size-3);
`