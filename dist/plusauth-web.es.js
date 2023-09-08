function P(e) {
  return new TextEncoder().encode(e);
}
function d(e) {
  const t = new Uint8Array(e);
  let n = "";
  for (const s of t)
    n += String.fromCharCode(s);
  return btoa(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function w(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), n = (4 - t.length % 4) % 4, r = t.padEnd(t.length + n, "="), s = atob(r), a = new ArrayBuffer(s.length), i = new Uint8Array(a);
  for (let o = 0; o < s.length; o++)
    i[o] = s.charCodeAt(o);
  return a;
}
function b() {
  return (window == null ? void 0 : window.PublicKeyCredential) !== void 0 && typeof window.PublicKeyCredential == "function";
}
function E(e) {
  const { id: t } = e;
  return {
    ...e,
    id: w(t),
    transports: e.transports
  };
}
function m(e) {
  return e === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
}
class c extends Error {
  constructor({ message: t, code: n, cause: r, name: s }) {
    super(t, { cause: r }), this.name = s ?? r.name, this.code = n;
  }
}
function I({ error: e, options: t }) {
  var r, s;
  const { publicKey: n } = t;
  if (!n)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal instanceof AbortSignal)
      return new c({
        message: "Registration ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: e
      });
  } else if (e.name === "ConstraintError") {
    if (((r = n.authenticatorSelection) == null ? void 0 : r.requireResidentKey) === !0)
      return new c({
        message: "Discoverable credentials were required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
        cause: e
      });
    if (((s = n.authenticatorSelection) == null ? void 0 : s.userVerification) === "required")
      return new c({
        message: "User verification was required but no available authenticator supported it",
        code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
        cause: e
      });
  } else {
    if (e.name === "InvalidStateError")
      return new c({
        message: "The authenticator was previously registered",
        code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
        cause: e
      });
    if (e.name === "NotAllowedError")
      return new c({
        message: e.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: e
      });
    if (e.name === "NotSupportedError")
      return n.pubKeyCredParams.filter((i) => i.type === "public-key").length === 0 ? new c({
        message: 'No entry in pubKeyCredParams was of type "public-key"',
        code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
        cause: e
      }) : new c({
        message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
        code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
        cause: e
      });
    if (e.name === "SecurityError") {
      const a = window.location.hostname;
      if (m(a)) {
        if (n.rp.id !== a)
          return new c({
            message: `The RP ID "${n.rp.id}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: e
          });
      } else
        return new c({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: e
        });
    } else if (e.name === "TypeError") {
      if (n.user.id.byteLength < 1 || n.user.id.byteLength > 64)
        return new c({
          message: "User ID was not between 1 and 64 characters",
          code: "ERROR_INVALID_USER_ID_LENGTH",
          cause: e
        });
    } else if (e.name === "UnknownError")
      return new c({
        message: "The authenticator was unable to process the specified options, or could not create a new credential",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: e
      });
  }
  return e;
}
class S {
  createNewAbortSignal() {
    if (this.controller) {
      const n = new Error("Cancelling existing WebAuthn API call for new one");
      n.name = "AbortError", this.controller.abort(n);
    }
    const t = new AbortController();
    return this.controller = t, t.signal;
  }
}
const A = new S(), C = ["cross-platform", "platform"];
function y(e) {
  if (e && !(C.indexOf(e) < 0))
    return e;
}
async function v(e) {
  var g;
  if (!b())
    throw new Error("WebAuthn is not supported in this browser");
  const n = { publicKey: {
    ...e,
    challenge: w(e.challenge),
    user: {
      ...e.user,
      id: P(e.user.id)
    },
    excludeCredentials: (g = e.excludeCredentials) == null ? void 0 : g.map(E)
  } };
  n.signal = A.createNewAbortSignal();
  let r;
  try {
    r = await navigator.credentials.create(n);
  } catch (p) {
    throw I({ error: p, options: n });
  }
  if (!r)
    throw new Error("Registration was not completed");
  const { id: s, rawId: a, response: i, type: o } = r;
  let u;
  typeof i.getTransports == "function" && (u = i.getTransports());
  let f;
  typeof i.getPublicKeyAlgorithm == "function" && (f = i.getPublicKeyAlgorithm());
  let l;
  if (typeof i.getPublicKey == "function") {
    const p = i.getPublicKey();
    p !== null && (l = d(p));
  }
  let h;
  return typeof i.getAuthenticatorData == "function" && (h = d(i.getAuthenticatorData())), {
    id: s,
    rawId: d(a),
    response: {
      attestationObject: d(i.attestationObject),
      clientDataJSON: d(i.clientDataJSON),
      transports: u,
      publicKeyAlgorithm: f,
      publicKey: l,
      authenticatorData: h
    },
    type: o,
    clientExtensionResults: r.getClientExtensionResults(),
    authenticatorAttachment: y(r.authenticatorAttachment)
  };
}
function T(e) {
  return new TextDecoder("utf-8").decode(e);
}
function O() {
  const e = window.PublicKeyCredential;
  return e.isConditionalMediationAvailable === void 0 ? new Promise((t) => t(!1)) : e.isConditionalMediationAvailable();
}
function D({ error: e, options: t }) {
  const { publicKey: n } = t;
  if (!n)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal instanceof AbortSignal)
      return new c({
        message: "Authentication ceremony was sent an abort signal",
        code: "ERROR_CEREMONY_ABORTED",
        cause: e
      });
  } else {
    if (e.name === "NotAllowedError")
      return new c({
        message: e.message,
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: e
      });
    if (e.name === "SecurityError") {
      const r = window.location.hostname;
      if (m(r)) {
        if (n.rpId !== r)
          return new c({
            message: `The RP ID "${n.rpId}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: e
          });
      } else
        return new c({
          message: `${window.location.hostname} is an invalid domain`,
          code: "ERROR_INVALID_DOMAIN",
          cause: e
        });
    } else if (e.name === "UnknownError")
      return new c({
        message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
        code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
        cause: e
      });
  }
  return e;
}
async function x(e, t = !1) {
  var h, g;
  if (!b())
    throw new Error("WebAuthn is not supported in this browser");
  let n;
  ((h = e.allowCredentials) == null ? void 0 : h.length) !== 0 && (n = (g = e.allowCredentials) == null ? void 0 : g.map(E));
  const r = {
    ...e,
    challenge: w(e.challenge),
    allowCredentials: n
  }, s = {};
  if (t) {
    if (!await O())
      throw Error("Browser does not support WebAuthn autofill");
    if (document.querySelectorAll("input[autocomplete*='webauthn']").length < 1)
      throw Error('No <input> with `"webauthn"` in its `autocomplete` attribute was detected');
    s.mediation = "conditional", r.allowCredentials = [];
  }
  s.publicKey = r, s.signal = A.createNewAbortSignal();
  let a;
  try {
    a = await navigator.credentials.get(s);
  } catch (p) {
    throw D({ error: p, options: s });
  }
  if (!a)
    throw new Error("Authentication was not completed");
  const { id: i, rawId: o, response: u, type: f } = a;
  let l;
  return u.userHandle && (l = T(u.userHandle)), {
    id: i,
    rawId: d(o),
    response: {
      authenticatorData: d(u.authenticatorData),
      clientDataJSON: d(u.clientDataJSON),
      signature: d(u.signature),
      userHandle: l
    },
    type: f,
    clientExtensionResults: a.getClientExtensionResults(),
    authenticatorAttachment: y(a.authenticatorAttachment)
  };
}
function L() {
  return b() ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() : new Promise((e) => e(!1));
}
function R(e, t) {
  return new Promise(function(n, r) {
    fetch(e, t).then((s) => {
      const a = s.headers.get("content-type");
      if (s.redirected && a && a.includes("html"))
        return window.location.assign(s.url), !1;
      let i = null;
      s.text().then((o) => {
        if (a && a.includes("json") ? i = Object.assign(JSON.parse(o), { _raw: s }) : i = { data: o, _raw: s }, s.ok)
          n(i);
        else {
          if (s.status === 400 && i.error === "xhr_request" && i.location)
            return window.location.replace(i.location), !1;
          r(i);
        }
      });
    }).catch(r);
  });
}
class _ {
  constructor(t, n) {
    const r = {};
    ["get", "post", "patch", "delete"].forEach((s) => {
      r[s] = function(...a) {
        const i = Object.assign({
          method: s,
          credentials: "include",
          mode: "cors"
        }, n || {});
        return i.headers = Object.assign({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }, i.headers || {}), s !== "get" && (i.body = JSON.stringify(a[1])), typeof a[0] != "string" ? R.call(null, t, i) : R.call(null, t + a[0], i);
      };
    }), this.http = r;
  }
}
class N extends _ {
  /**
   * @internal
   */
  constructor(t) {
    super(t);
  }
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
  signIn(t, n) {
    return this.http.post("/signin", { ...t, connection: n });
  }
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
  signInPasswordless(t, n) {
    return this.http.post(`/signin/passwordless/${t}`, n);
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
  signUp(t, n) {
    return this.http.post("/signup", { ...t, strategy: n });
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
  updateMissingInformation(t) {
    return this.http.post("/account/updateMissingInformation", t);
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
  requestResetPassword(t) {
    return this.http.post("/account/forgotPassword", {
      email: t
    });
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
  resetPassword(t, n) {
    return this.http.post(`/account/resetPassword/${n}`, {
      password: t
    });
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
  acceptConsent() {
    return this.http.post("/signin/consent/confirm");
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
  rejectConsent() {
    return this.http.get("/signin/consent/reject");
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
  checkPasswordStrength(t, n = {}) {
    t = t ?? "";
    const r = {};
    let { min: s, max: a, number: i, lowerCase: o, upperCase: u, customChars: f, customRegexp: l } = n;
    return o = Number(o), u = Number(u), i = Number(i), o && !new RegExp(`(?=(.*[a-z])${o > 0 ? `{${o},}` : ""})`).test(t) && (r.lowerCase = !0), u && !new RegExp(
      `(?=(.*[A-Z])${u > 0 ? `{${u},}` : ""})`
    ).test(t) && (r.upperCase = !0), i && !new RegExp(
      `(?=(.*[0-9])${i > 0 ? `{${i},}` : ""})`
    ).test(t) && (r.number = !0), s != null && t.length < s && (r.min = !0), a != null && t.length > a && (r.max = !0), f && !f.split("").some((h) => t.indexOf(h) > -1) && (r.customChars = !0), l && l.value && !new RegExp(l).test(l.value) ? l.message || " " : Object.keys(r).length > 0 ? r : !0;
  }
}
class K extends _ {
  /**
   * @internal
   */
  constructor(t) {
    super(t);
  }
  async validateCode(t, n) {
    return this.http.post(`/signin/challenge/${t}`, {
      code: n
    });
  }
}
var U = /* @__PURE__ */ ((e) => (e.SMS = "sms", e.EMAIL = "email", e.SMARTCARD = "sc", e.WEBAUTHN = "webauthn", e.FINGER_VEIN = "fv", e.OTP = "otp", e))(U || {});
class H {
  /**
   * @param apiURL - Your PlusAuth tenant url. It must be a valid url.
   */
  constructor(t) {
    try {
      t === "/" || new URL(t);
    } catch {
      throw new Error('"apiURL" must be a valid URL');
    }
    this.auth = new N(t), this.mfa = new K(t);
  }
}
export {
  N as AuthService,
  _ as HttpService,
  U as MFACodeType,
  K as MFAService,
  H as PlusAuthWeb,
  L as isPlatformAuthenticatorAvailable,
  O as isWebAuthNAutofillSupported,
  b as isWebAuthNSupported,
  v as registerDevice,
  x as verifyDevice
};
//# sourceMappingURL=plusauth-web.es.js.map
