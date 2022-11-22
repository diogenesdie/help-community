import { ISession, ILoginPaylod } from "@/types/authenticate";
import client from "@/config/http";
import { setLocals } from "@/utils/local-utils";

export const loadSession = async (): Promise<ISession> => {
    return {} as ISession;
};

export const login = async(data: ILoginPaylod): Promise<ISession> => {
    const response = await client({
        method: 'POST',
        url: '/authenticate/login',
        data: data
    });

    if( response.status !== 200 ) {
        throw response.data;
    }

    setLocals(response.data);

    return response.data;
}