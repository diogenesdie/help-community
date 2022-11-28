import { IReportReturnPayload } from "@/data/report/source";
import { BigHead } from '@bigheads/core'
import { Button } from "primereact/button";

const Report = ({ report, key }: { report: IReportReturnPayload, key: number }): JSX.Element => {
    return (
        <div key={key} className="p-col-12">
            <div className="p-card flex align-items-center mt-2">
                <div className="flex flex-wrap flex-column gap-2 align-items-center">
                    <Button
                        icon="pi pi-arrow-up"
                        className="p-button-rounded p-button-primary p-button-sm mr-2 ml-2 mt-2"
                    />
                    <span className="text-700 text-2xl font-medium p-0 m-0">{report.votes}</span>
                    <Button
                        icon="pi pi-arrow-down"
                        className="p-button-rounded p-button-primary p-button-sm mr-2 ml-2 mb-2"
                    />
                </div>
                <div className="content">
                    <div className="w-4rem">
                        <BigHead />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: report.body }} />
                </div>
            </div>
        </div>
    )
}

export default Report;