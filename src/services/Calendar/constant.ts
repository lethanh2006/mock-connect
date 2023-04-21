export enum ELoaiSuKien {
  LICH_GIANG_DAY = 'Lịch giảng dạy',
  LICH_HOC = 'Lịch học',
  LICH_THI = 'Lịch thi',
  CA_NHAN = 'Cá nhân',
  TAT_CA = 'Tất cả',
}

export const messages = {
  allDay: 'Cả ngày',
  previous: 'Trước',
  next: 'Sau',
  today: 'Hôm nay',
  month: 'Tháng',
  week: 'Tuần',
  day: 'Ngày',
  agenda: 'Chung',
  date: 'Ngày',
  time: 'Thời gian',
  event: 'Sự kiện',
  showMore: (total: number) => `+ Xem thêm (${total})`,
  noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này',
};

export const Color = {
  [ELoaiSuKien.LICH_GIANG_DAY]: 'rgba(71, 136, 142, 0.7)',
  [ELoaiSuKien.LICH_HOC]: 'rgba(71, 136, 142, 0.7)',
  [ELoaiSuKien.LICH_THI]: 'rgba(161, 52, 84, 0.7)',
  [ELoaiSuKien.CA_NHAN]: 'rgba(128, 101, 86, 0.7)',
  [ELoaiSuKien.TAT_CA]: 'rgba(8, 140, 206, 0.7)',
};
