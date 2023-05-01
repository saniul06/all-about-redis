export const pageCacheKey = (id: string) => `pagecache${id}`;

export const usrKey = (userId: string) => `users#${userId}`;

export const sessionKey = (sessionId: string) => `sessions#${sessionId}`;

export const usernameUniqueKey = () => `username:unique`

export const userLikesKey = (userId: string) => `user:likes#${userId}`

export const usernamesKey = () => `usernames`

// items 
export const itemKey = (itemId: string) => `items#${itemId}`

export const itemsByViewsKey = () => `items:views`

export const itemsByEndingAtKey = () => `items:endingAt`

export const itemsViewsKey = (itemId: string) => `items:views#${itemId}`