export type TErrorType = 'ERROR' | 'NOT_FOUND'  | 'NOT_ALLOWED' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION_ERROR' | 'INTERNAL_SERVER_ERROR';

export interface IErrorField {
    field: string;
    message: string;
}

export interface IResponseError {
    status?: number;
    name: TErrorType;
    message: string;
    fields?: IErrorField[];
}