import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<VanBan.IRecord>('van-ban');

	return {
		...objInit,
	};
};
