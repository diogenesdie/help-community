import { useState, useEffect } from 'react';
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

interface ILoginState {
    username: string;
    password: string;
};

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
    const { session, sessionError, isLoadingSession } = useAuthenticate();
    const router = useRouter();

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

    const onSubmit = async (e: any) => {
        e.preventDefault();
        const { username, password } = state;
        console.log(state)
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
            if( username && password ) {
                await login({
                    username,
                    password
                });
            }
        } catch (error) {
            console.log(error);
        }

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
            <div className="flex w-6 bg-primary">
                <div className="flex flex-column align-items-center justify-content-center w-full relative">
                    <Image src={logo} alt="Help Community Logo" width={400}/>
                    <h2 className="roboto">be the help that you looking for</h2>
                </div>
                <svg className="waves absolute rotate-90" preserveAspectRatio="none" shape-rendering="auto" style={{width: '125vw', right: '-235'}} viewBox="0 24 150 28">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g className="parallax">
                        <use x="48" y="0" fill="rgba(255,255,255,0.7" xlinkHref="#gentle-wave" />
                        <use x="48" y="3" fill="rgba(255,255,255,0.5)" xlinkHref="#gentle-wave" />
                        <use x="48" y="5" fill="rgba(255,255,255,0.3)" xlinkHref="#gentle-wave" />
                        <use x="48" y="7" fill="#fff" xlinkHref="#gentle-wave" />
                    </g>
                </svg>
            </div>
            <div className="p-fluid flex w-6 align-items-center justify-content-center">
                <div className="flex flex-wrap align-items-center justify-content-center h-10rem gap-3 w-6">
                    <Image src={logoPrimary} alt="Help Community Logo" width={250}  />
                    <div className="p-field w-full">
                        <label htmlFor="username">Username</label>
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
                        <label htmlFor="password">Password</label>
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
                            onClick={onSubmit}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage