import type { NextApiRequest, NextApiResponse } from 'next';
import { getLoginSession } from '@/utils/auth-utils';
import { getErrorNormalized } from '@/utils/api-utils';
import { IResponseError } from '@/types/response';
import { IReportPayload, insertReport, getReports } from '@/data/report/source';
import { IFiltersReports } from '@/data/report/source';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'GET' ) {
        res.status(200).json({ message: 'GET' });
    } else {
        const erro: IResponseError = {
            name: 'NOT_ALLOWED',
            message: 'Method not allowed'
        }
        res.status(405).json(erro);
    }
};
export default handler;