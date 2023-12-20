import {
	deleteDangKyTinChi,
	getDotAvailable,
	getLopDangKy,
	getPhieuDangKy,
	postDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi';
import { ETrangThaiDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { message } from 'antd';
import moment from 'moment';
import { useState } from 'react';

export default () => {
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleRegister, setVisibleRegister] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>();
	const [dotDangKyHienTai, setDotDangKyHienTai] = useState<DangKyTinChi.IDotDangKy>(); // Đợt đăng ký tín chỉ hiện tại trong kỳ, back trả về
	const [phieuDangKy, setPhieuDangKy] = useState<DangKyTinChi.IPhieuDangKy>(); // Phiếu đăng ký tín chỉ trong học kỳ, back tự tính
	const [danhSachLopDangKy, setDanhSachLopDangKy] = useState<DangKyTinChi.ILopDangKy[]>([]); // Danh sách lớp hp đăng ký, bao gồm cả các lớp mới thêm
	// Dữ liệu lịch học cho các lớp đang đăng ký hiện tại
	// Dưới dạng { "DDMMYY": [true, true, false, false, true, true]...}
	// Mỗi ngày tương ứng với mảng các tiết học trong ngày đó: true => Có lớp học trong tiết tương ứng
	const [dataLichHoc, setDataLichHoc] = useState<Record<string, boolean[]>>({});

	const getDotDangKyAvailableModel = async (maHocKy: string): Promise<DangKyTinChi.IDotDangKy> => {
		setLoading(true);
		try {
			const res = await getDotAvailable(maHocKy);
			setDotDangKyHienTai(res.data?.data);

			return res.data?.data;
		} catch (er) {
			setDotDangKyHienTai(undefined);
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Tính lại dữ liệu lịch học cho các lớp đã đăng ký
	 * @param {DangKyTinChi.ILopDangKy[]} lopDangKy:DangKyTinChi.ILopDangKy[]
	 * @returns {Record<string, boolean[]>}
	 */
	const tinhDataLichHoc = (lopDangKy: DangKyTinChi.ILopDangKy[]): Record<string, boolean[]> => {
		const data: Record<string, boolean[]> = {};
		const allThoiKhoaBieu = lopDangKy.map((item) => item.thoiKhoaBieuList ?? []).flat();
		allThoiKhoaBieu.forEach((item) => {
			const date = moment(item.ngay).format('DDMMYY');
			if (!(date in data)) data[date] = [];

			for (let tiet = item.tietBatDau; tiet <= item.tietKetThuc; tiet++) data[date][tiet - 1] = true;
		});
		setDataLichHoc(data);
		return data;
	};

	/**
	 * Check trùng lịch học so với dữ liệu lịch hiện đang đăng ký
	 * @param {any} thoiKhoaBieuList:ThoiKhoaBieu.IRecord[] Danh sách thời khóa biểu cần check
	 * @returns {any} Có trùng hay ko?
	 */
	const checkTrungLich = (thoiKhoaBieuList: ThoiKhoaBieu.IRecord[]): boolean => {
		const isTrung = thoiKhoaBieuList.some((item) => {
			const date = moment(item.ngay).format('DDMMYY');
			if (!(date in dataLichHoc)) return false;

			for (let tiet = item.tietBatDau; tiet <= item.tietKetThuc; tiet++) if (dataLichHoc[date][tiet - 1]) return true;

			return false;
		});
		return isTrung;
	};

	const getPhieuDangKyModel = async (idDotDangKyTinChi: string): Promise<DangKyTinChi.IPhieuDangKy> => {
		if (!idDotDangKyTinChi) return Promise.reject('Invalid idDotDangKyTinChi');
		setLoading(true);
		try {
			const res = await getPhieuDangKy(idDotDangKyTinChi);
			const phieu: DangKyTinChi.IPhieuDangKy = res.data?.data;
			setPhieuDangKy(phieu);

			// const lopDangKy =
			//   phieu.lopHpSvList?.map((item) => ({
			//     ...item.lopHocPhan,
			//     _id: item.lopHocPhanId,
			//     soTinChi: item.lopHocPhan?.deCuong?.deCuong?.soTinChi ?? 0,
			//     loai: item.loai,
			//     trangThai: ETrangThaiDangKyTinChi.DA_DANG_KY,
			//   })) ?? [];
			// setDanhSachLopDangKy(lopDangKy);
			// tinhDataLichHoc(lopDangKy);

			return phieu;
		} catch (er) {
			setPhieuDangKy(undefined);
			// setDanhSachLopDangKy([]);
			// setDataLichHoc({});
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getLopDangKyModel = async (maHocKy: string): Promise<DangKyTinChi.ILopDangKy[]> => {
		if (!maHocKy) return Promise.reject('Invalid maHocKy');
		setLoading(true);
		try {
			const res = await getLopDangKy(maHocKy);
			const lop: LopHocPhan.IRecordSinhVienLopHP[] = res.data?.data ?? [];

			const lopDangKy =
				lop
					?.filter((item) => item.lopHocPhan?.trangThaiLop === ETrangThaiLopHocPhan.MO)
					?.map((item) => ({
						...item.lopHocPhan,
						_id: item.lopHocPhanId,
						ten: item.lopHocPhan.ten,
						soTinChi: item.lopHocPhan?.hocPhan?.soTinChi ?? 0,
						loai: item.loai,
						trangThai: ETrangThaiDangKyTinChi.DA_DANG_KY,
					})) ?? [];
			setDanhSachLopDangKy(lopDangKy);
			tinhDataLichHoc(lopDangKy);

			return lopDangKy;
		} catch (er) {
			setDanhSachLopDangKy([]);
			setDataLichHoc({});
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const postDangKyTinChiModel = async (data: {
		dangKy: { lopHocPhanId: string };
		phieuDktcId: string;
	}): Promise<LopHocPhan.IRecordSinhVienLopHP> => {
		try {
			const res = await postDangKyTinChi(data);

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		}
	};

	const deleteDangKyTinChiModel = async (data: { phieuDktcId: string; lopHocPhanId: string }): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await deleteDangKyTinChi(data);
			message.success('Hủy đăng ký thành công');

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		visibleRegister,
		setVisibleRegister,
		visibleModal,
		setVisibleModal,
		loading,
		dotDangKyHienTai,
		setDotDangKyHienTai,
		getDotDangKyAvailableModel,
		phieuDangKy,
		setPhieuDangKy,
		getPhieuDangKyModel,
		getLopDangKyModel,
		postDangKyTinChiModel,
		deleteDangKyTinChiModel,
		danhSachLopDangKy,
		setDanhSachLopDangKy,
		dataLichHoc,
		tinhDataLichHoc,
		checkTrungLich,
	};
};
