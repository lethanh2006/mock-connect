import useInitModel from '@/hooks/useInitModel';
import { exportCheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien';
import type { CheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/typings';
import { useState } from 'react';
import fileDownload from 'js-file-download';

export default () => {
	const objInit = useInitModel<CheDoSinhVien.QuyetDinhCheDoSinhVien>('quyet-dinh-cdsv');
	const [visibleView, setVisibleView] = useState<boolean>(false);
	const { setLoading, condition, filters } = objInit;
	const exportCheDoSinhVienModel = async (fileName: string, idCheDo: string) => {
		setLoading(true);
		const res = await exportCheDoSinhVien(idCheDo, { condition, filters });
		fileDownload(res?.data, `${fileName}.xlsx`);
		setLoading(false);
	};
	return {
		...objInit,
		visibleView,
		setVisibleView,
		exportCheDoSinhVienModel,
	};
};
