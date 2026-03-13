import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';
import type { QuyTrinh } from '@/services/QuyTrinh/typings';
import { LoaiHinh } from '@/services/QuyTrinh/LoaiHinh/typing';
import { getQuyTrinhUser } from '@/services/QuyTrinh/quytrinh';

export default () => {
	const objInit = useInitModel<QuyTrinh.IRecord>('quy-trinh-dong');

	const { page, limit, condition, setDanhSach, setTotal } = objInit;
	const [current, setCurrent] = useState<number>(0);
	const [dataSending, setDataSending] = useState<QuyTrinh.IRecord>();

	const [visibleDanhSachBuocXuLy, setVisibleDanhSachBuocXuLy] = useState<boolean>(false);
	const [visiblePreview, setVisiblePreview] = useState<boolean>(false);
	const [editCauHinh, setEditCauHinh] = useState<boolean>(false);
	const [editMauDon, setEditMauDon] = useState<boolean>(false);

	const [visibleThemMoiCanBo, setVisibleThemMoiCanBo] = useState<boolean>(false);
	const [editCanBo, setEditCanBo] = useState<boolean>(false);
	const [recordCauHinh, setRecordCauHinh] = useState<LoaiHinh.TruongThongTin>();

	const [editCot, setEditCot] = useState<boolean>(false);
	const [recordCot, setRecordCot] = useState<LoaiHinh.Cot>();
	const [recordMauDon, setRecordMauDon] = useState<QuyTrinh.IMauDon>();
	const [recordBuocXuLy, setRecordBuocXuLy] = useState<QuyTrinh.IBuocXuLy>();
	const [recordBoPhanXuLy, setRecordBoPhanXuLy] = useState<QuyTrinh.IBoPhanXuLy>();
	const [recordBoPhanChiuTrachNhiem, setRecordBoPhanChiuTrachNhiem] = useState<QuyTrinh.IBoPhanXuLy>();

	const [visibleDanhSachMauDon, setVisibleDanhSachMauDon] = useState<boolean>(false);

	const [editBuocXuLy, setEditBuocXuLy] = useState<boolean>(false);

	const [visibleDanhSachBoPhan, setVisibleDanhSachBoPhan] = useState<boolean>(false);
	const [editBoPhan, setEditBoPhan] = useState<boolean>(false);
	const [recordNhanSu, setRecordNhanSu] = useState<any>();
	const [visibleDanhSachCanBoXuLy, setVisibleDanhSachCanBoXuLy] = useState<boolean>(false);

	//Dot khai bao
	const [visibleDot, setVisibleDot] = useState<boolean>(false);

	const [recordQuyTrinhForm, setRecordQuyTrinhForm] = useState<any>();


  const [type, setType] = useState<'ALL' | 'MY'>('ALL');


	const getDataByUser = async (loaiQuyTrinh: string) => {
		try {
			const res = await getQuyTrinhUser(loaiQuyTrinh, { page, limit, condition });
			if (res) {
				setDanhSach(res?.data?.data?.result ?? []);
				setTotal(res?.data?.data?.total ?? 0);
			}
		} catch (e) {
			console.log(e);
		}
	};
	return {
		...objInit,
		current,
		setCurrent,
		dataSending,
		setDataSending,
		visibleDanhSachMauDon,
		setVisibleDanhSachMauDon,
		visiblePreview,
		editCauHinh,
		recordCauHinh,
		setVisiblePreview,
		setEditCauHinh,
		setRecordCauHinh,
		editCot,
		recordCot,
		setEditCot,
		setRecordCot,
		recordMauDon,
		setRecordMauDon,
		visibleDanhSachBoPhan,
		visibleDanhSachBuocXuLy,
		setVisibleDanhSachBoPhan,
		setVisibleDanhSachBuocXuLy,
		recordBoPhanXuLy,
		setRecordBoPhanXuLy,
		visibleThemMoiCanBo,
		setVisibleThemMoiCanBo,
		recordNhanSu,
		setRecordNhanSu,
		editMauDon,
		setEditMauDon,
		editBoPhan,
		setEditBoPhan,
		editBuocXuLy,
		setEditBuocXuLy,
		editCanBo,
		setEditCanBo,
		recordBuocXuLy,
		setRecordBuocXuLy,
		visibleDanhSachCanBoXuLy,
		setVisibleDanhSachCanBoXuLy,
		visibleDot,
		setVisibleDot,
		recordQuyTrinhForm,
		setRecordQuyTrinhForm,
		recordBoPhanChiuTrachNhiem,
		setRecordBoPhanChiuTrachNhiem,getDataByUser,type,setType
	};
};
