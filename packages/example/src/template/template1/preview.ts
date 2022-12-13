import { faker } from '@faker-js/faker'

import { Previews, Item } from 'postler'
import { Props, Item as PropItem } from './types'

export let Data: Previews<Props> = [
	Item('title', {
		name: faker.name.fullName(),
		email: faker.internet.email(),
		items: getItems(),
		propject: faker.internet.domainName(),
		expire_in: 5,
	}),
	Item('title2', {
		name: faker.name.fullName(),
		email: faker.internet.email(),
		items: getItems(),
		propject: faker.internet.domainName(),
		expire_in: 10,
	}),
	Item('title3', {
		name: faker.name.fullName(),
		email: faker.internet.email(),
		items: getItems(),
		propject: faker.internet.domainName(),
		expire_in: 120,
	}),	
]

function getItems() {
	let items: Array<PropItem> = []
	
	for(let i = 0; i < 10; i = i + 1) {
		items.push({
			title: faker.internet.domainName(),
		})
	}

	return items
}