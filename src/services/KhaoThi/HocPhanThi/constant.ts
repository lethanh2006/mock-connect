export enum ETrangThaiPhanCong {
	CHUA_HOAN_THANH = 'Chưa hoàn thành',
	DA_HOAN_THANH = 'Đã hoàn thành',
}

export const MapKeyValueFilterTrangThaiPhanCong: any = {
	[ETrangThaiPhanCong.CHUA_HOAN_THANH]: { $elemMatch: { giamThi: { $exists: false } } },
	[ETrangThaiPhanCong.DA_HOAN_THANH]: { $not: { $elemMatch: { giamThi: { $exists: false } } } },
};

export const MapKeyColorTrangThaiPhanCong = {
	[ETrangThaiPhanCong.CHUA_HOAN_THANH]: '#ffca2c',
	[ETrangThaiPhanCong.DA_HOAN_THANH]: '#1fba36',
};
