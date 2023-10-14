export enum ELoaiNhanSuDotXetTN {
	HOI_DONG = 'Hội đồng',
	TT = 'Tổ kiểm tra',
}

export enum ELoaiDoiTuongXetTotNghiep {
	DUNG_TIEN_DO = 'Đúng tiến độ',
	NHU_CAU = 'Nhu cầu',
	HOAN = 'Hoãn',
}

export enum EKetQuaXetTotNghiep {
	DU_DK = 'Đủ điều kiện',
	KHONG_DU_DK = 'Không đủ điều kiện',
}

export const colorKetQuaXetTotNghiep: Record<EKetQuaXetTotNghiep, string> = {
	[EKetQuaXetTotNghiep.DU_DK]: 'green',
	[EKetQuaXetTotNghiep.KHONG_DU_DK]: 'orange',
};

export enum ETrangThaiDuyetXetTotNghiep {
	CHO_DUYET = 'Chờ duyệt',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiXetTotNghiep: Record<ETrangThaiDuyetXetTotNghiep, string> = {
	[ETrangThaiDuyetXetTotNghiep.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetXetTotNghiep.DUYET]: 'green',
	[ETrangThaiDuyetXetTotNghiep.KHONG_DUYET]: 'orange',
};
