export const environment = {
  production: true,
  apiUrl: `${process.env['API_URL'] || 'http://localhost:8080/api'}`,
  baseUrl: `${process.env['API_URL'] || 'http://localhost:8080'}`,
};
