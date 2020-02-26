export const versionService = (http) => {
  return {
    async get () {
      return http.get('/version');
    }
  };
};
