import Core from './core';
import { mergeRequestOptions } from './utils';

const request = (initOptions = {}) => {
  const coreInstance = new Core(initOptions);
  const umiInstance = (url, options = {}) => {
    const mergeOptions = mergeRequestOptions(coreInstance.initOptions, options);
    return coreInstance.request(url, mergeOptions);
  };

  umiInstance.use = coreInstance.use.bind(coreInstance);
  umiInstance.fetchIndex = coreInstance.fetchIndex;

  umiInstance.interceptors = {
    request: {
      use: Core.requestUse.bind(coreInstance)
    },
    response: {
      use: Core.responseUse.bind(coreInstance)
    }
  };

  const METHODS = ['get', 'post', 'delete', 'put', 'patch', 'head', 'options', 'rpc'];
  const HAS_BODY = ['post', 'put', 'patch', 'delete'];
  METHODS.forEach(method => {
    if (HAS_BODY.includes(method)) {
      umiInstance[method] = (url, data, options) => umiInstance(url, { ...(options ? { ...options, data } : { data }), method });
    } else {
      umiInstance[method] = (url, options) => umiInstance(url, { ...options, method });
    }
  });

  umiInstance.extendOptions = coreInstance.extendOptions.bind(coreInstance);

  return umiInstance;
};

/**
 * fetch
 */
export const fetch = request({ parseResponse: false });

export default request;
