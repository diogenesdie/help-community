/**
 * Verify if string is empty
 * 
 * @param str String to be verified
 * 
 * @returns True if string is empty
 */
export const isEmpty = (str: string): boolean => {
    if( 
        !str ||
        typeof str !== 'string' ||
        typeof str === 'number' ||
        typeof str === 'boolean'
    ) {
        return true;
    }

    if( Array.isArray(str) && str.length === 0 ) {
        return true;
    }

    return str.trim() === '';
}