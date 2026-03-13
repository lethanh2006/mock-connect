import type { DanhMucChung } from '@/services/KhoaHoc/DanhMuc/Chung/typings';
import { EKieuDuLieu } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import type { LoaiHinhNCKH } from '@/services/KhoaHoc/LoaiHinhNCKH/typings';

export const buildFilter = (
	cauHinh: LoaiHinhNCKH.TruongThongTin | LoaiHinhNCKH.Cot,
	danhMucChung?: DanhMucChung.IRecord[],
): any => {
	let filterType;
	let sortable;
	let filterData;

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.BOOLEAN:
			filterType = 'select';
			filterData = [
				{ value: true, label: 'Có' },
				{ value: false, label: 'Không' },
			];

			break;
		case EKieuDuLieu.DANHMUC:
			filterType = 'select';
			filterData = danhMucChung
				?.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)
				?.danhSachGiaTri.map((item) => ({ value: item, label: item }));
			break;
		case EKieuDuLieu.DECIMAL:
			sortable = true;
			break;
		case EKieuDuLieu.NUMBER:
			sortable = true;
			break;
		case EKieuDuLieu.TEXT:
			filterType = 'string';
		default:
			break;
	}

	return { filterData, filterType, sortable };
};
