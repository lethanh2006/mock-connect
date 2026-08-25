import useInitModel from '@/hooks/useInitModel';
import { getViCuaToi } from '@/services/TaiChinh/Vi';
import type { Vi } from '@/services/TaiChinh/Vi/typing';
import { ipTaiChinh } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<Vi.IGiaoDich>('giao-dich-vi', undefined, undefined, ipTaiChinh);
	const [viCuaToi, setViCuaToi] = useState<Vi.IRecord>();
	const [loadingVi, setLoadingVi] = useState<boolean>(false);

	const getViCuaToiModel = async (): Promise<Vi.IRecord | undefined> => {
		setLoadingVi(true);
		try {
			const res = await getViCuaToi();
			setViCuaToi(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingVi(false);
		}
	};

	return {
		...objInit,
		viCuaToi,
		loadingVi,
		getViCuaToiModel,
	};
};
