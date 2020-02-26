import { isArray, isURLSearchParams, forEach2ObjArr, isObject, isDate, reqStringify } from '../utils';

export function paramsSerialize (params, paramsSerializer) {
  let serializedParams;
  let jsonStringifiedParams;
  if (params) {
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      if (isArray(params)) {
        jsonStringifiedParams = [];
        forEach2ObjArr(params, function (item) {
          if (item === null || typeof item === 'undefined') {
            jsonStringifiedParams.push(item);
          } else {
            jsonStringifiedParams.push(isObject(item) ? JSON.stringify(item) : item);
          }
        });
        // a: [1,2,3] => a=1&a=2&a=3
        serializedParams = reqStringify(jsonStringifiedParams, { arrayFormat: 'repeat', strictNullHandling: true });
      } else {
        jsonStringifiedParams = {};
        forEach2ObjArr(params, function (value, key) {
          let jsonStringifiedValue = value;
          if (value === null || typeof value === 'undefined') {
            jsonStringifiedParams[key] = value;
          } else if (isDate(value)) {
            jsonStringifiedValue = value.toISOString();
          } else if (isArray(value)) {
            jsonStringifiedValue = value;
          } else if (isObject(value)) {
            jsonStringifiedValue = JSON.stringify(value);
          }
          jsonStringifiedParams[key] = jsonStringifiedValue;
        });
        const tmp = reqStringify(jsonStringifiedParams, { arrayFormat: 'repeat', strictNullHandling: true });
        serializedParams = tmp;
      }
    }
  }
  return serializedParams;
}

export default function simpleGetMiddleware (ctx, next) {
  if (!ctx) return next();
  const { req: { options = {} } = {} } = ctx;
  const { paramsSerializer, params } = options;
  const { req: { url = '' } = {} } = ctx;
  options.method = options.method ? options.method.toUpperCase() : 'GET';

  options.credentials = options.credentials || 'same-origin';

  const serializedParams = paramsSerialize(params, paramsSerializer);
  ctx.req.originUrl = url;
  if (serializedParams) {
    const urlSign = url.indexOf('?') !== -1 ? '&' : '?';
    ctx.req.url = `${url}${urlSign}${serializedParams}`;
  }

  ctx.req.options = options;

  return next();
}
