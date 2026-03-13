import { type PhieuDiemRenLuyen } from './typing';

// PHIẾU ĐIỂM RÈN LUYỆN
export enum ELoaiNhapTayPhieuDiem {
	PHAM_VI = 'Phạm vi',
	TAP_GIA_TRI = 'Tập giá trị',
}

export enum EVaiTroPhieuDiem {
	SINH_VIEN = 'sinh-vien',
	CAN_SU = 'can-su',
	CVHT = 'co-van',
}

export const vaiTroPhieuDiem: Record<
	EVaiTroPhieuDiem,
	{
		field: keyof PhieuDiemRenLuyen.IDiemCham;
		title: string;
		status: keyof PhieuDiemRenLuyen.IKetQua;
	}
> = {
	[EVaiTroPhieuDiem.SINH_VIEN]: {
		field: 'diemChamSinhVien',
		status: 'trangThaiChamSinhVien',
		title: 'Sinh viên',
	},
	[EVaiTroPhieuDiem.CAN_SU]: {
		field: 'diemChamCanSu',
		status: 'trangThaiChamCanSu',
		title: 'Tập thể lớp',
	},
	[EVaiTroPhieuDiem.CVHT]: {
		field: 'diemChamCoVan',
		status: 'trangThaiChamCoVan',
		title: 'CVHT',
	},
};
