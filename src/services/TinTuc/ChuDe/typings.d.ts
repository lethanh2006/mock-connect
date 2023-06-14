declare module ChuDe {
  export interface Record {
    phamVi: 'Tất cả' | 'Hình thức đào tạo';
    _id: string;
    name: string;
    type: string;
    order: number;
    hinhThucDaoTaoId: number;
  }
}
