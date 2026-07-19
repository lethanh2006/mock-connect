export enum ELoaiPhuongThucThanhToan {
    NGAN_HANG = 'NGAN_HANG',
    ONEPAY = 'ONEPAY',
}

export const titleLoaiPhuongThucThanhToan = {
    [ELoaiPhuongThucThanhToan.ONEPAY]: 'OnePay',
    [ELoaiPhuongThucThanhToan.NGAN_HANG]: 'Ngân hàng',
}

export enum EOnepayIntegrationType {
    PAYGATE = 'PAYGATE',
    PAYCOLLECT = 'PAYCOLLECT',
}

export const titleOnepayIntegrationType = {
    [EOnepayIntegrationType.PAYGATE]: 'Paygate',
    [EOnepayIntegrationType.PAYCOLLECT]: 'Paycollect',
}


export enum EOnepayCard {
    INTERCARD = 'INTERCARD',
    GOOGLEPAY = 'GOOGLEPAY',
    DOMESTIC = 'DOMESTIC',
    MOBILEBANKING = 'MOBILEBANKING',
    // QR = 'QR',
    VIETQR = 'VIETQR',
}

export const titleOnepayCard = {
    [EOnepayCard.INTERCARD]: 'Thẻ tín dụng / Ghi nợ',
    [EOnepayCard.GOOGLEPAY]: 'Google Pay',
    [EOnepayCard.DOMESTIC]: 'Thẻ ATM / Tài khoản ngân hàng',
    [EOnepayCard.MOBILEBANKING]: 'Thanh toán mã QR với Ứng dụng di động',
    // [EOnepayCard.QR]: 'QR',
    [EOnepayCard.VIETQR]: 'Thanh toán qua VietQR',
};

export const optionsOnpayCard = Object.keys(EOnepayCard).map((key) => ({
    value: EOnepayCard[key as keyof typeof EOnepayCard],
    label: titleOnepayCard[key as keyof typeof EOnepayCard],
}));