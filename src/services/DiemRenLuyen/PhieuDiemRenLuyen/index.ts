import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { type PhieuDiemRenLuyen } from './typing';
import { type EVaiTroPhieuDiem } from './constants';

export function getCauHinhPhieu() {
	interface ResponseSuccess {
		data: null;
		success: boolean;
	}
	return axios.get<ResponseSuccess>(`${ip3}/phieu-diem-ren-luyen/hien-tai`);
}

export function sinhVienGetKetQua(idDotChamDiem: string) {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/dot-cham-diem/${idDotChamDiem}/sinh-vien/ket-qua`);
}

export function postKetQuaChamDiemRL(
	role: EVaiTroPhieuDiem,
	idKetQua: string,
	type: 'luu' | 'nop',
	payload: Partial<PhieuDiemRenLuyen.IDiemCham>,
) {
	return axios.post(`${ip3}/phieu-diem-ren-luyen/${role}/ket-qua/${idKetQua}/${type}`, payload);
}
