import useInitModel from '@/hooks/useInitModel';
import type { ETrangThaiHocSv } from '@/services/DaoTao/constant';
import { getBieuMauKhaoSatSinhVien, initBieuMauTracNghiem, traLoiBieuMau } from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiBieuMau, type EVaiTroKhaoSat } from '@/services/TienIch/KhaoSat/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, {
		loai: ELoaiBieuMau.KHAO_SAT,
	});
	const { setLoading, setVisibleForm, getModel, formSubmiting, setFormSubmiting, setRecord } = objInit;
	const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);

	const getBieuMauUserModel = async (loaiParam?: ELoaiBieuMau) =>
		getModel({ loai: loaiParam }, undefined, undefined, undefined, undefined, 'my/pageable');

	const initBieuMauTracNghiemModel = async (idDot: string, idKhaoSat: string) => {
		setLoading(true);
		await initBieuMauTracNghiem({ idKhaoSat, idDot });
		setLoading(false);
	};

	const traLoiBieuMauModel = async (
		payload: {
			idKhaoSat: string;
			danhSachTraLoi: Partial<BieuMau.TraLoiRecord[]>;
			idDot: string;
			vaiTroNguoiKhaoSat?: EVaiTroKhaoSat;
			trangThaiSinhVien?: ETrangThaiHocSv;
			danToc?: string;
			gioiTinh?: string;
			duDoanSoNguoiThamDu?: number;
			maLop?: string;
			lopHocPhanId?: string;
		},
		getData?: () => void,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await traLoiBieuMau(payload);
			message.success('Gửi câu trả lời thành công');
			// getIdBieuMauDaTraLoiModel();

			if (getData) getData();
			setVisibleForm(false);
			return res.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getBieuMauKhaoSatSinhVienModel = async (id: string | number, isSetRecord?: boolean): Promise<any> => {
		if (!id) return Promise.reject('Invalid id');
		setLoading(true);
		try {
			const response = await getBieuMauKhaoSatSinhVien(id);
			if (isSetRecord !== false) setRecord(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getBieuMauUserModel,
		listIdBieuMauDaTraLoi,
		setListIdBieuMauDaTraLoi,
		initBieuMauTracNghiemModel,
		traLoiBieuMauModel,
		getBieuMauKhaoSatSinhVienModel,
	};
};
