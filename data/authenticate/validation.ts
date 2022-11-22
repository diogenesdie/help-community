import { ILoginPaylod } from "@/types/authenticate";
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