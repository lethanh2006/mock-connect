declare module NganhDaoTao {
  export interface IRecordBo {
    _id: string;
    ma: string;
    ten: string;
    dmNhomNganhId: string;
    dmTrinhDoId: string;
    dmNhomNganh?: NhomNganhDaoTao.IRecordBo;
    dmTrinhDo?: TrinhDoDaoTao.IRecordBo;
    createdAt?: string;
    updatedAt?: string;
  }

  export interface IRecordCoSo {
    _id: string;
    ma: string;
    ten: string;
    tenTiengAnh: string;
    dmNganhId?: string;
    dmNganh?: NganhDaoTao.IRecordBo;
    // canCuId?: string;
    // canCu?: VanBanQuyDinh.IRecord;
    // parentId?: string | null;
    // parent?: IRecordCoSo;
    createdAt?: string;
    updatedAt?: string;
  }
}
