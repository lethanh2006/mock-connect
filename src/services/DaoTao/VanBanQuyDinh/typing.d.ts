declare module VanBanQuyDinh {
  export interface IRecord {
    _id: string;
    ma: string;
    ten: string;
    noiDung: string;
    url?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }
}
