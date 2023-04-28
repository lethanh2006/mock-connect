/* eslint-disable no-underscore-dangle */
import {
  adminDeleteDon,
  adminGetAllBieuMau,
  adminGetDonSinhVien,
  adminGetTrangThaiDon,
  adminPutDon,
  chuyenVienDieuPhoiDuyetDon,
  chuyenVienDieuPhoiGetDonSinhVien,
  chuyenVienDieuPhoiGetTrangThaiDon,
  chuyenVienTiepNhanGetDonSinhVien,
  chuyenVienTiepNhanGetTrangThaiDon,
  chuyenVienXuLyDuyetDon,
  deleteBieuMauAdmin,
  dieuPhoiDon,
  downloadDon,
  getAllBieuMauChuyenVienDieuPhoi,
  getAllBieuMauChuyenVienTiepNhan,
  getBieuMauAdmin,
  getBieuMauById,
  getDonSinhVien,
  getDonThaoTacChuyenVienDieuPhoi,
  getDonThaoTacChuyenVienXuLy,
  postBieuMauAdmin,
  postDonSinhVien,
  printDon,
  putBieuMauAdmin,
  putTrangThaiBieuMau,
  sinhVienDeleteDon,
  sinhVienGetTrangThaiDon,
  sinhVienPutDon,
  traKetQua,
  updateTrangThaiNhanKetQua,
  userGetAllBieuMau,
  nhanVienDeleteDon,
} from '@/services/DichVuMotCuaV2/dichvumotcuav2';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { getAllDonVPS } from '@/services/VanPhongSo/vanphongso';
import type { MaDichVuVps } from '@/utils/constants';
import { message } from 'antd';
import FileDownload from 'js-file-download';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<DichVuMotCuaV2.BieuMau[]>([]);
  const [danhSachDon, setDanhSachDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const [danhSachDonThaoTac, setDanhSachDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac[]>([]);
  const [danhSachDataTable, setDanhSachDataTable] = useState<
    Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }[]>
  >({});
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<DichVuMotCuaV2.BieuMau>();
  const [recordDon, setRecordDon] = useState<DichVuMotCuaV2.Don>();
  const [loaiDichVu, setLoaiDichVu] = useState<'DVMC' | 'VAN_PHONG_SO'>('DVMC');
  const [recordDonThaoTac, setRecordDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac>();
  const [loading, setLoading] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [thuTuc, setThuTuc] = useState<DichVuMotCuaV2.ThuTuc>();
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);
  const [visibleFormDon, setVisibleFormDon] = useState<boolean>(false);
  const [visibleFormChinhSuaDon, setVisibleFormChinhSuaDon] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [current, setCurrent] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [typeForm, setTypeForm] = useState<string>('add');
  const [trangThaiQuanLyDonThaoTac, setTrangThaiQuanLyDonThaoTac] = useState<string>('PENDING');
  const [trangThaiQuanLyDon, setTrangThaiQuanLyDon] = useState<string | undefined>('PROCESSING');
  const [recordTongSoDon, setRecordTongSoDon] = useState<{ trangThai: string; soLuong: number }[]>(
    [],
  );
  const [idDichVu, setIdDichVu] = useState<string>();

  const [recordTrangThaiDon, setRecordTrangThaiDon] = useState<DichVuMotCuaV2.TrangThaiBuoc[]>([]);
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');
  const { setVisibleForm: setVisibleFormThanhToan } = useModel('thanhtoan');
  const [isDonCanXuLy, setIsDonCanXuLy] = useState<number>(1);
  const [typeTraKetQua, setTypeTraKetQua] = useState<string>('');
  const { initialState } = useModel('@@initialState');
  const getBieuMauAdminModel = async (loaiDichVuParam?: string) => {
    setLoading(true);
    const response = await getBieuMauAdmin({
      page,
      limit,
      condition: {
        ...condition,
        phamVi: initialState?.currentUser?.vai_tro === 'quan_tri' ? undefined : phamVi,
        loaiDichVu: loaiDichVuParam || loaiDichVu,
        hinhThucDaoTaoId:
          condition?.hinhThucDaoTaoId === -1 ? undefined : condition?.hinhThucDaoTaoId,
      },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    if (response?.data?.data?.result?.length === 0 && response?.data?.data?.page !== 1) {
      setPage(response?.data?.data?.page - 1 ?? 1);
    }
    setLoading(false);
  };

  const getDonSinhVienModel = async (maDichVuVps?: MaDichVuVps) => {
    setLoading(true);
    const response = await getDonSinhVien({
      page,
      limit,
      condition: maDichVuVps
        ? { ...condition, 'thongTinDichVu.maDichVu': maDichVuVps, trangThai: trangThaiQuanLyDon }
        : condition,
    });
    const maxPage = Math.ceil((total - 1) / limit);
    let newPage = page;
    if (newPage > maxPage) {
      newPage = maxPage || 1;
      setPage(newPage);
    }
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllBieuMauModel = async (loaiDichVuParam?: string) => {
    setLoading(true);
    const response = await userGetAllBieuMau({
      condition: { ...condition, loaiDichVu: loaiDichVuParam || loaiDichVu },
    });
    setDanhSach(response?.data?.data ?? []);
    // setTotal(response?.data?.data?.length);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const adminGetAllBieuMauModel = async (loaiDichVuParam?: string) => {
    setLoading(true);
    const response = await adminGetAllBieuMau({
      condition: { loaiDichVu: loaiDichVuParam || loaiDichVu },
    });
    setDanhSach(response?.data?.data ?? []);
    setRecord({
      _id: {
        $in: response?.data?.data?.map((item: DichVuMotCuaV2.BieuMau) => item._id),
      },
    } as any);
    setLoading(false);
  };

  const postBieuMauAdminModel = async (payload: DichVuMotCuaV2.BieuMau) => {
    try {
      setLoading(true);
      await postBieuMauAdmin({ ...payload, loaiDichVu });
      message.success('Thêm thành công');
      setLoading(false);
      setVisibleForm(false);
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const putBieuMauAdminModel = async (payload: { data: DichVuMotCuaV2.BieuMau; id?: string }) => {
    try {
      setLoading(true);
      await putBieuMauAdmin({
        ...payload,
        data: {
          ...payload.data,
          loaiDichVu,
        },
      });
      message.success('Lưu thành công');
      setLoading(false);
      setVisibleForm(false);
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const putTrangThaiBieuMauModel = async (idBieuMau: string) => {
    try {
      setLoading(true);
      await putTrangThaiBieuMau(idBieuMau);
      message.success('Lưu thành công');
      setLoading(false);
      setVisibleForm(false);
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteBieuMauAdminModel = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteBieuMauAdmin(id);
      message.success('Xóa thành công');
      getBieuMauAdminModel();
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  const postDonSinhVienModel = async (payload: {
    soLuongThanhToan?: number;
    duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
    dichVuId: string;
    traKetQua?: boolean;
    daTraKetQua?: boolean;
    idCoSoVatChat?: any;
  }) => {
    try {
      setLoading(true);
      const response = await postDonSinhVien(payload);
      setRecordDon(response?.data?.data ?? {});
      message.success('Gửi đơn thành công');
      setLoading(false);
      setVisibleFormBieuMau(false);
      setVisibleFormThanhToan(true);
    } catch (error: any) {
      const { response } = error;
      if (response?.data?.errorCode === 2 && response?.data?.statusCode === 400) {
        message.error('Đơn của bạn đang được xử lý, vui lòng không tạo thêm đơn mới');
      }
      setLoading(false);
    }
  };

  const getDonThaoTacChuyenVienDieuPhoiModel = async (
    loaiDichVuParam?: string,
    conditionParams?: any,
    pageParams?: number,
    limitParams?: number,
  ) => {
    if (
      loaiDichVuParam &&
      danhSach?.filter((item) => item.loaiDichVu === loaiDichVuParam)?.length === 0
    )
      return;
    setLoading(true);
    const response = await getDonThaoTacChuyenVienDieuPhoi({
      page: pageParams || page,
      limit: limitParams || limit,
      condition: conditionParams || {
        ...condition,
        trangThai: trangThaiQuanLyDonThaoTac,
        idDichVu: record?._id || danhSach?.map((item) => item._id),
      },
    });
    console.log(response?.data?.data?.result, 'response?.data?.data?.result');
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    // setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienDieuPhoiGetDonModel = async (loaiDichVuParam?: string) => {
    setLoading(true);
    const response = await chuyenVienDieuPhoiGetDonSinhVien({
      page,
      limit,
      condition:
        typeTraKetQua !== 'CHUA_TRA_KQ' && typeTraKetQua !== 'DA_TRA_KQ'
          ? {
              ...condition,
              loaiDichVu: loaiDichVuParam || loaiDichVu,
              trangThai: trangThaiQuanLyDon,
              'thongTinDichVu._id': record?._id,
            }
          : {
              ...condition,
              loaiDichVu: loaiDichVuParam || loaiDichVu,
              trangThai: 'OK',
              'thongTinDichVu._id': record?._id,
              traKetQua: true,
              daTraKetQua: typeTraKetQua === 'CHUA_TRA_KQ' ? false : true,
            },
      me: isDonCanXuLy,
    });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const chuyenVienDieuPhoiGetDonVpsModel = async () => {
    setLoading(true);
    const response = await chuyenVienDieuPhoiGetDonSinhVien({
      page,
      limit,
      condition: {
        ...condition,
        loaiDichVu: 'VAN_PHONG_SO',
        trangThai: trangThaiQuanLyDon,
      },
      me: isDonCanXuLy,
    });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    if (response?.data?.data?.result?.length === 0 && response?.data?.data?.page !== 1) {
      setPage(response?.data?.data?.page - 1 ?? 1);
    }
    setLoading(false);
  };

  const getDonThaoTacChuyenVienXuLyModel = async (
    loaiDichVuParam?: string,
    conditionParams?: any,
    pageParams?: number,
    limitParams?: number,
  ) => {
    if (
      loaiDichVuParam &&
      danhSach?.filter((item) => item.loaiDichVu === loaiDichVuParam)?.length === 0
    )
      return;
    setLoading(true);
    const response = await getDonThaoTacChuyenVienXuLy({
      page: pageParams || page,
      limit: limitParams || limit,
      condition: conditionParams || {
        ...condition,
        trangThai: trangThaiQuanLyDonThaoTac,
        idDichVu: record?._id || danhSach?.map((item) => item._id),
      },
    });
    setDanhSachDonThaoTac(response?.data?.data?.result ?? []);
    // setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const adminGetDonModel = async (loaiDichVuParam?: string) => {
    if (!record?._id) return;
    setLoading(true);
    try {
      const response = await adminGetDonSinhVien({
        page,
        limit,
        condition:
          typeTraKetQua !== 'CHUA_TRA_KQ' && typeTraKetQua !== 'DA_TRA_KQ'
            ? {
                ...condition,
                loaiDichVu: loaiDichVuParam || loaiDichVu,
                trangThai: trangThaiQuanLyDon,
                'thongTinDichVu._id': record?._id,
              }
            : {
                ...condition,
                loaiDichVu: loaiDichVuParam || loaiDichVu,
                trangThai: 'OK',
                'thongTinDichVu._id': record?._id,
                traKetQua: true,
                daTraKetQua: typeTraKetQua === 'CHUA_TRA_KQ' ? false : true,
              },
      });

      setDanhSachDon(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total);
      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const adminGetDonVpsModel = async (maDichVu: MaDichVuVps) => {
    setLoading(true);
    try {
      const response = await adminGetDonSinhVien({
        page,
        limit,
        condition: {
          ...condition,
          loaiDichVu: 'VAN_PHONG_SO',
          trangThai: trangThaiQuanLyDon,
          'thongTinDichVu.maDichVu': maDichVu ?? null,
        },
      });
      setDanhSachDon(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total);
      if (response?.data?.data?.result?.length === 0 && response?.data?.data?.page !== 1) {
        setPage(response?.data?.data?.page - 1 ?? 1);
      }
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const chuyenVienXuLyGetDonModel = async (loaiDichVuParam?: string) => {
    if (!record?._id) return;
    setLoading(true);
    const response = await chuyenVienTiepNhanGetDonSinhVien({
      page,
      limit,
      condition:
        typeTraKetQua !== 'CHUA_TRA_KQ' && typeTraKetQua !== 'DA_TRA_KQ'
          ? {
              ...condition,
              loaiDichVu: loaiDichVuParam || loaiDichVu,
              trangThai: trangThaiQuanLyDon,
              'thongTinDichVu._id': record?._id,
            }
          : {
              ...condition,
              loaiDichVu: loaiDichVuParam || loaiDichVu,
              trangThai: 'OK',
              'thongTinDichVu._id': record?._id,
              traKetQua: true,
              daTraKetQua: typeTraKetQua === 'CHUA_TRA_KQ' ? false : true,
            },
      me: isDonCanXuLy,
    });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienXuLyGetDonVpsModel = async () => {
    setLoading(true);
    const response = await chuyenVienTiepNhanGetDonSinhVien({
      page,
      limit,
      condition: {
        ...condition,
        loaiDichVu: 'VAN_PHONG_SO',
        trangThai: trangThaiQuanLyDon,
      },
      me: isDonCanXuLy,
    });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total);
    setLoading(false);
  };

  const chuyenVienDieuPhoiGetTrangThaiDonModel = async (idDon?: string) => {
    if (!idDon) return;
    setLoading(true);
    const response = await chuyenVienDieuPhoiGetTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const chuyenVienTiepNhanGetTrangThaiDonModel = async (idDon?: string) => {
    if (!idDon) return;
    setLoading(true);
    const response = await chuyenVienTiepNhanGetTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const chuyenVienXuLyDuyetDonModel = async (payload: {
    type: string;
    idDonThaoTac: string;
    data: {
      urlFileDinhKem: string[];
    };
  }) => {
    await chuyenVienXuLyDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    getDonThaoTacChuyenVienXuLyModel(undefined, { idDon: recordDon?._id }, 1, 100);
    chuyenVienXuLyGetDonModel();
    chuyenVienTiepNhanGetTrangThaiDonModel(recordDon?._id);
  };

  const chuyenVienDieuPhoiDuyetDonModel = async (payload: {
    type: string;
    idDonThaoTac: string;
    data: {
      urlFileDinhKem: string[];
    };
  }) => {
    await chuyenVienDieuPhoiDuyetDon(payload);
    message.success('Xử lý thành công');
    setVisibleFormBieuMau(false);
    if (loaiDichVu === 'VAN_PHONG_SO') setVisibleFormDon(false);
    getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: recordDon?._id }, 1, 100);
    if (loaiDichVu === 'VAN_PHONG_SO') {
      chuyenVienDieuPhoiGetDonVpsModel();
    } else {
      chuyenVienDieuPhoiGetDonModel();
    }
    chuyenVienDieuPhoiGetTrangThaiDonModel(recordDon?._id);
  };

  const getAllBieuMauChuyenVienDieuPhoiModel = async (loaiDichVuParam?: string) => {
    const response = await getAllBieuMauChuyenVienDieuPhoi({
      condition: { loaiDichVu: loaiDichVuParam || loaiDichVu },
    });
    setRecord({
      _id: {
        $in: response?.data?.data?.map((item: DichVuMotCuaV2.BieuMau) => item._id),
      },
    } as any);
    setDanhSach(response?.data?.data ?? []);
  };

  const getAllBieuMauVPSModel = async () => {
    setLoading(true);
    const res = await getAllDonVPS();
    setDanhSach(res?.data?.data ?? []);
    setLoading(false);
  };

  const getAllBieuMauChuyenVienTiepNhanModel = async (loaiDichVuParam?: string) => {
    const response = await getAllBieuMauChuyenVienTiepNhan({
      condition: { loaiDichVu: loaiDichVuParam || loaiDichVu },
    });
    setRecord({
      _id: {
        $in: response?.data?.data?.map((item: DichVuMotCuaV2.BieuMau) => item._id),
      },
    } as any);
    setDanhSach(response?.data?.data ?? []);
  };

  const dieuPhoiDonModel = async (payload: {
    idDonThaoTac: string;
    data: {
      nguoiDuocGiao: {
        _id: string;
        hoTen: string;
        gioiTinh: string;
        ngaySinh: string;
        maDinhDanh: string;
      };
    };
  }) => {
    try {
      setLoading(true);
      await dieuPhoiDon(payload);
      message.success('Điều phối thành công');
      setLoading(false);
      setVisibleFormBieuMau(false);
      getDonThaoTacChuyenVienDieuPhoiModel(undefined, { idDon: recordDon?._id }, 1, 100);
      chuyenVienDieuPhoiGetTrangThaiDonModel(recordDon?._id);
    } catch (error) {
      setLoading(false);
    }
  };

  const sinhVienGetTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await sinhVienGetTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const adminGetTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await adminGetTrangThaiDon(idDon, { condition });
    setRecordTrangThaiDon(response?.data?.data ?? []);
    setLoading(false);
  };

  const getBieuMauByIdModel = async (idBieuMau: string) => {
    const response = await getBieuMauById(idBieuMau);
    setRecord(response?.data?.data ?? {});
  };

  const exportDonModel = async (payload: {
    idDon: string;
    mauExport: 'MAU_DON' | 'TRA_LOI';
    exportType: string;
    tenDon?: string;
  }) => {
    try {
      setLoading(true);
      if (payload?.exportType === 'pdf') {
        const response = await printDon(payload);
        window.open(response?.data?.url);
      } else {
        const response = await downloadDon(payload);
        FileDownload(response.data, `${payload?.tenDon ?? 'dondichvu'}.doc`);
      }
      setLoading(false);
    } catch (err) {
      message.error('Biểu mẫu không tồn tại');
      setLoading(false);
    }
  };

  const traKetQuaModel = async (
    payload: {
      ketQuaText: string;
      ketQuaDinhKem: string[];
    },
    idDon?: string,
  ) => {
    if (!idDon) return;
    setLoading(true);
    const response = await traKetQua(idDon, payload);
    setRecordDon(response?.data?.data);
    message.success('Trả kết quả thành công');
    setLoading(false);
  };

  const adminDeleteDonModel = async (idDon: string, role?: 'dieuphoi' | 'tiepnhan') => {
    try {
      setLoading(true);
      await adminDeleteDon(idDon);
      message.success('Xóa thành công');
      if (role === 'dieuphoi') chuyenVienDieuPhoiGetDonModel();
      else if (role === 'tiepnhan') chuyenVienXuLyGetDonModel();
      else adminGetDonModel();
    } catch (err) {
      setLoading(false);
      message.error('Đơn đang được xử lý hoặc đã được thanh toán');
    }
  };

  const sinhVienDeleteDonModel = async (idDon: string) => {
    try {
      setLoading(true);
      await sinhVienDeleteDon(idDon);
      message.success('Xóa thành công');
      getDonSinhVienModel();
    } catch (err) {
      setLoading(false);
      message.error('Đơn đang được xử lý hoặc đã được thanh toán');
    }
  };

  const nhanVienDeleteDonModel = async (idDon: string) => {
    try {
      setLoading(true);
      await nhanVienDeleteDon(idDon);
      // const maxPage = Math.ceil((total - 1) / limit);
      // let newPage = page;
      // if (newPage > maxPage) {
      //   newPage = maxPage || 1;
      //   setPage(newPage);
      // }
      message.success('Xóa thành công');
      // getDonSinhVienModel();
    } catch (err) {
      setLoading(false);
      message.error('Đơn đang được xử lý hoặc đã được thanh toán');
    }
  };

  const sinhVienPutDonModel = async (
    idDon: string,
    payload: {
      duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
      traKetQua?: boolean;
      daTraKetQua?: boolean;
    },
  ) => {
    try {
      setLoading(true);
      await sinhVienPutDon(idDon, payload);
      message.success('Sửa thành công');
      getDonSinhVienModel();
      setVisibleFormChinhSuaDon(false);
    } catch (err) {
      setLoading(false);
      message.error('Không thể chỉnh sửa đơn đang được xử lý hoặc đã được thanh toán');
    }
  };

  const adminPutDonModel = async (
    idDon: string,
    payload: {
      duLieuBieuMau: DichVuMotCuaV2.CauHinhBieuMau[];
    },
  ) => {
    try {
      setLoading(true);
      await adminPutDon(idDon, payload);
      message.success('Sửa thành công');
      adminGetDonModel();
      setVisibleFormChinhSuaDon(false);
    } catch (err) {
      setLoading(false);
      message.error('Không thể chỉnh sửa đơn đang được xử lý hoặc đã được thanh toán');
    }
  };

  const updateTrangThaiNhanKetQuaModel = async (
    id: string,
    daTraKetQua: boolean,
    getData?: any,
  ) => {
    setLoading(true);
    try {
      const response = await updateTrangThaiNhanKetQua(id, daTraKetQua);
      if (response?.status === 200) {
        message.success('Cập nhật trạng thái trả kết quả thành công!');
      }
      if (getData) getData();
      else adminGetDonModel();
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  return {
    putTrangThaiBieuMauModel,
    adminPutDonModel,
    visibleFormChinhSuaDon,
    setVisibleFormChinhSuaDon,
    sinhVienPutDonModel,
    sinhVienDeleteDonModel,
    adminDeleteDonModel,
    isDonCanXuLy,
    setIsDonCanXuLy,
    phamVi,
    setPhamVi,
    traKetQuaModel,
    visibleFormDon,
    setVisibleFormDon,
    chuyenVienTiepNhanGetTrangThaiDonModel,
    chuyenVienDieuPhoiGetTrangThaiDonModel,
    chuyenVienDieuPhoiGetDonModel,
    chuyenVienXuLyGetDonModel,
    chuyenVienDieuPhoiGetDonVpsModel,
    exportDonModel,
    updateTrangThaiNhanKetQuaModel,
    nhanVienDeleteDonModel,
    loaiDichVu,
    setLoaiDichVu,
    recordTongSoDon,
    setRecordTongSoDon,
    idDichVu,
    setIdDichVu,
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    adminGetTrangThaiDonModel,
    adminGetDonModel,
    adminGetDonVpsModel,
    adminGetAllBieuMauModel,
    getBieuMauByIdModel,
    thuTuc,
    setThuTuc,
    sinhVienGetTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordTrangThaiDon,
    dieuPhoiDonModel,
    getDonThaoTacChuyenVienXuLyModel,
    chuyenVienXuLyDuyetDonModel,
    danhSachDataTable,
    setDanhSachDataTable,
    recordDonThaoTac,
    setRecordDonThaoTac,
    getAllBieuMauChuyenVienDieuPhoiModel,
    getAllBieuMauChuyenVienTiepNhanModel,
    trangThaiQuanLyDonThaoTac,
    setTrangThaiQuanLyDonThaoTac,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
    getDonThaoTacChuyenVienDieuPhoiModel,
    chuyenVienDieuPhoiDuyetDonModel,
    chuyenVienXuLyGetDonVpsModel,
    current,
    setCurrent,
    typeForm,
    setTypeForm,
    postDonSinhVienModel,
    danhSachDon,
    setDanhSachDon,
    recordDon,
    setRecordDon,
    getDonSinhVienModel,
    getAllBieuMauModel,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    deleteBieuMauAdminModel,
    putBieuMauAdminModel,
    postBieuMauAdminModel,
    getBieuMauAdminModel,
    danhSach,
    setDanhSach,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    record,
    setRecord,
    loading,
    setLoading,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
    page,
    limit,
    setPage,
    setLimit,
    typeTraKetQua,
    setTypeTraKetQua,
    getAllBieuMauVPSModel,
  };
};
