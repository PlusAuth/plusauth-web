/**
 * @packageDocumentation
 * @module Constants
 */

/**
 * Code types to be used in Multi-Factor Authentication
 *
 * @public
 */
export enum MFACodeType {
  SMS = 'sms',
  EMAIL = 'email',
  SMARTCARD = 'sc',
  WEBAUTHN = 'webauthn',
  FINGER_VEIN = 'fv',
  OTP = 'otp'
}
