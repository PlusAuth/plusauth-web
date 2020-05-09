import {AuthService, MFAService} from "./auth";

/**
 * Main class for initializing the library.
 *
 * @example
 *
 * ```js
 * const pa = new PlusAuthWeb("https://mytenant.plusauth.com")
 * ```
 */
export default class PlusAuthWeb {
    auth: AuthService;
    mfa: MFAService;

    /**
     * @param apiURL Your PlusAuthWeb tenant url. It must be a valid url.
     */
    constructor(apiURL: string) {
        try{
            new URL(apiURL)
        }catch (e) {
            throw new Error('"apiURL" must be a valid URL')
        }
        this.auth = new AuthService(apiURL)
        this.mfa = new MFAService(apiURL)
    }
}

export * from './constants'
