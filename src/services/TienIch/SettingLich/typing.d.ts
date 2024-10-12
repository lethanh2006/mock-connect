import { type EReceiverType } from './constant';

declare module SettingLich {
	export interface IRecord {
		_id: string;
		ssoId: string;
		maCanBo: string;
		hoTen: string;
		danhSachSettingLich: TTanhSachSettingLich[];
	}

	export type TTanhSachSettingLich = {
		loaiLich: ELoaiSuKien;
		maMau: string;
	};
}
