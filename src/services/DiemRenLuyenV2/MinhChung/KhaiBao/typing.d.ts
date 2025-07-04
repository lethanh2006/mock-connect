import type { MinhChungDrl } from '@/services/DiemRenLuyenV2/MinhChung/typing';

declare module KhaiBaoDRL {
	export interface IRecord {
		_id: string;
		ssoId: string;
		hoTen: string;
		maSinhVien: string;
		lopHanhChinh: string;
		nguoiKhaiBao: {
			ssoId: string;
			ten: string;
			ma: string;
			email: string;
		};
		cauHinhMinhChungId: string;
		dotChamDiemId: string;
		thongTinKhaiBao: any;
		trangThai: string;
		createdAt: string;
		updatedAt: string;
		__v: number;

		diemQuyDoi: 10;

		dotChamDiem: DotChamDiemRenLuyen.IRecord;
		cauHinhMinhChung: MinhChungDrl.IBieuMau;
	}
}
