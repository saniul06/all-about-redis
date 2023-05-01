import { client } from '$services/redis';
import { itemKey, itemsByViewsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    // const ids = await client.zRange(
    //     itemsByViewsKey(),
    //     0,
    //     '+inf',
    //     {
    //         BY: "SCORE",
    //         LIMIT: {
    //             offset,
    //             count
    //         }
    //     }
    // )
    // console.log('ids: ', ids)
    // const result = await Promise.all(ids.map(item => client.hGetAll(itemKey(item))))
    // // console.log('rrrr:', result)
    // return result.map((item, index) => deserialize(ids[index], item))

    let results: any = await client.sort(
        itemsByViewsKey(),
        {
            GET: [
                '#',
                `${itemKey('*')}->name`,
                `${itemKey('*')}->views`,
                `${itemKey('*')}->endingAt`,
                `${itemKey('*')}->price`,
                `${itemKey('*')}->imageUrl`,
            ],
            BY: "nosort",
            DIRECTION: order,
            LIMIT: {
                offset,
                count
            }
        }
    )

    const items: any = []

    while (results.length) {
        const [id, name, views, endingAt, price, imageUrl, ...rest] = results;
        const item = deserialize(id, { name, views, endingAt, price, imageUrl })
        items.push(item);
        results = rest;
    }
    return items;
};
