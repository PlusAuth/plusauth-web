/**
 * @packageDocumentation
 */

import { AuthService } from './auth/auth';
import { MFAService } from './auth/mfa';

export * from './http'
export * from './auth'
export * from './constants'

/**
 * Main class for initializing the library.
 *
 * @example
 *
 * ```js
 * const pa = new PlusAuthWeb("https://mytenant.plusauth.com")
 *
 * // access auth methods from `auth` property
 * pa.auth.signIn({ username: ..., password: ...})
 *
 * // access MFA methods from `mfa` property
 * pa.mfa.validateCode('code', 'sms')
 * ```
 *
 * @public
 */
export default class PlusAuthWeb {
  /**
   * See {@link AuthService }
   * @readonly
   */
  readonly auth: AuthService;

  /**
   * See {@link MFAService }
   * @readonly
   */
  readonly mfa: MFAService;

  /**
   * @param apiURL - Your PlusAuth tenant url. It must be a valid url.
   */
  constructor( apiURL: string ) {
    try {
      apiURL === '/' || new URL( apiURL )
    } catch ( e ) {
      throw new Error( '"apiURL" must be a valid URL' )
    }
    this.auth = new AuthService( apiURL )
    this.mfa = new MFAService( apiURL )
  }
}

