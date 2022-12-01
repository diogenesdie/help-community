import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logoPrimary from '@/public/images/logo-help-community-primary.png';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import { login } from '@/services/authenticate-service';
import { useAuthenticate } from '@/hooks/authenticate-hook';
import { ProgressBar } from 'primereact/progressbar';
import { IResponseError } from '@/types/response';
import Link from 'next/link';

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
                setIsLoginOk(true);
                
            } else {
                setIsLoginOk(false);
            }
            
        } catch (error: any) {
            dispatchErrors(error);
        }

        setIsLogin(false);
    }

    if( (session && session.id && !sessionError) || isLoadingSession ) {
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
                <div className="text-center mb-5">
                    <Image src={logoPrimary} alt="Help Community Logo" width={250}  />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    <span className="text-600 font-medium line-height-3">Dont have an account?</span>
                    <Link 
                        className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
                        href="/register"
                    >
                        Create today!
                    </Link>
                </div>

                <div>
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
                        value={state.username}
                    />
                    {errors.username && <small className="p-error">{errors.username}</small>}
                    <label htmlFor="password" className="block text-900 font-medium mb-2 mt-3">Password</label>
                    <InputText
                        id="password"
                        name="password"
                        type="password"
                        value={state.password}
                        className={classNames({ 
                            'p-invalid': Boolean(errors.password),
                            'w-full': true
                        })}
                        placeholder="Password"
                        onChange={handleChange} 
                        maxLength={100}
                    />
                    {errors.password && <small className="p-error">{errors.password}</small>}
                    <div className="flex align-items-center justify-content-between mb-6 mt-2">
                        <div className="flex align-items-center">
                            {/* <Checkbox id="rememberme" className="mr-2" checked={checked1} onChange={(e) => setChecked1(e.checked)} /> */}
                            {/* <label htmlFor="rememberme">Remember me</label> */}
                        </div>
                        {/* <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a> */}
                    </div>

                    <Button 
                        label="Sign In"
                        icon="pi pi-user"
                        className="w-full"  
                        onClick={onSubmit}
                        loading={isLoginOk || isLogin}
                    />
                </div>
            </div>
        </div>

        
    )
}

export default LoginPage