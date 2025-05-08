// lib/coreAxios.js
import axios from 'axios';

const coreAxios = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default coreAxios;