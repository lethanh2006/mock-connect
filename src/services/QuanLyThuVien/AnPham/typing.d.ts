declare module AnPham {
	export interface IRecord {
		_id: string;
		maTaiLieu: string;
		nhanDe: string;
		tacGia: string;
		soLuong: number;

		canBoBienMuc: string;
		maKieuBanGhi: string;
		kieuBanGhi?: KieuBanGhi.IRecord;
		maCapThuMuc: string;
		capThuMuc?: CapThuMuc.IRecord;
		maDangTaiLieu: string;
		dangTaiLieu?: DangTaiLieu.IRecord;
		maVatMangTin: string;
		vatMangTin?: VatMangTin.IRecord;
		doMat: number;
		maNgonNgu: string;
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
		soTrang: string;
		dacDiemVatLy: string;
		khuonKho: string;
		tuLieuDiKem: string;
		nhaXuatBan: string;
		thongTinTaiLieu: MauBienMuc.IThongTinKhaiBao[];

		trangThai: ETrangThaiBienMuc;

		online: boolean;
		dpsaceId: string;
		collectionId: string;
		communityId: string;

		thongTinAnPhamTrucTuyen: TDanhSachTaiLieuTrucTuyen[];

		dotNhapSachId: string;
		dotNhapSach: IDotNhapSach;
		isSachHay: boolean;
		moTa: string;
		urlScanBia?: string;

		danhSachAnPhamVatLy?: IAnPhamXepGia[];
		danhSachThongTin?: IThongTinAnPham[];

		createdAt?: Date;
		updatedAt?: Date;

		//fake
		randomImageIndex?: any;
	}

	export type TDanhSachTaiLieuTrucTuyen = {
		_id: string;
		index: number;
		ten: string;
		moTa: string;
		url: string | null;
	};

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
