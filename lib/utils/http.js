import request from './better-fetch/index';
import {generateTenantUrl} from "./generate_tenant_url";


export function createHttpClientInstance ( opts = {}) {
    let httpClientInstance = null;
    httpClientInstance = request(Object.assign({
        requestType: 'json',
        prefix: generateTenantUrl(opts.tenantID) + '/api',
        headers: {
            'Content-Type': 'application/json'
        }
    }));

    // Request Interceptor
    httpClientInstance.interceptors.request.use(
        (url, options) => {
            const { headers } = options;
            if(opts.accessToken){
                headers.authorization = 'Bearer ' + opts.accessToken;
            }
            return (
                {
                    url,
                    options: { ...options, interceptors: true }
                }
            );
        }
    );

    return httpClientInstance;
};
