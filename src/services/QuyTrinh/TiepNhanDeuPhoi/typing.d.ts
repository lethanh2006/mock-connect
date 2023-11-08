import { TruongThongTin } from '@/services/QuanLyKhoaHocV2/LoaiHinhNCKH/typings';

declare module KhaiBaoQuyTrinh {
  export interface IRecord {
    _id: '652b62d89d463e5f2d1f33b7';
    ssoId: '84c1a4f7-f65f-4eca-b917-861ab0fbf5fc';
    quyTrinhId: '6528e8aa7b56da5d525cc3f5';
    dotQuyTrinhId: '6529f116a726f8bdbf98ebab';
    danhSachBuocXuLy: IBuocXuLy[];
    danhSachKhaiBao: {
      ten: string;
      ma: string;
      thongTinKhaiBao: any;
    }[];
    __v: 0;
    quyTrinh: {
      _id: '6528e8aa7b56da5d525cc3f5';
      ten: 'Quy trình kiểm thử';
      ghiChu: 'kiểm thử toàn bộ';
      moTa: 'đây là kiểm thử rất quan trong';
      choPhepGuiNhieuLan: true;
      danhSachFormKhaiBao: IDanhSachForm[];
      danhSachBoPhanXuLy: IDonViXuLy[];
      danhSachBuocXuLy: IBuocXuLy[];
      __v: 0;
    };
  }
  export interface IDanhSachForm {
    ten: string;
    ma: string;
    cauHinhLoaiHinh: TruongThongTin[];
  }
  export interface IDonViXuLy {
    ten: 'Người xử lý';
    ma: 'NGUOI';
    phuongThucPhanCong: 'Người cụ thể';
    danhSachThanhVienXuLy: [
      {
        ssoId: '6692d5f5-e2ed-4e4c-9045-34e2ccac3292';
        ten: 'Trần Lan Hương';
        ma: '2022.04.04.833';
        donVi: 'Phòng Tổ chức Hành chính';
        hocHam: null;
        hocVi: 'Thạc sĩ';
        soDienThoai: '';
        email: 'huong@gmail.com';
      },
      {
        ssoId: 'ad241aec-8e5c-419c-a6b3-74d7dee6bb9d';
        ten: 'Nguyễn Hoàng Anh 2';
        ma: '2020.13.22.609';
        donVi: 'Viện Nghiên cứu Phụ nữ';
        hocHam: 'Giáo sư';
        hocVi: 'Giáo sư';
        soDienThoai: '0978782288';
        email: 'ab1c@gmail.com';
      },
    ];
  }
  export interface IBuocXuLy {
    ten: 'Bước 1';
    ma: string;
    maFormKhaiBao: string;
    maBoPhanXuLy: 'NGUOI';
    trangThaiTiepNhan: 'Chưa có kết quả tiếp nhận';
    coKhaiBao: false;
    daDienThongTin: false;
  }
  export interface IChiTietKhaiBao {
    _id: string;
    ssoId: string;
    quyTrinhId: string;
    dotQuyTrinhId: string;
    danhSachBuocXuLy: IBuocXuLy[];
    danhSachKhaiBao: [];
    __v: 0;
    quyTrinh: {
      _id: '6528e8aa7b56da5d525cc3f5';
      ten: 'Quy trình kiểm thử';
      ghiChu: 'kiểm thử toàn bộ';
      moTa: 'đây là kiểm thử rất quan trong';
      choPhepGuiNhieuLan: true;
      danhSachFormKhaiBao: [
        {
          ten: 'Mẫu đơn kiểm thử';
          ma: 'KT_1';
          cauHinhLoaiHinh: [
            {
              ten: 'HIệu năng';
              ma: 'HIEU_NANG';
              ghiChu: 'Hiệu năng sản phẩm';
              laDangMang: false;
              kieuDuLieu: 'Số nguyên';
              thamDinh: [];
              kichHoat: true;
              batBuoc: true;
              danhSachCot: [];
              danhSachCotHienThi: [];
            },
            {
              textarea: false;
              ten: 'Tiêu đề';
              ma: 'TIEU_DE';
              ghiChu: 'Tiêu đề hiệu năng';
              laDangMang: false;
              kieuDuLieu: 'Chữ';
              thamDinh: [];
              kichHoat: true;
              batBuoc: true;
              danhSachCot: [];
              danhSachCotHienThi: [];
            },
          ];
        },
      ];
      danhSachBoPhanXuLy: [
        {
          ten: 'Người xử lý';
          ma: 'NGUOI';
          phuongThucPhanCong: 'Người cụ thể';
          danhSachThanhVienXuLy: [
            {
              ssoId: '6692d5f5-e2ed-4e4c-9045-34e2ccac3292';
              ten: 'Trần Lan Hương';
              ma: '2022.04.04.833';
              donVi: 'Phòng Tổ chức Hành chính';
              hocHam: null;
              hocVi: 'Thạc sĩ';
              soDienThoai: '';
              email: 'huong@gmail.com';
            },
            {
              ssoId: 'ad241aec-8e5c-419c-a6b3-74d7dee6bb9d';
              ten: 'Nguyễn Hoàng Anh 2';
              ma: '2020.13.22.609';
              donVi: 'Viện Nghiên cứu Phụ nữ';
              hocHam: 'Giáo sư';
              hocVi: 'Giáo sư';
              soDienThoai: '0978782288';
              email: 'ab1c@gmail.com';
            },
          ];
        },
        {
          ten: 'Bộ phận xử lý';
          ma: 'BO_PHAN';
          phuongThucPhanCong: 'Tổ chức nhân sự - Đơn vị';
          danhSachThanhVienXuLy: [];
          maDonVi: '12.01';
        },
      ];
      danhSachBuocXuLy: [
        {
          ten: 'Bước 1';
          ma: 'BUOC_1';
          moTa: 'Bước đầu tiên';
          suDungForm: true;
          maFormKhaiBao: 'KT_1';
          danhSachMaBoPhanXuLy: ['NGUOI'];
        },
        {
          ten: 'Bước 3';
          ma: 'BUOC_3';
          suDungForm: true;
          maFormKhaiBao: 'KT_1';
          danhSachMaBoPhanXuLy: ['NGUOI', 'BO_PHAN'];
        },
        {
          ten: 'Bước 2';
          ma: 'BUOC_2';
          suDungForm: true;
          maFormKhaiBao: 'KT_1';
          danhSachMaBoPhanXuLy: ['BO_PHAN'];
        },
      ];
      __v: 0;
    };
  }
}
