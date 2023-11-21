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
				component: './TinTucWP',
				hideInMenu: true,
			},
			{
				path: './chi-tiet',
				hideInMenu: true,
				component: './TinTucWP/ChiTietTinTuc.tsx',
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
		routes: [
			{
				path: './',
				hideInMenu: true,
				component: './HocTap/LopHanhChinh',
				exact: true,
			},
			{
				path: './:id',
				component: './HocTap/LopHanhChinh/$id',
				hideInMenu: true,
				exact: true,
			},
		],
	},

	{
		name: 'KeHoachNamHoc',
		path: '/ke-hoach-nam-hoc',
		icon: 'TableOutlined',
		component: './DaoTao/KeHoachNamHoc',
	},

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
			// { name: 'DangKyNhuCau', path: 'dang-ky-nhu-cau', component: './HocTap/DangKyNhuCau' },
			{ name: 'DangKyTinChi', path: 'dang-ky-tin-chi', component: './HocTap/DangKyTinChi' },
			{
				name: 'LopHocPhan',
				path: 'lop-hoc-phan',
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
			{
				name: 'KetQuaHocTap',
				path: './ket-qua-hoc-tap',
				// access: 'sinhVien',
				component: './HocTap/KetQuaHocTap',
			},
			{
				name: 'XetHocVu',
				path: './xet-hoc-vu',
				component: './HocTap/XetHocVu',
			},
			{
				name: 'XetTotNghiep',
				path: './xet-tot-nghiep',
				component: './HocTap/XetTotNghiep',
			},
			{
				name: 'QuyetDinh',
				path: './quyet-dinh-bao-luu-thoi-hoc',
				component: './HocTap/BaoLuuThoiHoc',
			},
		],
	},

	// DRL
	{
		name: 'DiemRenLuyen',
		path: '/diem-ren-luyen',
		icon: 'user',
		routes: [
			{
				name: 'KhaiBaoMinhChung',
				path: 'khai-bao-minh-chung',
				routes: [
					{
						name: 'NoiNgoaiTru',
						path: 'noi-ngoai-tru',
						component: './DiemRenLuyen/KhaiBaoMinhChung',
					},
					{
						name: 'ThamGiaCongTacXaHoi',
						path: 'tham-gia-cong-tac-xa-hoi',
						component: './DiemRenLuyen/KhaiBaoMinhChung',
					},
					{
						name: 'TuyenTruyen',
						path: 'tuyen-truyen',
						component: './DiemRenLuyen/KhaiBaoMinhChung',
					},
					{
						name: 'DacBiet',
						path: 'dac-biet',
						component: './DiemRenLuyen/KhaiBaoMinhChung',
					},
				],
			},
			{
				name: 'PhieuDiemRenLuyen',
				path: 'phieu-diem-ren-luyen',
				component: './DiemRenLuyen/PhieuDiemRenLuyen',
			},
		],
	},

	{
		name: 'DichVuHanhChinh',
		icon: 'AuditOutlined',
		path: '/dich-vu-hanh-chinh',
		routes: [
			{
				path: './',
				component: './DichVuMotCuaV2/SinhVien/LichSu',
				hideInMenu: true,
				// access: 'sinhVien',
			},
			{
				name: 'TaoDon',
				path: './tao-don',
				// access: 'sinhVien',
				hideInMenu: true,
				routes: [
					{
						path: './',
						component: './DichVuMotCuaV2/SinhVien/GuiDon',
						extract: true,
					},
					{
						path: './:id',
						component: './DichVuMotCuaV2/SinhVien/GuiDon/$id',
						extract: true,
					},
				],
			},
		],
	},

	{
		name: 'KhaiBaoSucKhoe',
		icon: 'HeartOutlined',
		path: '/khai-bao-suc-khoe',
		component: './KhaiBaoSucKhoe',
	},

	{
		name: 'KhaiBaoQuyTrinh',
		icon: 'AuditOutlined',
		path: './khai-bao-quy-trinh',
		// component: './KhaiBaoQuyTrinh',
		routes: [
			{
				name: 'DanhSachQuyTrinh',
				icon: 'AuditOutlined',
				hideInMenu: true,
				path: './',
				component: './KhaiBaoQuyTrinh',
			},
			{
				name: 'KhaiBaoQuyTrinh',
				icon: 'AuditOutlined',
				hideInMenu: true,
				path: './:id',
				component: './KhaiBaoQuyTrinh/ViewQuyTrinh/$id',
			},
		],
	},
	{
		name: 'CongNo',
		icon: 'TransactionOutlined',
		path: '/cong-no',
		component: './TaiChinh/ChiTietThu',
	},

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
		name: 'CauHoiThuongGap',
		path: './cauhoithuonggap',
		icon: 'QuestionOutlined',
		component: './TienIch/CauHoiThuongGap',
	},
	{
		name: 'VanBanHuongDan',
		path: '/van-ban-huong-dan',
		component: './TienIch/VanBanHuongDan',
		icon: 'FileOutlined',
	},
	//MENU GIANG VIEN

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
		component: './exception/404',
	},
];
