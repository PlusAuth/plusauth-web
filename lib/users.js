import { encodedQueryString } from './utils/encoded_query_string';

export const userService = (http) => {
  return {
    // USER
    async getAll (pagination) {
      return http.get('/v1/users' + encodedQueryString(pagination));
    },
    async get (id) {
      return http.get('/v1/users/' + id);
    },
    async create (user) {
      return http.post('/v1/users', user);
    },
    async remove (id) {
      return http.delete('/v1/users/' + id);
    },
    async update (id, user) {
      return http.patch('/v1/users/' + id, user);
    },

    // TENANT
    async getTenants (userId) {
      return http.get('/v1/users/' + userId + '/tenants');
    },

    // ROLE GROUP
    async getRoleGroups (userId) {
      return http.get('/v1/users/' + userId + '/roleGroups');
    },
    async assignRoleGroups (userId, roleGroupIDs) {
      return http.post('/v1/users/' + userId + '/roleGroups', roleGroupIDs);
    },
    async unassignRoleGroups (userId, roleGroupIDs) {
      return http.delete('/v1/users/' + userId + '/roleGroups', roleGroupIDs);
    },

    // ROLE
    async getRoles (userId) {
      return http.get('/v1/users/' + userId + '/roles');
    },
    async assignRoles (userId, roleIDs) {
      return http.post('/v1/users/' + userId + '/roles', roleIDs);
    },
    async unassignRoles (userId, roleIDs) {
      return http.delete('/v1/users/' + userId + '/roles', roleIDs);
    },

    // PERMISSION
    async getPermissions (userId) {
      return http.get('/v1/users/' + userId + '/permissions');
    },
    async assignPermissions (userId, permissionIDs) {
      return http.post('/v1/users/' + userId + '/permissions', permissionIDs);
    },
    async unassignPermissions (userId, permissionIDs) {
      return http.delete('/v1/users/' + userId + '/permissions', permissionIDs);
    }
  };
};
