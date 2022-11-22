import { NextApiResponse } from 'next';
import { IResponseError } from '@/types/response';
import { isEmpty } from '@/utils/string-utils'

/**
 * Extract error from object
 * 
 * @param err Error from exception
 * @returns Normalized error
 */
 export const gerError = (err: any): IResponseError => {
    if( typeof err === 'string' || (typeof err === 'object' && !err.message) ) {
        let erro: IResponseError = {
            status: 500,
            name: 'ERROR',
            message: err.toString()
        }
        return erro;

    } else {
        let error: IResponseError = {
            name: err?.name || 'ERROR',
            message: err?.message || 'Unknown error',
            fields: err?.fields,
        };

        if(err.name === 'VALIDATION_ERROR') {
            error.status = 400;

        } else if(err.name === 'NOT_FOUND') {
            error.status = 404;

        } else if(err.name === 'UNAUTHORIZED') {
            error.status = 401;

        } else {
            error.status = 500;
        }

        return error;
    }
}

/**
 * Handle API error before send to client
 * 
 * @param res NextJS response
 * @param err Error object
 */
 export const getErrorNormalized = (res: NextApiResponse, err: any) => {
    let erro: IResponseError = gerError(err);
    // Não deve repetir o código do status no corpo da resposta
    let statusCode = erro.status || 500;
    erro.status = undefined;

    return {
        statusCode: statusCode,
        error: erro
    }
}