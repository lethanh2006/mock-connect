import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<any>('dot-quy-trinh-dong');

	return {
		...objInit,
	};
};
