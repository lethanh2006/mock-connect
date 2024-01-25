import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<QuyetDinhGiaoDeTai.IRecord>('quyet-dinh-quy-trinh');
	return {
		...objInit,
	};
};
