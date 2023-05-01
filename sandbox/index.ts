import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('car1', {
        color: 'red',
        year: JSON.stringify([2, 4])
    })

    const result = await client.hGetAll('car1')
    console.log('clinet.hGetAll:', JSON.parse(result.year), Array.isArray(JSON.parse(result.year)));

    await client.sAdd('c', 'red')
    await client.sAdd('c', 'blue')
    // await client.sAdd('color', 'green')
    // await client.sAdd('color', 'red')
    const set1 = await client.sMembers('a')
    const set2 = await client.sMembers('b')
    const set3 = await client.sMembers('c')
    console.log(set1)
    console.log(set2)
    console.log(set3)
    console.log(await client.sIsMember('a', 'red'))

}

run();
