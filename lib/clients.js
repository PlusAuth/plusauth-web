import { encodedQueryString } from './utils/encoded_query_string';

export const clientService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/clients' + encodedQueryString(pagination));
    },
    async get (clientId) {
      return http.get('/v1/clients/' + clientId);
    },
    async create (client) {
      return http.post('/v1/clients', client);
    },
    async update (clientId, client) {
      return http.patch('/v1/clients/' + clientId, client);
    }
  };
};
