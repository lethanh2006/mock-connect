import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export const getAllMyDot = (idQuyTrinh: string) => {
	return axios.get(`${ip3}/dot-quy-trinh-dong/all/my/quy-trinh/${idQuyTrinh}`);
};
