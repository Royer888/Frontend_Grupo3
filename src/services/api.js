import axios from 'axios';

const api = axios.create({
  baseURL: 'https://grupo-3-s55k.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;