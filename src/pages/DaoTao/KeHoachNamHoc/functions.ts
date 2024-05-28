import _ from 'lodash';
import moment, { type Moment } from 'moment';

/**
 * Tính số tuần của năm học, bao gồm thời gian break giữa các kỳ
 * @param thoiGianBatDau Thời gian bắt đầu năm học
 * @param hocKyList Thông tin các học kỳ
 * @returns Số tuần
 */
export const calNumWeek = (thoiGianBatDau: Moment, hocKyList: Partial<HocKy.IRecord>[]): number => {
	let endDay: Moment = moment(thoiGianBatDau);
	hocKyList.forEach((item) => {
		if (item.thoiGianBatDau && item.soTuan) endDay = moment(item.thoiGianBatDau).add(item.soTuan, 'w');
	});
	return endDay.diff(thoiGianBatDau, 'w');
};

/**
 * Tính header kế hoạch năm học
 * @param thoiGianBatDau Thời gian bắt đầu năm học
 * @param hocKyList Thông tin các kỳ học
 * @param numWeek Số tuần năm học
 * @returns Header
 */
export const calHeader = (
	thoiGianBatDau: Moment,
	hocKyList: Partial<HocKy.IRecord>[],
	numWeek: number,
): KeHoachNamHoc.TGridHeader => {
	const day = thoiGianBatDau.clone();
	let month: number = -1;
	const weeks: number[] = [];
	const isoWeeks: number[] = [];
	const months: KeHoachNamHoc.THeadGroup[] = [];
	const days: KeHoachNamHoc.THeadGroup[] = [];
	// Lấy danh sách các học kỳ
	const hocKys: KeHoachNamHoc.THeadGroup[] = [];

	let indexKy = 0;
	let stepKy = 0;
	_.range(0, numWeek).map((tuan) => {
		// Tuần này có ở trong học kỳ nào ko?
		const isBreak = day.diff(moment(hocKyList[indexKy]?.thoiGianBatDau).startOf('isoWeek'), 'w') !== stepKy;
		if (isBreak) {
			// Break đầu năm hoặc break đầu tiên sau kỳ
			if (!hocKys.length || !hocKys.at(-1)?.isBreak) hocKys.push({ span: 1, title: `break${tuan}`, isBreak });
			else hocKys.slice(-1)[0].span++; // Các tuần break kế tiếp
		} else {
			// Vào kỳ học
			// Bắt đầu năm học hoặc kỳ trước là break thì thêm học kỳ mới
			if (!stepKy) hocKys.push({ span: 1, title: `HK ${indexKy + 1}` });
			else hocKys.slice(-1)[0].span++; // Tăng số tuần
			stepKy++; // Tắng số tuần trong kỳ hiện tại

			// Nếu quá số tuần trong kỳ thì tăng index kỳ và reset thứ tự tuần về 0
			if (stepKy >= +(hocKyList[indexKy]?.soTuan ?? 0)) {
				indexKy++;
				stepKy = 0;
			}
		}

		if (month !== day.month()) {
			// Tiêu đề các tháng: Bắt đầu tháng mới
			month = day.month();
			months.push({ title: `T${day.format('M/YY')}`, span: 1 });
		} else {
			months.slice(-1)[0].span++;
			months.slice(-1)[0].title = `Tháng ${day.format('M/YYYY')}`;
		}
		weeks.push(tuan + 1);
		isoWeeks.push(day.week());
		// Ngày bắt đầu - kết thúc của tuần
		days.push({ title: `${day.date()}-${day.clone().add(6, 'd').date()}`, span: tuan, isBreak });
		day.add(1, 'w');
	});

	return { hocKys, weeks, months, days, isoWeeks };
};
