import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
  const { getByIdModel, getModel } = objInit;

  // const [listTkbSinhVien, setListTkbSinhVien] = useState<LopHocPhan.IBuoiHoc[]>([]);
  // const [danhSachMonHoc, setDanhSachMonHoc] = useState<LopHocPhan.InfoMonHoc[]>([]);
  // const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  // const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  // const [flagDaDanhGia, setFlagDaDanhGia] = useState(false);
  // const [danhSachDiemTongKet, setDanhSachDiemTongKet] = useState<LopHocPhan.DiemTongKet[]>([]);
  // // const [dataBieuMau, setDataBieuMau] = useState<BieuMau.Record>({} as BieuMau.Record);
  // const [danhSachDiemThanhPhanTheoKy, setDanhSachDiemThanhPhanTheoKy] = useState<any[]>([]);
  // const [thongTinChung, setThongTinChung] = useState<LopHocPhan.ThongTinChungLopTinChiRecord>(
  //   {} as any,
  // );

  const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
    getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

  const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> =>
    getByIdModel(`${idLop}/sinh-vien`);

  return {
    ...objInit,
    sinhVienGetModel,
    sinhVienGetByIdModel,
    // idNhomLop,
    // setIdNhomLop,
    // hinhThucDaoTao,
    // setHinhThucDaoTao,
    // flagDaDanhGia,
    // setFlagDaDanhGia,
    // thongTinChung,
    // setThongTinChung,
    // thongTinNhomLop,
    // setThongTinNhomLop,
    // listTkbSinhVien,
    // setListTkbSinhVien,
    // recordBuoiHoc,
    // setRecordBuoiHoc,
    // danhSachMonHoc,
    // setDanhSachMonHoc,
    // danhSachDiemThanhPhanTheoKy,
    // setDanhSachDiemThanhPhanTheoKy,
    // danhSachDiemTongKet,
  };
};
