import { type EPhamViChuDe } from './constant';

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
      email?: string; // 'admin@administrator.com';
      hoTen: string; // 'Administrator';
      systemRole: string; // 'Admin';
      username: string; // 'admin';
      _id: string; // '649a63c2e42a64cb859874d7';
    };
  }

  export interface IChuDe {
    phamVi: EPhamViChuDe;
    _id: string;
    name: string;
    type: string;
    order: number;
    hinhThucDaoTaoId: number;
  }
}
