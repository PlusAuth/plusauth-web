import { HttpService } from '../http';

/**
 * Class containing authorization related methods.
 * @public
 */
export class AuthService extends HttpService {
  /**
   * @internal
   */
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

  /**
   * In some cases user may need to enter additional information for their profile. For example
   * applications may force users to enter their phone number. `Fill Missing` view in PlusAuth
   * uses this method to post the form.
   *
   * @param fields - Key/Value object containing user information
   *
   * @example
   * ```js
   * auth.updateMissingInformation({ phone_number: '+1222334455'})
   * ```
   */
  public updateMissingInformation( fields: { [key: string]: any } ): Promise<any> {
    return this.http.post( '/updateMissingInformation', fields );
  }

  /**
   * Request password reset email. `Forgot Password` view in PlusAuth uses this method to post
   * the form.
   *
   * @param email - Email of user requesting password reset.
   *
   * @example
   * ```js
   * auth.requestResetPassword('john@doe.com')
   * ```
   */
  public requestResetPassword( email: string ): Promise<any> {
    return this.http.post( '/forgotPassword', {
      email,
    } );
  }

  /**
   * After clicking the reset password email, users will be delivered on a page which will
   * request their new password. Use this method to post their new password and token from the
   * url. If `Auto SignIn` is enabled in `Settings > Login` user will be redirected to `Tenant Login URL` automatically. `Reset Password` view in PlusAuth uses this method to submit the form.
   *
   * @param password - New password of user
   * @param hash - Received token in the url
   *
   * @example
   * ```js
   * const pathParts = location.pathname.split('/')
   * const token = pathParts[pathParts.length - 1];
   *
   * auth.resetPassword('NEW_PASSWORD', token).then(function(){
   *   console.log('Password reset successfully')
   * })
   * ```
   */
  public resetPassword( password: string, hash: string ): Promise<any> {
    return this.http.post( `/resetPassword/${ hash }`, {
      password,
    } );
  }


  /**
   * Allow applications to access displayed user information. When third-party applications
   * request to access user information they need the consent of the end user. This method will
   * allow the 3rd party application to receive the information. `Allow` button in `Consent`
   * view uses this method.
   *
   * @example
   * ```js
   * auth.acceptConsent()
   * ```
   */
  public acceptConsent(): Promise<any> {
    return this.http.post( '/signin/consent/confirm' );
  }


  /**
   * Forbid applications to access displayed user information. When third-party applications
   * request to access user information they need the consent of the end user. This method will
   * reject the 3rd party application's request to receive the information. `Reject` button in
   * `Consent` view uses this method.
   *
   * @example
   * ```js
   * auth.rejectConsent()
   * ```
   */
  public rejectConsent(): Promise<any> {
    return this.http.get( '/signin/consent/reject' );
  }

  /**
   * Helper method for checking password strength for rules defined in PlusAuth. This method
   * would be useful in SignUp and ResetPassword views.
   *
   * @param value - Password to check
   * @param passwordRules - Object containing password rules
   *
   * @example
   * ```js
   * const password = '123'
   * const passwordRules = window.PlusAuth.passwordPolicy
   *
   * const passwordStrength = auth.checkPasswordStrength(password, passwordRules)
   *
   * if( passwordStrength === true ){
   *   console.log('password is strong enough')
   * } else {
   *   console.log('Password is not strong enough', passwordStrength)
   * }
   * ```
   */
  public checkPasswordStrength( value: string, passwordRules: any = {} ): any {
    value = value ?? '';
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
