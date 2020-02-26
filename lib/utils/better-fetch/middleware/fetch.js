import 'isomorphic-fetch';
import { timeout2Throw } from '../utils';

let warnedCoreType = false;

export default function fetchMiddleware (ctx, next) {
  if (!ctx) return next();
  const { req: { options = {}, url = '' } = {}, responseInterceptors } = ctx;
  const {
    timeout = 0,
    __umiRequestCoreType__ = 'normal'
  } = options;

  if (__umiRequestCoreType__ !== 'normal') {
    if (process && process.env && process.env.NODE_ENV === 'development' && warnedCoreType === false) {
      warnedCoreType = true;
      console.warn(
        '__umiRequestCoreType__ is a internal property that use in umi-request, change its value would affect the behavior of request! It only use when you want to extend or use request core.'
      );
    }
    return next();
  }

  const adapter = fetch;

  if (!adapter) {
    throw new Error('Global fetch not exist!');
  }

  let response;
  if (timeout > 0) {
    response = Promise.race([adapter(url, options), timeout2Throw(timeout, ctx.req)]);
  } else {
    response = Promise.race([adapter(url, options)]);
  }

  responseInterceptors.forEach(handler => {
    response = response.then(res => {
      const clonedRes = typeof res.clone === 'function' ? res.clone() : res;
      return handler(clonedRes, options);
    });
  });

  return response.then(res => {
    ctx.res = res;
    return next();
  });
}
