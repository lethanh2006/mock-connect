export const PhamVi = ['Tất cả', 'Hình thức đào tạo'];

export enum ETrangThaiThanhToan {
  open = 'open',
  underpaid = 'underpaid',
  paid = 'paid',
  overpaid = 'overpaid',
  closed = 'closed',
}

export const TrangThaiThanhToan: Partial<Record<ETrangThaiThanhToan, string>> = {
  [ETrangThaiThanhToan.open]: 'Chưa thanh toán đủ',
  [ETrangThaiThanhToan.paid]: 'Đã thanh toán đủ',
  [ETrangThaiThanhToan.overpaid]: 'Thanh toán thừa',
};
