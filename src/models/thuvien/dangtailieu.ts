import useInitModel from '@/hooks/useInitModel';
import { ipThuVien } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<DangTaiLieu.IRecord>('dang-tai-lieu', undefined, undefined, ipThuVien);

	return {
		...objInit,
	};
};
