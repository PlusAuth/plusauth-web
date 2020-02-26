import { encodedQueryString } from './utils/encoded_query_string';

export const templateService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/templates' + encodedQueryString(pagination));
    },
    async get (key) {
      return http.get('/v1/templates/' + key);
    },
    async create (key, template) {
      return http.post('/v1/templates/' + key, template);
    },
    async update (key, template) {
      return http.patch('/v1/templates/' + key, template);
    },
    async remove (key) {
      return http.delete('/v1/templates/' + key);
    }
  };
};
