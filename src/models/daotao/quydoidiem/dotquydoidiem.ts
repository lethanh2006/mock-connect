import useInitModel from '@/hooks/useInitModel';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import dayjs from '@/utils/dayjs';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.DotQuyDoiDiem>('dot-quy-doi-diem-sinh-vien', undefined, undefined, ipDaoTao);
	const { record } = objInit;
	const ngoaiQuyDoiDiem =
		!record?.thoiGianBatDau ||
		!record?.thoiGianKetThuc ||
		dayjs().isBefore(dayjs(record?.thoiGianBatDau), 'day') ||
		dayjs().isAfter(dayjs(record?.thoiGianKetThuc), 'day');

	return {
		...objInit,
		ngoaiQuyDoiDiem,
	};
};
