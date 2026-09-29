import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DanhMucChung.IRecord>('nckh/danh-muc-nckh');
	return {
		...objInit,
	};
};
