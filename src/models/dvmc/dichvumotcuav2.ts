/* eslint-disable no-underscore-dangle */
import useInitModel from '@/hooks/useInitModel';
import {
  downloadDon,
  getBieuMauById,
  getDonSinhVien,
  postDonSinhVien,
  printDon,
  sinhVienDeleteDon,
  sinhVienGetTrangThaiDon,
  sinhVienPutDon,
  traKetQua,
  userGetAllBieuMau,
} from '@/services/DVMC/DichVuMotCuaV2/dichvumotcuav2';
import type { DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { message } from 'antd';
import FileDownload from 'js-file-download';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const objInit = useInitModel<DichVuMotCuaV2.BieuMau>('dvmc');
  const { setDanhSach, setRecord, setLoading, page, limit, setTotal, condition } = objInit;
  const [danhSachDon, setDanhSachDon] = useState<DichVuMotCuaV2.Don[]>([]);
  const [danhSachDonThaoTac, setDanhSachDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac[]>([]);
  const [danhSachDataTable, setDanhSachDataTable] = useState<
    Record<string, { cauHinhBieuMau: DichVuMotCuaV2.CauHinhBieuMau[] }[]>
  >({});
  const [recordDon, setRecordDon] = useState<DichVuMotCuaV2.Don>();
  const [loaiDichVu, setLoaiDichVu] = useState<'DVMC'>('DVMC');
  const [recordDonThaoTac, setRecordDonThaoTac] = useState<DichVuMotCuaV2.DonThaoTac>();
  const [thuTuc, setThuTuc] = useState<DichVuMotCuaV2.ThuTuc>();
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);
  const [visibleFormDon, setVisibleFormDon] = useState<boolean>(false);
  const [visibleFormChinhSuaDon, setVisibleFormChinhSuaDon] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(0);
  const [typeForm, setTypeForm] = useState<string>('add');
  const [idDichVu, setIdDichVu] = useState<string>();
  const [recordTrangThaiDon, setRecordTrangThaiDon] = useState<DichVuMotCuaV2.TrangThaiBuoc[]>([]);
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');
  const { setVisibleForm: setVisibleFormThanhToan } = useModel('dvmc.thanhtoan');

  const getDonSinhVienModel = async () => {
    setLoading(true);
    const response = await getDonSinhVien({
      page,
      limit,
      condition,
    });
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
    setRecord(response?.data?.data?.[0]);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
    return response?.data?.data ?? [];
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
      if (response) {
        setRecordDon(response?.data?.data ?? {});
        message.success('Gửi đơn thành công');
        setLoading(false);
        setVisibleFormBieuMau(false);
        setVisibleFormThanhToan(true);
      }
    } catch (error: any) {
      setVisibleFormBieuMau(false);
      const { response } = error;
      if (response?.data?.errorCode === 2 && response?.data?.statusCode === 400) {
        message.error('Đơn của bạn đang được xử lý, vui lòng không tạo thêm đơn mới');
      }
      setLoading(false);
    }
  };

  const sinhVienGetTrangThaiDonModel = async (idDon: string) => {
    setLoading(true);
    const response = await sinhVienGetTrangThaiDon(idDon, { condition });
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

  return {
    ...objInit,
    visibleFormChinhSuaDon,
    setVisibleFormChinhSuaDon,
    sinhVienPutDonModel,
    sinhVienDeleteDonModel,
    phamVi,
    setPhamVi,
    traKetQuaModel,
    visibleFormDon,
    setVisibleFormDon,
    exportDonModel,
    loaiDichVu,
    setLoaiDichVu,
    idDichVu,
    setIdDichVu,
    getBieuMauByIdModel,
    thuTuc,
    setThuTuc,
    sinhVienGetTrangThaiDonModel,
    recordTrangThaiDon,
    setRecordTrangThaiDon,
    danhSachDataTable,
    setDanhSachDataTable,
    recordDonThaoTac,
    setRecordDonThaoTac,
    danhSachDonThaoTac,
    setDanhSachDonThaoTac,
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
  };
};
