import useInitModel from '@/hooks/useInitModel';
import type { HinhThucThanhToan } from '@/services/TaiChinh/HinhThucThanhToan/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HinhThucThanhToan.IRecord>('kenh-thanh-toan', undefined, undefined, ipTaiChinh);
	const { danhSach } = objInit;
	const defaultHinhThuc = danhSach.find((i) => i.isMacDinh) ?? danhSach?.[0];

	return {
		...objInit,
		defaultHinhThuc,
	};
};
