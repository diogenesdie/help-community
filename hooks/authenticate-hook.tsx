import { ISession, IAuthenticateProviderProps, IDialogProps } from "@/types/authenticate";
import { IResponseError } from "@/types/response";
import React, { useContext, createContext, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { loadSession } from "@/services/authenticate-service";
import { clearLocals } from "@/utils/local-utils";
import { isEmpty } from "@/utils/string-utils";

/**
 * Authenticate provider
 */
export const AuthContext = createContext<IAuthenticateProviderProps>({
    session: null,
    isLoadingSession: false,
    sessionError: null,
    is_logged_in: false,
    reload: () => {},
    showDialog: () => {}
});

/**
 * Hook thats gets the session
 */
export const useAuthenticate = () => useContext(AuthContext);

/**
 * Hook thats generates the parent component to 
 */
export const useProviderAuthenticate = () => {
    const keyProvideAuthenticate = '/api/authenticate/login';
    const swrConfig = useSWRConfig();

    const { data, error, mutate, isValidating } = useSWR<ISession | undefined, IResponseError>(keyProvideAuthenticate, async () => await loadSession(), {
        onErrorRetry(err, _key, _config, revalidate, { retryCount }) {
            if( ['UNAUTHORIZED','SESSION_EXPIRED', 'SESSION_CLOSED'].indexOf(err.name) !== -1 ) {
                clearLocals();
                mutate(undefined);
                return;    
            }

            //Try only 10 times
            if( retryCount > 10 ) return;

            //Retry after 5 secondsq
            setTimeout(() => revalidate({ retryCount }), 5000);
        },
    });

    return {
        session: data,
        isLoadingSession: (!error && !data) || isValidating,
        sessionError: error,
        reload: async (): Promise<void> => swrConfig.mutate(keyProvideAuthenticate),
    }
};

/**
 * Provider 
 */
const ProvideAuthenticate = (props: any): JSX.Element => {
    const { 
        session, 
        isLoadingSession,
        sessionError,
        reload
    } = useProviderAuthenticate();
    const [modal, setModal] = useState<IDialogProps>({
        title: 'Atenção',
        message: '',
        type: 'info',
        button_text: 'OK'
    });

    let isUserAuthenticated = false;

    if( 
        (
            !isLoadingSession && 
            session &&
            !sessionError
        ) ||
        (
            !isLoadingSession && 
            sessionError &&
            ['UNAUTHORIZED','SESSION_EXPIRED','SESSION_CLOSED'].indexOf(sessionError.name) === -1 &&
            sessionError.name !== 'NOT_AUTHENTICATED'
        ) 
    ) {
        isUserAuthenticated = true;
    }

    return (
        <AuthContext.Provider 
            value={
                {
                    session: session || null,
                    isLoadingSession: isLoadingSession,
                    is_logged_in: isUserAuthenticated,
                    sessionError: sessionError || null,
                    reload: () => reload(),
                    showDialog: (props: IDialogProps) => setModal(props)
                }
            }
        >
            <Dialog 
                onHide={() => setModal({ 
                    ...modal,
                    message: '' 
                })}
                modal
                draggable
                header={modal.title}
                visible={!isEmpty(modal.message)}
                style={{
                    maxWidth: '520px',
                }}
                footer={
                    <div className="flex justify-content-end">
                        <Button 
                            label={modal.button_text || 'OK'}
                            icon={modal.icon}
                            className={classNames({
                                'p-button-danger': modal.type === 'error',
                                'p-button-warning': modal.type === 'warning',
                                'p-button-success': modal.type === 'success',
                                'p-button-primary': modal.type === 'info',
                            })}
                            onClick={() => {
                                setModal({ 
                                    ...modal, 
                                    message: '' 
                                });

                                if( typeof modal.callback === 'function' ) {
                                    modal.callback();
                                }
                            }}
                        />
                    </div>
                }
            >
                <p className="m-0 p-2">{modal.message}</p>
            </Dialog>
            {props.children}
        </AuthContext.Provider>
    )
};
export default ProvideAuthenticate;