import { encodedQueryString } from './utils/encoded_query_string';

export const hookService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/hooks' + encodedQueryString(pagination));
    },
    async get (hookID) {
      return http.get('/v1/hooks/' + hookID);
    },
    async create (hook) {
      return http.post('/v1/hooks', hook);
    },
    async update (hookID, hook, progressEvent) {
      return http.patch('/v1/hooks' + (hookID ? '/' + hookID : ''), hook, { responseType: hook.stream ? 'stream' : undefined });
    },
    async addPackages (hookID, packages, stream) {
      return http.post('/v1/hooks/' + hookID + '/packages', packages, { responseType: stream ? 'stream' : undefined });
    },
    async deletePackages (hookID, packages, stream) {
      return http.delete('/v1/hooks/' + hookID + '/packages', packages, { responseType: stream ? 'stream' : undefined });
    },
    async remove (hookID) {
      return http.delete('/v1/hooks/' + hookID);
    },
    execute (context, user, action, hook) {
      return http.post('/v1/hook-test', { context, user, action, hook });
    }
  };
};
