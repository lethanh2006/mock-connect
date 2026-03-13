import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<DanhMucVaiTro.IRecord>('nckh/vai-tro-thanh-vien');
	return {
		...objInit,
	};
};
