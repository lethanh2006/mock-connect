import { EOperatorType } from '@/components/Table/constant';
import type { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import { ipNhanSu } from '@/utils/ip';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';

export default () => {
	const objInit = useInitModel<ToChucNhanSu.INhanSu>('thong-tin-nhan-su', undefined, undefined, ipNhanSu);
	const { setLoading, setDanhSach, getService } = objInit;

	const searchCanBoModel = async (
		keyword: string,
		maDonVi?: string,
		isSetDanhSach?: boolean,
		condition?: Partial<ToChucNhanSu.INhanSu>,
	): Promise<ToChucNhanSu.INhanSu[]> => {
		setLoading(true);
		try {
			const filterStatus: TFilter<ToChucNhanSu.INhanSu> = {
				active: true,
				field: 'maDonVi',
				operator: EOperatorType.INCLUDE,
				values: [maDonVi ?? ''],
			};
			const payloads = [
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'maCanBo', values: [keyword], operator: EOperatorType.CONTAIN },
						...(maDonVi ? [filterStatus] : []),
					],
				},
				{
					page: 1,
					limit: 20,
					condition,
					filters: [
						{ active: true, field: 'hoTen', values: [keyword], operator: EOperatorType.CONTAIN },
						...(maDonVi ? [filterStatus] : []),
					],
				},
			];
			const responses = await Promise.allSettled(payloads.map((payload) => getService(payload, 'sinh-vien/page')));
			const data = (
				responses.filter((item) => item.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse<any>>[]
			).map((item) => item.value.data?.data?.result);
			const flatData: ToChucNhanSu.INhanSu[] = data.flat();
			const uniqData = _.uniqBy(flatData, (item) => item.ssoId);
			if (isSetDanhSach !== false) setDanhSach(uniqData);

			return uniqData;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		searchCanBoModel,
	};
};
