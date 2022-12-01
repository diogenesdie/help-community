import { IResponseError } from "@/types/response";
import { ISession, ILoginPaylod, IRegisterPayload } from "@/types/authenticate";
import client from "@/config/http";
import { setLocals, getLocals, clearLocals } from "@/utils/local-utils";
import { isEmpty } from "@/utils/string-utils";
import { isClientError } from "@/config/http";

export const loadSession = async (): Promise<ISession> => {
    const locals: ISession = getLocals();

    if( !locals || isEmpty(locals.public_token) ) {
        throw {
            name: 'NOT_AUTHENTICATED',
            message: 'User not authenticated'
        } as IResponseError;
    }

    let sessionData = await client.get(`/api/authenticate/${locals.public_token}`);

    if (sessionData.status === 200) {
        return sessionData.data as ISession;

    } else if( isClientError(sessionData) ) {
        throw {
            name: 'ERROR',
            message: sessionData.message || 'Error on load session'
        } as IResponseError;

    }
    let erro = sessionData.data as IResponseError;

    if( ['NOT_ALLOWED','SESSION_EXPIRED', 'SESSION_CLOSED'].indexOf(erro.name) !== -1 ) {
        clearLocals();
    }
    throw erro;
};

export const login = async(data: ILoginPaylod): Promise<ISession> => {
    const response = await client({
        method: 'POST',
        url: '/api/authenticate/login',
        data: data
    });

    if( response.status !== 200 ) {
        throw response.data;
    }

    setLocals(response.data);

    return response.data;
}

export const logout = async(): Promise<void> => {
    const locals: ISession = getLocals();

    if( !locals || isEmpty(locals.public_token) ) {
        throw {
            name: 'NOT_AUTHENTICATED',
            message: 'User not authenticated'
        } as IResponseError;
    }

    const response = await client({
        method: 'POST',
        url: `/api/authenticate/logout`
    });

    if( response.status !== 200 ) {
        throw response.data;
    }

    clearLocals();
}

export const register = async(data: IRegisterPayload): Promise<ISession> => {
    console.log(data);
    const response = await client({
        method: 'POST',
        url: '/api/authenticate/register',
        data: data
    });
    
    if( response.status !== 200 ) {
        throw response.data;
    }

    setLocals(response.data);

    return response.data;
}