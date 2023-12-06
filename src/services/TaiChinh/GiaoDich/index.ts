import { ipTaiChinh } from '@/utils/ip';
import axios from 'axios';

export const getSoDuViSinhVien = () => {
	return axios.get(`${ipTaiChinh}/transaction/wallet/me`);
};
