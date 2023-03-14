import { IReportReturnPayload } from "@/data/report/source";
import { BigHead } from '@bigheads/core'
import { Button } from "primereact/button";
import { doReportVote } from "@/services/reports-service";
import { useAuthenticate } from "@/hooks/authenticate-hook";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageViewer from 'react-simple-image-viewer';
import { useTranslation } from "next-i18next";

const Report = ({ report, key }: { report: IReportReturnPayload, key: number }): JSX.Element => {
    const { showDialog } = useAuthenticate();
    const { t } = useTranslation(['common', 'feed']);

    const [selectedImage, setSelectedImage] = useState<number | undefined>(undefined);
    const [reportData, setReportData] = useState<IReportReturnPayload>(report);

    useEffect(() => {
        if( report ) {
            setReportData(report);
        }
    }, [report]);

    const doVote = async (report_id: IReportReturnPayload['report_id'], vote: string) => {
        try {
            const votes = await doReportVote(report_id, vote);
            setReportData(prevReport => ({...prevReport,
                votes: votes
            }));

        } catch (error: any) {
            showDialog({
                title: 'Opss...',
                message: error.message,
                button_text: 'Ok',
                type: 'error'
            });
        }
    };

    return (
        <div key={key} className="p-fluid">
            <div className="p-card flex align-items-center mt-2 p-2">
                <div className="flex flex-wrap flex-column gap-2 align-items-center w-1 align-self-start">
                    <Button
                        icon="pi pi-arrow-up"
                        className="p-button-rounded p-button-text p-button-sm mr-2 ml-2 mt-2"
                        onClick={() => doVote(reportData.report_id, 'UP')}
                    />
                    <span className={classNames({
                        'text-md font-medium': true,
                        'text-green-500' : (reportData.votes || 0) > 0,
                        'text-red-500' : (reportData.votes || 0) < 0,
                    })}>
                        {(reportData.votes || 0) > 0 ? `+${reportData.votes}` : reportData.votes}
                    </span>
                    <Button
                        icon="pi pi-arrow-down"
                        className="p-button-rounded p-button-text p-button-sm mr-2 ml-2 mb-2"
                        onClick={() => doVote(reportData.report_id, 'DOWN')}
                    />
                </div>
                <div className="content ml-2 w-11">
                    <div className="flex align-items-center">
                        <div className="w-4rem">
                            <BigHead />
                        </div>
                        <div className="ml-2">
                            <span className="text-700 text-lg font-medium p-0 m-0">{reportData.user.username || t('anonimo')}</span>
                            <span className="text-500 text-sm font-medium p-0 m-0 ml-2">{reportData.time}</span>
                        </div>
                    </div>
                    <div className="mt-2 ml-3">
                        <div dangerouslySetInnerHTML={{ __html: reportData.body }} />
                    </div>
                    <div className="flex overflow-x-auto gap-2 pb-2 custom-scroll mr-2">
                        {reportData.medias.map((media, index) => (
                            <Image
                                key={index}
                                src={media.base64}
                                width={100}
                                height={100}
                                alt="media"
                                className="border-round-md cursor-pointer"
                                onClick={() => {
                                    setSelectedImage(index)
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex pb-3 pr-3 align-items-center justify-content-end pt-2">
                        <div className="w-2rem border-circle h-2rem bg-primary flex align-items-center justify-content-center mr-2">
                            <i className="pi pi-bookmark"></i>
                        </div>
                        <span className="text-700 text-lg font-medium p-0 m-0 mr-4">{t(`categorys:${reportData.category}`)}</span>
                        <div className="w-2rem border-circle h-2rem bg-primary flex align-items-center justify-content-center mr-2">
                            <i className="pi pi-map"></i>
                        </div>
                        <span className="text-700 text-lg font-medium p-0 m-0">{`${reportData.city} - ${reportData.district}`}</span>
                    </div>
                </div>
            </div>
            {selectedImage !== undefined && (
                <ImageViewer
                    src={reportData.medias.map(media => media.base64)}
                    currentIndex={selectedImage}
                    disableScroll={false}
                    onClose={() => setSelectedImage(undefined)}
                />
            )}
        </div>
    )
}

export default Report;