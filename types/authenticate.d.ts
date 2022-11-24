import { IResponseError } from "./response";
export interface IUser {
    id: number;
    username: string;
    email?: string;
    admin: boolean;
}
export interface ISession {
    user: IUser | null; 
    public_token: string;
    private_token: string;
    expires_at: Date;
    id: number;
}
export interface IAuthenticateProviderProps {
    session: ISession | null;
    isLoadingSession: boolean;
    is_logged_in: boolean;
    sessionError: IResponseError | null;
    showDialog: Function;
    reload: Function;
}
export interface IDialogProps {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    icon?: string | null;
    button_text?: string | null;
    callback?: Function | null;
}
export interface ILoginPaylod {
    username: string;
    password: string;
}