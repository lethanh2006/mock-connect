export const getSoLanHocFromDiem = (
	diem: { soLanHoc?: number; infoKhoaNganh?: Record<string, { soLanHoc?: number }> },
	maKhoaNganh?: string,
): number => {
	if (typeof diem.soLanHoc === 'number') return diem.soLanHoc;
	if (maKhoaNganh && diem.infoKhoaNganh?.[maKhoaNganh]?.soLanHoc != null) {
		return diem.infoKhoaNganh[maKhoaNganh].soLanHoc ?? 0;
	}
	if (diem.infoKhoaNganh) {
		return Math.max(0, ...Object.values(diem.infoKhoaNganh).map((i) => i?.soLanHoc ?? 0));
	}
	return 0;
};

/** Quy ước Vin: quy đổi → (T); học lại/cải thiện (soLanHoc > 1) → (R) */

export const isDiemChuT = (diemChu?: string | null) => (diemChu || '').trim().toUpperCase() === 'T';

export type TDiemChuMark = 'T' | 'R';

/**
 * - isQuyDoi + điểm chữ đã là T → không thêm gì
 * - isQuyDoi + điểm khác T (A/B/C/D…) → thêm (T)
 * - soLanHoc > 1 → thêm (R)
 */
export const getDiemChuMarks = (
	diemChu: string | undefined | null,
	opts: { isQuyDoi?: boolean; soLanHoc?: number | null },
): TDiemChuMark[] => {
	const marks: TDiemChuMark[] = [];
	const chu = (diemChu || '').trim();
	if (opts.isQuyDoi && chu && !isDiemChuT(chu)) marks.push('T');
	if ((opts.soLanHoc ?? 0) > 1) marks.push('R');
	return marks;
};

/** Ghép suffix vào chuỗi điểm (dùng cho transcript / export) */
export const appendDiemChuNotation = (
	diemChu: string,
	opts: { isQuyDoi?: boolean; soLanHoc?: number | null },
): string => {
	const marks = getDiemChuMarks(diemChu, opts);
	return marks.length ? `${diemChu}${marks.map((m) => `(${m})`).join('')}` : diemChu;
};
