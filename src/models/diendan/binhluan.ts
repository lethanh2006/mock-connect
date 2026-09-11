import useInitModel from '@/hooks/useInitModel';
import { BinhLuan } from '@/services/HocTap/DienDan/BinhLuan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BinhLuan.IRecord>('dien-dan-binh-luan', 'condition', undefined, ipDaoTao);
	return objInit;
};
