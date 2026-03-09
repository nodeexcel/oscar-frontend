import client from './client.js';

export const listTenants = () => client.get('/api/tenants').then((res) => res.data);
