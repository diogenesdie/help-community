import { useReports } from "@/hooks/reports-hook";
import { useRouter } from "next/router";
import { useState } from "react";
import { IFiltersReports } from "@/data/report/source";
import { isEmpty } from "@/utils/string-utils";
import { ProgressBar } from 'primereact/progressbar';
import { forwardRef, useImperativeHandle } from "react";

export interface IReportsListRef {
    reload: () => void;
}

const ReportsList = forwardRef(function ReportsList(props, ref): JSX.Element {
    const [filters, setFilters] = useState<IFiltersReports>({
        search: '',
        status: 'A',
        page: 1,
        limit: 25,
        sortField: 'created_at',
        sortOrder: 'asc'
    });
    const { 
        reports, 
        errorReports, 
        isLoadingReports, 
        reloadReports,
    } = useReports(filters);

    useImperativeHandle(ref, () => ({   
        reload: () => {
            reloadReports();
        }
    }));

    if( isLoadingReports ){
        return (
            <div className="p-d-flex p-jc-center p-ai-center p-p-4">
                <ProgressBar mode="indeterminate" />
            </div>
        );
    }
    
    if( errorReports ){
        return (
            <div className="p-d-flex p-jc-center p-ai-center p-p-4">
                <span className="p-error">{errorReports.message}</span>
            </div>
        );
    }

    return (
        <div className="p-grid">
            {(reports?.data && reports.data.map((report, index) => (
                <div key={index} className="p-col-12">
                    <div className="p-card">
                        <div dangerouslySetInnerHTML={{ __html: report.body }} />
                    </div>
                </div>
            )))}
        </div>
    );
});

export default ReportsList;