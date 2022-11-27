import { IFiltersReports, IReportPayload } from "@/data/report/source";
import { validateReportPayload } from "@/data/report/validation";
import { IResponseError } from "@/types/response";
import { IListRecords } from "@/types/api";
import client from "@/config/http";


/** 
 * Returns a list of reports
 * 
 * @param {IFiltersReports} filters
 * 
 * @returns {Promise<IReportPayload[]>}
 */
export const getReports = async (filters?: IFiltersReports): Promise<IListRecords<IReportPayload>> => {
    const response = await client.get('/api/reports', { params: filters });

    if( response.status !== 200 ) {
        throw response.data as IResponseError;
    }

    return response.data as IListRecords<IReportPayload>;
}

/**
 * Insert a new report
 * 
 * @param payload Report data
 * @returns
 */
 export const insert = async (payload: IReportPayload): Promise<IReportPayload> => {
    const data = validateReportPayload(payload);

    const response = await client({
        method: "POST",
        url: `/api/reports`,
        data: data
    });

    if (response.status !== 200) {
        throw response.data as IResponseError;
    }

    return response.data as IReportPayload;

}