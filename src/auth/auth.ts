import { VerificationTokenType } from '../constants';
import { HttpService } from '../http';

/**
 * Class containing authorization related methods.
 * @public
 */
export class AuthService extends HttpService {
  constructor( baseURL: string ) {
    super( baseURL );
  }

  /**
   * Submits user credentials to the endpoint `/signin`.
   *
   * @param fields - Key/Value object for validating user.
   * @param strategy - PlusAuth strategy to check user. Make sure you have created this strategy
   * in your tenant.
   *
   * @example
   * Here is a simple usage.
   * ```js
   *  auth.signIn( { username: "johndoe@example.com", password: "mypassword" } )
   * ```
   *
   * @example
   * With different strategy.
   * ```js
   *  auth.signIn( { username: "johndoe@example.com", password: "mypassword" }, "myLdapStrategy" )
   * ```
   */
  public signIn( fields: { [key: string]: any }, strategy?: string ): Promise<any> {
    return this.http.post( '/signin', { ...fields, strategy } );
  }

  /**
   * Posts a request for registering a user.
   *
   * @param fields - Key/Value object containing user information.
   * @param strategy - PlusAuth strategy to create the user for. Make sure you have created this
   * strategy in your tenant.
   *
   * @example
   * Here is a simple usage.
   * ```
   *  auth.signUp( { username: "johndoe@example.com", password: "mypassword" } )
   * ```
   *
   * @example
   * With phone number.
   * ```
   *  auth.signUp( { username: "johndoe@example.com", password: "mypassword", phone_number: '+11231212123' } )
   * ```
   *
   * @example
   * With different strategy.
   * ```js
   *  auth.signUp( { username: "johndoe@example.com", password: "mypassword" }, "myLdapStrategy" )
   * ```
   */
  public signUp( fields: { [key: string]: any }, strategy?: string ): Promise<any> {
    return this.http.post( '/signup', { ...fields, strategy } );
  }

  public updateMissingInformation( fields: { [key: string]: any } ): Promise<any> {
    return this.http.post( '/updateMissingInformation', fields );
  }

  public requestResetPassword( email: string ): Promise<any> {
    return this.http.post( '/forgotPassword', {
      email,
    } );
  }

  public resetPassword( password: string, hash: string ): Promise<any> {
    return this.http.post( `/resetPassword/${ hash }`, {
      password,
    } );
  }

  public verifyCode( code: string, type?: VerificationTokenType, token?: string ): Promise<any> {
    return this.http.post( `verify/${ token }`, {
      type,
      code,
    } );
  }

  public acceptConsent(): Promise<any> {
    return this.http.post( '/signin/consent/confirm' );
  }

  public rejectConsent(): Promise<any> {
    return this.http.get( '/signin/consent/reject' );
  }

  public checkPasswordStrength( value: string, passwordRules: any ): any {
    if ( !value ) {
      return passwordRules ? { min: true } : { score: 0 };
    }

    const errors: any = {};
    // eslint-disable-next-line prefer-const
    let { min, max, number, lowerCase, upperCase, customChars, customRegexp } = passwordRules;

    lowerCase = Number( lowerCase );
    upperCase = Number( upperCase );
    number = Number( number );
    if (
      lowerCase &&
      !new RegExp( `(?=(.*[a-z])${ lowerCase > 0 ? `{${ lowerCase },}` : '' })` ).test( value )
    ) {
      errors.lowerCase = true;
    }
    if (
      upperCase &&
      !new RegExp(
        `(?=(.*[A-Z])${ upperCase > 0 ? `{${ upperCase },}` : '' })`
      ).test( value )
    ) {
      errors.upperCase = true;
    }
    if (
      number &&
      !new RegExp(
        `(?=(.*[0-9])${ number > 0 ? `{${ number },}` : '' })`
      ).test( value )
    ) {
      errors.number = true;
    }
    if ( min != null && value.length < min ) {
      errors.min = true;
    }
    if ( max != null && value.length > max ) {
      errors.max = true;
    }
    if ( customChars &&
      !customChars.split( '' ).some( ( char: string ) => value.indexOf( char ) > -1 )
    ) {
      errors.customChars = true;
    }

    if ( customRegexp && customRegexp.value ) {
      if ( !new RegExp( customRegexp ).test( customRegexp.value ) ) {
        return customRegexp.message || ' ';
      }
    }

    return Object.keys( errors ).length > 0 ? errors : true;
  }
}
