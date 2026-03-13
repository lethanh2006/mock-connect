import dayjs from '@/utils/dayjs';
import { Dayjs } from 'dayjs';
import _ from 'lodash';

/**
 * Tính số tuần của năm học, bao gồm thời gian break giữa các kỳ
 * @param thoiGianBatDau Thời gian bắt đầu năm học
 * @param hocKyList Thông tin các học kỳ
 * @returns Số tuần
 */
export const calNumWeek = (thoiGianBatDau: Dayjs, hocKyList: Partial<HocKy.IRecord>[]): number => {
	let endDay: Dayjs = dayjs(thoiGianBatDau);
	hocKyList.forEach((item) => {
		if (item.thoiGianBatDau && item.soTuan) endDay = dayjs(item.thoiGianBatDau).add(item.soTuan, 'week');
	});
	return endDay.diff(thoiGianBatDau, 'week');
};

/**
 * Tính header kế hoạch năm học
 * @param thoiGianBatDau Thời gian bắt đầu năm học
 * @param hocKyList Thông tin các kỳ học
 * @param numWeek Số tuần năm học
 * @returns Header
 */
export const calHeader = (
	thoiGianBatDau: Dayjs,
	hocKyList: Partial<HocKy.IRecord>[],
	numWeek: number,
): KeHoachNamHoc.TGridHeader => {
	const day = dayjs(thoiGianBatDau); // or: thoiGianBatDau.clone() if plugin
	let month: number = -1;
	const weeks: number[] = [];
	const isoWeeks: number[] = [];
	const months: KeHoachNamHoc.THeadGroup[] = [];
	const days: KeHoachNamHoc.THeadGroup[] = [];
	const hocKys: KeHoachNamHoc.THeadGroup[] = [];

	let indexKy = 0;
	let stepKy = 0;

	_.range(0, numWeek).map((tuan) => {
		const isBreak = day.diff(dayjs(hocKyList[indexKy]?.thoiGianBatDau).startOf('isoWeek'), 'week') !== stepKy;

		if (isBreak) {
			if (!hocKys.length || !hocKys.at(-1)?.isBreak) hocKys.push({ span: 1, title: `break${tuan}`, isBreak });
			else hocKys.slice(-1)[0].span++;
		} else {
			if (!stepKy) hocKys.push({ span: 1, title: `HK ${indexKy + 1}` });
			else hocKys.slice(-1)[0].span++;
			stepKy++;

			if (stepKy >= +(hocKyList[indexKy]?.soTuan ?? 0)) {
				indexKy++;
				stepKy = 0;
			}
		}

		if (month !== day.month()) {
			month = day.month();
			months.push({ title: `T${day.format('M/YY')}`, span: 1 });
		} else {
			months.slice(-1)[0].span++;
			months.slice(-1)[0].title = `Tháng ${day.format('M/YY')}`;
		}

		weeks.push(tuan + 1);
		isoWeeks.push(day.isoWeek?.() ?? day.week()); // dayjs tuần ISO cần plugin
		days.push({ title: `${day.date()}`, span: tuan, isBreak });

		day = day.add(1, 'week');
	});

	return { hocKys, weeks, months, days, isoWeeks };
};
