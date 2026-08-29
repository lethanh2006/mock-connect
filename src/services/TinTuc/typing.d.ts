import type { CommonTopicType, EPhamViChuDe } from './constant';

declare module TinTuc {
	export interface IRecord {
		hinhThucDaoTaoId: number;
		danhSachVaiTro: string[];
		doiTuong: 'Tất cả' | 'Vai trò';
		_id: string;
		tieuDe: string;
		idTopic: string;
		moTa: string;
		urlAnhDaiDien: string;
		noiDung: string;
		ngayDang: string;
		nguoiDang: {
			email?: string;
			hoTen: string;
			systemRole: string;
			username: string;
			_id: string;
		};

		chuDe: IChuDe;
	}

	export interface IChuDe {
		phamVi: EPhamViChuDe;
		_id: string;
		name: string;
		type: CommonTopicType;
		order: number;
		hinhThucDaoTaoId: number;
	}
}
