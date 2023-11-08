import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';
import type { KhaiBaoQuyTrinh } from '@/services/KhaiBaoQuyTrinh/typings';
import {  getQuyTrinhChuyenVien } from '@/services/KhaiBaoQuyTrinh/khaibaoquytrinh';

export default () => {
	const objInit = useInitModel<KhaiBaoQuyTrinh.IRecord>('don-quy-trinh-dong');
	const { setDanhSach, setLoading, setTotal, page, limit, condition,getModel } = objInit;
	const [current, setCurrent] = useState<KhaiBaoQuyTrinh.IBuocXuLy>();
	const [currentFormKhaiBao, setCurrentFormKhaiBao] = useState<KhaiBaoQuyTrinh.IDanhSachForm>();
	const [recordFormKhaiBao, setRecordFormKhaiBao] = useState<any>();
	const [visibleFormQuyTrinh, setVisibleFormQuyTrinh] = useState<boolean>(false);
	const [editFormKhaiBao, setEditFormKhaiBao] = useState<boolean>(false);
	const [visibleFormKhaiBaoQuyTrinh, setVisibleFormKhaiBaoQuyTrinh] = useState<boolean>(false);
	const [dataQuyTrinh, setDataQuyTrinh] = useState<KhaiBaoQuyTrinh.IRecord>();

	const [recordSanPham, setRecordSanPham] = useState<KhaiBaoQuyTrinh.IRecord>();


	const getDataKhaiBaoUser = async () => getModel(undefined,undefined,undefined,undefined,undefined,'user/page');

	const getQuyTrinhChuyenVienModel = async (loaiXuLyDon: string) => {
		try {
			setLoading(true);
			const res = await getQuyTrinhChuyenVien(loaiXuLyDon, { page, limit, condition });
			if (res) {
				setDanhSach(res?.data?.data?.result ?? []);
				setTotal(res?.data?.data?.total ?? 0);
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		current,
		setCurrent,
		dataQuyTrinh,
		setDataQuyTrinh,
		visibleFormQuyTrinh,
		setVisibleFormQuyTrinh,
		visibleFormKhaiBaoQuyTrinh,
		setVisibleFormKhaiBaoQuyTrinh,
		currentFormKhaiBao,
		setCurrentFormKhaiBao,
		getQuyTrinhChuyenVienModel,
		recordFormKhaiBao,
		setRecordFormKhaiBao,
		setEditFormKhaiBao,
		editFormKhaiBao,
		getDataKhaiBaoUser,recordSanPham,setRecordSanPham
	};
};
