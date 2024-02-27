import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const getAllMyDot = (idQuyTrinh: string) => {
	return axios.get(`${ip3}/dot-quy-trinh-dong/all/my/quy-trinh/${idQuyTrinh}`);
};
