declare module AnPham {
	export interface IRecord {
		_id: string;
		maTaiLieu: string;
		nhanDe: string;
		tacGia: string;
		tacGiaConverse: string;
		nhanDeConverse: string;
		soLuong: number;

		maKieuBanGhi: string;
		kieuBanGhi?: KieuBanGhi.IRecord;
		MaCapThuMuc: string;
		capThuMuc?: CapThuMuc.IRecord;
		maDangTaiLieu: string;
		dangTaiLieu?: DangTaiLieu.IRecord;
		maVatMangTin: string;
		vatMangTin?: VatMangTin.IRecord;
		doMat: number;
		mauBienMucId: string;
		mauBienMuc?: MauBienMuc.IRecord;
		ISBN: string;
		ISSN: string;
		soThuTuCuaTap: string;
		tenTap: string;
		nhanDeSongSong: string;
		phuDe: string;
		thongTinTrachNhiem: string;
		lanXuatBan: string;
		noiXuatBan: string;
		namXuatBan: number;
		soTrang: number;
		dacDiemVatLy: string;
		khuonKho: string;
		tuLieuDiKem: string;
		nhaXuatBan: string;
		thongTinTaiLieu: MauBienMuc.IThongTinKhaiBao[];

		trangThai: ETrangThaiBienMuc;

		danhSachThongTin?: IThongTinAnPham[];

		online: boolean;
		dpsaceId: string;

		createdAt?: Date;
		updatedAt?: Date;

		//fake
		randomImageIndex?: any;
	}

	export interface IThongTinAnPham {
		_id: string;
		anPhamId: string;
		anPham: IRecord;
		tagCode: string;
		tag: TruongBienMuc.IRecord;
		ind1: string;
		ind2: string;
		value: string;

		thuocTinhAnPham: TThuocTinhAnPham[];

		total?: nunber;

		createdAt?: Date;
		updatedAt?: Date;
	}

	export type TThuocTinhAnPham = {
		_id: string;
		code: string;
		value: string;
	};

	export interface IAnPhamXepGia {
		_id: string;
		soDangKyCaBiet: string;
		anPhamId: string;
		anPham: IRecord;
		thoiGianXepGia: Date;
		thongTinXepGiaId: string;
		thongTinXepGia: IXepGia;
	}

	export interface IThongKeXepGia {
		thongTinAnPhamDangMuon: IAnPhamXepGia[];
		thongTinAnPhamKhaDung: IAnPhamXepGia[];
	}
}
