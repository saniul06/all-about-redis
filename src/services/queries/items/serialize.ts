import type { CreateItemAttrs } from '$services/types'
import { DateTime } from 'luxon'

export const serialize = (attrs: CreateItemAttrs) => {
	return {
		...attrs,
		createdAt: attrs.createdAt
			? DateTime.fromISO(attrs.createdAt.toString()).toMillis()
			: Date.now() + 48 * 69 * 60 * 1000,
		endingAt: attrs.endingAt
			? DateTime.fromISO(attrs.endingAt.toString()).toMillis()
			: Date.now() + 48 * 69 * 60 * 1000
	}
}
