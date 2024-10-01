import useInitModel from '@/hooks/useInitModel';
import { type TinTuc } from '@/services/TinTuc/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<TinTuc.IChuDe>('common-topic');
	const [tabActive, setTabActive] = useState<string>('all');

	return {
		...objInit,
		tabActive,
		setTabActive,
	};
};
