import { IResponseError } from "@/types/response"
import { ILoginPaylod, ISession } from "@/types/authenticate"
import { validateLogin } from "@/data/authenticate/validation"
import prisma, { getSequence } from "@/config/prisma";
import { encrypt, generateToken } from "@/utils/crypto-utils";

export const doLogin = async (data: ILoginPaylod): Promise<ISession> => {
    const formatedData = validateLogin(data);

    const user = await prisma.user.findFirst({
        where: {
            username: formatedData.username
        }
    });

    if( !user ) {
        throw {
            name: 'NOT_FOUND',
            message: 'User not found',
            fields: [
                {
                    field: 'username',
                    message: 'User not found'
                }
            ]
        } as IResponseError;

    } else if( user.status === 'I' ){
        throw {
            name: 'NOT_ALLOWED',
            message: 'User is inactive',
            fields: [
                {
                    field: 'username',
                    message: 'User is inactive'
                }
            ]
        } as IResponseError;
    }

    const encryptedPassword = encrypt(formatedData.password);

    if( user.password !== encryptedPassword ) {
        throw {
            name: 'NOT_ALLOWED',
            message: 'Invalid password',
            fields: [
                {
                    field: 'password',
                    message: 'Invalid password'
                }
            ]
        } as IResponseError;
    }

    const session_id = await getSequence('help_community.seq_session');
    const session = await prisma.session.create({
        data: {
            session_id: session_id,
            user_id: user.user_id,
            public_token: generateToken(32),
            private_token: generateToken(32),
            status: 'A',
            created_at: new Date(),
            updated_at: new Date(),
            expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30)
        }
    });


    return {
        user: {
            id: user.user_id,
            username: user.username,
            admin: user.admin === '1'
        },
        public_token: session.public_token,
        private_token: session.private_token,
        expires_at: session.expires_at,
        id: session_id
    } as ISession;
        
}

export const doLogout = async (session: ISession) => {
    await prisma.session.update({
        data: {
            status: 'I',
            updated_at: new Date(),
        },
        where: {
            session_id: session.id
        }
    });
}

export const getSession = async (public_token: string): Promise<ISession> => {
    const session = await prisma.session.findFirst({
        where: {
            public_token: public_token,
            expires_at: {
                gt: new Date()
            },
            status: 'A'
        },
        include: {
            user: true
        }
    });

    if( !session ) {
        throw {
            name: 'NOT_FOUND',
            message: 'Session not found'
        } as IResponseError;
    }

    return {
        user: {
            id: session.user?.user_id,
            username: session.user?.username,
            admin: session.user?.admin === '1'
        },
        public_token: session.public_token,
        private_token: session.private_token,
        expires_at: session.expires_at,
        id: session.session_id
    } as ISession;
}