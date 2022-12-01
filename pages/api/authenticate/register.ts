import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';
import { getErrorNormalized } from '@/utils/api-utils';
import { doRegister } from '@/data/authenticate/source';
import { setTokenCookie } from '@/utils/auth-utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            const data = req.body;
            const currentDate = new Date();

            const session = await doRegister(data);

            setTokenCookie(res, session.private_token, session.public_token, session.expires_at, session.expires_at.getTime() - currentDate.getTime());

            res.status(200).json(session);

        } catch(e: any) {
            const error = getErrorNormalized(res, e);
            res.status(error.statusCode).json(error.error);
        }

    } else {
        const error: IResponseError = {
            name: 'NOT_ALLOWED',
            message: 'Method not allowed'
        }

        res.status(405).json(error);
    }
};
export default handler;