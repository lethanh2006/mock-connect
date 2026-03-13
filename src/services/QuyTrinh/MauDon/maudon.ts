import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { LoaiDefaultValue } from '@/services/QuyTrinh/MauDon/constants';

export async function getDataDefault(loaiDefaultValue: LoaiDefaultValue) {
	return axios.get(`${ip3}/form-dong/default-value/${loaiDefaultValue}`);
}
export async function getDataDefaultV2(quyTrinhId: string, loaiForm: 'khai_bao' | 'tiep_nhan', maForm: string) {
	return axios.get(`${ip3}/form-dong/default-value/quy-trinh/${quyTrinhId}/${loaiForm}/form/${maForm}`);
}
