import { Button } from 'primereact/button';
import ReportEditor from '@/components/shared/ReportEditor';
import ReportsList from '@/components/shared/ReportsList';
import { IReportsListRef } from "@/components/shared/ReportsList"; 
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticate } from '@/hooks/authenticate-hook';
import { useTranslation } from "next-i18next";
import SelectLang from '@/components/shared/SelectLang';

const Feed = (): JSX.Element => {
    const reportListRef = useRef<IReportsListRef>(null);
    const intervalReload = useRef<any>(null);
    const router = useRouter();
    const { session } = useAuthenticate();
    const { t } = useTranslation(['common','feed','menu']);

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
        <div className="flex flex-wrap lg:w-10 w-full">
            <div className="flex flex-wrap w-full">
                {session && (
                    <h2 className="text-2xl font-bold">{t('feed:messages.hello', {
                        name: session.user?.username
                    })}</h2>
                ) || (
                    <div className="w-full flex justify-content-end lg:hidden">
                        <SelectLang />
                        <Button
                            label={t('menu:items.login') || ''}
                            className="p-button-primary mr-2 ml-3"
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
                <h2 className="text-2xl font-bold">{t('feed:title')}</h2>
                <ReportsList
                    ref={reportListRef}
                />
            </div>
        </div>
    );
};

export default Feed;