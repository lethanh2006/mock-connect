import useInitModel from '@/hooks/useInitModel';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';
import {
	chuyenDotSanPham,
	deleteService,
	exportSanPham,
	getQuyDoiGioTheoCongThuc,
	putQuyDoiGioSanPhamNCKH,
	putSanPhamSauDuyet,
	putService,
	tiepNhanSanPhamNCKH,
	xacNhanHoanThanh,
} from '@/services/KhoaHoc/SanPhamNCKH';
import { ETrangThaiSanPham } from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { gioNCKHBySsoId } from '@/services/KhoaHoc/ThongKe';
import { chuanHoaObject } from '@/utils/utils';
import { message } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<SanPhamNCKH.IRecord>('nckh/san-pham-nckh');
	const {
		setLoading,
		total,
		page,
		limit,
		setPage,
		formSubmiting,
		setFormSubmiting,
		setVisibleForm,
		getModel,
		condition,
		filters,
	} = objInit;

	const [quyDoiGio, setQuyDoiGio] = useState<Record<string, SanPhamNCKH.KetQuaTinhGioThanhVien[]>>({});
	const [quyDoiDiem, setQuyDoiDiem] = useState<Record<string, SanPhamNCKH.KetQuaTinhGioThanhVien[]>>({});
	const [recordQuyDoiGio, setRecordQuyDoiGio] = useState<SanPhamNCKH.KetQuaTinhGioThanhVien>();
	const [dataThongKeGio, setDataThongKeGio] = useState<SanPhamNCKH.DataThongKe[]>([]);
	const [dataThongKeDiem, setDataThongKeDiem] = useState<SanPhamNCKH.DataThongKe[]>([]);
	const [visibleViewSanPham, setVisibleViewSanPham] = useState<boolean>(false);
	const [visibleViewQuyDoiGio, setVisibleViewQuyDoiGio] = useState<boolean>(false);
	const [recordKetQuaTinhGioThanhVien, setRecordKetQuaTinhGioThanhVien] =
		useState<SanPhamNCKH.KetQuaTinhGioThanhVien>();
	const [editKetQuaTinhGioThanhVien, setEditKetQuaTinhGioThanhVien] = useState<boolean>(false);
	const [recordThongTinGio, setRecordThongTinGio] = useState<SanPhamNCKH.ThongTinGio>();
	const [editThongTinGio, setEditThongTinGio] = useState<boolean>(false);
	const [dataSelectView, setDataSelectView] = useState<SanPhamNCKH.IRecord[]>([]);
	const [ketQuaSearch, setKetQuaSearch] = useState<SanPhamNCKH.IRecord[]>([]);
	const [visibleKetQuaSearch, setVisibleKetQuaSearch] = useState<boolean>(false);
	const [current, setCurrent] = useState<number>(0);
	const [loadingSearchSanPham, setLoadingSearchSanPham] = useState<boolean>(false);
	const [isXacNhanHoanThanh, setIsXacNhanHoanThanh] = useState<boolean>(false);

	const getDataThongKe = async (ssoId: string, listIdNamHoc: string[], mode: 'GIO' | 'DIEM') => {
		const res = await gioNCKHBySsoId(listIdNamHoc || [], ssoId, mode);
		if (mode === 'GIO') setDataThongKeGio(res?.data?.data ?? []);
		else setDataThongKeDiem(res?.data?.data ?? []);
	};

	const getModelSelect = async (paramCondition: any) => {
		try {
			const obj = await objInit.getModel(
				paramCondition,
				undefined,
				{ createdAt: -1 },
				undefined,
				undefined,
				undefined,
				undefined,
				false,
			);
			setDataSelectView(obj);
		} catch (e) {
			console.log(e);
		}
	};

	const getSanPhamDaKhaiBao = (paramCondition?: any, otherQuery?: any) => {
		getModel(paramCondition, undefined, undefined, undefined, undefined, 'user/page', otherQuery);
	};

	const getQuyDoiGioTheoCongThucModel = async (
		namHocId: string,
		mode: 'GIO' | 'DIEM',
		payload: {
			danhSachThanhVien: SanPhamNCKH.ThanhVienNCKH[];
			thongTinKhaiBao: LoaiHinhNCKH.TruongThongTin[];
			soLuongThanhVien: number;
			thongTinThoiGian: SanPhamNCKH.TimeConfig;
			loaiHinhNckhId: string;
		},
	) => {
		try {
			setLoading(true);
			const res = await getQuyDoiGioTheoCongThuc(namHocId, mode, payload);
			if (mode === 'GIO') setQuyDoiGio({ ...quyDoiGio, [namHocId]: res?.data?.data ?? [] });
			else setQuyDoiDiem({ ...quyDoiDiem, [namHocId]: res?.data?.data ?? [] });
			setLoading(false);
			return res?.data?.data ?? [];
		} catch (err) {
			setLoading(false);
		}
	};

	const putQuyDoiGioSanPhamNCKHModel = async (
		idSanPhamNCKH: string,
		payload: {
			namHocId: string;
			danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[];
		},
		getData: any,
		mode: 'GIO' | 'DIEM',
	) => {
		setLoading(true);
		await putQuyDoiGioSanPhamNCKH(idSanPhamNCKH, payload, mode);
		message.success('Lưu thành công');
		if (getData) getData();
		setLoading(false);
	};

	const tiepNhanSanPhamNCKHModel = async (
		idSanPhamNCKH: string,
		payload: {
			ketQuaTiepNhan: ETrangThaiSanPham;
			ghiChuTiepNhan?: string;
		},
		getData: any,
	) => {
		setLoading(true);
		await tiepNhanSanPhamNCKH(idSanPhamNCKH, payload);
		setVisibleViewSanPham(false);
		message.success('Lưu thành công');
		if (getData) getData();
		setLoading(false);
	};

	const putModel = async (
		id: string | number,
		payload: any,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('form submiting');
		setFormSubmiting(true);
		try {
			const res = await putService(id, chuanHoaObject(payload));
			message.success('Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const putSanPhamSauDuyetModel = async (
		id: string,
		payload: any,
		getData?: any,
		notGet?: boolean,
		closeModal?: boolean,
		messageText?: string,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await putSanPhamSauDuyet(id, chuanHoaObject(payload));
			message.success(messageText ?? 'Lưu thành công');
			setLoading(false);
			if (getData) getData();
			else if (!notGet) getModel();
			if (closeModal !== false) setVisibleForm(false);

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	const deleteModel = async (id: string | number, getData?: () => void): Promise<any> => {
		setLoading(true);
		try {
			const res = await deleteService(id);
			message.success('Xóa thành công');
			const maxPage = Math.ceil((total - 1) / limit) || 1;
			let newPage = page;
			if (newPage > maxPage) {
				newPage = maxPage;
				setPage(newPage);
			} else if (getData) getData();
			else getModel(undefined, undefined, undefined, newPage);

			return res.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoading(false);
		}
	};

	const searchSanPhamModel = async (textQuery: string, idSanPhamNCKH: string, recLoaiHinh: LoaiHinhNCKH.IRecord) => {
		setLoadingSearchSanPham(true);
		const res = await getModel(
			{
				$and: [
					{
						thongTinKhaiBao: {
							$elemMatch: { ma: recLoaiHinh.searchKey1, value: { $regex: textQuery, $options: 'i' } },
						},
					},
				],
				loaiHinhNckhId: recLoaiHinh._id,
				trangThaiSanPham: { $nin: [ETrangThaiSanPham.DANG_THUC_HIEN] } as any,
			},
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			undefined,
			false,
		);
		const dataFinal = res?.filter((item) => item._id !== idSanPhamNCKH);

		if (dataFinal?.length) {
			setKetQuaSearch(dataFinal);
			setVisibleKetQuaSearch(true);
			setLoadingSearchSanPham(false);
			return true;
		}
		setLoadingSearchSanPham(false);
		return false;
	};

	const exportSanPhamModel = async (loaiSanPham: string, paramCondition?: any) => {
		try {
			setLoading(true);
			const res = await exportSanPham({ condition: { ...condition, ...paramCondition }, filters });
			fileDownload(res?.data, `${loaiSanPham}_${moment().format('HH:mm DD/MM/YYYY')}.xlsx`);
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const xacNhanHoanThanhModel = async (idSanPham: string, payload: SanPhamNCKH.IRecord, getData: any) => {
		setLoading(true);
		await xacNhanHoanThanh(idSanPham, payload);
		message.success('Xử lý thành công');
		if (getData) getData();
		setVisibleForm(false);
	};

	const chuyenDotSanPhamModel = async (idSanPham: string, idDot: string, getData: any) => {
		setLoading(true);
		await chuyenDotSanPham(idSanPham, idDot);
		message.success('Xử lý thành công');
		if (getData) getData();
		setLoading(false);
	};

	return {
		...objInit,
		getDataThongKe,
		dataThongKeGio,
		setDataThongKeGio,
		dataThongKeDiem,
		setDataThongKeDiem,
		isXacNhanHoanThanh,
		setIsXacNhanHoanThanh,
		xacNhanHoanThanhModel,
		chuyenDotSanPhamModel,
		searchSanPhamModel,
		getQuyDoiGioTheoCongThucModel,
		quyDoiGio,
		setQuyDoiGio,
		quyDoiDiem,
		setQuyDoiDiem,
		putQuyDoiGioSanPhamNCKHModel,
		tiepNhanSanPhamNCKHModel,
		visibleViewSanPham,
		setVisibleViewSanPham,
		visibleViewQuyDoiGio,
		setVisibleViewQuyDoiGio,
		recordKetQuaTinhGioThanhVien,
		setRecordKetQuaTinhGioThanhVien,
		editKetQuaTinhGioThanhVien,
		setEditKetQuaTinhGioThanhVien,
		recordQuyDoiGio,
		setRecordQuyDoiGio,
		setRecordThongTinGio,
		recordThongTinGio,
		editThongTinGio,
		setEditThongTinGio,
		putModel,
		deleteModel,
		getModelSelect,
		dataSelectView,
		ketQuaSearch,
		setKetQuaSearch,
		visibleKetQuaSearch,
		setVisibleKetQuaSearch,
		current,
		setCurrent,
		getSanPhamDaKhaiBao,
		putSanPhamSauDuyetModel,
		exportSanPhamModel,
		loadingSearchSanPham,
		setLoadingSearchSanPham,
	};
};
