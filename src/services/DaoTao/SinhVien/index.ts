import { ip3 } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getHocTapHienTai(sinhVienSsoId: string) {
  return axios.get(`${ip3}/sinh-vien/${sinhVienSsoId}/thong-tin-hoc-tap-hien-tai`);
}

export async function exportLyLich(sinhVienSsoId: string) {
  return axios.get(`${ip3}/sinh-vien/${sinhVienSsoId}/export-ly-lich`, {
    responseType: 'arraybuffer',
  });
}

// export async function kichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/activate`);
// }

// export async function tatKichHoatNguonThu(id: string) {
//   return axios.put(`${ip3}/nguon-thu/${id}/inactivate`);
// }
