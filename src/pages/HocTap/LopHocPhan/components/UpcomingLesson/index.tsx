import { officialColors } from '@/services/base/constant';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Card, Divider, Empty, Tag } from 'antd';
import { groupBy, sortBy, uniq } from 'lodash';
import { useMemo } from 'react';
import { useIntl } from 'umi';
import './style.less';

type UpcomingEvent = {
	_id: string;
	title: string;
	tenLopHocPhan?: string;
	thoiGianBatDau: string | Date;
	thoiGianKetThuc?: string | Date;
	location?: string;
	loaiSuKien: ELoaiSuKien | string;
};

type UpcomingLessonProps = {
	danhSach: LopHocPhan.IRecord[];
};

const getTkbList = (lop: LopHocPhan.IRecord): ThoiKhoaBieu.IRecord[] => [
	...(lop.thoiKhoaBieuList ?? []),
	...(lop.lopGhepTkb?.thoiKhoaBieuList ?? []),
	...(lop.children?.flatMap((child) => child.thoiKhoaBieuList ?? []) ?? []),
];

const buildUpcomingEvents = (danhSach: LopHocPhan.IRecord[]): UpcomingEvent[] =>
	danhSach.flatMap((lop) =>
		getTkbList(lop).map((tkb, index) => ({
			_id: `${lop._id}-${tkb._id ?? index}-${tkb.thoiGianBatDau ?? tkb.ngay}`,
			title: lop.hocPhan?.ten ?? lop.ten,
			tenLopHocPhan: lop.ten,
			thoiGianBatDau: tkb.thoiGianBatDau ?? tkb.ngay,
			thoiGianKetThuc: tkb.thoiGianKetThuc,
			location: tkb.phongHoc,
			loaiSuKien: ELoaiSuKien.LICH_HOC,
		})),
	);

const UpcomingLesson = ({ danhSach }: UpcomingLessonProps) => {
	const intl = useIntl();

	const dayGroups = useMemo(() => {
		const now = dayjs();
		const events = sortBy(
			buildUpcomingEvents(danhSach).filter((event) =>
				dayjs(event.thoiGianKetThuc ?? event.thoiGianBatDau).isSameOrAfter(now, 'minute'),
			),
			(event) => dayjs(event.thoiGianBatDau).valueOf(),
		);

		const grouped = groupBy(events, (event) => dayjs(event.thoiGianBatDau).format('YYYY-MM-DD'));
		const nearestDays = sortBy(
			uniq(events.map((event) => dayjs(event.thoiGianBatDau).format('YYYY-MM-DD'))),
			(dateKey) => dayjs(dateKey).valueOf(),
		).slice(0, 3);

		return nearestDays.map((dateKey) => {
			const isToday = dayjs(dateKey).isSame(now, 'day');
			return {
				dateKey,
				isToday,
				dateLabel: isToday
					? intl.formatMessage({ id: 'lichsukien.calendar.today' })
					: dayjs(dateKey).format('ddd, MMM D'),
				events: grouped[dateKey] ?? [],
			};
		});
	}, [danhSach, intl]);

	const getBadge = (loaiSuKien: ELoaiSuKien | string) => {
		if (loaiSuKien === 'Lịch coi thi') {
			return {
				label: intl.formatMessage({ id: 'lophocphan.upcoming-lesson.exam' }),
				className: 'upcoming-lesson__tag upcoming-lesson__tag--exam',
				color: '#df4471b3',
			};
		}

		return {
			label: intl.formatMessage({ id: 'lophocphan.upcoming-lesson.course' }),
			className: 'upcoming-lesson__tag upcoming-lesson__tag--course',
			color: ColorSuKien[ELoaiSuKien.LICH_HOC],
		};
	};

	return (
		<Card className='upcoming-lesson-card' title={intl.formatMessage({ id: 'lophocphan.upcoming-lesson.title' })}>
			{dayGroups.length ? (
				<div className='upcoming-lesson'>
					{dayGroups.map((group) => (
						<div key={group.dateKey} className='upcoming-lesson__day'>
							<Divider orientation='left' className='divider-big-title' dashed style={{ marginTop: 0 }}>
								{group.dateLabel}
							</Divider>
							{group.events.map((event) => {
								const badge = getBadge(event.loaiSuKien);
								return (
									<div
										key={event._id}
										className='upcoming-lesson__item'
										style={group.isToday ? { backgroundColor: officialColors.official500 } : undefined}
									>
										<div className='upcoming-lesson__time'>{formatDate(event.thoiGianBatDau, 'H:mm')}</div>
										<div className='upcoming-lesson__bar' style={{ backgroundColor: badge.color ?? '#134d8b' }} />
										<div className='upcoming-lesson__content'>
											<div className='upcoming-lesson__info'>
												<div className='upcoming-lesson__title'>{event.title}</div>
												{event.location ? (
													<div className='upcoming-lesson__location'>
														<EnvironmentOutlined />
														<span>{event.location}</span>
													</div>
												) : null}
											</div>
											<Tag bordered={false} className={badge.className}>
												{badge.label}
											</Tag>
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={intl.formatMessage({ id: 'lophocphan.upcoming-lesson.empty' })}
				/>
			)}
		</Card>
	);
};

export default UpcomingLesson;
