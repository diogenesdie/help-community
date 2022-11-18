import type { NextApiRequest, NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            

        } catch(e: any) {

        }

    } else {
        const erro: IResponseError = {
            name: 'NOT_ALLOWED',
            message: 'Method not allowed'
        }

        res.status(405).json(erro);
    }
};
export default handler;