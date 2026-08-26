import { TrangThaiDonDangKyHocDuThinh } from '@/services/DaoTao/DkDuThinh/constant';
import {
	ELoaiDangKyTheoLop,
	ELoaiHocPhanDangKyTinChi,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { type KhoaNganh } from '@/services/DaoTao/KhoaNganh/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { formatDateRange } from '@/utils/formatDate';
import _ from 'lodash';

export const renderKhoangThoiGian = (rec: { thoiKhoaBieuList?: ThoiKhoaBieu.IRecord[] }) => {
	const thoiKhoaBieuList = rec.thoiKhoaBieuList ?? [];
	if (!thoiKhoaBieuList.length) return null;

	const start = _.minBy(thoiKhoaBieuList, (item) => dayjs(item.ngay).valueOf())?.ngay;
	const end = _.maxBy(thoiKhoaBieuList, (item) => dayjs(item.ngay).valueOf())?.ngay;
	if (!start || !end) return null;

	return formatDateRange(start, end);
};

export const buildDanhSachLopHienThi = (danhSachLopDangKy: DangKyTinChi.ILopDangKy[]): DangKyTinChi.ILopDangKy[] => {
	const hocPhanCoLopThucHanh = new Set<string>();
	const maHoaLichHocTheoHocPhan: Record<string, LopHocPhan.TMaHoaLichHoc[]> = {};

	danhSachLopDangKy.forEach((item) => {
		if (item.tenCha && item.maHocPhan) hocPhanCoLopThucHanh.add(item.maHocPhan);
		if (item.maHocPhan) {
			maHoaLichHocTheoHocPhan[item.maHocPhan] = [
				...(maHoaLichHocTheoHocPhan[item.maHocPhan] ?? []),
				...(item.maHoaLichHoc ?? []),
			];
		}
	});

	return danhSachLopDangKy
		.filter((item) => !item.maHocPhan || !hocPhanCoLopThucHanh.has(item.maHocPhan) || !!item.tenCha)
		.map((item) =>
			item.maHocPhan && hocPhanCoLopThucHanh.has(item.maHocPhan)
				? {
					...item,
					maHoaLichHoc: maHoaLichHocTheoHocPhan[item.maHocPhan] ?? [],
				}
				: item,
		);
};

/** Lớp có đăng ký dự thính (bất kể trạng thái duyệt) */
export const isLopDuThinh = (item?: DangKyTinChi.ILopDangKy) =>
	!!(item?.dangKyHocDuThinh?._id || item?.dangKyHocDuThinh?.trangThai);

/** Dự thính đã được giảng viên phê duyệt */
export const isDuThinhDaDuyet = (item?: DangKyTinChi.ILopDangKy) =>
	item?.dangKyHocDuThinh?.trangThai === TrangThaiDonDangKyHocDuThinh.DA_DUYET;

/** Lớp có được tính vào tổng số tín chỉ đăng ký không (loại học phần không tính, lớp đăng ký dự thính) */
export const isTinhTinChiDangKy = (item: DangKyTinChi.ILopDangKy) =>
	item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy !== false && !isLopDuThinh(item);

export const tinhTongTinChi = (danhSachLopHienThi: DangKyTinChi.ILopDangKy[]): number =>
	_.sumBy(danhSachLopHienThi.filter(isTinhTinChiDangKy), (item) => item.soTinChi);

export const tinhTongHocPhanDangKy = (danhSachLopHienThi: DangKyTinChi.ILopDangKy[]): number =>
	_.uniq(danhSachLopHienThi.map((item) => item.maHocPhan).filter(Boolean)).length;

export const getSoTinChiToiDa = (
	phieuDangKy?: DangKyTinChi.IPhieuDangKy,
	khoaNganhMe?: KhoaNganh.TMyKhoaNganh,
): number =>
	khoaNganhMe?.khoaNganhPhu && phieuDangKy?.soTinChiToiDaSongNganh
		? phieuDangKy.soTinChiToiDaSongNganh
		: (phieuDangKy?.soTinChiToiDa ?? 0);

export const isCungLopDangKy = (lopDangKy: DangKyTinChi.ILopDangKy, lopHocPhan: LopHocPhan.IRecord) =>
	lopDangKy._id === lopHocPhan._id ||
	lopDangKy.ten === lopHocPhan.ten ||
	lopDangKy.tenCha === lopHocPhan.ten ||
	lopDangKy.ten === lopHocPhan.tenCha;

export const isDaChonLop = (rec: LopHocPhan.IRecord, danhSachLopDangKy: DangKyTinChi.ILopDangKy[]) =>
	!!danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);

export const getDangKyRoiMap = (
	maHocPhan: string | undefined,
	danhSachLopDangKy: DangKyTinChi.ILopDangKy[],
): Partial<Record<ELoaiLopHocPhan, DangKyTinChi.ILopDangKy>> => {
	const map: Partial<Record<ELoaiLopHocPhan, DangKyTinChi.ILopDangKy>> = {};
	if (!maHocPhan) return map;

	danhSachLopDangKy.forEach((item) => {
		if (item.maHocPhan === maHocPhan && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY) {
			map[item.loaiLop!] = item;
		}
	});
	return map;
};

export const isDaDangKyHocPhanKhacLop = (
	lopHocPhan: LopHocPhan.IRecord,
	danhSachLopDangKy: DangKyTinChi.ILopDangKy[],
) =>
	!!lopHocPhan.maHocPhan &&
	danhSachLopDangKy.some((item) => item.maHocPhan === lopHocPhan.maHocPhan && !isCungLopDangKy(item, lopHocPhan));

const isTrungLichThoiKhoaBieu = (tkb: ThoiKhoaBieu.IRecord, tkbDangKy: ThoiKhoaBieu.IRecord) => {
	const isSameDate = dayjs(tkbDangKy.ngay).isSame(dayjs(tkb.ngay), 'day');
	const isOverlap =
		(tkb.tietBatDau ?? 0) <= (tkbDangKy.tietKetThuc ?? 0) && (tkb.tietKetThuc ?? 0) >= (tkbDangKy.tietBatDau ?? 0);
	return isSameDate && isOverlap;
};

export const getLopTrungLich = (rec: LopHocPhan.IRecord, danhSachLopDangKy: DangKyTinChi.ILopDangKy[]) => {
	const thoiKhoaBieuList = rec.thoiKhoaBieuList ?? [];
	if (!thoiKhoaBieuList.length) return [];

	return _.uniq(
		danhSachLopDangKy
			.filter((lopDangKy) =>
				thoiKhoaBieuList.some((tkb) =>
					(lopDangKy.thoiKhoaBieuList ?? []).some((tkbDangKy) => isTrungLichThoiKhoaBieu(tkb, tkbDangKy)),
				),
			)
			.map((lopDangKy) => lopDangKy.maLop ?? lopDangKy.ten ?? lopDangKy.maHocPhan)
			.filter(Boolean),
	);
};

export const getLopChaContext = (
	record: LopHocPhan.IRecord,
	danhSachLopDktc: LopHocPhan.IRecord[],
	danhSachLopDangKy: DangKyTinChi.ILopDangKy[],
) => {
	const lopCha = danhSachLopDktc.find((item) => item.ten === record.tenCha);
	const dangKyRoiMap = getDangKyRoiMap(record.maHocPhan, danhSachLopDangKy);
	const needCheckLopCha = !!(lopCha && dangKyRoiMap[lopCha.loai]?.soThuTuLop !== lopCha.soThuTuLop);
	return { lopCha, needCheckLopCha, dangKyRoiMap };
};

export const isHetSiSo = (record: LopHocPhan.IRecord, lopCha?: LopHocPhan.IRecord, needCheckLopCha?: boolean) => {
	const hetCho = record.siSoToiDa - (record.siSo ?? 0) <= 0;
	if (!needCheckLopCha || !lopCha?._id) return hetCho;
	return hetCho || lopCha.siSoToiDa - (lopCha.siSo ?? 0) <= 0;
};

export const getSoTinChiLop = (record: LopHocPhan.IRecord, danhSachLopDktc: LopHocPhan.IRecord[]) => {
	if (record.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false) return 0;

	let soTinChi = record.hocPhan?.soTinChi ?? 0;
	if (record.tenCha && !soTinChi) {
		const lopCha = danhSachLopDktc.find((item) => item.ten === record.tenCha);
		soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
	}
	return soTinChi;
};

export const isVuotSoTinChiToiDa = (
	record: LopHocPhan.IRecord,
	danhSachLopHienThi: DangKyTinChi.ILopDangKy[],
	danhSachLopDktc: LopHocPhan.IRecord[],
	tongTinChi: number,
	soTinChiToiDa: number,
) => {
	if (!soTinChiToiDa) return false;

	const stcHienTaiCuaHp = _.sumBy(
		danhSachLopHienThi.filter((item) => item.maHocPhan === record.maHocPhan && isTinhTinChiDangKy(item)),
		(item) => item.soTinChi ?? 0,
	);

	return tongTinChi - stcHienTaiCuaHp + getSoTinChiLop(record, danhSachLopDktc) > soTinChiToiDa;
};

type BuildLopDangKyParams = {
	lopVuaChon: LopHocPhan.IRecord;
	danhSachLopDangKy: DangKyTinChi.ILopDangKy[];
	danhSachLopDktc: LopHocPhan.IRecord[];
	loaiDangKy: ELoaiDangKyTheoLop;
	khoaNganhMe?: KhoaNganh.TMyKhoaNganh;
	dangKyNgay: boolean;
	isWaitlist?: boolean;
};

export const buildLopDangKy = ({
	lopVuaChon,
	danhSachLopDangKy,
	danhSachLopDktc,
	loaiDangKy,
	khoaNganhMe,
	dangKyNgay,
	isWaitlist = false,
}: BuildLopDangKyParams) => {
	const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan);
	let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? 0;
	const khoaNganh =
		loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2 ? khoaNganhMe?.khoaNganhPhu : khoaNganhMe?.khoaNganhChinh;
	const lopDangKy = {
		hocPhan: lopVuaChon.hocPhan,
		maNganh: khoaNganh?.maNganh,
		maKhoaNganh: khoaNganh?.ma,
		loai: ELoaiHocPhanDangKyTinChi.TIEN_TRINH,
		trangThai: dangKyNgay ? ETrangThaiDangKyTinChi.DA_DANG_KY : ETrangThaiDangKyTinChi.CHUA_DANG_KY,
		isWaitlist,
	};

	const listDangKy: DangKyTinChi.ILopDangKy[] = [];

	if (lopVuaChon.tenCha) {
		const lopCha = danhSachLopDktc.find((item) => item.ten === lopVuaChon.tenCha);
		if (!soTinChi) soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
		if (lopCha) listDangKy.push({ ...lopCha, soTinChi, ...lopDangKy } as DangKyTinChi.ILopDangKy);
	}

	listDangKy.push({ ...lopVuaChon, soTinChi, ...lopDangKy } as DangKyTinChi.ILopDangKy);

	return {
		temp: [...listDangKy, ...temp],
		listDangKy,
	};
};

export const filterBoChonLop = (danhSachLopDangKy: DangKyTinChi.ILopDangKy[], rec: LopHocPhan.IRecord) =>
	danhSachLopDangKy.filter(
		(item) =>
			item.maHocPhan !== rec.maHocPhan ||
			(item._id !== rec._id && item.ten !== rec.ten && item.tenCha !== rec.ten && item.ten !== rec.tenCha),
	);
