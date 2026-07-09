import {
	deleteDangKyTinChi,
	getChiTietHocPhanDangKyTinChi,
	getDotAvailable,
	getLichDangKyTinChiTrongKhoang,
	getLopDaHuyDangKyTinChi,
	getLopDangKy,
	getPhieuDangKy,
	getSinhVienDot,
	postDangKyTinChi,
	revertLopDangKyTinDaHuy,
} from '@/services/DaoTao/DangKyTinChi';
import { ETrangThaiDangKyTinChi, ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { message } from 'antd';
import { useState } from 'react';
import { getIntl } from 'umi';

export default () => {
	const intl = getIntl();
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleRegister, setVisibleRegister] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [formSubmiting, setFormSubmiting] = useState<boolean>();
	const [dotDangKyHienTai, setDotDangKyHienTai] = useState<DangKyTinChi.IDotDangKy>(); // Đợt đăng ký tín chỉ hiện tại trong kỳ, back trả về
	const [phieuDangKy, setPhieuDangKy] = useState<DangKyTinChi.IPhieuDangKy>(); // Phiếu đăng ký tín chỉ trong học kỳ, back tự tính
	const [danhSachLopDangKy, setDanhSachLopDangKy] = useState<DangKyTinChi.ILopDangKy[]>([]); // Danh sách lớp hp đăng ký, bao gồm cả các lớp mới thêm
	const [danhSachLopDaHuy, setDanhSachLopDaHuy] = useState<DangKyTinChi.AuditLog[]>([]); //Danh sách lớp sinh viên đã hủy đăng ký
	const [chiTietHocPhan, setChiTietHocPhan] = useState<DangKyTinChi.IChiTietHocPhanDangKyTinChi>();
	// Dữ liệu lịch học cho các lớp đang đăng ký hiện tại
	// Dưới dạng { "DDMMYY": [true, true, false, false, true, true]...}
	// Mỗi ngày tương ứng với mảng các tiết học trong ngày đó: true => Có lớp học trong tiết tương ứng
	const [dataLichHoc, setDataLichHoc] = useState<Record<string, boolean[]>>({});
	const [sinhVienDot, setSinhVienDot] = useState<DangKyTinChi.ISinhVienDotDangKy>();

	const getDotDangKyAvailableModel = async (maHocKy: string): Promise<DangKyTinChi.IDotDangKy> => {
		setLoading(true);
		setPhieuDangKy(undefined);
		setSinhVienDot(undefined);
		let sinhVienDotData: DangKyTinChi.ISinhVienDotDangKy | undefined;
		let dotData: DangKyTinChi.IDotDangKy | undefined;

		try {
			const res = await getDotAvailable(maHocKy);
			dotData = res.data?.data;
			setDotDangKyHienTai(dotData);

			if (dotData?._id) {
				const res1 = await getSinhVienDot(dotData._id);
				sinhVienDotData = res1.data?.data;
				setSinhVienDot(sinhVienDotData);
			} else {
				setSinhVienDot(undefined);
			}

			return dotData as DangKyTinChi.IDotDangKy;
		} catch (er) {
			setDotDangKyHienTai(undefined);
			setSinhVienDot(undefined);
			return Promise.reject(er);
		} finally {
			setLoading(false);
			if (sinhVienDotData?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK && dotData?._id) {
				void getPhieuDangKyModel(dotData._id);
			}
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
			const date = dayjs(item.ngay).format('DDMMYY');
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
			const date = dayjs(item.ngay).format('DDMMYY');
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

		try {
			const res = await getLopDangKy(maHocKy);

			const mapLop = (
				list: LopHocPhan.IRecordSinhVienLopHP[],
				isWaitlist: boolean = false,
			): DangKyTinChi.ILopDangKy[] =>
				list
					?.filter((item) => item.lopHocPhan?.trangThaiLop === ETrangThaiLopHocPhan.MO)
					?.map((item) => ({
						...item.lopHocPhan,
						_id: item.lopHocPhanId,
						ten: item.lopHocPhan.ten,
						soTinChi: item.lopHocPhan?.hocPhan?.soTinChi ?? 0,
						loai: item.loai,
						loaiLop: item.lopHocPhan.loai,
						maKhoaNganh: item.maKhoaNganh,
						isWaitlist,
						trangThai: ETrangThaiDangKyTinChi.DA_DANG_KY,
					})) ?? [];

			const lop = res.data?.data?.registeredList ?? res.data?.data ?? []; // Back trả về có thể là {registeredList: [], waitlistList: []} hoặc chỉ là mảng lớp đã đăng ký
			const waitList = res.data?.data?.waitlistList ?? [];

			const lopDangKy = mapLop(lop, false);
			const lopWaitList = mapLop(waitList, true);

			const result = [...lopDangKy, ...lopWaitList];

			setDanhSachLopDangKy((prev) => {
				const maHocPhanDaDangKy = new Set(result.map((item) => item.maHocPhan).filter(Boolean));
				const lopChuaDangKy = prev.filter(
					(item) =>
						item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY &&
						item.maHocPhan &&
						!maHocPhanDaDangKy.has(item.maHocPhan),
				);
				const merged = [...lopChuaDangKy, ...result];
				tinhDataLichHoc(merged);
				return merged;
			});

			return result;
		} catch (er) {
			setDanhSachLopDangKy([]);
			setDataLichHoc({});
			return Promise.reject(er);
		}
	};

	const postDangKyTinChiModel = async (
		data: {
			dangKy: { lopHocPhanId: string; maKhoaNganh: string };
			phieuDktcId: string;
		},
		messageText?: string,
	): Promise<LopHocPhan.IRecordSinhVienLopHP> => {
		try {
			const res = await postDangKyTinChi(data);
			message.success(messageText ?? intl.formatMessage({ id: 'dangkytinchi.thongbao.dangky' }));

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		}
	};

	const deleteDangKyTinChiModel = async (
		data: { phieuDktcId: string; lopHocPhanId: string },
		messageText?: string,
	): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await deleteDangKyTinChi(data);
			message.success(messageText ?? intl.formatMessage({ id: 'dangkytinchi.thongbao.huydangky' }));

			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	const getLopDaHuyDangKyTinChiModel = async (idPhieuDktc: string): Promise<DangKyTinChi.ILopDangKy[]> => {
		setLoading(true);
		try {
			const res = await getLopDaHuyDangKyTinChi(idPhieuDktc);
			setDanhSachLopDaHuy(res.data?.data);
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getLichDangKyTinChiTrongKhoangModel = async (payload: {
		fromDate: string;
		toDate: string;
	}): Promise<DangKyTinChi.IDotDangKy[]> => {
		try {
			const res = await getLichDangKyTinChiTrongKhoang(payload);
			return res.data?.data ?? [];
		} catch (er) {
			return Promise.reject(er);
		}
	};

	const getChiTietHocPhanDangKyTinChiModel = async (
		maHocPhan: string,
		maKhoaNganh: string,
	): Promise<DangKyTinChi.IChiTietHocPhanDangKyTinChi> => {
		setLoading(true);
		try {
			const res = await getChiTietHocPhanDangKyTinChi(maHocPhan, maKhoaNganh);
			const data: DangKyTinChi.IChiTietHocPhanDangKyTinChi = res.data?.data;
			setChiTietHocPhan(data);
			return data;
		} catch (er) {
			setChiTietHocPhan(undefined);
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const revertLopDangKyTinDaHuyModel = async (idAuditLog: string, getData?: () => void): Promise<any> => {
		if (formSubmiting) return Promise.reject('Form submitting');
		setFormSubmiting(true);
		try {
			const res = await revertLopDangKyTinDaHuy(idAuditLog);
			message.success(intl.formatMessage({ id: 'global.message.luuthanhcong' }));

			if (getData) getData();
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		formSubmiting,
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
		sinhVienDot,
		chiTietHocPhan,
		danhSachLopDaHuy,
		getLopDaHuyDangKyTinChiModel,
		getLichDangKyTinChiTrongKhoangModel,
		getChiTietHocPhanDangKyTinChiModel,
		revertLopDangKyTinDaHuyModel,
	};
};
