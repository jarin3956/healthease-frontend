import axios from 'axios';

const axiosinstance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default axiosinstance;
