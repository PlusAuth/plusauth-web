import { encodedQueryString } from './utils/encoded_query_string';

export const viewService = (http) => {
  return {
    async getAll (pagination) {
      return http.get('/v1/views' + encodedQueryString(pagination));
    },
    async get (type) {
      return http.get('/v1/views/' + type);
    },
    async create (view) {
      return http.post('/v1/views', view);
    },
    async update (type, view) {
      return http.patch('/v1/views/' + type, view, {
        requestType: 'text',
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    },
    async remove (viewId) {
      return http.delete('/v1/views/' + viewId);
    }

  };
};
