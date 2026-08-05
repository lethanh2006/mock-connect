import { ETagColor } from '@/services/base/constant';

export enum ETrangThaiThanhToanKTX {
	CHUA_HOAN_THANH_COC = 'deposit_pending',
	DA_HOAN_THANH_COC = 'deposit_paid',
	DONG = 'closed',
	HUY = 'Hủy',
}

export const ETrangThaiThanhToanKTXI18n: Record<ETrangThaiThanhToanKTX, string> = {
	[ETrangThaiThanhToanKTX.CHUA_HOAN_THANH_COC]: 'kytucxa.lichsu.status.depositPending',
	[ETrangThaiThanhToanKTX.DA_HOAN_THANH_COC]: 'kytucxa.lichsu.status.depositPaid',
	[ETrangThaiThanhToanKTX.DONG]: 'kytucxa.lichsu.status.closed',
	[ETrangThaiThanhToanKTX.HUY]: 'kytucxa.lichsu.status.closed',
};

export const ETrangThaiThanhToanKTXColor: Record<ETrangThaiThanhToanKTX, ETagColor> = {
	[ETrangThaiThanhToanKTX.CHUA_HOAN_THANH_COC]: ETagColor.RED,
	[ETrangThaiThanhToanKTX.DA_HOAN_THANH_COC]: ETagColor.GREEN,
	[ETrangThaiThanhToanKTX.DONG]: ETagColor.DEFAULT,
	[ETrangThaiThanhToanKTX.HUY]: ETagColor.DEFAULT,
};
