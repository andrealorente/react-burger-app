import axios from 'axios';

const axiosOrders = axios.create({
  baseURL: 'https://react-burger-builder-1f073.firebaseio.com/'
});

export default axiosOrders;