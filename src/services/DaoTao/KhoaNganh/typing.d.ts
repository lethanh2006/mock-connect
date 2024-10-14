import type { ChuongTrinhDaoTao } from '../ChuongTrinhDaoTao/typing';

declare module KhoaNganh {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		maChuongTrinhDaoTao: string;
		chuongTrinh?: ChuongTrinhDaoTao.IRecord;
		maKhoaSinhVien: string;
		khoaSinhVien: KhoaSinhVien.IRecord;
		maNganh: string;
		nganh: NganhDaoTao.IRecordCoSo;
		namBatDau?: number;
		namKetThuc?: number;

		maCSDT: string;
		csdt?: CoSoDaoTao.IRecord;
		maTinhChatCt: string;
		tinhChatCt?: TinhChatChuongTrinh.IRecord;

		createdAt?: string;
		updatedAt?: string;
	}

	export type TMyKhoaNganh = {
		khoaNganhChinh: IRecord;
		khoaNganhPhu?: IRecord;
	};
}
