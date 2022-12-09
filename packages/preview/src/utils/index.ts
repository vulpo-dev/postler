import { useEffect, useRef } from 'react'
import { useMatch } from 'react-router-dom'

type CB<T> = (event: MessageEvent<T>) => void
let listeners = new Map<string, Array<{ id: string, fn: CB<ServerEvent> }>>()

export type ServerEvent = {
	event: 'update' | 'remove',
	path: string,
}

export function useServerEvent(url: string, fn: CB<ServerEvent>) {
	let id = useRef(uuid())
	useEffect(() => {
		let urlListeners = listeners.get(url) ?? []
		listeners.set(url, [
			...urlListeners.filter(entry => entry.id !== id.current),
			{ id: id.current, fn }
		])

		return () => {
			let urlListeners = listeners.get(url) ?? []
			listeners.set(url, urlListeners.filter(entry =>
				entry.id !== id.current
			))
		}
	})

	useEffect(() => {
		let urlListeners = listeners.get(url) ?? []
		if (urlListeners.length > 1) {
			return
		}

		let source = new EventSource(url)

		source.addEventListener('message', event => {
			let urlListeners = listeners.get(url) ?? []
			urlListeners.forEach(listener => {
				listener.fn({
					...event,
					data: JSON.parse(event.data),
				})
			})
		})

		return () => {
			source.close()
		}
	}, [url])
}

export function uuid(): string {
	if ('randomUUID' in self.crypto) {
		return self.crypto.randomUUID()
	}

	// https://stackoverflow.com/a/2117523/11383840
	// @ts-ignore
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c) => (c ^ self.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export function useCurrentTemplate(): string {
	let match = useMatch('/preview/:currentTemplate')
	let { currentTemplate = '' } = match?.params ?? {}
	return currentTemplate
}