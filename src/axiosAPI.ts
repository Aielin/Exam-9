import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'https://test-53f61-default-rtdb.europe-west1.firebasedatabase.app/',
});

export default axiosApi;