import type { Session } from '$services/types';
import { sessionKey } from '$services/keys';
import { client } from '$services/redis';

export const getSession = async (id: string) => {
    console.log('ggggggggggggggggggg getSession')
    const session = await client.hGetAll(sessionKey(id));
    if (Object.keys(session).length === 0) {
        return null;
    }
    return deserialize(id, session);
};

const deserialize = (id: string, session: { [key: string]: string }) => {
    return {
        id,
        userId: session.userId,
        username: session.username,
    }
}

export const saveSession = async (session: Session) => {
    console.log('sssssssssssssssssssss saveSession')
    return await client.hSet(sessionKey(session.id), serialize(session))

};

const serialize = (session: Session) => {
    return {
        userId: session.userId,
        username: session.username
    }
}
