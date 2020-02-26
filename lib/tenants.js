import { encodedQueryString } from './utils/encoded_query_string';

export const tenantService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/tenants' + encodedQueryString(pagination));
    },
    async get (tenantID) {
      return http.get('/v1/tenants/' + tenantID);
    },
    async create (tenant) {
      return http.post('/v1/tenants', tenant, {
        headers: {
          'X-PlusAuth-Tenant': 'api'
        }
      });
    },
    async update (tenantID, tenant) {
      return http.patch('/v1/tenants/' + tenantID, tenant);
    },
    async delete (tenantID) {
      return http.delete('/v1/tenants/' + tenantID);
    },
    // SETTINGS
    async getSettings (tenantID) {
      return http.get('/v1/tenants/' + tenantID + '/settings');
    },
    async updateSettings (tenantID, settings) {
      return http.patch('/v1/tenants/' + tenantID + '/settings', settings);
    }
  };
};
