import { detect } from 'detect-browser';
import {get,set,clear} from 'local-storage';
import { ISession } from '@/types/authenticate';

/**
 * Returns the browser name
 * 
 * @returns Browser name
 */
export const getBrowserName = (): string => {
    const browser = detect();

    const mountName = browser?.name ? `${browser.name} - ${(browser.version || 'No version')}` : 'Unknown';

    return mountName;
};

/**
 * Returns the OS name
 * 
 * @returns OS name 
 */
export const getOS = (): string => {
    const navegador = detect();
    return navegador?.os || '';
};

/**
 * Save session in cookie
 * 
 * @param session Session data
 */
export const setLocals = (session: ISession): void => {
    set<ISession>('session', session);
};

/**
 * Return session data
 * 
 * @returns Local session data
 */
export const getLocals = (): ISession => {
    return get<ISession>('session');
};

/**
 * Limpa os dados da sessão local
 */
export const clearLocals = (): void => clear();