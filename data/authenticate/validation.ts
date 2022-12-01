import { ILoginPaylod, IRegisterPayload } from "@/types/authenticate";
import { IErrorField } from "@/types/response";  

export const validateLogin = (data: ILoginPaylod) => {
    const errors: IErrorField[] = [];

    if( !data.username ) {
        errors.push({
            field: 'username',
            message: 'Username is required'
        });
    }

    if( !data.password ) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }

    if( errors.length > 0 ) {
        throw errors;
    }

    return data;
}

export const validateRegister = (data: IRegisterPayload) => {
    const errors: IErrorField[] = [];

    if( !data.username ) {
        errors.push({
            field: 'username',
            message: 'Username is required'
        });
    }

    if( !data.password ) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }

    if( !data.confirm_password ) {
        errors.push({
            field: 'confirm_password',
            message: 'Confirm password is required'
        });
    }

    if( data.password !== data.confirm_password ) {
        errors.push({
            field: 'confirm_password',
            message: 'Password and confirm password must be the same'
        });
    }

    if( errors.length > 0 ) {
        throw errors;
    }

    return data;
}