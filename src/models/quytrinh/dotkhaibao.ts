import useInitModel from '@/hooks/useInitModel';
import { getAllMyDot } from '@/services/QuyTrinh/DotQuyTrinh';
import type { DotQuyTrinh } from '@/services/QuyTrinh/DotQuyTrinh/typing';

export default () => {
	const objInit = useInitModel<DotQuyTrinh.IRecord>('dot-quy-trinh-dong');

	const { setLoading } = objInit;

	const getAllMyDotModel = async (idQuyTrinh: string) => {
		setLoading(true);
		const res = await getAllMyDot(idQuyTrinh);
		setLoading(false);
		return res?.data?.data ?? [];
	};

	return {
		...objInit,
		getAllMyDotModel,
	};
};
