import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<QuyChe.IRecord>('quy-che');
	return {
		...objInit,
	};
};
