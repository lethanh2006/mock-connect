export enum ETrangThaiNoiNgoaiTru {
	KICH_HOAT = 'Kích hoạt',
	KHONG_KICH_HOAT = 'Không kích hoạt',
}

export enum ETrangThaiDuyetNoiNgoaiTru {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export const colorETrangThaiDuyetNoiNgoaiTru: Record<ETrangThaiDuyetNoiNgoaiTru, string> = {
	[ETrangThaiDuyetNoiNgoaiTru.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetNoiNgoaiTru.DA_DUYET]: 'green',
	[ETrangThaiDuyetNoiNgoaiTru.YEU_CAU_CHINH_SUA]: 'orange',
};

export enum ETrangThaiKhaiBaoNoiNgoaiTru {
	CHUA_KHAI_BAO = 'Chưa khai báo',
	DA_KHAI_BAO = 'Đã khai báo',
}

export const colorETrangThaiKhaiBaoNoiNgoaiTru: Record<ETrangThaiKhaiBaoNoiNgoaiTru, string> = {
	[ETrangThaiKhaiBaoNoiNgoaiTru.CHUA_KHAI_BAO]: 'blue',
	[ETrangThaiKhaiBaoNoiNgoaiTru.DA_KHAI_BAO]: 'green',
};

export enum EPhanLoaiCuTru {
	NOI_TRU = 'Nội trú',
	NGOAI_TRU = 'Ngoại trú',
}
