import { client } from '$services/redis'
import { userLikesKey, itemKey } from '$services/keys';
import { serialize } from '$services/queries/items/serialize'
import { deserialize } from '$services/queries/items/deserialize'
import { getItems } from '$services/queries/items'

export const userLikesItem = async (itemId: string, userId: string) => {
    return await client.sIsMember(userLikesKey(userId), itemId)
};

export const likedItems = async (userId: string) => {
    const ids = await client.sMembers(userLikesKey(userId))
    return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
    const inserted = await client.sAdd(userLikesKey(userId), itemId)
    if (inserted) {
        return await client.hIncrBy(itemKey(itemId), 'likes', 1)
    }
};

export const unlikeItem = async (itemId: string, userId: string) => {
    const removed = await client.sRem(userLikesKey(userId), itemId)
    if (removed) {
        return await client.hIncrBy(itemKey(itemId), 'likes', -1)
    }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
    const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)])
    return getItems(ids);
};