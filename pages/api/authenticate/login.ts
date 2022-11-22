import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';
import { getErrorNormalized } from '@/utils/api-utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            const data = req.body;


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