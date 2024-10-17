import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';
import moment from 'moment';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.DotQuyDoiDiem>('dot-quy-doi-diem-sinh-vien', undefined, undefined, ipDaoTao);
	const { record } = objInit;
	const ngoaiQuyDoiDiem =
		!record?.thoiGianBatDau ||
		!record?.thoiGianKetThuc ||
		moment().isBefore(record?.thoiGianBatDau, 'd') ||
		moment().isAfter(record?.thoiGianKetThuc, 'd');

	return {
		...objInit,
		ngoaiQuyDoiDiem,
	};
};
