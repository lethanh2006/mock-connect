import { EKieuDuLieu } from '@/services/FormDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';

export const buildFilter = (
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot,
	// danhMucChung?: DanhMucChung.IRecord[],
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
			break;
		// case EKieuDuLieu.DANHMUC:
		// 	filterType = 'select';
		// 	filterData = danhMucChung
		// 		?.find((item) => item.maDanhMuc === cauHinh.maDanhMuc)
		// 		?.danhSachGiaTri.map((item) => ({ value: item, label: item }));
		// 	break;
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
