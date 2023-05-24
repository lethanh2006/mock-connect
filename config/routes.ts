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
        name: 'LopHanhChinh',
        path: 'lop-hanh-chinh',

        routes: [
          {
            path: './',
            hideInMenu: true,
            component: './HocTap/LopHanhChinh/SinhVien',
            exact: true,
          },
          {
            path: './:id',
            component: './HocTap/LopHanhChinh/SinhVien/$id',
            hideInMenu: true,
            exact: true,
          },
        ],
      },
      {
        name: 'LopTinChi',
        path: 'lop-tin-chi',

        routes: [
          {
            path: './',
            hideInMenu: true,
            component: './HocTap/LopTinChi',
            exact: true,
          },
          {
            path: './:id',
            component: './HocTap/LopTinChi/$id',
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
    path: '/dichvumotcuasv',
    routes: [
      {
        path: './',
        component: './DichVuMotCuaV2/SinhVien/LichSu',
        hideInMenu: true,
        // access: 'sinhVien',
      },
      {
        name: 'TaoDon',
        path: './taodon',
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
    component: './PhanHoi',
    icon: 'HighlightOutlined',
    // access: 'sinhVienVaNhanVien',
  },

  {
    name: 'CauHoiThuongGap',
    path: './cauhoithuonggap',
    icon: 'QuestionOutlined',
    component: './CauHoiThuongGap',
  },
  {
    name: 'VanBanHuongDan',
    path: '/van-ban-huong-dan',
    component: './VanBanHuongDan',
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
