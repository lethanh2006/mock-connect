import type { TFilter } from '@/components/Table/typing';
import useInitModel from '@/hooks/useInitModel';
import { postSinhVienQuyDoiPhieu, selectTruongHocDebounce } from '@/services/HocTap/QuyDoiDiem';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuyDoiDiem.IQuyDoiDiemSinhVien>(
		'quy-doi-diem-sinh-vien',
		undefined,
		undefined,
		ipDaoTao,
	);
	const { formSubmiting, setFormSubmiting } = objInit;
	const [loadingDebounce, setLoadingDebounce] = useState<boolean>(false);
	const [dataAuto, setDataAuto] = useState<Record<keyof QuyDoiDiem.IQuyDoiDiemSinhVien, any[]>>();

	const postSinhVienQuyDoiPhieuModel = async (idDotQuyDoi: string, payLoad: any): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postSinhVienQuyDoiPhieu(idDotQuyDoi, payLoad);
			message.success('Đăng ký thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const selectTruongHocDebounceModel = async (
		key: keyof QuyDoiDiem.IQuyDoiDiemSinhVien,
		condition?: Partial<QuyDoiDiem.IQuyDoiDiemSinhVien>,
		filter?: TFilter<QuyDoiDiem.IQuyDoiDiemSinhVien>[],
	): Promise<any> => {
		try {
			setLoadingDebounce(true);
			const res = await selectTruongHocDebounce({ condition, key, filter });

			const temp = Object.assign(dataAuto ?? {}, { [key]: res.data?.data ?? [] }) as Record<
				keyof QuyDoiDiem.IQuyDoiDiemSinhVien,
				any[]
			>;
			setDataAuto(temp);

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoadingDebounce(false);
		}
	};

	return {
		...objInit,
		loadingDebounce,
		dataAuto,
		postSinhVienQuyDoiPhieuModel,
		selectTruongHocDebounceModel,
	};
};
