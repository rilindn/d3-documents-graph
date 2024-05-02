import axios from 'axios';

require('dotenv').config()

const flureeApiUrl = process.env.REACT_APP_FLUREE_API_URL;
const flureeToken = process.env.REACT_APP_FLUREE_TOKEN;

export const FlureeClient = axios.create({
  baseURL: flureeApiUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    "Authorization": `${flureeToken}`
  }
});
