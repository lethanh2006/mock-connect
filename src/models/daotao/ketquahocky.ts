import useInitModel from '@/hooks/useInitModel';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KetQuaHocKy.IRecord>('kqht-hoc-ky', undefined, undefined, ipDaoTao);
	const { getAllModel, setRecord } = objInit;

	const getKetQuaHocKy = (maKhoaNganh: string) =>
		getAllModel(undefined, { maHocKy: 1 }, undefined, undefined, `me/many/khoa-nganh/${maKhoaNganh}`).then((res) => {
			if (res.length) setRecord(res.at(-1));
			return res;
		});

	return {
		...objInit,
		getKetQuaHocKy,
	};
};
