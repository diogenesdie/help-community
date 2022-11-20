import { IResponseError } from "./response";
export interface IUser {
    id: number;
    username: string;
    email: string;
    admin: boolean;
}
export interface ISession {
    user: IUser;
    is_loading: boolean;
    reload: Function;
    error: IResponseError | null;
    public_token: string;
    private_token: string;
    expires_at: Date;
}
export interface IAuthenticateProviderProps {
    session: ISession | null;
    is_loading: boolean;
    is_logged_in: boolean;
    error: IResponseError | null;
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