import { ILoginPaylod } from "@/types/authenticate"
import { validateLogin } from "@/data/authenticate/validation"

export const doLogin = async (data: ILoginPaylod) => {
    data = validateLogin(data);

    
}

export const doLogout = async () => {

}