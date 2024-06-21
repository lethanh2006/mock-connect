import useInitModel from '@/hooks/useInitModel';
import type { ETrangThaiHocSv } from '@/services/DaoTao/constant';
import { getIdBieuMauDaTraLoi, initBieuMauTracNghiem, traLoiBieuMau } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiBieuMau, type EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, {
		loai: ELoaiBieuMau.KHAO_SAT,
	});
	const { setLoading, condition, setVisibleForm, getModel, formSubmiting, setFormSubmiting } = objInit;
	const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);

	const getBieuMauUserModel = async (loaiParam?: ELoaiBieuMau) =>
		getModel({ loai: loaiParam }, undefined, undefined, undefined, undefined, 'my/pageable');

	const getIdBieuMauDaTraLoiModel = async () => {
		setLoading(true);
		const response = await getIdBieuMauDaTraLoi(condition?.loai);
		setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
		setLoading(false);
	};

	const initBieuMauTracNghiemModel = async (idDot: string, idKhaoSat: string) => {
		setLoading(true);
		await initBieuMauTracNghiem({ idKhaoSat, idDot });
		setLoading(false);
	};

	const traLoiBieuMauModel = async (payload: {
		idKhaoSat: string;
		danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]>;
		idDot: string;
		vaiTroNguoiKhaoSat: EVaiTroKhaoSat;
		trangThaiSinhVien?: ETrangThaiHocSv;
		danToc?: string;
		gioiTinh?: string;
	}): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await traLoiBieuMau(payload);
			message.success('Gửi câu trả lời thành công');
			// getIdBieuMauDaTraLoiModel();

			setVisibleForm(false);
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getBieuMauUserModel,
		getIdBieuMauDaTraLoiModel,
		listIdBieuMauDaTraLoi,
		setListIdBieuMauDaTraLoi,
		initBieuMauTracNghiemModel,
		traLoiBieuMauModel,
	};
};
