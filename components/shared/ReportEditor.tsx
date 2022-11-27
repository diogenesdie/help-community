import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { insert } from '@/services/reports-service';
import { IReportMediaPayload, IReportPayload } from "@/data/report/source"
import { BlockUI } from 'primereact/blockui';
import { useAuthenticate } from '@/hooks/authenticate-hook';
import { isEmpty } from '@/utils/string-utils';

const ReportEditor = (): JSX.Element => {
    const [text, setText] = useState<string>('');
    const [medias, setMedias] = useState<Array<string>>([]);
    const fileUploadRef = useRef<FileUpload>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);	
    const { showDialog } = useAuthenticate();

    const onTextChange = (e: any) => {
        setText(e.htmlValue);
    }

    const fileToBase64 = async (file: any): Promise<string> => new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then(r => r.blob());

        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = reader.result;

            resolve(base64data as string);
        }

    });

    const customBase64Uploader = async (event: any) => {
        const filesBase64: string[] = [];

        for (let file of event.files) {
            filesBase64.push(await fileToBase64(file));
        }

        setMedias(prevMedias => [...prevMedias, ...filesBase64]);
        fileUploadRef.current?.clear();
    }

    const renderHeader = () => {
        return (
            <span className="ql-formats flex align-items-center">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-link" aria-label="link"></button>
                <FileUpload 
                    ref={fileUploadRef}
                    mode="basic"
                    name="demo[]"
                    accept="image/*" 
                    maxFileSize={1000000} 
                    customUpload 
                    uploadHandler={customBase64Uploader}
                    auto
                    multiple
                    chooseOptions={{
                        icon: 'pi pi-image',
                        iconOnly: true,
                        className: 'p-button-text p-button-plain p-2 m-0'
                    }}
                />
            </span>
        );
    }

    const header = renderHeader();

    const onDiscard = () => {
        setText('');
        setMedias([]);
    }

    const onClickSave = async () => {
        if( isEmpty(text) ) return 
        
        try {
            setIsLoading(true);
            await insert({
                body: text,
                medias: medias.map((media: string) => {
                    return {
                        base64: media
                    } as IReportMediaPayload
                })
            } as IReportPayload);

            
            showDialog({
                title: 'Report published',
                message: 'Your report has been published successfully',
                button_text: 'Ok',
                type: 'success',
                callback: () => {
                    onDiscard();
                }
            });

        } catch (error: any) {
            showDialog({
                title: 'Error',
                message: error.message,
                button_text: 'Ok',
                type: 'error'
            });
        }

        setIsLoading(false);
    }

    return (
        <BlockUI blocked={isLoading}>
        <div className="p-fluid border-bottom-1 border-primary pb-3">
            <div className="p-field w-full">
                <Editor 
                    style={{ height: '120px' }} 
                    value={text}
                    onTextChange={onTextChange}
                    headerTemplate={header}
                    className="placeholder-white border-none text-lg"
                    placeholder="Report your problem here..."
                />
                {(medias.length > 0) && (
                    <div className="flex flex-wrap">
                        {medias.map((media, index) => (
                            <div key={index} className="relative p-2">
                                <div 
                                    className="absolute"
                                    style={{right: '0', top: '0'}}
                                >
                                    <Button
                                        icon="pi pi-times"
                                        className="p-button-rounded p-button-primary w-2rem h-2rem p-0"
                                        onClick={() => setMedias(prevMedias => prevMedias.filter((_, i) => i !== index))}
                                    />
                                </div>
                                <Image src={media} width={100} height={100} alt="media" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="flex justify-content-end mt-2 border-top-1 border-primary pt-3">
                <Button
                    label="Discard"
                    icon="pi pi-times"
                    className="p-button-text w-3"
                    onClick={onDiscard}
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    className="p-button-outlined w-3"
                    onClick={onClickSave}
                />
            </div>
        </div>
        </BlockUI>
    );
}

export default ReportEditor;