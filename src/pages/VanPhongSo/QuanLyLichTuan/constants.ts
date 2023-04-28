export enum ETrangThaiLichTuan {
  CHO_DUYET = 'Chờ duyệt',
  DA_DUYET = 'Đã duyệt',
  KHONG_DUYET = 'Không duyệt',
  DA_PHAT_HANH = 'Đã phát hành',
}

export const colorLichTuan = {
  [ETrangThaiLichTuan.CHO_DUYET]: 'rgba(120, 120, 120, 0.7)',
  [ETrangThaiLichTuan.DA_DUYET]: 'rgba(8, 140, 206, 0.7)',
  [ETrangThaiLichTuan.KHONG_DUYET]: 'rgba(240, 49, 52, 0.7)',
  [ETrangThaiLichTuan.DA_PHAT_HANH]: 'rgba(59, 172, 21, 0.7)',
};

export const colorLichTuanSolid = {
  [ETrangThaiLichTuan.CHO_DUYET]: 'rgba(120, 120, 120, 1)',
  [ETrangThaiLichTuan.DA_DUYET]: 'rgba(8, 140, 206, 1)',
  [ETrangThaiLichTuan.KHONG_DUYET]: 'rgba(240, 49, 52, 1)',
  [ETrangThaiLichTuan.DA_PHAT_HANH]: 'rgba(59, 172, 21, 1)',
};
