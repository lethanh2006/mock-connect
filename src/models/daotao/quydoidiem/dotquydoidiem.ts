import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';
import moment from 'moment';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.DotQuyDoiDiem>('dot-quy-doi-diem-sinh-vien', undefined, undefined, ipDaoTao);
	const { danhSach } = objInit;
	const ngoaiQuyDoiDiem =
		!danhSach.length ||
		!danhSach[0]?.thoiGianBatDau ||
		!danhSach[0]?.thoiGianKetThuc ||
		moment().isBefore(danhSach[0]?.thoiGianBatDau, 'd') ||
		moment().isAfter(danhSach[0]?.thoiGianKetThuc, 'd');

	return {
		...objInit,
		ngoaiQuyDoiDiem,
	};
};
