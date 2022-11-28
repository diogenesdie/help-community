import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logoPrimary from '@/public/images/logo-help-community-primary.png';
import logo from '@/public/images/logo-help-community.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { classNames } from "primereact/utils";
import { login } from '@/services/authenticate-service';
import { useAuthenticate } from '@/hooks/authenticate-hook';
import { ProgressBar } from 'primereact/progressbar';
import { IResponseError } from '@/types/response';

interface ILoginState {
    username: string;
    password: string;
};

type ILoginField = keyof ILoginState;

interface ILoginErrors {
    username: string | boolean;
    password: string | boolean;
};

const templateErrors = {
    username: false,
    password: false
};

const LoginPage = (): JSX.Element => {
    const [state, setState] = useState<ILoginState>({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState<ILoginErrors>(templateErrors);
    const { session, sessionError, isLoadingSession, showDialog } = useAuthenticate();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isLoginOk, setIsLoginOk] = useState<boolean>(false);

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
                    newErrors[field.field as ILoginField] = field.message || false;
                });
            }

            return newErrors;
        });
    }, [setErrors]);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        setErrors(templateErrors);
        const { username, password } = state;

        if( !username ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                username: 'Username is required'
            }));
        }

        if( !password ) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: 'Password is required'
            }));
        }

        try {
            setIsLogin(true);
            if( username && password ) {
                await login({
                    username,
                    password
                });
            }
            setIsLoginOk(true);

            router.push('/');
            
        } catch (error: any) {
            dispatchErrors(error);
        }

        setIsLogin(false);
    }

    if( (session && !sessionError) || isLoadingSession ) {
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
        
        <div className="flex h-screen overflow-hidden">
            {session && (
                <span>Logado</span>
            )}
            <div className="flex w-4 bg-primary">
                <div className="flex flex-column align-items-center justify-content-center w-full relative">
                    <Image src={logo} alt="Help Community Logo" width={400}/>
                    <h2 className="roboto">be the help that you looking for</h2>
                </div>
            </div>
            <div className="p-fluid flex w-8 align-items-center justify-content-center">
                <div className="flex flex-wrap align-items-center justify-content-center w-4 gap-3">
                    <Image src={logoPrimary} alt="Help Community Logo" width={250}  />
                    <div className="p-field w-full">
                        <label htmlFor="username" className="block text-900 font-medium mb-2">Username</label>
                        <InputText 
                            id="username"
                            name="username"
                            type="text"
                            className={classNames({ 
                                'p-invalid': Boolean(errors.username),
                                'w-full': true
                            })}
                            placeholder="Username"
                            onChange={handleChange} 
                            maxLength={100}
                        />
                        {errors.username && <small className="p-error">{errors.username}</small>}
                    </div>
                    <div className="p-field w-full">
                        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
                        <Password 
                            id="password"
                            name="password"
                            value={state.password}
                            feedback={false}
                            className={classNames({ 
                                'p-invalid': Boolean(errors.password),
                                'w-full': true
                            })}
                            placeholder="Password"
                            onChange={handleChange} 
                            maxLength={100}
                        />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                    <div className="p-field w-full">
                        <Button 
                            label="Login"
                            className="p-button-raised w-full"
                            icon="pi pi-sign-in"
                            onClick={onSubmit}
                            loading={isLoginOk || isLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage