import { ip3 } from '@/utils/ip';
import { buildFormData } from '@/utils/utils';
import axios from 'axios';

export const getTemplateImportCheDoSinhVien = (idChinhSach: string) => {
	return axios.get(`${ip3}/che-do-sinh-vien/${idChinhSach}/import-template`, { responseType: 'arraybuffer' });
};

export const importCheDoSinhVien = (idCheDo: string, payload: { file: any }) => {
	const formData = buildFormData(payload);
	return axios.post(`${ip3}/quyet-dinh-cdsv/import/che-do-sinh-vien/${idCheDo}`, formData);
};

export const getDataThongKeJson = (idThongKe: string, payload: { filters: any }) => {
	return axios.get(`${ip3}/thong-ke-cdsv/${idThongKe}/execute/raw`, { params: payload });
};

export const getDataThongKeExcel = (id: string, payload?: { filters: string[] }) => {
	return axios.get(`${ip3}/thong-ke-cdsv/${id}/execute/excel`, { responseType: 'arraybuffer', params: payload });
};
export const getDataThongKeDocx = (id: string, payload?: { filters: string[] }) => {
	return axios.get(`${ip3}/thong-ke-cdsv/${id}/execute/docx`, { responseType: 'arraybuffer', params: payload });
};

export const exportCheDoSinhVien = (
	idCheDo: string,
	payload: {
		condition: any;
		filters: any[];
	},
) => axios.get(`${ip3}/quyet-dinh-cdsv/export/cdsv/${idCheDo}`, { responseType: 'arraybuffer', params: payload });
