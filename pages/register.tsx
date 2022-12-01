import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logoPrimary from '@/public/images/logo-help-community-primary.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import { register } from '@/services/authenticate-service';
import { useAuthenticate } from '@/hooks/authenticate-hook';
import { ProgressBar } from 'primereact/progressbar';
import { IResponseError } from '@/types/response';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; 
import { useTranslation } from 'next-i18next';
import SelectLang from '@/components/shared/SelectLang';

interface IRegisterState {
    username: string;
    password: string;
    confirm_password: string;
};

type IRegisterField = keyof IRegisterState;

interface IRegisterErrors {
    username: string | boolean;
    password: string | boolean;
    confirm_password: string | boolean;
};

const templateErrors = {
    username: false,
    password: false,
    confirm_password: false
};

const RegisterPage = (): JSX.Element => {
    const [state, setState] = useState<IRegisterState>({
        username: '',
        password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState<IRegisterErrors>(templateErrors);
    const { session, sessionError, isLoadingSession } = useAuthenticate();
    const router = useRouter();
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [isRegisterOk, setIsRegisterOk] = useState<boolean>(false);

    const { t } = useTranslation(['common', 'register']);

    useEffect(() => {
        if( !session || sessionError ) {
            //Do nothing, not logged in
            return;
        }

        // Logged in, redirect to home
        router.push('/');

    }, [session, router, sessionError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: false
        }));
    };

    const dispatchErrors = useCallback((err: IResponseError): void => {
        setErrors((prevErrors) => {
            let newErrors = {...prevErrors};

            if(err.fields) {            
                err.fields.forEach((field) => {
                    newErrors[field.field as IRegisterField] = field.message || false;
                });
            }

            return newErrors;
        });
    }, [setErrors]);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setErrors(templateErrors);
        const { username, password, confirm_password } = state;

        if( !username ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                username: t('register:validation.username.required') || ''
            }));
        }

        if( !password ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: t('register:validation.password.required') || ''
            }));
        }

        if( !confirm_password ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                confirm_password: t('register:validation.confirm-password.required') || ''
            }));
        }

        if( password !== confirm_password ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                confirm_password: t('register:validation.confirm-password.not-equal') || ''
            }));
        }

        try {
            setIsRegister(true);
            if( username && password && confirm_password) {
                await register({
                    username,
                    password,
                    confirm_password
                });
                setIsRegisterOk(true);
            } else {
                setIsRegisterOk(false);
            }
            
        } catch (error: any) {
            setIsRegisterOk(false);
            dispatchErrors(error);
        }

        setIsRegister(false);
    }

    if( (session && session.public_token && !sessionError) ) {
        return <div className="flex flex-wrap justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="flex flex-wrap justify-content-center w-full">
                    <Image src={logoPrimary} alt="Help Community" width={400} />
                    <div className="w-full flex justify-content-center">
                        <ProgressBar mode="indeterminate" style={{ height: '6px', width: '200px' }}></ProgressBar>
                    </div>
                </div>
        </div>
    }

    return (
        <div className="flex justify-content-center align-items-center w-full h-screen">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                <div className="flex w-full justify-content-end">
                    <SelectLang />
                </div>
                <div className="text-center mb-5">
                    <Image src={logoPrimary} alt="Help Community Logo" width={250}  />
                    <div className="text-900 text-3xl font-medium mb-3">{t('register:title')}</div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-900 font-medium mb-2">{t('register:labels.username')}</label>
                    <InputText 
                        id="username"
                        name="username"
                        type="text"
                        className={classNames({ 
                            'p-invalid': Boolean(errors.username),
                            'w-full': true
                        })}
                        placeholder={t('register:placeholders.username') || ''}
                        onChange={handleChange} 
                        maxLength={100}
                        value={state.username}
                    />
                    {errors.username && <small className="p-error">{errors.username}</small>}
                    <label htmlFor="password" className="block text-900 font-medium mb-2 mt-3">{t('register:labels.password')}</label>
                    <InputText
                        id="password"
                        name="password"
                        type="password"
                        value={state.password}
                        className={classNames({ 
                            'p-invalid': Boolean(errors.password),
                            'w-full': true
                        })}
                        placeholder={t('register:placeholders.password') || ''}
                        onChange={handleChange} 
                        maxLength={100}
                    />
                    {errors.password && <small className="p-error">{errors.password}</small>}
                    <label htmlFor="confirm_password" className="block text-900 font-medium mb-2 mt-3">{t('register:labels.confirm-password')}</label>
                    <InputText
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={state.confirm_password}
                        className={classNames({
                            'p-invalid': Boolean(errors.confirm_password),
                            'w-full': true
                        })}
                        placeholder={t('register:placeholders.confirm-password') || ''}
                        onChange={handleChange}
                        maxLength={100}
                    />
                    {errors.confirm_password && <small className="p-error">{errors.confirm_password}</small>}
                    <Button 
                        label={t('register:labels.register') || ''}
                        icon="pi pi-user"
                        className="w-full mt-3"  
                        onClick={onSubmit}
                        loading={isRegisterOk || isRegister}
                    />
                </div>
            </div>
        </div>

        
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale ?? 'pt', ['common','register']))
    }
});

export default RegisterPage