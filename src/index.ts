/**
 * @packageDocumentation
 * PlusAuth helper utility intended to use in client side environments.
 */

import { AuthService, MFAService } from './auth';

export * from './auth'
export * from './constants'
export * from './http'

/**
 * Main class for initializing the library.
 *
 * @example
 *
 * ```js
 * const pa = new PlusAuthWeb("https://mytenant.plusauth.com")
 * ```
 *
 *
 * @public
 */
export default class PlusAuthWeb {
  /**
   * @readonly
   */
  readonly auth: AuthService;

  /**
   * @readonly
   */
  readonly mfa: MFAService;

  /**
   * @param apiURL - Your PlusAuth tenant url. It must be a valid url.
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

