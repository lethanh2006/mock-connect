export enum EDoiTuongKeHoachNCKH {
	SINH_VIEN = 'SINH_VIEN',
	CAN_BO_GV = 'CAN_BO_GV',
}

export const MapKeyDoiTuongKeHoachNCKH = {
	[EDoiTuongKeHoachNCKH.CAN_BO_GV]: 'Cán bộ, giảng viên',
	[EDoiTuongKeHoachNCKH.SINH_VIEN]: 'Sinh viên',
};

export enum ETrangThaiKeHoachNCKH {
	CHO_XU_LY = 'CHO_XU_LY',
	DUYET = 'DUYET',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
}

export const MapKeyTrangThaiKeHoachNCKH = {
	[ETrangThaiKeHoachNCKH.CHO_XU_LY]: 'Chờ xử lý',
	[ETrangThaiKeHoachNCKH.DUYET]: 'Duyệt',
	[ETrangThaiKeHoachNCKH.YEU_CAU_CHINH_SUA]: 'Yêu cầu chỉnh sửa',
};

export const MapKeyColorTrangThaiKeHoachNCKH = {
	[ETrangThaiKeHoachNCKH.CHO_XU_LY]: '#0d6efd',
	[ETrangThaiKeHoachNCKH.DUYET]: '#1fba36',
	[ETrangThaiKeHoachNCKH.YEU_CAU_CHINH_SUA]: '#ffca2c',
};
