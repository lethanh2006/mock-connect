export enum TrangThaiKhaiBao {
  DA_KHAI_BAO = 'Đã khai báo',
  CHUA_KHAI_BAO = 'Chưa khai báo',
}
export enum TrangThaiTiepNhan {
  CHUA_CO = 'Chưa có kết quả tiếp nhận',
  DA_DUYET = 'Chưa khai báo',
  KHONG_DUYET = 'Không duyệt',
  CHINH_SUA_LAI = 'Chỉnh sửa lại',
}

export const MapColorTrangThaiTiepNhan = {
  [TrangThaiTiepNhan.CHUA_CO]: 'yellow',
  [TrangThaiTiepNhan.DA_DUYET]: 'green',
  [TrangThaiTiepNhan.KHONG_DUYET]: 'red',
  [TrangThaiTiepNhan.CHINH_SUA_LAI]: 'yellow',
};
export enum TrangThaiTiepNhanDon {
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  CHINH_SUA_LAI = 'Chỉnh sửa lại',
}
