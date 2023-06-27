import { type ELoaiHinhHocTap } from '@/services/HocTap/LopHocPhan/constant';
import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

const url = 'thoi-khoa-bieu/sv';

export async function getThoiKhoaBieuById(idThoiKhoaBieu: string) {
  return axios.get(`${ipDaoTao}/${url}/${idThoiKhoaBieu}`);
}

export async function getThoiKhoaBieuByTrongKhoang(payload: { fromDate: string; toDate: string }) {
  return axios.get(`${ipDaoTao}/${url}/from/${payload.fromDate}/to/${payload.toDate}`);
}

export async function sinhVienGetThoiKhoaBieu(
  tenLop: string,
  params?: { loaiHinhHocTap?: ELoaiHinhHocTap },
) {
  return axios.get(`${ipDaoTao}/lop-hoc-phan/${tenLop}/sinh-vien/thoi-khoa-bieu`, { params });
}
