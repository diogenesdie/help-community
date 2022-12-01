import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';
import { getErrorNormalized } from '@/utils/api-utils';
import { doLogout } from '@/data/authenticate/source';
import { getLoginSession, removeTokenCookie, setTokenCookie } from '@/utils/auth-utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            const session = await getLoginSession(req);
            await doLogout(session);

        } catch(e: any) {
            const error = getErrorNormalized(res, e);
            res.status(error.statusCode).json(error.error);
        }

        removeTokenCookie(res);
        res.status(204).end();

    } else {
        const error: IResponseError = {
            name: 'NOT_ALLOWED',
            message: 'Method not allowed'
        }

        res.status(405).json(error);
    }
};
export default handler;