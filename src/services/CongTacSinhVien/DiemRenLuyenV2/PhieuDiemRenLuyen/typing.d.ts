declare module PhieuDiemRenLuyenV2 {
	export interface IRecord {
		_id: string;
		dotDrlId: string;
		dotDrl: {
			_id: string;
			maHocKy: string; //'20231';
			danhSachDoiTuongChamDiem: {
				loaiDoiTuongChamDiem: string; //'SINH_VIEN';
				thoiGianBatDauCham: string; // '2024-02-01T08:36:49.871Z';
				thoiGianKetThucCham: string; //'2024-02-11T08:36:53.871Z';
			}[];
			mauDrlId: string; //'65a10deee2ed5478c2e0628a';
			createdAt: string; // '2024-02-20T08:37:00.077Z';
			updatedAt: string; //'2024-03-27T13:54:08.208Z';
			thoiGianKetThuc: string; //'2024-03-27T13:54:08.208Z';
			thoiGianBatDau: string; //'2024-03-27T13:54:08.208Z';
			__v: 0;
		};
		thongTinNguoiTao: {
			ssoId: string;
			ten: string;
			ma: string;
			donVi: string;
		};
		maLopHanhChinh: string;
		donVi: {
			_id: string;
			ten: string;
			maDonVi: string;
			donViChaId: string;
			loaiPhongBanId: string;
			loaiHinhDonVi: string;
			laDonViThucTe: true;
			soQuyetDinhThanhLap: null;
			tenVietTat: null;
			ngayRaQuyetDinh: null;
			diaChiDonVi: null;
			sdtDonVi: null;
			isBanGiamDoc: null;
			emailDonVi: null;
			loaiTrucThuoc: null;
			urlFileUpload: null;
			moTa: null;
			chucDanhKiemNhiem: null;
			hienThi: true;
			loaiTuChuTaiChinh: null;
			createdAt: '2023-10-17T05:34:04.953Z';
			updatedAt: '2023-10-17T05:34:04.953Z';
			loaiPhongBan: {
				ten: 'Khoa';
				ma: '03';
			};
			donViCha: {
				ten: 'Các đơn vị thuộc và trực thuộc Học viện';
				maDonVi: 'TTT';
			};
			danhSachDonViCon: {
				ten: 'Bộ môn Mỹ thuật đa phương tiện';
				maDonVi: '19.03';
			}[];

			danhSachDonViViTri: {
				_id: '652e1d02f1730e6b5d9001f1';
				tenChucVu: 'Trợ lý khoa';
				loai: 'Thực tế';
				soLuong: 1;
				capChucVu: 'Cán bộ, giảng viên';
				donViId: '652e1cccf1730e6b5d9000af';
				chucVu: {
					ma: '63';
					ten: 'Trợ lý';
				};
				donVi: {
					maDonVi: '19';
					ten: 'Khoa Truyền thông đa phương tiện';
				};
			}[];

			danhSachNhanSuDonViChinh: {
				_id: '65daa9ed15cebd24f549dbd4';
				maCanBo: '20191903109';
				hoDem: 'Lại Thị Hải';
				ten: 'Bình';
				trangThai: 'Đang làm việc';
				loaiHoSo: 'Cán bộ';
				cccdCMND: '035180004497';
				trangThaiChinhSua: 'Duyệt';
				loaiCanBoGiangVien: 'Viên chức';
				ssoId: 'cd1f3121-5055-4365-a655-c15557b8b60a';
				donViChinh: {
					maDonVi: '19';
					ten: 'Khoa Truyền thông đa phương tiện';
					_id: '652e1cccf1730e6b5d9000af';
				};
				donViViTri: {
					capChucVu: 'Trưởng';
					tenChucVu: 'Trưởng khoa';
					_id: '652e1d01f1730e6b5d9001d2';
				};
			}[];
		};
		nganh: {
			_id: string;
			dmNganhId: null;
			ma: string;
			ten: string;
			tenTiengAnh: string;
			canCuId: string;
			maDonVi: string;
			createdAt: string;
			updatedAt: string;
			maDmNganh: string;
			maTrinhDo: string;
			maNganhGoc: string;
			maCanCuPhapLy: string;
		};
		trangThai: string;
		diemSo: number;
		xepLoai: string;
		danhSachChamDiem: any[];
		createdAt: string;
		updatedAt: string;
		__v: 0;
	}
}
