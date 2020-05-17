# plusauth-web
PlusAuth helper utility intended to use in client side environments.

## Table of Contents
1. [Installation](#installation)
2. [Initialization](#initialization)


## Installation
From PlusAuth CDN:
```html
<!-- Latest release -->
<script src="https://cdn.plusauth.com/assets/js/plusauth-web/0.0.1/plusauth-web.min.js"></script>
```

With npm:
```shell script
# npm install plusauth-web
```

or with yarn
```shell script
# yarn add plusauth-web
```

## Initialization
After installing the library it will be exposed to global as `PlusAuthWeb`

Initialize it like following:
```js
const plusAuth = new PlusAuthWeb('https://<YOUR_TENANT_ID>.plusauth.com')
```
