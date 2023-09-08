/**
 * @packageDocumentation
 */

import { platformAuthenticatorIsAvailable as isPlatformAuthenticatorAvailable } from '@simplewebauthn/browser';
import { browserSupportsWebAuthnAutofill as isWebAuthNAutofillSupported } from '@simplewebauthn/browser';
import { browserSupportsWebAuthn as isWebAuthNSupported } from '@simplewebauthn/browser';
import { startRegistration as registerDevice } from '@simplewebauthn/browser';
import { startAuthentication as verifyDevice } from '@simplewebauthn/browser';

/**
 * Class containing authorization related methods.
 * @public
 */
export declare class AuthService extends HttpService {
    /**
     * @internal
     */
    constructor(baseURL: string);
    /**
     * Submits user credentials to the endpoint `/signin`.
     *
     * @param fields - Key/Value object for validating user.
     * @param connection - PlusAuth strategy to check user. Make sure you have created this strategy
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
    signIn(fields: {
        [key: string]: any;
    }, connection?: string): Promise<any>;
    /**
     * Submits user credentials to the endpoint `/signin`.
     *
     * @param method - Passwordless method. For ex. email or sms
     * @param fields - Key/Value object for validating user.
     * in your tenant.
     *
     * @example
     * Sign in with email passwordless strategy
     * ```js
     *  auth.signInPasswordless( 'email', { code: "123456" } )
     * ```
     */
    signInPasswordless(method: string | 'sms' | 'email' | 'otp', fields: {
        [key: string]: any;
    }): Promise<any>;
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
    signUp(fields: {
        [key: string]: any;
    }, strategy?: string): Promise<any>;
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
    updateMissingInformation(fields: {
        [key: string]: any;
    }): Promise<any>;
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
    requestResetPassword(email: string): Promise<any>;
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
    resetPassword(password: string, hash: string): Promise<any>;
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
    acceptConsent(): Promise<any>;
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
    rejectConsent(): Promise<any>;
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
    checkPasswordStrength(value: string, passwordRules?: any): any;
}

/**
 * Helper service for posting requests. It is intended to be used internally.
 * @public
 */
export declare class HttpService {
    /**
     * @internal
     */
    http: any;
    ['constructor']: typeof HttpService;
    constructor(apiURL: string, options?: Partial<RequestInit>);
}

export { isPlatformAuthenticatorAvailable }

export { isWebAuthNAutofillSupported }

export { isWebAuthNSupported }

/**
 * Code types to be used in Multi-Factor Authentication
 *
 * @public
 */
export declare enum MFACodeType {
    SMS = "sms",
    EMAIL = "email",
    SMARTCARD = "sc",
    WEBAUTHN = "webauthn",
    FINGER_VEIN = "fv",
    OTP = "otp"
}

/**
 * Class containing Multi Factor Authorization related methods.
 * @public
 */
export declare class MFAService extends HttpService {
    /**
     * @internal
     */
    constructor(baseURL: string);
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
    validateCode(codeType: MFACodeType.WEBAUTHN, code: Record<string, any>): Promise<any>;
    validateCode(codeType: Exclude<MFACodeType, MFACodeType.WEBAUTHN>, code: string): Promise<any>;
}

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
export declare class PlusAuthWeb {
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
    constructor(apiURL: string);
}

export { registerDevice }

export { verifyDevice }

export { }
