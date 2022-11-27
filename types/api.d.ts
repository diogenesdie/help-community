export interface IListRecordsPayload {
    search?: string | null;
    page?: number | null;
    limit?: number | null;
}
export interface IListRecords<type> {
    data: Array<type>;
    page: number;
    totalData: number;
    totalPages: number;
}