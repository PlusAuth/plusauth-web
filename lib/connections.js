import { encodedQueryString } from './utils/encoded_query_string';

export const federatedService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/federated' + encodedQueryString(pagination));
    },
    async get (connectionId) {
      return http.get('/v1/federated/' + connectionId);
    },
    async create (connection) {
      return http.post('/v1/federated', connection);
    },
    async update (connectionId, connection) {
      return http.patch('/v1/federated/' + connectionId, connection);
    },
    async remove (connectionId) {
      return http.delete('/v1/federated/' + connectionId);
    }
  };
};
