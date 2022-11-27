import { IFiltersReports, IReportPayload } from "@/data/report/source";
import { IErrorField, IResponseError } from "@/types/response";
import { isEmpty } from "@/utils/string-utils"

export const validateFilters = (filters: IFiltersReports): IFiltersReports => {
    let normalizedFilters: IFiltersReports = {
        search: filters?.search?.toString() || '',
        page: Number(filters?.page || 1),
        limit: Number(filters?.limit || 25),
        status: filters?.status || '',
        sortField: filters?.sortField || 'created_at',
        sortOrder: filters?.sortOrder || 'asc',
    };

    const validSortFields = ['created_at','updated_at'];

    if( 
        Number.isNaN(normalizedFilters.page) ||
        !Number.isInteger(normalizedFilters.page) ||
        !Number.isFinite(normalizedFilters.page) || 
        normalizedFilters.page! < 1
     ) {
        throw {
            name: 'ERROR',
            message: 'Invalid page',
        } as IResponseError;
    }

    if( 
        Number.isNaN(normalizedFilters.limit) ||
        !Number.isInteger(normalizedFilters.limit) ||
        !Number.isFinite(normalizedFilters.limit) ||
        normalizedFilters.limit! < 1 ||
        normalizedFilters.limit! > 100
     ) {
        throw {
            name: 'ERROR',
            message: 'Invalid limit',
        } as IResponseError;
    }

    if( !isEmpty(normalizedFilters.status) && ['A','I'].indexOf(normalizedFilters.status!) === -1 ) {
        throw {
            name: 'ERROR',
            message: 'Invalid status',
        } as IResponseError;
    }

    if( !isEmpty(normalizedFilters.sortField) && validSortFields.indexOf(normalizedFilters.sortField!) === -1 ) {
        throw {
            name: 'ERROR',
            message: 'Invalid sortField',
        } as IResponseError;
    }

    if( !isEmpty(normalizedFilters.sortOrder) && ['asc','desc'].indexOf(normalizedFilters.sortOrder!) === -1 ) {
        throw {
            name: 'ERROR',
            message: 'Invalid sortOrder',
        } as IResponseError;
    }

    return normalizedFilters;
}

export const validateReportPayload = (payload: IReportPayload) => {
    const errors: IErrorField[] = [];

    if( !payload.body ) {
        errors.push({
            field: 'body',
            message: 'Content is required'
        });
    }

    if( errors.length > 0 ) {
        throw errors;
    }

    return payload;
}