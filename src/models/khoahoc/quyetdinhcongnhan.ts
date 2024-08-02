import useInitModel from '@/hooks/useInitModel';
import type { ExportType } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { exportQuyetDinhCongNhan, giaoQuyetDinh } from '@/services/KhoaHoc/QuyetDinhCongNhan';
import type { QuyetDinhCongNhan } from '@/services/KhoaHoc/QuyetDinhCongNhan/typings';
import FileDownload from 'js-file-download';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuyetDinhCongNhan.IRecord>('quyet-dinh-cong-nhan');
	const { setLoading } = objInit;
	const [visibleViewDetail, setVisibleViewDetail] = useState<boolean>(false);

	const giaoQuyetDinhModel = async (idQuyetDinhCongNhan: string, getData: any) => {
		setLoading(true);
		await giaoQuyetDinh(idQuyetDinhCongNhan);
		setLoading(false);
		getData();
	};

	const exportQuyetDinhCongNhanModel = async (
		idQuyetDinhCongNhan: string,
		exportType: ExportType,
		tenQuyetDinh: string,
	) => {
		setLoading(true);
		const res = await exportQuyetDinhCongNhan(idQuyetDinhCongNhan, exportType);
		FileDownload(res.data, `${tenQuyetDinh}.docx`);
		setLoading(false);
	};

	return {
		...objInit,
		exportQuyetDinhCongNhanModel,
		giaoQuyetDinhModel,
		visibleViewDetail,
		setVisibleViewDetail,
	};
};
