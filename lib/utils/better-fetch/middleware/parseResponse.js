import { safeJsonParse, ResponseError, RequestError, listenableStream } from '../utils';

export default function parseResponseMiddleware (ctx, next) {
  let copy;

  return next()
    .then(() => {
      if (!ctx) return;
      const { res = {}, req = {} } = ctx;
      const {
        options: {
          responseType = 'json',
          throwErrIfParseFail = false,
          parseResponse = true
        } = {}
      } = req || {};

      if (!parseResponse) {
        return;
      }

      if (!res || !res.clone) {
        return;
      }

      copy = res.clone();
      if (responseType === 'json') {
        return res.text().then(d => safeJsonParse(d, throwErrIfParseFail, copy, req));
      } else if (responseType === 'stream') {
        return listenableStream(res.body.getReader());
      }
      try {
        return res[responseType]();
      } catch (e) {
        throw new ResponseError(copy, 'responseType not support', null, req, 'ParseError');
      }
    })
    .then(body => {
      if (!ctx) return;
      const { req = {} } = ctx;
      const { options: { getResponse = false } = {} } = req || {};

      if (!copy) {
        return;
      }
      if (copy.status >= 200 && copy.status < 300) {
        if (getResponse) {
          ctx.res = { data: body, response: copy };
          return;
        }
        ctx.res = body;
        return;
      }
      throw new ResponseError(copy, 'http error', body, req, 'HttpError');
    })
    .catch(e => {
      if (e instanceof RequestError || e instanceof ResponseError) {
        throw e;
      }
      const { req, res } = ctx;
      e.request = req;
      e.response = res;
      e.type = e.name;
      e.data = undefined;
      throw e;
    });
}
