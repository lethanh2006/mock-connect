import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { ExportType } from '../DeTaiKHCN/constants';

export const giaoQuyetDinh = (idQuyetDinhGiao: string) => {
	return axios.put(`${ip3}/quyet-dinh-cong-nhan/${idQuyetDinhGiao}/giao-qd`);
};

export const exportQuyetDinhCongNhan = (idQuyetDinhGiao: string, exportType: ExportType) => {
	return axios.get(`${ip3}/quyet-dinh-cong-nhan/${idQuyetDinhGiao}/export`, {
		params: {
			exportType,
		},
		responseType: 'arraybuffer',
	});
};
