import { encodedQueryString } from './utils/encoded_query_string';

export const roleService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/roles' + encodedQueryString(pagination));
    },
    async get (roleId) {
      return http.get('/v1/roles/' + roleId);
    },
    async create (role) {
      return http.post('/v1/roles', role);
    },
    async update (roleId, role) {
      return http.patch('/v1/roles/' + roleId, role);
    },
    async remove (roleId) {
      return http.delete('/v1/roles/' + roleId);
    },

    // PERMISSION
    async getPermissions (roleId) {
      return http.get('/v1/roles/' + roleId + '/permissions');
    },
    async assignPermissions (roleId, permissionIDs) {
      return http.post('/v1/roles/' + roleId + '/permissions', permissionIDs);
    },
    async unassignPermissions (roleId, permissionIDs) {
      return http.delete('/v1/roles/' + roleId + '/permissions', permissionIDs);
    }
  };
};
