import { parse, stringify } from 'qs';

export class RequestError extends Error {
  constructor (text, request, type = 'RequestError') {
    super(text);
    this.name = 'RequestError';
    this.request = request;
    this.type = type;
  }
}
export class ResponseError extends Error {
  constructor (response, text, data, request, type = 'ResponseError') {
    super(text || response.statusText);
    this.name = 'ResponseError';
    this.data = data;
    this.response = response;
    this.status = response.status;
    this.request = request;
    this.type = type;
  }
}

/**
 * @param reader { ReadableStreamDefaultReader }
 */
export function listenableStream (reader) {
  const decoder = new TextDecoder();
  const stream = {
    data: [],
    end: [],
    on: function (event, callback) {
      if (this[event]) {
        this[event].push(callback);
      }
    }
  };
  reader.read().then(function processText ({ done, value }) {
    if (done) {
      stream.end.forEach(e => e.call(null));
      return;
    }
    stream.data.forEach(e => e.call(null, decoder.decode(value)));
    return reader.read().then(processText);
  });
  return stream;
}
export function safeJsonParse (data, throwErrIfParseFail = false, response = null, request = null) {
  try {
    return JSON.parse(data);
  } catch (e) {
    if (throwErrIfParseFail) {
      throw new ResponseError(response, 'JSON.parse fail', data, request, 'ParseError');
    }
  } // eslint-disable-line no-empty
  return data;
}

export function timeout2Throw (msec, request) {
  return new Promise((req, reject) => {
    setTimeout(() => {
      reject(new RequestError(`timeout of ${msec}ms exceeded`, request, 'Timeout'));
    }, msec);
  });
}

export function isArray (val) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Array]';
}

export function isURLSearchParams (val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

export function isDate (val) {
  return typeof val === 'object' && Object.prototype.toString.call(val) === '[object Date]';
}

export function isObject (val) {
  return val !== null && typeof val === 'object';
}

export function forEach2ObjArr (target, callback) {
  if (!target) return;

  if (typeof target !== 'object') {
    target = [target];
  }

  if (isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      callback.call(null, target[i], i, target);
    }
  } else {
    for (const key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        callback.call(null, target[key], key, target);
      }
    }
  }
}

export function getParamObject (val) {
  if (isURLSearchParams(val)) {
    return parse(val.toString(), { strictNullHandling: true });
  }
  if (typeof val === 'string') {
    return [val];
  }
  return val;
}

export function reqStringify (val) {
  return stringify(val, { arrayFormat: 'repeat', strictNullHandling: true });
}

export function mergeRequestOptions (options, options2Merge) {
  return {
    ...options,
    ...options2Merge,
    headers: {
      ...options.headers,
      ...options2Merge.headers
    },
    params: {
      ...getParamObject(options.params),
      ...getParamObject(options2Merge.params)
    },
    method: (options2Merge.method || options.method || 'get').toLowerCase()
  };
}
