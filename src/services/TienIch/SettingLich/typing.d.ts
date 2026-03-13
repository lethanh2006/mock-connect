import { type EReceiverType } from './constant';

declare module SettingLich {
	export interface IRecord {
		_id: string;
		ssoId: string;
		maCanBo: string;
		hoTen: string;
		danhSachSettingLich: TDanhSachSettingLich[];
	}

	export type TDanhSachSettingLich = {
		loaiLich: ELoaiSuKien;
		maMau: string;
	};
}
