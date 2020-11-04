import { MFACodeType } from '../constants/mfa_code_type';
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
   * mfa.validateCode('123456', 'sms').catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   * ```
   *
   * @example
   * Validate Email code.
   * ```js
   * mfa.validateCode('123456', 'email').catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   * ```
   *
   * @example
   * Validate OTP code.
   * ```js
   * mfa.validateCode('123456', 'otp').catch( function(err){
   *   console.error('Code is not valid', err)
   * })
   * ```
   */
  public async validateCode( code: string, codeType: MFACodeType ): Promise<any> {
    return this.http.post( `/signin/challenge/${ codeType }`, {
      code
    } );
  }
}
