import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';
import { IResponseError } from '@/types/response';
import prisma from '@/config/prisma';
import { isEmpty } from '@/utils/string-utils';
import { ISession } from '@/types/authenticate';
import { IncomingMessage } from 'http';

export const PRIVATE_TOKEN_NAME: string = 'token';
export const PUBLIC_TOKEN_NAME: string = 'token_key';
export type ReqServerSideProps = IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; };

/**
 * Add a new cookie to the browser
 * 
 * @param res NextApiResponse
 * @param private_token Session token
 * @param public_token Public token
 * @param expires_at Expiration date
 * @param maxAge Max age in ms
 */
export const setTokenCookie = (
    res: NextApiResponse, 
    private_token: string, 
    public_token: string, 
    expires_at: Date, 
    maxAge: number
): void => {
    const privateCookie = serialize(PRIVATE_TOKEN_NAME, private_token, {
        maxAge: maxAge,
        expires: expires_at,
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    const publicToken = serialize(PUBLIC_TOKEN_NAME, public_token, {
        maxAge: maxAge,
        expires: expires_at,
        httpOnly: false,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });

    res.setHeader('Set-Cookie', [privateCookie, publicToken]);
};

/**
 * Remove the cookie from the browser
 * 
 * @param res NextApiResponse
 */
export const removeTokenCookie = (res: NextApiResponse): void => {
    const privateCookie = serialize(PRIVATE_TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });

    const publicCookie = serialize(PUBLIC_TOKEN_NAME, '', {
        maxAge: -1,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });

    res.setHeader('Set-Cookie', [privateCookie, publicCookie]);
};

/**
 * Parse NextApiRequest to get cookies
 * 
 * @param req NextApiRequest
 * @returns All cookies
 */
export const parseCookies = (req: NextApiRequest | ReqServerSideProps): Partial<{ [key: string]: string; }> => {
    if (req.cookies && typeof req.cookies === 'object') return req.cookies;

    const cookie = req.headers?.cookie;

    return parse(cookie || '');

};

/**
 * Return private token from the cookies request
 * 
 * @param req NextApiRequest
 * @returns Private token
 */
export const getPrivateToken = (req: NextApiRequest | ReqServerSideProps): string => {
    const cookies = parseCookies(req);
    return cookies[PRIVATE_TOKEN_NAME] || '';
};

/**
 * Return public token from the cookies request
 * 
 * @param req NextApiRequest
 * @returns Public token
 */
export const getPublicToken = (req: NextApiRequest | ReqServerSideProps): string => {
    const cookies = parseCookies(req);
    return cookies[PUBLIC_TOKEN_NAME] || '';
};

export const getPrivateTokenFromHeader = (req: NextApiRequest | ReqServerSideProps): string => {
    const token = req.headers.authorization || '';
    return token.replace('Bearer ', '');
};

/**
 * Retorna os dados da sessão de autenticação.
 * 
 * @param req Requisição do NextJS
 * @param validateSession Se deve validar o status e a data de expiração da sessão
 * @returns Dados da sessão de autenticação
 */
export const getLoginSession = async (req: NextApiRequest | ReqServerSideProps, validateSession: boolean = true): Promise<ISession> => {
    let erro: IResponseError | null = null;

    // Validação do token
    let private_token = getPrivateToken(req);
    
    if ( isEmpty(private_token) ) {
        private_token = getPrivateTokenFromHeader(req);
    }

    if ( isEmpty(private_token) ) {
        throw {
            status: 401,
            message: 'Token not found',
            name: 'UNAUTHORIZED',
        } as IResponseError
    }

    // Validação da sessão
    const session = await prisma.session.findFirst({
        where: {
            private_token: private_token,
        }
    });

    if ( !session ) {
        throw {
            status: 401,
            message: 'Session not found',
            name: 'UNAUTHORIZED',
        }

    } else if ( session.status === 'I' )  {
        throw {
            status: 401,
            message: 'Session is inactive',
            name: 'UNAUTHORIZED',
        }

    } else if ( validateSession && session.expires_at && session.expires_at < new Date() ) {
        throw {
            status: 401,
            message: 'Session expired',
            name: 'UNAUTHORIZED',
        }

    } 

    let user = null;

    if( session.user_id ){
        user = await prisma.user.findFirst({
            where: {
                user_id: session.user_id,
            }
        });
    }

    return {
        user: {
            id: user?.user_id,
            username: user?.username,
            admin: user?.admin === '1'
        },
        expires_at: session.expires_at,
        private_token: session.private_token,
        public_token: session.public_token,
    } as ISession;
};