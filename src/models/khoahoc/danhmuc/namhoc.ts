import useInitModel from '@/hooks/useInitModel';
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
