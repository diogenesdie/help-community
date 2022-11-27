import { useRouter } from "next/router";
import { Button } from 'primereact/button';
import ReportEditor from '@/components/shared/ReportEditor';
import ReportsList from '@/components/shared/ReportsList';
import { IReportsListRef } from "@/components/shared/ReportsList"; 
import { useRef } from 'react';

const Feed = (): JSX.Element => {
    const reportListRef = useRef<IReportsListRef>(null);

    return (
        <div className="flex flex-wrap lg:w-10">
            <div className="flex flex-column flex-auto p-2">
                <h1 className="text-700 text-2xl font-medium p-0 mt-0 mb-2">Feed</h1>
                <ReportEditor />
            </div>
            <div className="w-full">
                <ReportsList
                    ref={reportListRef}
                />
                <Button
                    label="Reload"
                    onClick={() => {
                        reportListRef.current?.reload();
                    }}
                />
            </div>
        </div>
    );
};

export default Feed;