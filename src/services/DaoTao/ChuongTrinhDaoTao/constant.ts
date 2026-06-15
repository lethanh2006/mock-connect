import { ETagColor } from '@/services/base/constant';

export enum ETrangThaiDuyetLoTrinh {
	CHUA_DANG_KY = 'CHUA_DANG_KY',
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
	TU_CHOI = 'TU_CHOI',
}

export const mapNamTrangThaiDuyetLoTrinh: Record<ETrangThaiDuyetLoTrinh, string> = {
	[ETrangThaiDuyetLoTrinh.CHO_DUYET]: 'Chờ duyệt',
	[ETrangThaiDuyetLoTrinh.CHUA_DANG_KY]: 'Chưa đăng ký',
	[ETrangThaiDuyetLoTrinh.DA_DUYET]: 'Đã duyệt',
	[ETrangThaiDuyetLoTrinh.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
	[ETrangThaiDuyetLoTrinh.TU_CHOI]: 'Từ chối',
};

export const mapColorTrangThaiDuyetLoTrinh: Record<ETrangThaiDuyetLoTrinh, ETagColor> = {
	[ETrangThaiDuyetLoTrinh.CHUA_DANG_KY]: ETagColor.DEFAULT,
	[ETrangThaiDuyetLoTrinh.CHO_DUYET]: ETagColor.BLUE,
	[ETrangThaiDuyetLoTrinh.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiDuyetLoTrinh.YEU_CAU_CHINH_SUA]: ETagColor.ORANGE,
	[ETrangThaiDuyetLoTrinh.TU_CHOI]: ETagColor.RED,
};
