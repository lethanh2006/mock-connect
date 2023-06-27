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
      {
        component: '404',
      },
    ],
  },
  {
    hideInMenu: true,
    name: 'account',
    icon: 'user',
    path: '/account',
    routes: [
      {
        name: 'center',
        icon: 'smile',
        path: '/account/center',
        component: './account/center',
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
        component: './TinTuc/ChiTietTinTuc.tsx',
      },
    ],
  },
  // DANH MUC HE THONG
  // {
  //   name: 'DanhMuc',
  //   path: '/danh-muc',
  //   icon: 'copy',
  //   routes: [
  //     {
  //       name: 'ChucVu',
  //       path: 'chuc-vu',
  //       component: './DanhMuc/ChucVu',
  //     },
  //   ],
  // },

  // MENU CHUNG
  {
    name: 'Lich',
    icon: 'CalendarOutlined',
    path: '/calendar',
    component: './Calendar',
  },

  // MENU SINH VIEN
  {
    name: 'HocTap',
    path: '/hoc-tap',
    icon: 'EditOutlined',
    // access: 'sinhVien',
    routes: [
      { name: 'DangKyNhuCau', path: 'dang-ky-nhu-cau', component: './HocTap/DangKyNhuCau' },
      {
        name: 'TienTrinhHocTap',
        path: 'tien-trinh-hoc-tap',
        component: './HocTap/TienTrinhHocTap',
      },
      {
        name: 'LopHanhChinh',
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
    ],
  },
  {
    name: 'DichVuMotCua',
    icon: 'AuditOutlined',
    path: '/dich-vu-mot-cua-sinh-vien',
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
