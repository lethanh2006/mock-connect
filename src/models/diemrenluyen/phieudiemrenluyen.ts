import useInitModel from '@/hooks/useInitModel';
import { getCauHinhPhieu, postKetQuaChamDiemRL, sinhVienGetKetQua } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen';
import { type EVaiTroPhieuDiem } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/constants';
import { type PhieuDiemRenLuyen } from '@/services/DiemRenLuyen/PhieuDiemRenLuyen/typing';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
	const objInitModel = useInitModel('phieu-diem-ren-luyen');
	const { setLoading } = objInitModel;

	const [isLoadingKetQuaChamDiem, setIsLoadingKetQuaChamDiem] = useState(false);
	const [ketQuaChamDiem, setKetQuaChamDiem] = useState<PhieuDiemRenLuyen.IKetQua>();
	const [visiblePhieuDiem, setVisiblePhieuDiem] = useState(false);

	const getCauHinhPhieuDiemModel = async (): Promise<PhieuDiemRenLuyen.ICauHinhPhieu | null> => {
		setIsLoadingKetQuaChamDiem(true);
		try {
			const res = await getCauHinhPhieu();

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setIsLoadingKetQuaChamDiem(false);
		}
	};

	const sinhVienGetKetQuaModel = async (idDotChamDiem: string): Promise<PhieuDiemRenLuyen.IKetQua> => {
		setLoading(true);
		try {
			const res = await sinhVienGetKetQua(idDotChamDiem);
			setKetQuaChamDiem(res.data?.data);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const postKetQuaChamDiemModel = async (
		role: EVaiTroPhieuDiem,
		idKetQua: string,
		type: 'luu' | 'nop',
		diemCham: Partial<PhieuDiemRenLuyen.IDiemCham>,
	): Promise<PhieuDiemRenLuyen.IKetQua> => {
		setLoading(true);
		try {
			const res = await postKetQuaChamDiemRL(role, idKetQua, type, diemCham);
			message.success(`${type === 'luu' ? 'Lưu' : 'Gửi'} phiếu điểm rèn luyện thành công`);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInitModel,
		isLoadingKetQuaChamDiem,
		ketQuaChamDiem,
		setKetQuaChamDiem,
		getCauHinhPhieuDiemModel,
		sinhVienGetKetQuaModel,
		postKetQuaChamDiemModel,
		setVisiblePhieuDiem,
		visiblePhieuDiem,
	};
};
