import compose from './compose';

class Onion {
  constructor (defaultMiddlewares) {
    if (!Array.isArray(defaultMiddlewares)) throw new TypeError('Default middlewares must be an array!');

    this.middlewares = [...defaultMiddlewares];
  }

  static globalMiddlewares = [];
  static defaultGlobalMiddlewaresLength = 0;
  static coreMiddlewares = [];
  static defaultCoreMiddlewaresLength = 0;

  use (newMiddleware, opts = { global: false, core: false }) {
    let core = false;
    let global = false;
    if (typeof opts === 'number') {
      if (process && process.env && process.env.NODE_ENV === 'development') {
        console.warn(
          'use() options should be object, number property would be deprecated in future，please update use() options to "{ core: true }".'
        );
      }
      core = true;
      global = false;
    } else if (typeof opts === 'object' && opts) {
      global = opts.global || false;
      core = opts.core || false;
    }

    if (global) {
      Onion.globalMiddlewares.splice(
        Onion.globalMiddlewares.length - Onion.defaultGlobalMiddlewaresLength,
        0,
        newMiddleware
      );
      return;
    }
    if (core) {
      Onion.coreMiddlewares.splice(Onion.coreMiddlewares.length - Onion.defaultCoreMiddlewaresLength, 0, newMiddleware);
      return;
    }

    this.middlewares.push(newMiddleware);
  }

  execute (params = null) {
    const fn = compose([...this.middlewares, ...Onion.globalMiddlewares, ...Onion.coreMiddlewares]);
    return fn(params);
  }
}

export default Onion;
