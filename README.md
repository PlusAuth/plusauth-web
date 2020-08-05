# plusauth-web
PlusAuth helper utility intended to use in browsers.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Docs](#docs)


## Installation
From PlusAuth CDN:
```html
<!-- Latest release -->
<script src="https://unpkg.com/@plusauth/web@0.0.4/dist/plusauth-web.umd.min.js"></script>
```

With npm:
```shell script
$ npm install @plusauth/web
```

or with yarn
```shell script
$ yarn add @plusauth/web
```

# Usage

## CDN Usage
The library will be exposed to global as `plusauthweb`

Initialize it like following:
```js
const plusAuth = new plusauthweb.PlusAuthWeb('https://<YOUR_TENANT_ID>.plusauth.com')

// access auth methods
plusAuth.auth.signIn({ username: 'test', password: 'test' })

// access mfa methods
plusAuth.mfa.validateCode('CODE', plusauthweb.MFACodeType.SMS)
```

## NPM Usage
```js
import { PlusAuthWeb, MFACodeType } from '@plusauth/web'

const plusAuth = new PlusAuthWeb('https://<YOUR_TENANT_ID>.plusauth.com')

// access auth methods
plusAuth.auth.signIn({ username: 'test', password: 'test' })

// access mfa methods
plusAuth.mfa.validateCode('CODE', MFACodeType.SMS)
```

# Docs
For API docs visit [here](https://plusauth.github.io/plusauth-web/classes/plusauthweb.html)

