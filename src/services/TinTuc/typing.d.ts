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
      _id: string;
      fullname: string;
    };
  }

  export interface IChuDe {
    phamVi: 'Tất cả' | 'Hình thức đào tạo';
    _id: string;
    name: string;
    type: string;
    order: number;
    hinhThucDaoTaoId: number;
  }
}
