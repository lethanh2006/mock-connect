declare module BaiDang {
	export interface IRecord {
		soDaXem: 0;
		_id: string;
		ssoId: string;
		tieuDe: string;
		noiDung: string;
		ghiChu: null;
		ngayDang: null;
		danhSachDaXem: {
			ma: string;
			hoTen: string;
			ssoId: string;
			thoiGian: string;
			isGiaoVien: boolean;
		}[];
		danhSachBinhLuan: {
			_id: string;
			ssoId: string;
			noiDung: string;
			ghiChu: string;
			fileDinhKem: null;
			ngayDang: string;
			thongTinNguoiDang: {
				ma: string;
				hoTen: string;
				ssoId: string;
				avatar: null;
				isGiaoVien: boolean;
			};
			createdAt: string;
			updatedAt: string;
			baiDangId: string;
		}[];

		thongTinNguoiDang: {
			ma: string;
			hoTen: string;
			ssoId: string;
			avatar: string;
			isGiaoVien: boolean;
		};
		isPublic: null;
		createdAt: string;
		updatedAt: string;
		lopHanhChinhId: null;
		lopHocPhanId: string;
		lopHanhChinh: null;
		lopHocPhan: {
			thoiKhoaBieuList: any;
			_id: string;
			trangThaiDiemLop: string;
			ten: string;
			tenCha: string;
			maLop: string;
			dotThiId: string;
			maLopCha: string;
			thoiGianNopDiem: string;
			isNopDiemMuon: boolean;
			soTietTrongTuan: 4;
			nopDiem: boolean;
			khoaDiemTp: boolean;
			khoaDiemThi: boolean;
			maHocKy: string;
			maHocPhan: string;
			soThuTuNhom: null;
			soThuTuLop: 3;
			siSo: 0;
			siSoKeHoach: null;
			siSoToiDa: 77;
			trangThaiDuyetGiangDay: string;
			maHocPhanHocKy: string;
			chotKeHoach: true;
			chotTkb: boolean;
			xepTkb: true;
			trangThaiLop: string;
			lmsUrl: null;
			lopNhuCau: boolean;
			moodleShortname: string;
			cauHinhTkb: {
				tuan: 7;
				soTiet: 4;
			}[];

			doiTuongLopHanhChinh: string;
			maCSDT: string;
			maNhuCau: string;
			tenLopGhepTkb: string;
			loai: string;
			hinhThucGiangDay: string;
			maHinhThuc: string;
			maTinhChat: string;
			gioiThieuChung: string;
			createdAt: string;
			updatedAt: string;
			lopHanhChinhId: string;
			dotHuyId: string;
			dotDangKyNhuCauId: string;
		};
		ghimBaiViet: boolean;
		fileDinhKem: string[] | string;

		[k: string]: any;
	}
}
