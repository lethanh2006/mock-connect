import useInitModel from '@/hooks/useInitModel';
import type { NamHoc } from '@/services/QuanLyKhoaHocV2/DanhMuc/NamHoc/typings';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<NamHoc.IRecord>('nckh/nam-hoc');

	const [listIdNamHoc, setListIdNamHoc] = useState<string[]>([]);

	return {
		...objInit,
		listIdNamHoc,
		setListIdNamHoc,
	};
};
