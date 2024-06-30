import useInitModel from '@/hooks/useInitModel';
import type { ExportType } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { exportQuyetDinhGiao, giaoQuyetDinh } from '@/services/KhoaHoc/QuyetDinhGiao';
import type { QuyetDinhGiao } from '@/services/KhoaHoc/QuyetDinhGiao/typings';

import FileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuyetDinhGiao.IRecord>('quyet-dinh-giao');
	const { setLoading } = objInit;
	const [visibleViewDetail, setVisibleViewDetail] = useState<boolean>(false);

	const giaoQuyetDinhModel = async (idQuyetDinhGiao: string, getData: any) => {
		setLoading(true);
		await giaoQuyetDinh(idQuyetDinhGiao);
		setLoading(false);
		getData();
	};

	const exportQuyetDinhGiaoModel = async (idQuyetDinhGiao: string, exportType: ExportType, tenQuyetDinh: string) => {
		setLoading(true);
		const res = await exportQuyetDinhGiao(idQuyetDinhGiao, exportType);
		FileDownload(res.data, `${tenQuyetDinh}.docx`);
		setLoading(false);
	};

	return {
		...objInit,
		exportQuyetDinhGiaoModel,
		giaoQuyetDinhModel,
		visibleViewDetail,
		setVisibleViewDetail,
	};
};
