import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInit = useInitModel<Tag.IRecord>('tag');

	return {
		...objInit,
	};
};
