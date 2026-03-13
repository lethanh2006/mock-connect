import useInitModel from '@/hooks/useInitModel';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import { useState } from 'react';

export default () => {
	const [editCauHinh, setEditCauHinh] = useState<boolean>(false);
	const [editCauHinhTinh, setEditCauHinhTinh] = useState<boolean>(false);
	const [editCot, setEditCot] = useState<boolean>(false);
	const [editTieuChi, setEditTieuChi] = useState<boolean>(false);
	const [editQuyDoiThanhVien, setEditQuyDoiThanhVien] = useState<boolean>(false);
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinhNCKH.TruongThongTin>();
	const [recordCauHinhTinh, setRecordCauHinhTinh] = useState<LoaiHinhNCKH.CauHinhTruongThongTinTinh>();
	const [recordDieuKienQuyDoi, setRecordDieuKienQuyDoi] = useState<LoaiHinhNCKH.DieuKienQuyDoi>();
	const [editDieuKienQuyDoi, setEditDieuKienQuyDoi] = useState<boolean>(false);
	const [recordCot, setRecordCot] = useState<LoaiHinhNCKH.Cot>();
	const [recordTieuChi, setRecordTieuChi] = useState<LoaiHinhNCKH.TieuChi>();
	const [recordQuyDoiThanhVien, setRecordQuyDoiThanhVien] = useState<LoaiHinhNCKH.QuyDoiThanhVien>();
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [recordStatic, setRecordStatic] = useState<LoaiHinhNCKH.IRecord>();
	const objInit = useInitModel<LoaiHinhNCKH.IRecord>('nckh/loai-hinh-nckh');
	return {
		...objInit,
		recordCauHinh,
		setRecordCauHinh,
		recordCauHinhTinh,
		setRecordCauHinhTinh,
		recordDieuKienQuyDoi,
		setRecordDieuKienQuyDoi,
		editDieuKienQuyDoi,
		setEditDieuKienQuyDoi,
		recordCot,
		setRecordCot,
		editCauHinh,
		setEditCauHinh,
		editCot,
		setEditCot,
		editTieuChi,
		setEditTieuChi,
		recordTieuChi,
		setRecordTieuChi,
		editQuyDoiThanhVien,
		setEditQuyDoiThanhVien,
		recordQuyDoiThanhVien,
		setRecordQuyDoiThanhVien,
		visiblePreview,
		setVisiblePreview,
		editCauHinhTinh,
		setEditCauHinhTinh,
		recordStatic,
		setRecordStatic,
	};
};
