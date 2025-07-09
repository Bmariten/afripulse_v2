import axios from 'axios';
import { API_URL } from '@/config';

const publicApi = axios.create({
  baseURL: API_URL,
});

export default publicApi;
