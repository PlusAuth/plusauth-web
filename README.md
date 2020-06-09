# plusauth-web
PlusAuth helper utility intended to use in browsers.

## Table of Contents
1. [Installation](#installation)
2. [Docs](#docs)
3. [Usage](#usage)


## Installation
From PlusAuth CDN:
```html
<!-- Latest release -->
<script src="https://cdn.plusauth.com/assets/js/plusauth-web/0.0.1/plusauth-web.min.js"></script>
```

With npm:
```shell script
$ npm install plusauth-web
```

or with yarn
```shell script
$ yarn add plusauth-web
```

# Usage

## CDN Usage
The library will be exposed to global as `PlusAuthWeb`

Initialize it like following:
```js
const plusAuth = new PlusAuthWeb('https://<YOUR_TENANT_ID>.plusauth.com')
```

## NPM Usage
```js
import PlusAuthWeb from 'plusauth-web'

const plusAuth = new PlusAuthWeb('https://<YOUR_TENANT_ID>.plusauth.com')
```

# Docs
For api docs visit [here](https://plusauth.github.io/plusauth-web/classes/plusauthweb.html)

