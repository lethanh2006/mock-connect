import { EOperatorType } from '@/components/Table/constant';
import useInitModel from '@/hooks/useInitModel';
import { getDotDanhGiaTietHoc } from '@/services/TienIch/KhaoSat/DotKhaoSat';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { ELoaiDot, EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DotKhaoSat.IRecord>('dot-khao-sat');
	const [thoiGian, setThoiGian] = useState<EThoiGianDot>(EThoiGianDot.DANG_DIEN_RA);
	const { getModel, setLoading, setRecord } = objInit;

	const getDotMeModel = () =>
		getModel(
			{ kichHoat: true },
			[
				{
					active: true,
					field: 'loai',
					operator: EOperatorType.EQUAL,
					values: [ELoaiDot.BIEU_MAU],
				},
			],
			{ thoiGianKetThuc: -1 },
			undefined,
			undefined,
			'my/page',
			{ thoiGian },
		);

	const getDotDanhGiaTietHocModel = async (maHocKy: string): Promise<DotKhaoSat.IRecord> => {
		setLoading(true);
		try {
			const res = await getDotDanhGiaTietHoc(maHocKy);
			setRecord(res.data?.data);
			return res.data?.data;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getDotMeModel,
		thoiGian,
		setThoiGian,
		getDotDanhGiaTietHocModel,
	};
};
