declare module DonVi {
  export interface Record {
    createdAt: string;
    danhSachDonViCon: Record[];
    danhSachDonViViTri: Record[];
    diaChiDonVi: string;
    donViCha: Record;
    donViChaId: string;
    emailDonVi: string;
    laDonViThucTe: boolean;
    loaiHinhDonVi: string;
    loaiPhongBan: Record;
    loaiPhongBanId: string;
    maDonVi: string;
    ten: string;
    _id: string;
  }
}
