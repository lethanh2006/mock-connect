import { ETagColor } from '@/services/base/constant';

export enum ETrangThaiDangKyChuyenNganh {
	NHAP = 'draft',
	CHO_DUYET = 'pending',
	DA_DUYET = 'approve',
	YEU_CAU_CHINH_SUA = 'request_change',
	KHONG_DUYET = 'rejected',
}

export const trangThaiDangKyChuyenNganh: Record<ETrangThaiDangKyChuyenNganh, string> = {
	[ETrangThaiDangKyChuyenNganh.NHAP]: 'Nháp',
	[ETrangThaiDangKyChuyenNganh.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiDangKyChuyenNganh.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
	[ETrangThaiDangKyChuyenNganh.KHONG_DUYET]: 'Không duyệt',
};

export const colorTrangThaiDangKyChuyenNganh: Record<ETrangThaiDangKyChuyenNganh, ETagColor> = {
	[ETrangThaiDangKyChuyenNganh.NHAP]: ETagColor.DEFAULT,
	[ETrangThaiDangKyChuyenNganh.CHO_DUYET]: ETagColor.BLUE,
	[ETrangThaiDangKyChuyenNganh.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA]: ETagColor.ORANGE,
	[ETrangThaiDangKyChuyenNganh.KHONG_DUYET]: ETagColor.RED,
};
