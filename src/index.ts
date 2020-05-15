import { AuthService, MFAService } from './auth';

export * from './constants'

/**
 * Main class for initializing the library.
 *
 * @example
 *
 * ```js
 * const pa = new PlusAuthWeb("https://mytenant.plusauth.com")
 * ```
 *
 * @packageDefinition
 */
export default class PlusAuthWeb {
  auth: AuthService;

  mfa: MFAService;

  /**
     * @param apiURL Your PlusAuthWeb tenant url. It must be a valid url.
     */
  constructor( apiURL: string ) {
    try {
      new URL( apiURL )
    } catch ( e ) {
      throw new Error( '"apiURL" must be a valid URL' )
    }
    this.auth = new AuthService( apiURL )
    this.mfa = new MFAService( apiURL )
  }
}

