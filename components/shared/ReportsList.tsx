import { useReports } from "@/hooks/reports-hook";
import { useRouter } from "next/router";
import { useState } from "react";
import { IFiltersReports } from "@/data/report/source";
import { isEmpty } from "@/utils/string-utils";
import { ProgressBar } from 'primereact/progressbar';
import { forwardRef, useImperativeHandle } from "react";
import Report from "@/components/shared/Report";
import { Dropdown } from "primereact/dropdown";
import SelectCity from "./SelectCity";
import SelectDistrict from "./SelectDistrict";
import SelectCategory from "./SelectCategory";
import { Button } from "primereact/button";

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
        sortOrder: 'desc',
        city: '',
        district: '',
        category: ''
    });
    const { 
        reports, 
        errorReports, 
        isLoadingReports, 
        reloadReports,
    } = useReports(filters);
    const [showReload, setShowReload] = useState<boolean>(true);

    useImperativeHandle(ref, () => ({   
        reload: () => {
            setShowReload(false);
            reloadReports();
        }
    }));

    if( isLoadingReports && showReload ){
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
        <div className="p-fluid">
            <div className="flex gap-2 w-full">
                <SelectCity
                    id="city"
                    name="city"
                    placeholder="Filter by city"
                    className="p-mr-2"
                    classNameField="w-3"
                    value={filters.city}
                    onChange={(e) => setFilters(prevFilters => ({...prevFilters, city: e.value}))}
                    showClear
                />
                <SelectDistrict
                    id="district"
                    name="district"
                    placeholder="Filter by district"
                    className="p-mr-2"
                    classNameField="w-3"
                    value={filters.district}
                    onChange={(e) => setFilters(prevFilters => ({...prevFilters, district: e.value}))}
                    city={filters.city}
                    disabled={isEmpty(filters.city)}
                    showClear
                />
                <SelectCategory
                    id="category"
                    name="category"
                    placeholder="Filter by category"
                    className="p-mr-2"
                    classNameField="w-3"
                    value={filters.category}
                    onChange={(e) => setFilters(prevFilters => ({...prevFilters, category: e.value}))}
                    showClear
                />
                <Dropdown
                    id="order"
                    name="order"
                    placeholder="Order by"
                    className="p-mr-2 w-3"
                    value={`${filters.sortField}:${filters.sortOrder}`}
                    options={[
                        {label: 'Latest', value: 'created_at:desc', type: 'desc'},
                        {label: 'Oldest', value: 'created_at:asc', type: 'asc'},
                        {label: 'Most liked', value: 'votes:desc', type: 'desc'},
                        {label: 'Least liked', value: 'votes:asc', type: 'asc'},
                    ]}
                    onChange={(e) => setFilters(prevFilters => {
                        const { value } = e.target;
                        
                        const [sortField, sortOrder] = value.split(':');
                        return {
                            ...prevFilters,
                            sortField,
                            sortOrder,
                        };
                            
                    })}
                />
            </div>
            {(reports?.data && reports.data.length && reports.data.map((report, index) => (
                <Report report={report} key={index} />
            )) || (isLoadingReports && (
                <div className="p-d-flex p-jc-center p-ai-center p-p-4">
                    <ProgressBar mode="indeterminate" />
                </div>
            )) || (
                <div className="flex justify-content-center flex-wrap">
                    <div className="flex justify-content-center align-items-center mt-7 w-full">
                        <span className="flex align-items-center justify-content-center bg-cyan-100 text-cyan-800 mr-3 border-circle mb-3" style={{width: '64px', height: '64px'}}><i className="pi pi-exclamation-circle text-5xl"></i></span>
                    </div>
                    <h2 className="text-center mt-0 w-full">No reports found</h2>
                    <Button
                        label="Clear filters"
                        className="p-button-primary w-2"
                        onClick={() => setFilters(prevFilters => ({
                            ...prevFilters,
                            city: '',
                            district: '',
                            category: '',
                        }))}
                    />
                </div>
            ))}
        </div>
    );
});

export default ReportsList;