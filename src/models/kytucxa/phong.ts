import useInitModel from '@/hooks/useInitModel';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { ipCsvc } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<Phong.IChinhSachPhongRecord>('chinh-sach-phong', undefined, undefined, ipCsvc);
	const [visibleDangKy, setVisibleDangKy] = useState<boolean>(false);

	return {
		...objInit,
		visibleDangKy,
		setVisibleDangKy,
	};
};
