/**
 * @internal
 */
function fetchAsPromise( url: string, options: RequestInit ) {
  return new Promise( function ( resolve, reject ){
    fetch( url, options ).then( rawResponse => {
      const contentType = rawResponse.headers.get( 'content-type' )
      // const clone = rawResponse.clone()
      let response = null
      rawResponse.text().then( value => {
        if ( contentType && contentType.indexOf( 'application/json' ) > -1 ){
          response = JSON.parse( value )
        } else {
          response = value
        }
        // TODO: migrate to object response
        // response.__proto__._raw = clone

        if ( rawResponse.ok ){
          resolve( response )
        } else if ( rawResponse.status === 400
                    && response.error === 'xhr_request'
                    && response.location ){
          window.location.replace( response.location );
          return false;
        } else {
          reject( response )
        }
      } )
    } ).catch( reject )
  } )
}

/**
 * Helper service for posting requests. It is intended to be used internally.
 * @public
 */
export class HttpService {
  /**
   * @internal
   */
  http: any

  ['constructor']!: typeof HttpService

  constructor( apiURL: string ) {
    const http: any = {};
    ['get', 'post', 'patch', 'delete'].forEach( method => {
      http[method] = function ( ...args: any[] ) {
        const fetchOptions: RequestInit = {
          method,
          credentials: 'include',
          mode:        'cors',
          headers:     {
            'Content-Type':     'application/json',
            'Accept':           'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
        method !== 'get' ? fetchOptions.body = JSON.stringify( args[1] ) : null
        if ( typeof args[0] !== 'string' ){
          return fetchAsPromise.call( null, apiURL, fetchOptions )
        } else {
          return fetchAsPromise.call( null, apiURL + args[0], fetchOptions )
        }
      }
    } )
    this.http = http
  }
}
