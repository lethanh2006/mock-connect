import { EKieuDuLieu } from '@/services/FormDong/LoaiHinh/constants';
import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import { IntlShape } from 'react-intl';

export const buildFilter = (
	cauHinh: LoaiHinh.TruongThongTin | LoaiHinh.Cot,
	intl: IntlShape,
	// danhMucChung?: DanhMucChung.IRecord[],
): any => {
	let filterType;
	let sortable;
	let filterData;

	switch (cauHinh.kieuDuLieu) {
		case EKieuDuLieu.BOOLEAN:
			filterType = 'select';
			filterData = [
				{ value: true, label: intl.formatMessage({ id: 'diemrenluyen.maudon.co' }) },
				{ value: false, label: intl.formatMessage({ id: 'diemrenluyen.maudon.khong' }) },
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
