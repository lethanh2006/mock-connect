import type { ExportType } from '@/utils/constants';
import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const giaoQuyetDinh = (idQuyetDinhGiao: string) => {
	return axios.put(`${ip3}/quyet-dinh-giao/${idQuyetDinhGiao}/giao-qd`);
};

export const exportQuyetDinhGiao = (idQuyetDinhGiao: string, exportType: ExportType) => {
	return axios.get(`${ip3}/quyet-dinh-giao/${idQuyetDinhGiao}/export`, {
		params: {
			exportType,
		},
		responseType: 'arraybuffer',
	});
};
