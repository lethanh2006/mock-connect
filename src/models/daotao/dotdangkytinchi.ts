import useInitModel from '@/hooks/useInitModel';
import {
  deleteDangKyTinChi,
  getDotAvailable,
  getPhieuDangKy,
  postDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi';
import { ELoaiDangKyTinChi, ETrangThaiDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ipDaoTao } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DangKyTinChi.IDotDangKy>(
    'dang-ky-tin-chi/dot',
    undefined,
    undefined,
    ipDaoTao,
  );
  const { setLoading, formSubmiting, setFormSubmiting } = objInit;
  const [dotDangKyHienTai, setDotDangKyHienTai] = useState<DangKyTinChi.IDotDangKy>(); // Đợt đăng ký tín chỉ hiện tại trong kỳ, back trả về
  const [phieuDangKy, setPhieuDangKy] = useState<DangKyTinChi.IPhieuDangKy>(); // Phiếu đăng ký tín chỉ trong học kỳ, back tự tính
  const [danhSachLopDangKy, setDanhSachLopDangKy] = useState<DangKyTinChi.ILopDangKy[]>([]); // Danh sách lớp hp đăng ký, bao gồm cả các lớp mới thêm
  const [hocPhanDangKy, setHocPhanDangKy] = useState<DangKyTinChi.IHocPhanDangKy>();

  const getDotDangKyAvailableModel = async (maHocKy: string): Promise<DangKyTinChi.IDotDangKy> => {
    setLoading(true);
    try {
      const res = await getDotAvailable(maHocKy);
      setDotDangKyHienTai(res.data?.data);

      return res.data?.data;
    } catch (er) {
      setDotDangKyHienTai(undefined);
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getPhieuDangKyModel = async (maHocKy: string): Promise<DangKyTinChi.IPhieuDangKy> => {
    setLoading(true);
    try {
      const res = await getPhieuDangKy(maHocKy);
      const phieu: DangKyTinChi.IPhieuDangKy = res.data?.data;
      setPhieuDangKy(phieu);
      setDanhSachLopDangKy(
        phieu.lopHpSvList?.map((item) => ({
          ...item.lopHocPhan,
          _id: item.lopHocPhanId,
          soTinChi: item.lopHocPhan?.deCuong?.deCuong?.soTinChi ?? 0,
          loaiDangKy: ELoaiDangKyTinChi.DK_LAN_DAU,
          trangThai: ETrangThaiDangKyTinChi.DA_DANG_KY,
        })) ?? [],
      );

      return phieu;
    } catch (er) {
      setPhieuDangKy(undefined);
      setDanhSachLopDangKy([]);
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const postDangKyTinChiModel = async (data: {
    danhSachDangKy: { lopHocPhanId: string }[];
    phieuDktcId: string;
  }): Promise<any> => {
    if (formSubmiting) return Promise.reject('Form submitting');
    setFormSubmiting(true);
    try {
      const res = await postDangKyTinChi(data);
      message.success('Đăng ký thành công');

      return res.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  const deleteDangKyTinChiModel = async (data: {
    phieuDktcId: string;
    lopHocPhanId: string;
  }): Promise<any> => {
    if (formSubmiting) return Promise.reject('Form submitting');
    setFormSubmiting(true);
    try {
      const res = await deleteDangKyTinChi(data);
      message.success('Hủy đăng ký thành công');

      return res.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  return {
    ...objInit,
    dotDangKyHienTai,
    setDotDangKyHienTai,
    getDotDangKyAvailableModel,
    phieuDangKy,
    setPhieuDangKy,
    getPhieuDangKyModel,
    postDangKyTinChiModel,
    deleteDangKyTinChiModel,
    danhSachLopDangKy,
    setDanhSachLopDangKy,
    hocPhanDangKy,
    setHocPhanDangKy,
  };
};
