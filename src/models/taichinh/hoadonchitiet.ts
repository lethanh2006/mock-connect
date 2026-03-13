import useInitModel from '@/hooks/useInitModel';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ipTaiChinh } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HoaDon.IBillItem>('bill-item', undefined, undefined, ipTaiChinh);
	const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
	const [xemRutGonChiTiet, setXemRutGonChiTiet] = useState(false);

	return {
		...objInit,
		visibleThanhToan,
		setVisibleThanhToan,
		xemRutGonChiTiet,
		setXemRutGonChiTiet
	};
};
