import useInitModel from '@/hooks/useInitModel';
import { getTemplateImportCheDoSinhVien, importCheDoSinhVien } from '@/services/CheDoSinhVien';
import type { CheDoSinhVien } from '@/services/CheDoSinhVien/typings';
import { useState } from 'react';
import fileDownload from 'js-file-download';
import { message } from 'antd';
import type { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';

export default () => {
	const objInit = useInitModel<CheDoSinhVien.IRecord>('che-do-sinh-vien');
	const { setLoading } = objInit;
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinh.TruongThongTin>();
	const [editCot, setEditCot] = useState<boolean>(false);
	const [recordCot, setRecordCot] = useState<LoaiHinh.Cot>();
	const [editCauHinh, setEditCauHinh] = useState<boolean>(false);
	const [visibleViewForm, setVisibleViewForm] = useState<boolean>(false);
	const [visibleImport, setVisibleImport] = useState<boolean>(false);

	const getTemplateImportCheDoSinhVienModel = async (idCheDo: string) => {
		setLoading(true);
		const res = await getTemplateImportCheDoSinhVien(idCheDo);
		fileDownload(res.data, 'Mẫu Import.xlsx');
		setLoading(false);
	};

	const importCheDoSinhVienModel = async (idCheDo: string, payload: { file: any }, getData: any) => {
		try {
			setLoading(true);
			await importCheDoSinhVien(idCheDo, payload);
			message.success('Import thành công');
			setVisibleImport(false);
			if (getData) getData();
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	return {
		...objInit,
		recordCauHinh,
		setRecordCauHinh,
		editCot,
		setEditCot,
		recordCot,
		setRecordCot,
		editCauHinh,
		setEditCauHinh,
		visibleViewForm,
		setVisibleViewForm,
		getTemplateImportCheDoSinhVienModel,
		importCheDoSinhVienModel,
		visibleImport,
		setVisibleImport,
	};
};
