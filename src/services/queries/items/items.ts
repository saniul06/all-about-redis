import type { CreateItemAttrs } from '$services/types';
import { itemKey, itemsByViewsKey, itemsByEndingAtKey } from '$services/keys'
import { genId } from '$services/utils';
import { client } from '$services/redis'
import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { DateTime } from 'luxon';

export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id))
    if (Object.keys(item).length === 0) {
        return null;
    }
    return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
    const commands = ids.map(id => client.hGetAll(itemKey(id)))
    const results = await Promise.all(commands);
    return results.map((item, i) => {
        if (Object.keys(item).length === 0) {
            return null;
        }
        return deserialize(ids[i], item);
    })
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
    const id = genId();
    const r = await Promise.all([
        client.hSet(itemKey(id), serialize(attrs)),
        client.zAdd(itemsByViewsKey(), {
            value: id,
            score: 0
        }),
        client.zAdd(itemsByEndingAtKey(), {
            value: id,
            score: new Date(attrs.endingAt).getTime()
        })
    ])
    return id;
};
