import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usrKey, usernameUniqueKey, usernamesKey } from '$services/keys'
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {
    const decimalId = await client.zScore(usernamesKey(), username);
    if (!decimalId) {
        throw new Error("User doesn't exist");
    }
    console.log('deciman id is: ', decimalId);
    console.log('hesadecimal id is: ', decimalId.toString(16))
    const id = decimalId.toString(16);
    const user = await client.hGetAll(usrKey(id));
    return deserialize(id, user)
};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(usrKey(id))
    return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const isExists = await client.sIsMember(usernameUniqueKey(), attrs.username)
    if (isExists) {
        throw new Error('username already in use')
    }
    const id = genId();
    console.log('hex: ', id);
    console.log('decimal: ', parseInt(id, 16))

    const pro = await Promise.all([
        client.hSet(usrKey(id), serialize(attrs)),
        client.sAdd(usernameUniqueKey(), attrs.username),
        client.zAdd(usernamesKey(), {
            value: attrs.username,
            score: parseInt(id, 16)
        })
    ])
    console.log('ppppppppp: ', pro)
    return id;
};

export const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password
    }
}

export const deserialize = (id: string, user: { [key: string]: string }) => {
    return {
        id,
        username: user.username,
        password: user.password
    }
}
