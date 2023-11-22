import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<KeHoachNamHoc.IRecord>('ke-hoach-nam-hoc', undefined, undefined, ipDaoTao);
	const [recordKHTheoTuan, setRecordKHTheoTuan] = useState<KeHoachNamHoc.IKeHoachTheoTuan>();

	return {
		...objInit,
		recordKHTheoTuan,
		setRecordKHTheoTuan,
	};
};
