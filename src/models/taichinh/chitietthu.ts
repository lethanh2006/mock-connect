import useInitModel from '@/hooks/useInitModel';
import { getChiTietThuByIdentityCode } from '@/services/TaiChinh/ChiTietThu';
import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChiTietThu.Record>('chi-tiet-thu', undefined, undefined, ipTaiChinh);

	const { setLoading, setRecord } = objInit;

	const getChiTietThuByIdentityCodeModel = async (identityCode: string) => {
		setLoading(true);
		const res = await getChiTietThuByIdentityCode(identityCode);
		setRecord(res?.data?.data ?? {});
		setLoading(false);
	};

	return {
		...objInit,
		getChiTietThuByIdentityCodeModel,
	};
};
