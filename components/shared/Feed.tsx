import { Button } from 'primereact/button';
import ReportEditor from '@/components/shared/ReportEditor';
import ReportsList from '@/components/shared/ReportsList';
import { IReportsListRef } from "@/components/shared/ReportsList"; 
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '@/hooks/authenticate-hook';

const Feed = (): JSX.Element => {
    const reportListRef = useRef<IReportsListRef>(null);
    const intervalReload = useRef<any>(null);
    const router = useRouter();
    const { session } = useAuthenticate();

    const onReportSaved = () => {
        if (reportListRef.current) {
            reportListRef.current.reload();
        }
    }   

    useEffect(() => {
        intervalReload.current = setInterval(() => {
            if (reportListRef.current) {
                reportListRef.current.reload();
            }
        }, 10000);

        return () => {
            clearInterval(intervalReload.current);
        }
    }, []);

    return (
        <div className="flex flex-wrap lg:w-10">
            <div className="flex flex-wrap w-full">
                {session && (
                    <h2 className="text-2xl font-bold">Hello {session.user?.username}!</h2>
                ) || (
                    <div className="w-full flex justify-content-end">
                        <Button
                            label="Login"
                            className="p-button-primary p-mr-2 lg:hidden"
                            onClick={() => {
                                router.push('/login');
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-column flex-auto pt-3 pb-3">
                <ReportEditor 
                    onSave={onReportSaved}
                />
            </div>
            <div className="w-full">
                <h2 className="text-2xl font-bold">Reports</h2>
                <ReportsList
                    ref={reportListRef}
                />
            </div>
        </div>
    );
};

export default Feed;