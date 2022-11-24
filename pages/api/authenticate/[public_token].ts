import { getSession } from "@/data/authenticate/source";
import { IResponseError } from "@/types/response";
import { getLoginSession } from "@/utils/auth-utils";
import { getErrorNormalized } from "@/utils/api-utils";
import { NextApiRequest, NextApiResponse } from "next";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if( req.method === 'GET' ) {
        try {
            // const sessao = await getLoginSession(req);
            const public_token = req.query.public_token as string;

            const session = await getSession(public_token);
            return res.status(200).send(session);

        } catch(e) {
            const error = getErrorNormalized(res, e);
            return res.status(error.statusCode).json(error.error);
        }

    } else {
        const error: IResponseError = {
            name: 'NOT_ALLOWED',
            message: 'Method not allowed'
        }
        return res.status(401).json(error);
    }
};
export default handler;