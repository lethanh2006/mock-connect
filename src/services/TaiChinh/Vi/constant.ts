import { ETagColor } from '@/services/base/constant';

export enum ELoaiGiaoDichVi {
	CONG_TIEN = 'CONG_TIEN',
	TRU_TIEN = 'TRU_TIEN',
	HOAN_TIEN = 'HOAN_TIEN',
	THANH_TOAN = 'THANH_TOAN',
}

export const loaiGiaoDichViI18n: Record<ELoaiGiaoDichVi, string> = {
	[ELoaiGiaoDichVi.CONG_TIEN]: 'visinhvien.loaigiaodich.congtien',
	[ELoaiGiaoDichVi.TRU_TIEN]: 'visinhvien.loaigiaodich.trutien',
	[ELoaiGiaoDichVi.HOAN_TIEN]: 'visinhvien.loaigiaodich.hoantien',
	[ELoaiGiaoDichVi.THANH_TOAN]: 'visinhvien.loaigiaodich.thanhtoan',
};

export const colorLoaiGiaoDichVi: Record<ELoaiGiaoDichVi, string> = {
	[ELoaiGiaoDichVi.CONG_TIEN]: 'green',
	[ELoaiGiaoDichVi.TRU_TIEN]: 'red',
	[ELoaiGiaoDichVi.HOAN_TIEN]: 'cyan',
	[ELoaiGiaoDichVi.THANH_TOAN]: 'volcano',
};

/** Các loại giao dịch làm tăng số dư ví */
export const loaiGiaoDichViTangSoDu: ELoaiGiaoDichVi[] = [ELoaiGiaoDichVi.CONG_TIEN, ELoaiGiaoDichVi.HOAN_TIEN];

/** Trạng thái duyệt của yêu cầu rút tiền từ ví */
export enum ETrangThaiYeuCauRutTien {
	CHO_DUYET = 'CHO_DUYET',
	DANG_XU_LY = 'DANG_XU_LY',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
}

export const trangThaiYeuCauRutTienI18n: Record<ETrangThaiYeuCauRutTien, string> = {
	[ETrangThaiYeuCauRutTien.CHO_DUYET]: 'visinhvien.ruttien.trangthai.choduyet',
	[ETrangThaiYeuCauRutTien.DANG_XU_LY]: 'visinhvien.ruttien.trangthai.dangxuly',
	[ETrangThaiYeuCauRutTien.DA_DUYET]: 'visinhvien.ruttien.trangthai.daduyet',
	[ETrangThaiYeuCauRutTien.TU_CHOI]: 'visinhvien.ruttien.trangthai.tuchoi',
};

export const colorTrangThaiYeuCauRutTien: Record<ETrangThaiYeuCauRutTien, ETagColor> = {
	[ETrangThaiYeuCauRutTien.CHO_DUYET]: ETagColor.BLUE,
	[ETrangThaiYeuCauRutTien.DANG_XU_LY]: ETagColor.ORANGE,
	[ETrangThaiYeuCauRutTien.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiYeuCauRutTien.TU_CHOI]: ETagColor.RED,
};

/**
 * Các trạng thái mà yêu cầu vẫn đang được xử lý -> ví bị khóa,
 * sinh viên không gửi được yêu cầu mới cho tới khi yêu cầu hiện tại kết thúc
 * (backend mở khóa ví khi đơn chuyển sang DA_DUYET hoặc TU_CHOI).
 */
export const trangThaiYeuCauRutTienDangXuLy: ETrangThaiYeuCauRutTien[] = [
	ETrangThaiYeuCauRutTien.CHO_DUYET,
	ETrangThaiYeuCauRutTien.DANG_XU_LY,
];
