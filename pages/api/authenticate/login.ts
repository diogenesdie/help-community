import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            

        } catch(e: any) {

        }

    } else {
        const erro: IResponseError = {
            name: 'NOT_FOUND',
            message: 'Not found'
        }
    }
};
export default handler;