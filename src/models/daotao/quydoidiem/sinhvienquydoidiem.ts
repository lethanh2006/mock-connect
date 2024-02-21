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
	const [dataTruongHoc, setDataTruongHoc] = useState<[]>();
	const [dataHocPhan, setDataHocPhan] = useState<[]>();

	const postSinhVienQuyDoiPhieuModel = async (idDotQuyDoi: string, payLoad: any): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);

		try {
			const res = await postSinhVienQuyDoiPhieu(idDotQuyDoi, payLoad);
			message.success('Thêm thành công');
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const selectTruongHocDebounceModel = async (condition?: any, key?: any, filter?: any[]): Promise<any> => {
		try {
			const res = await selectTruongHocDebounce({ condition, key, filter });
			if (key === 'tenTruong') {
				setDataTruongHoc(res.data?.data);
			} else if (key === 'tenHocPhan') {
				setDataHocPhan(res.data?.data);
			}

			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
		}
	};

	return {
		...objInit,
		dataHocPhan,
		dataTruongHoc,
		postSinhVienQuyDoiPhieuModel,
		selectTruongHocDebounceModel,
	};
};
