export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	// DANH MUC HE THONG
	{
		name: 'News',
		icon: 'NotificationOutlined',
		path: '/tin-tuc',
		// access: 'sinhVienVaNhanVien',
		routes: [
			{
				path: './',
				component: './TinTuc',
				hideInMenu: true,
			},
			{
				path: './chi-tiet',
				hideInMenu: true,
				component: './TinTuc/Detail.tsx',
			},
		],
	},

	// MENU CHUNG
	{
		name: 'ThongTinCaNhan',
		icon: 'idcard',
		path: '/thong-tin-ca-nhan',
		component: './SinhVien',
	},

	// {
	// 	name: 'KeHoachNamHoc',
	// 	path: '/ke-hoach-nam-hoc',
	// 	icon: 'TableOutlined',
	// 	component: './DaoTao/KeHoachNamHoc',
	// },

	{
		name: 'Lich',
		icon: 'CalendarOutlined',
		path: '/calendar',
		component: './Calendar',
	},

	{
		name: 'LopHanhChinh',
		icon: 'hdd',
		path: 'lop-hanh-chinh',
		component: './HocTap/LopHanhChinh',
	},

	//quy trinh
	{
		name: 'KhaiBaoQuyTrinh',
		icon: 'AuditOutlined',
		path: './khai-bao-quy-trinh',
		// component: './KhaiBaoQuyTrinh',
		routes: [
			{
				name: 'DangKy',
				icon: 'AuditOutlined',
				path: './dang-ky',
				component: './KhaiBaoQuyTrinh/QuyTrinh',
			},
			{
				name: 'LichSu',
				icon: 'AuditOutlined',
				path: './lich-su',
				component: './KhaiBaoQuyTrinh/DichVuHanhChinh',
			},
			// {
			// 	name: 'DanhSachQuyTrinh',
			// 	icon: 'AuditOutlined',
			// 	hideInMenu: true,
			// 	path: './',
			// 	component: './KhaiBaoQuyTrinh',
			// },
			{
				name: 'KhaiBaoQuyTrinh',
				icon: 'AuditOutlined',
				hideInMenu: true,
				path: './:id',
				component: './KhaiBaoQuyTrinh/ViewQuyTrinh/$id',
			},
		],
	},

	// {
	// 	name: 'KeHoachNCKH',
	// 	icon: 'FileOutlined',
	// 	path: '/ke-hoach-nckh',
	// 	component: './KhoaHoc/KeHoach',
	// },

	// MENU SINH VIEN
	{
		name: 'HocTap',
		path: '/hoc-tap',
		icon: 'EditOutlined',
		// access: 'sinhVien',
		routes: [
			{
				name: 'TienTrinhHocTap',
				path: 'tien-trinh-hoc-tap',
				component: './HocTap/TienTrinhHocTap',
			},
			// { name: 'NhuCauHocPhan', path: 'dang-ky-hoc-phan-nhu-cau', component: './HocTap/HocPhanNhuCau' },
			{ name: 'DangKyTinChi', path: 'dang-ky-tin-chi', component: './HocTap/DangKyTinChi' },

			{
				name: 'LopHocPhan',
				path: 'lop-tin-chi',
				routes: [
					{
						path: './',
						hideInMenu: true,
						component: './HocTap/LopHocPhan',
						exact: true,
					},
					{
						path: './:id',
						component: './HocTap/LopHocPhan/$id',
						hideInMenu: true,
						exact: true,
					},
				],
			},
			{ name: 'LichThi', path: 'lich-thi', component: './KhaoThi/LichThi' },
			{ name: 'BaiThiCuoiKy', path: 'bai-thi-cuoi-ky', component: './HocTap/BaiThiCuoiKy' },
			{
				name: 'KetQuaHocTap',
				path: './ket-qua-hoc-tap',
				// access: 'sinhVien',
				component: './HocTap/KetQuaHocTap',
			},
			{
				name: 'XetTotNghiep',
				path: './xet-tot-nghiep',
				routes: [
					{
						name: 'ChungChiTotNghiep',
						path: './chung-chi-tot-nghiep',
						component: './HocTap/XetTotNghiep/ChungChiTotNghiep',
					},
					{
						name: 'XetTotNghiep',
						path: './xet-tot-nghiep',
						component: './HocTap/XetTotNghiep',
					},
				],
			},
			{
				name: 'HocTapKhac',
				path: './khac',
				routes: [
					{ name: 'DangKyChuyenNganh', path: 'dang-ky-chuyen-nganh', component: './SinhVien/DangKyChuyenNganh' },
					{
						name: 'XetHocVu',
						path: './xet-hoc-vu',
						component: './HocTap/XetHocVu',
					},
					{
						name: 'QuyetDinh',
						path: './bao-luu-thoi-hoc',
						component: './HocTap/BaoLuuThoiHoc',
					},
				],
			},
		],
	},
	// Trường hợp copy link từ giảng viên => Tự động redirect tới học tập
	{ path: 'giang-day/lop-tin-chi/:id', component: './HocTap/LopHocPhan/$id', hideInMenu: true, exact: true },

	// DRL
	{
		name: 'DiemRenLuyen',
		path: '/diem-ren-luyen',
		icon: 'user',
		routes: [
			// {
			// 	name: 'KhaiBaoMinhChung',
			// 	path: 'khai-bao-minh-chung',
			// 	routes: [
			// 		{
			// 			name: 'NoiNgoaiTru',
			// 			path: 'noi-ngoai-tru',
			// 			component: './DiemRenLuyen/KhaiBaoMinhChung',
			// 		},
			// 		{
			// 			name: 'ThamGiaCongTacXaHoi',
			// 			path: 'tham-gia-cong-tac-xa-hoi',
			// 			component: './DiemRenLuyen/KhaiBaoMinhChung',
			// 		},
			// 		{
			// 			name: 'TuyenTruyen',
			// 			path: 'tuyen-truyen',
			// 			component: './DiemRenLuyen/KhaiBaoMinhChung',
			// 		},
			// 		{
			// 			name: 'DacBiet',
			// 			path: 'dac-biet',
			// 			component: './DiemRenLuyen/KhaiBaoMinhChung',
			// 		},
			// 	],
			// },
			{
				name: 'HoatDongCTSV',
				path: 'hoat-dong-ctsv',
				component: './CongTacSinhVien/HoatDongCTSV',
				icon: 'CarryOutOutlined',
			},
			{
				name: 'PhieuDiemRenLuyen',
				path: 'phieu-diem-ren-luyen',
				component: './DiemRenLuyenV2/PhieuDiemRenLuyen',
			},
			{
				name: 'TuanSinhHoatCongDan',
				path: 'tuan-sinh-hoat-cong-dan',
				component: './CheDoChinhSach/GiaoDucChinhTriTuTuong/QuyetDinhGDCTTT',
			},
		],
	},

	// Khoa học công nghệ
	{
		name: 'HoatDongKHCN',
		path: 'hoat-dong-khcn',
		icon: 'DotChartOutlined',
		routes: [
			{
				name: 'DeTaiHocVien',
				icon: 'AuditOutlined',
				path: './de-tai-hoc-vien',
				routes: [
					{
						name: 'DangKyDeXuat',
						path: './tong-hop-dang-ky-de-xuat',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/DangKyDeXuat',
					},
					{
						name: 'HoiDongXetChonDeXuat',
						path: './hoi-dong-xet-chon-de-xuat',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongXetChonDeXuat',
					},
					{
						name: 'NopThuyetMinh',
						path: './nop-thuyet-minh',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopThuyetMinh',
					},
					{
						name: 'HoiDongXetDuyetThuyetMinh',
						path: './hoi-dong-xet-duyet-thuyet-minh',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongXetDuyetThuyetMinh',
					},
					{
						name: 'QuyetDinhGiao',
						path: './quyet-dinh-giao',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/QuyetDinhGiao',
					},
					{
						name: 'ThucHienDeTai',
						path: './thuc-hien-de-tai',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/ThucHienDeTai',
					},
					{
						name: 'NopHoSoNghiemThu',
						path: './nop-ho-so-nghiem-thu',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopHoSoNghiemThu',
					},
					{
						name: 'HoiDongNghiemThu',
						path: './hoi-dong-nghiem-thu',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongNghiemThu',
					},
					{
						name: 'NopHoSoSauNghiemThu',
						path: './nop-ho-so-sau-nghiem-thu',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopHoSoSauNghiemThu',
					},
					{
						name: 'QuyetDinhCongNhan',
						path: './quyet-dinh-cong-nhan',
						component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/QuyetDinhCongNhan',
					},
				],
			},

			{
				name: 'DeTaiKhoa',
				icon: 'AuditOutlined',
				path: './de-tai-khoa-vien',
				routes: [
					{
						name: 'DangKyDeXuat',
						path: './tong-hop-dang-ky-de-xuat',
						component: './KhoaHoc/DeTaiKHCN/DeTaiKhoa/DangKyDeXuat',
					},
					// {
					// 	name: 'HoiDongXetChonDeXuat',
					// 	path: './hoi-dong-xet-chon-de-xuat',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongXetChonDeXuat',
					// },
					// {
					// 	name: 'NopThuyetMinh',
					// 	path: './nop-thuyet-minh',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopThuyetMinh',
					// },
					// {
					// 	name: 'HoiDongXetDuyetThuyetMinh',
					// 	path: './hoi-dong-xet-duyet-thuyet-minh',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongXetDuyetThuyetMinh',
					// },
					// {
					// 	name: 'QuyetDinhGiao',
					// 	path: './quyet-dinh-giao',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/QuyetDinhGiao',
					// },
					// {
					// 	name: 'ThucHienDeTai',
					// 	path: './thuc-hien-de-tai',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/ThucHienDeTai',
					// },
					// {
					// 	name: 'NopHoSoNghiemThu',
					// 	path: './nop-ho-so-nghiem-thu',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopHoSoNghiemThu',
					// },
					// {
					// 	name: 'HoiDongNghiemThu',
					// 	path: './hoi-dong-nghiem-thu',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/HoiDongNghiemThu',
					// },
					// {
					// 	name: 'NopHoSoSauNghiemThu',
					// 	path: './nop-ho-so-sau-nghiem-thu',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/NopHoSoSauNghiemThu',
					// },
					// {
					// 	name: 'QuyetDinhCongNhan',
					// 	path: './quyet-dinh-cong-nhan',
					// 	component: './KhoaHoc/DeTaiKHCN/DeTaiHocVien/QuyetDinhCongNhan',
					// },
				],
			},

			{
				name: 'QuyCheQuyDinh',
				path: './quychequydinh',
				icon: 'FileOutlined',
				component: './KhoaHoc/QuyChe',
			},
			{
				name: 'KeHoachNCKH',
				icon: 'FileOutlined',
				path: './ke-hoach-nckh',
				component: './KhoaHoc/KeHoach',
			},
		],
	},

	// {
	// 	name: 'NoiNgoaiTru',
	// 	icon: 'DeploymentUnitOutlined',
	// 	path: '/noi-ngoai-tru',
	// 	routes: [
	// 		{
	// 			name: 'KhaiBao',
	// 			path: 'khai-bao',
	// 			component: './NoiNgoaiTru',
	// 		},
	// 	],
	// },

	// {
	// 	name: 'ThuVien',
	// 	path: '/thu-vien',
	// 	icon: 'bank',
	// 	routes: [
	// 		{
	// 			name: 'MuonTraSach',
	// 			path: './muon-tra-sach',
	// 			routes: [
	// 				{
	// 					path: './',
	// 					hideInMenu: true,
	// 					component: './ThuVien/MuonTraSach',
	// 					exact: true,
	// 				},
	// 				{
	// 					path: './:id',
	// 					component: './ThuVien/MuonTraSach/$id',
	// 					hideInMenu: true,
	// 					exact: true,
	// 				},
	// 			],
	// 		},

	// 		{ name: 'LichSuMuonTra', path: './lich-su-muon-tra', component: './ThuVien/MuonTraSach/LichSu/PhieuMuon.tsx' },
	// 		{ name: 'VaoRa', path: './vao-ra', component: './ThuVien/VaoRaThuVien' },
	// 	],
	// },

	// TÀI CHÍNH
	{
		name: 'TaiChinh',
		icon: 'TransactionOutlined',
		path: '/tai-chinh',
		routes: [
			{
				name: 'CongNo',
				path: './cong-no',
				component: './TaiChinh/HoaDon',
			},
			{
				name: 'GiaoDich',
				path: './giao-dich',
				component: './TaiChinh/GiaoDich',
			},
			{
				name: 'UuDaiThanhToan',
				path: './uu-dai-thanh-toan',
				component: './TaiChinh/UuDaiThanhToan',
			},
		],
	},

	// TIỆN ÍCH
	{
		name: 'PhanHoi',
		path: './phan-hoi',
		component: './TienIch/PhanHoi',
		icon: 'HighlightOutlined',
		// access: 'sinhVienVaNhanVien',
	},
	{
		name: 'KhaoSatTrucTuyen',
		path: './khao-sat',
		component: './TienIch/KhaoSat',
		icon: 'table',
	},
	{
		name: 'ThongBao',
		path: 'thong-bao',
		component: './ThongBao',
		icon: 'BellOutlined',
	},
	// {
	// 	name: 'KhaiBaoSucKhoe',
	// 	icon: 'HeartOutlined',
	// 	path: '/khai-bao-suc-khoe',
	// 	component: './TienIch/KhaiBaoSucKhoe',
	// },

	{
		name: 'TienIch',
		path: 'tien-ich',
		icon: 'AppstoreAddOutlined',
		routes: [
			{
				name: 'CauHoiThuongGap',
				path: './cau-hoi-thuong-gap',
				component: './TienIch/CauHoiThuongGap',
			},
			{
				name: 'VanBanHuongDan',
				path: './van-ban-huong-dan',
				component: './TienIch/VanBanHuongDan',
			},
			{
				name: 'XemSau',
				path: './xem-sau',
				component: './TienIch/XemSau',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
