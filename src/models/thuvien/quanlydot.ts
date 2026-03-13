import useInitModel from '@/hooks/useInitModel';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IQuanLyDot>(
		'quan-ly-dot-nop-luan-van-luan-an-khoa-luan',
		undefined,
		undefined,
		ipDaoTao,
	);

	return {
		...objInit,
	};
};
