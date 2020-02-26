import { encodedQueryString } from './utils/encoded_query_string';

export const apiService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/apis' + encodedQueryString(pagination));
    },
    async get (apiId) {
      return http.get('/v1/apis/' + apiId);
    },
    async create (api) {
      return http.post('/v1/apis', api);
    },
    async update (apiId, api) {
      return http.patch('/v1/apis/' + apiId, api);
    },
    async remove (apiId) {
      return http.delete('/v1/apis/' + apiId);
    },

    //  PERMISSIONS
    async getPermissions (apiId, pagination) {
      return http.get('/v1/apis/' + apiId + '/permissions' + encodedQueryString(pagination));
    },
    async createPermission (apiID, permission) {
      return http.post('/v1/apis/' + apiID + '/permissions', permission);
    },
    async updatePermission (apiID, permission) {
      return http.patch('/v1/apis/' + apiID + '/permissions', permission);
    },
    async removePermission (apiID, permission) {
      return http.delete('/v1/apis/' + apiID + '/permissions/' + permission);
    }
  };
};
