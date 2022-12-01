import { IFiltersReports, IReportPayload, IReportReturnPayload } from "@/data/report/source";
import { validateReportPayload } from "@/data/report/validation";
import { IResponseError } from "@/types/response";
import { IListRecords } from "@/types/api";
import client from "@/config/http";
import { report } from "@prisma/client";


/** 
 * Returns a list of reports
 * 
 * @param {IFiltersReports} filters
 * 
 * @returns {Promise<IReportReturnPayload[]>}
 */
export const getReports = async (filters?: IFiltersReports): Promise<IListRecords<IReportReturnPayload>> => {
    const response = await client.get('/api/reports', { params: filters });

    if( response.status !== 200 ) {
        throw response.data as IResponseError;
    }

    return response.data as IListRecords<IReportReturnPayload>;
}

/**
 * Insert a new report
 * 
 * @param payload Report data
 * @returns
 */
 export const insert = async (payload: IReportPayload): Promise<IReportPayload> => {
    console.log(payload);
    const data = validateReportPayload(payload);

    const response = await client({
        method: "POST",
        url: `/api/reports`,
        data: data
    });

    console.log(response);
    console.log('response');

    if (response.status !== 200) {
        throw response.data as IResponseError;
    }

    return response.data as IReportPayload;

}

export const doReportVote = async (report_id: number, vote: string): Promise<report['votes']> => {
    if( isNaN(report_id) ) {
        throw {
            name: 'VALIDATION_ERROR',
            message: 'Invalid report id'
        } as IResponseError;
    }

    const response = await client({
        method: 'POST',
        url: `/api/reports/${report_id}/feedback`,
        data: {
            vote: vote
        }
    });

    if (response.status !== 200) {
        throw response.data as IResponseError;
    }

    return response.data.votes as report['votes'];
}