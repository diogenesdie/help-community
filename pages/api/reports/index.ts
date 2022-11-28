import type { NextApiRequest, NextApiResponse } from 'next';
import { getLoginSession } from '@/utils/auth-utils';
import { getErrorNormalized } from '@/utils/api-utils';
import { IResponseError } from '@/types/response';
import { IReportPayload, insertReport, getReports } from '@/data/report/source';
import { IFiltersReports } from '@/data/report/source';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'GET' ) {
        try{
            const session = await getLoginSession(req, false);
            const filters: IFiltersReports = req.query as any;
    
            const reports = await getReports(session, filters);
    
            return res.status(200).send(reports);

        } catch(e) {
            const error = getErrorNormalized(res, e);
            return res.status(error.statusCode).json(error.error);
        }
    
    } else if( req.method === 'POST' ) {
        try {
            const session = await getLoginSession(req, false);

            const data: IReportPayload = req.body;
            const newReport = await insertReport(session, data);

            res.status(200).json(newReport);

        } catch(err: any) {
            const error = getErrorNormalized(res, err);
            res.status(error.statusCode).json(error.error);
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