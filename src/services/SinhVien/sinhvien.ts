import { ip3 } from '@/utils/ip';
import axios from 'axios';

const url = 'sinh-vien';

export const getMyProfile = () => {
  return axios.get(`${ip3}/${url}/me`);
};
