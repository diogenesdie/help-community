import type { NextApiRequest, NextApiResponse } from 'next';
import { getLoginSession } from '@/utils/auth-utils';
import { getErrorNormalized } from '@/utils/api-utils';
import { IResponseError } from '@/types/response';
import { voteReportDown, voteReportUp } from '@/data/report/source';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'POST' ) {
        try {
            const session = await getLoginSession(req);
            const id = req.query.id as string;
            const vote = req.body.vote as string;
            let votes = 0;

            if( vote === 'UP' ) {
                votes = await voteReportUp(session, Number(id));

            } else if( vote === 'DOWN' ) {
                votes = await voteReportDown(session, Number(id));

            } else {
                const erro: IResponseError = {
                    name: 'VALIDATION_ERROR',
                    message: 'Invalid vote'
                }
                res.status(404).json(erro);
            }
    
            return res.status(200).json({
                votes: votes
            });

        } catch(e) {
            const error = getErrorNormalized(res, e);
            return res.status(error.statusCode).json(error.error);
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