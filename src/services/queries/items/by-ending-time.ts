import { client } from "$services/redis";
import { itemsByEndingAtKey, itemKey } from '$services/keys';
import { deserialize } from "./deserialize";

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(
		itemsByEndingAtKey(),
		Date.now(),
		'+inf',
		{
			BY: "SCORE",
			LIMIT: {
				offset,
				count
			}
		}
	)
	const results = await Promise.all(ids.map(item => client.hGetAll(itemKey(item))))
	const de = results.map((item, index) => deserialize(ids[index], item))
	return de
};
