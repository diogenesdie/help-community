import { IFiltersReports, IReportPayload } from "@/data/report/source";
import { getReports } from "@/services/reports-service";
import { IListRecords } from "@/types/api";
import { IResponseError } from "@/types/response";
import { toQueryString } from "@/utils/api-utils";
import useSWR, { useSWRConfig } from "swr";

/**
 * Hook to load reports
 */
export const useReports = (filters?: IFiltersReports) => {
    const keyReports = `/api/usuarios?${toQueryString(filters)}`;
    const swrConfig = useSWRConfig();
    const { data, error, isValidating } = useSWR<IListRecords<IReportPayload>, IResponseError>(keyReports, async () => await getReports(filters));

    return {
        reports: data || null,
        errorReports: error || null,
        isLoadingReports: (!data && !error) || isValidating,
        reloadReports: () => swrConfig.mutate(keyReports),
        mutateReports: (data: IListRecords<IReportPayload>) => swrConfig.mutate(keyReports, data, {
            optimisticData: data,
            rollbackOnError: true,
        }),
    };
}