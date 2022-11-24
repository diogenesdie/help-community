
import {
    createHash,
    createHmac,
    createDecipheriv,
    createCipheriv,
    randomBytes
} from 'crypto' 

/**
 * Encrypts a string using sha256
 * @param {string} text - The string to encrypt
 * 
 * @returns {string} The encrypted string
 */
export function encrypt(text: string): string {
    if( !text ){
        throw 'No text to encrypt';
    }

    const hash = createHash('sha256');
    hash.update(text);

    return hash.digest('hex');
}

/**
 * Decrypts a string using AES-256-CBC
 * @param {string} text - The string to decrypt
 * 
 * @returns {string} - The decrypted string
 * 
 */
export function decrypt(text: string): string {
    if( !text ){
        throw 'No text to decrypt';
    }

    if( !process.env.SALT_KEY ){
        throw 'No salt key defined';
    }

    if( !process.env.IV ){
        throw 'No IV defined';
    }

    const cipher = createCipheriv('aes-256-cbc', Buffer.from(decodeURIComponent(process.env.SALT_KEY), 'utf-8'), process.env.IV);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('utf-8');

}


/**
 * Generate a random token and returns as hex string
 * 
 * @param size Size of the token, default is 32
 * @returns Hex string
 */
export const generateToken = (size: number = 32): string => randomBytes(size).toString('hex');