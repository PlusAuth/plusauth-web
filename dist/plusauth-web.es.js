var S = Object.defineProperty;
var P = (e, t, r) => t in e ? S(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var f = (e, t, r) => (P(e, typeof t != "symbol" ? t + "" : t, r), r);
function x(e) {
  return new TextEncoder().encode(e);
}
function d(e) {
  const t = new Uint8Array(e);
  let r = "";
  for (const i of t)
    r += String.fromCharCode(i);
  return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function w(e) {
  const t = e.replace(/-/g, "+").replace(/_/g, "/"), r = (4 - t.length % 4) % 4, n = t.padEnd(t.length + r, "="), i = atob(n), a = new ArrayBuffer(i.length), o = new Uint8Array(a);
  for (let s = 0; s < i.length; s++)
    o[s] = i.charCodeAt(s);
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
function A(e) {
  return e === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
}
class l extends Error {
  constructor(t, r = "WebAuthnError") {
    super(t), this.name = r;
  }
}
function N({ error: e, options: t }) {
  var r, n;
  const { publicKey: i } = t;
  if (!i)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal === new AbortController().signal)
      return new l("Registration ceremony was sent an abort signal", "AbortError");
  } else if (e.name === "ConstraintError") {
    if (((r = i.authenticatorSelection) === null || r === void 0 ? void 0 : r.requireResidentKey) === !0)
      return new l("Discoverable credentials were required but no available authenticator supported it", "ConstraintError");
    if (((n = i.authenticatorSelection) === null || n === void 0 ? void 0 : n.userVerification) === "required")
      return new l("User verification was required but no available authenticator supported it", "ConstraintError");
  } else {
    if (e.name === "InvalidStateError")
      return new l("The authenticator was previously registered", "InvalidStateError");
    if (e.name === "NotAllowedError")
      return new l("User clicked cancel, or the registration ceremony timed out", "NotAllowedError");
    if (e.name === "NotSupportedError")
      return i.pubKeyCredParams.filter((o) => o.type === "public-key").length === 0 ? new l('No entry in pubKeyCredParams was of type "public-key"', "NotSupportedError") : new l("No available authenticator supported any of the specified pubKeyCredParams algorithms", "NotSupportedError");
    if (e.name === "SecurityError") {
      const a = window.location.hostname;
      if (A(a)) {
        if (i.rp.id !== a)
          return new l(`The RP ID "${i.rp.id}" is invalid for this domain`, "SecurityError");
      } else
        return new l(`${window.location.hostname} is an invalid domain`, "SecurityError");
    } else if (e.name === "TypeError") {
      if (i.user.id.byteLength < 1 || i.user.id.byteLength > 64)
        return new l("User ID was not between 1 and 64 characters", "TypeError");
    } else if (e.name === "UnknownError")
      return new l("The authenticator was unable to process the specified options, or could not create a new credential", "UnknownError");
  }
  return e;
}
class I {
  createNewAbortSignal() {
    return this.controller && this.controller.abort("Cancelling existing WebAuthn API call for new one"), this.controller = new AbortController(), this.controller.signal;
  }
}
const v = new I();
async function k(e) {
  if (!b())
    throw new Error("WebAuthn is not supported in this browser");
  const r = { publicKey: {
    ...e,
    challenge: w(e.challenge),
    user: {
      ...e.user,
      id: x(e.user.id)
    },
    excludeCredentials: e.excludeCredentials.map(E)
  } };
  r.signal = v.createNewAbortSignal();
  let n;
  try {
    n = await navigator.credentials.create(r);
  } catch (h) {
    throw N({ error: h, options: r });
  }
  if (!n)
    throw new Error("Registration was not completed");
  const { id: i, rawId: a, response: o, type: s } = n, u = {
    id: i,
    rawId: d(a),
    response: {
      attestationObject: d(o.attestationObject),
      clientDataJSON: d(o.clientDataJSON)
    },
    type: s,
    clientExtensionResults: n.getClientExtensionResults(),
    authenticatorAttachment: n.authenticatorAttachment
  };
  return typeof o.getTransports == "function" && (u.transports = o.getTransports()), u;
}
function K(e) {
  return new TextDecoder("utf-8").decode(e);
}
async function D() {
  if (navigator.credentials.conditionalMediationSupported)
    return !0;
  const e = window.PublicKeyCredential;
  return e.isConditionalMediationAvailable !== void 0 && e.isConditionalMediationAvailable();
}
function R({ error: e, options: t }) {
  var r;
  const { publicKey: n } = t;
  if (!n)
    throw Error("options was missing required publicKey property");
  if (e.name === "AbortError") {
    if (t.signal === new AbortController().signal)
      return new l("Authentication ceremony was sent an abort signal", "AbortError");
  } else {
    if (e.name === "NotAllowedError")
      return !((r = n.allowCredentials) === null || r === void 0) && r.length ? new l("No available authenticator recognized any of the allowed credentials", "NotAllowedError") : new l("User clicked cancel, or the authentication ceremony timed out", "NotAllowedError");
    if (e.name === "SecurityError") {
      const i = window.location.hostname;
      if (A(i)) {
        if (n.rpId !== i)
          return new l(`The RP ID "${n.rpId}" is invalid for this domain`, "SecurityError");
      } else
        return new l(`${window.location.hostname} is an invalid domain`, "SecurityError");
    } else if (e.name === "UnknownError")
      return new l("The authenticator was unable to process the specified options, or could not create a new assertion signature", "UnknownError");
  }
  return e;
}
async function _(e, t = !1) {
  var r, n;
  if (!b())
    throw new Error("WebAuthn is not supported in this browser");
  let i;
  ((r = e.allowCredentials) === null || r === void 0 ? void 0 : r.length) !== 0 && (i = (n = e.allowCredentials) === null || n === void 0 ? void 0 : n.map(E));
  const a = {
    ...e,
    challenge: w(e.challenge),
    allowCredentials: i
  }, o = {};
  if (t) {
    if (!await D())
      throw Error("Browser does not support WebAuthn autofill");
    if (document.querySelectorAll("input[autocomplete*='webauthn']").length < 1)
      throw Error('No <input> with `"webauthn"` in its `autocomplete` attribute was detected');
    o.mediation = "conditional", a.allowCredentials = [];
  }
  o.publicKey = a, o.signal = v.createNewAbortSignal();
  let s;
  try {
    s = await navigator.credentials.get(o);
  } catch (m) {
    throw R({ error: m, options: o });
  }
  if (!s)
    throw new Error("Authentication was not completed");
  const { id: u, rawId: h, response: c, type: p } = s;
  let g;
  return c.userHandle && (g = K(c.userHandle)), {
    id: u,
    rawId: d(h),
    response: {
      authenticatorData: d(c.authenticatorData),
      clientDataJSON: d(c.clientDataJSON),
      signature: d(c.signature),
      userHandle: g
    },
    type: p,
    clientExtensionResults: s.getClientExtensionResults(),
    authenticatorAttachment: s.authenticatorAttachment
  };
}
async function j() {
  return b() ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable() : !1;
}
function y(e, t) {
  return new Promise(function(r, n) {
    fetch(e, t).then((i) => {
      const a = i.headers.get("content-type");
      let o = null;
      i.text().then((s) => {
        if (a && a.indexOf("application/json") > -1 ? o = Object.assign(JSON.parse(s), { _raw: i }) : o = { data: s, _raw: i }, i.ok)
          r(o);
        else {
          if (i.status === 400 && o.error === "xhr_request" && o.location)
            return window.location.replace(o.location), !1;
          n(o);
        }
      });
    }).catch(n);
  });
}
class C {
  constructor(t, r) {
    f(this, "http");
    f(this, "constructor");
    const n = {};
    ["get", "post", "patch", "delete"].forEach((i) => {
      n[i] = function(...a) {
        const o = Object.assign({
          method: i,
          credentials: "include",
          mode: "cors"
        }, r || {});
        return o.headers = Object.assign({
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }, o.headers || {}), i !== "get" && (o.body = JSON.stringify(a[1])), typeof a[0] != "string" ? y.call(null, t, o) : y.call(null, t + a[0], o);
      };
    }), this.http = n;
  }
}
class T extends C {
  constructor(t) {
    super(t);
  }
  signIn(t, r) {
    return this.http.post("/signin", { ...t, strategy: r });
  }
  signUp(t, r) {
    return this.http.post("/signup", { ...t, strategy: r });
  }
  updateMissingInformation(t) {
    return this.http.post("/account/updateMissingInformation", t);
  }
  requestResetPassword(t) {
    return this.http.post("/account/forgotPassword", {
      email: t
    });
  }
  resetPassword(t, r) {
    return this.http.post(`/account/resetPassword/${r}`, {
      password: t
    });
  }
  acceptConsent() {
    return this.http.post("/signin/consent/confirm");
  }
  rejectConsent() {
    return this.http.get("/signin/consent/reject");
  }
  checkPasswordStrength(t, r = {}) {
    t = t != null ? t : "";
    const n = {};
    let { min: i, max: a, number: o, lowerCase: s, upperCase: u, customChars: h, customRegexp: c } = r;
    return s = Number(s), u = Number(u), o = Number(o), s && !new RegExp(`(?=(.*[a-z])${s > 0 ? `{${s},}` : ""})`).test(t) && (n.lowerCase = !0), u && !new RegExp(
      `(?=(.*[A-Z])${u > 0 ? `{${u},}` : ""})`
    ).test(t) && (n.upperCase = !0), o && !new RegExp(
      `(?=(.*[0-9])${o > 0 ? `{${o},}` : ""})`
    ).test(t) && (n.number = !0), i != null && t.length < i && (n.min = !0), a != null && t.length > a && (n.max = !0), h && !h.split("").some((p) => t.indexOf(p) > -1) && (n.customChars = !0), c && c.value && !new RegExp(c).test(c.value) ? c.message || " " : Object.keys(n).length > 0 ? n : !0;
  }
}
class U extends C {
  constructor(t) {
    super(t);
  }
  async validateCode(t, r) {
    return this.http.post(`/signin/challenge/${r}`, {
      code: t
    });
  }
}
var W = /* @__PURE__ */ ((e) => (e.SMS = "sms", e.EMAIL = "email", e.SMARTCARD = "sc", e.WEBAUTHN = "webauthn", e.FINGER_VEIN = "fv", e.OTP = "otp", e))(W || {});
class q {
  constructor(t) {
    f(this, "auth");
    f(this, "mfa");
    try {
      t === "/" || new URL(t);
    } catch {
      throw new Error('"apiURL" must be a valid URL');
    }
    this.auth = new T(t), this.mfa = new U(t);
  }
}
export {
  T as AuthService,
  C as HttpService,
  W as MFACodeType,
  U as MFAService,
  q as PlusAuthWeb,
  j as isPlatformAuthenticatorAvailable,
  D as isWebAuthNAutofillSupported,
  b as isWebAuthNSupported,
  k as registerDevice,
  _ as verifyDevice
};
//# sourceMappingURL=plusauth-web.es.js.map
