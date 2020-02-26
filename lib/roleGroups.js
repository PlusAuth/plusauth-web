import { encodedQueryString } from './utils/encoded_query_string';

export const roleGroupService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/roleGroups' + encodedQueryString(pagination));
    },
    async get (roleGroupId) {
      return http.get('/v1/roleGroups/' + roleGroupId);
    },
    async create (roleGroup) {
      return http.post('/v1/roleGroups', roleGroup);
    },
    async update (roleGroupId, roleGroup) {
      return http.patch('/v1/roleGroups/' + roleGroupId, roleGroup);
    },
    async remove (roleGroupId) {
      return http.delete('/v1/roleGroups/' + roleGroupId);
    },

    //  ROLES
    async getRoles (roleGroupId) {
      return http.get('/v1/roleGroups/' + roleGroupId + '/roles');
    },
    async assignRoles (roleGroupId, roleIDs) {
      return http.post('/v1/roleGroups/' + roleGroupId + '/roles', roleIDs);
    },
    async unassignRoles (roleGroupId, roleIDs) {
      return http.delete('/v1/roleGroups/' + roleGroupId + '/roles', roleIDs);
    }
  };
};
