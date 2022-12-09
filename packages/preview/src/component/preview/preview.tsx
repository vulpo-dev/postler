import { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useQueryParams } from '@biotic-ui/std'
import Handlebars from 'handlebars'

import { templateApi, useGetTemplateQuery } from '~/src/store/template.slice'
import { useGetPreviewsQuery } from '~/src/store/previews.slice'
import { useServerEvent, useCurrentTemplate } from '~src/utils'
import { Store } from '~src/store'

export let Preview = () => {
	let [iframe, setIframe] = useState<HTMLIFrameElement | null>(null)
	let template = useCurrentTemplate()
	let props = usePreviewProps(template)
	let {
		data: { markup = '' } = {}
	} = useGetTemplateQuery(template)

	let html = useMemo(() => {
		let t = Handlebars.compile(markup)
		return t(props ?? {})
	}, [markup, props])

	useServerEvent('/api/updates', () => {
		Store.dispatch(templateApi.util.resetApiState())
		Store.dispatch(templateApi.util.prefetch('getTemplate', template, { force: true }))
	})

	useEffect(() => {
		if (iframe && iframe.contentWindow) {
			let elm = iframe.contentWindow
			elm.document.open()
			elm.document.write(html)
		}
	}, [iframe, html])
	
	return (
		<IFrame
			ref={setIframe}
		></IFrame>
	)
}

let IFrame = styled.iframe`
	width: 100%;
	height: 100%;
	border: none;
	padding-left: var(--size-10);
	padding-right: var(--size-3);
`

function usePreviewProps(template: string) {
	let search = useQueryParams()
	let props = useGetPreviewsQuery(template)
	let entry = (props.data?.items ?? []).find(entry => {
		return entry.title === search.get('preview')
	})

	return entry?.props
}