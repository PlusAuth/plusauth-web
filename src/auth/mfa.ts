import { MFACodeType } from '../constants';
import { HttpService } from '../http';

/**
 * Class containing Multi Factor Authorization related methods.
 * @public
 */
export class MFAService extends HttpService {
  /**
   * @internal
   */
  constructor( baseURL: string ) {
    super( baseURL );
  }

  /**
   * Submit user provided code for validation.
   *
   * @param code - User provided code
   * @param codeType - Method of MFA
   *
   * @example
   * Validate SMS code.
   * ```js
   * mfa.validateCode('123456', MFACodeType.SMS).catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   * ```
   *
   * @example
   * Validate Email code.
   * ```js
   * mfa.validateCode('123456', MFACodeType.EMAIL).catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   * ```
   *
   * @example
   * Validate OTP code.
   * ```js
   * mfa.validateCode('123456', MFACodeType.OTP).catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   *```
   *
   * @example
   * Register WebAuthN device.
   * ```js
   * PlusAuthWeb.registerDevice(window.PlusAuth.details.registration_options)
   * .then(function(deviceRegistrationResult){
   *    mfa.validateCode(deviceRegistrationResult, MFACodeType.WEBAUTHN).catch( function(err){
   *      console.error('Registration failed', err)
   *    })
   * })
   *```
   *
   * @example
   * Verify WebAuthN device.
   * ```js
   * PlusAuthWeb.verify_device(window.PlusAuth.details.authentication_options)
   * .then(function(deviceVerificationResult){
   *    mfa.validateCode(deviceVerificationResult, MFACodeType.WEBAUTHN).catch( function(err){
   *      console.error('Verification failed', err)
   *    })
   * })
   * ```
   */
  public async validateCode(
    code: Record<string, any>,
    codeType: MFACodeType.WEBAUTHN
  ): Promise<any>;

  public async validateCode(
    code: string,
    codeType: Exclude<MFACodeType, MFACodeType.WEBAUTHN>
  ): Promise<any>;

  public async validateCode(
    code: string | Record<string, any>,
    codeType: MFACodeType
  ): Promise<any> {
    return this.http.post( `/signin/challenge/${ codeType }`, {
      code
    } );
  }
}
