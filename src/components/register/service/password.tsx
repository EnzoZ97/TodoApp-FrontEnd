import { SHA256 } from 'crypto-js';

export const getPassword  = ( password : string ) : string => {
    const password_crypto : string =  SHA256(password).toString();
    return password_crypto;
}