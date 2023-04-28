export const colorLichSinhNhat = ['#007EB988', '#c0c30c', '#726354'];

export const getColorLichSinhNhat = (chucVu: any) =>
  typeof chucVu === 'string' && (chucVu?.includes('đốc') || chucVu?.includes('chủ tịch'))
    ? colorLichSinhNhat[0]
    : typeof chucVu === 'string' &&
      (chucVu?.includes('phòng') ||
        chucVu?.includes('phòng') ||
        chucVu.toLowerCase()?.includes('trưởng') ||
        chucVu?.includes('trung tâm') ||
        chucVu?.includes('trưởng'))
    ? colorLichSinhNhat[1]
    : colorLichSinhNhat[2];
