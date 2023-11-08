export enum PhuongThucPhanCong {
	TO_CHUC = 'Tổ chức nhân sự - Đơn vị',
	NGUOI_CU_THE = 'Người cụ thể',
}
export enum DoiTuongDieuPhoi {
	NGUOI_CU_THE = 'Người dùng',
	TO_CHUC = 'Bộ phận xử lý',}
export const MapKeyPhuongThucPhanCong = {
	[PhuongThucPhanCong.TO_CHUC]: 'Đơn vị cụ thể',
	[PhuongThucPhanCong.NGUOI_CU_THE]: 'Người cụ thể',
};
export enum EHocHam {
  GS = 'Giáo sư',
  PGS = 'Phó Giáo sư',
}

export enum EHocVi {
  CN = 'Cử nhân',
  KS = 'Kỹ sư',
  THS = 'Thạc sỹ',
  TS = 'Tiến sỹ',
  GVC = 'Giảng viên chính',
}
