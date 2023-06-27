import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getHocTapHienTai(sinhVienSsoId: string) {
  return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
  return axios.get(`${ipDaoTao}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
    responseType: 'arraybuffer',
  });
}

export async function getThongTinSinhVien() {
  return axios.get(`${ipDaoTao}/sinh-vien/me`);
}

// export async function kichHoatNguonThu(id: string) {
//   return axios.put(`${ipDaoTao}/nguon-thu/${id}/activate`);
// }

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ipDaoTao}/nguon-thu/${id}/inactivate`);
// }
