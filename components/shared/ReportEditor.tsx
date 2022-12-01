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
import { classNames } from 'primereact/utils';
import SelectCity from '@/components/shared/SelectCity';
import SelectDistrict from '@/components/shared/SelectDistrict';
import { IErrorField } from '@/types/response';
import SelectCategory from '@/components/shared/SelectCategory';
import { useTranslation } from 'next-i18next';

export interface ReportEditorProps {
    onSave: () => void;
}

export interface IReportEditorErrors {
    text: string | boolean;
    city_id: string | boolean;
    district_id: string | boolean;
    category_id: string | boolean;
}

export type TReportErrorField = keyof IReportEditorErrors;

const ReportEditor = (props: ReportEditorProps): JSX.Element => {
    const [text, setText] = useState<string>('');
    const [medias, setMedias] = useState<Array<string>>([]);
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);	
    const [errors, setErrors] = useState<IReportEditorErrors>({
        text: false,
        city_id: false,
        district_id: false,
        category_id: false
    });

    const fileUploadRef = useRef<FileUpload>(null);
    const { showDialog } = useAuthenticate();
    const { t } = useTranslation(['feed', 'common']);

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
                <div className="flex flex-wrap">
                    <div className="flex align-items-center">
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
                    </div>
                    <div className="flex flex-wrap align-items-center gap-2 lg:gap-0">
                        <SelectCity
                            id="city_id"
                            name="city_id"
                            placeholder={t('feed:placeholders.select-city')}
                            value={city}
                            onChange={(e) => {
                                setCity(e.value);
                                setDistrict('');
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    city_id: false,
                                    district_id: false,
                                }));
                            }}
                            className={classNames({ 'p-invalid': Boolean(errors.city_id) })}
                            error={errors.city_id}
                        />
                        <SelectDistrict
                            id="district_id"
                            name="district_id"
                            placeholder={t('feed:placeholders.select-district')}
                            city={city}
                            value={district}
                            onChange={(e) => {
                                setDistrict(e.value);
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    district_id: false,
                                }));
                            }}
                            className={classNames({ 'p-invalid': Boolean(errors.city_id), 'lg:ml-2': true})}
                            error={errors.district_id}
                            disabled={isEmpty(city)}
                        />
                        <SelectCategory
                            id="category_id"
                            name="category_id"
                            placeholder={t('feed:placeholders.select-category')}
                            value={category}
                            onChange={(e) => {
                                setCategory(e.value);
                                setErrors(prevErrors => ({
                                    ...prevErrors,
                                    category_id: false,
                                }));
                            }}
                            className={classNames({ 'p-invalid': Boolean(errors.city_id), 'lg:ml-2': true})}
                            error={errors.category_id}
                        />
                    </div>
                </div>
            </span>
        );
    }

    const header = renderHeader();

    const onDiscard = () => {
        setText('');
        setMedias([]);
    }

    const dispatchError = (error: any) => {
        setErrors((prevErrors) => {
            let novoErros = {...prevErrors};

            if(error.fields) {            
                error.fields.forEach((field: IErrorField) => {
                    novoErros[field.field as TReportErrorField] = field.message || false;
                });            
            }

            return novoErros;
        });
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
                }),
                city: city,
                district: district,
                category: category
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

            props.onSave();

        } catch (error: any) {
            dispatchError(error);

            if( error.fields && error.fields.length > 0 ) {
                showDialog({
                    title: 'Validation error',
                    message: error.message,
                    button_text: 'Ok',
                    type: 'error'
                });
            }
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
                    className="placeholder-white border-none text-lg w-full"
                    placeholder={t('feed:placeholders.editor') || ''}
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
            <div className={classNames({
                'flex justify-content-end mt-2 border-primary pt-3': true,
                'border-top-1': !isEmpty(text) || medias.length
            })}>
                <Button
                    label="Discard"
                    icon="pi pi-times"
                    className={classNames({
                        'p-button-text w-3': true,
                        'hidden': isEmpty(text) && medias.length === 0
                    })}
                    onClick={onDiscard}
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    className={classNames({
                        'p-button-primary w-3': true,
                        'hidden': isEmpty(text) && medias.length === 0
                    })}
                    onClick={onClickSave}
                />
            </div>
        </div>
        </BlockUI>
    );
}

export default ReportEditor;