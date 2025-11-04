import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { primaryColor } from '@/services/base/constant';
import { colorTrangThaiLopDiemDanh, ETrangThaiLopDiemDanh, trangThaiLopDiemDanh } from '@/services/DaoTao/constant';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorHinhThucGiangDay, EHinhThucGiangDay } from '@/services/HocTap/constant';
import { ELoaiSuKien, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { ArrowRightOutlined, BookOutlined } from '@ant-design/icons';
import { Badge, Card, Empty, Space, Spin, Tag } from 'antd';
import { type Dayjs } from 'dayjs';
import { isEmpty, sortBy } from 'lodash';
import { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import styles from './style.less';

interface RenderLichGiangDayProps {
	dataCalendar?: ThoiKhoaBieu.IRecord[];
	loading?: boolean;
	onClick?: (val: ThoiKhoaBieu.IRecord) => void;
}

const RenderLichGiangDay = (props: RenderLichGiangDayProps) => {
	const { dataCalendar: dataCalendarProp, loading: loadingProp, onClick } = props;
	const {
		setRecord: setTkb,
		setVisibleForm: setVisibleTkb,
		getTrongKhoangModel,
		loading: loadingModel,
	} = useModel('daotao.thoikhoabieu');
	const [dateRange] = useState<Dayjs[]>([dayjs().startOf('week'), dayjs().endOf('week')]);
	const [dataCalendar, setDataCalendar] = useState<ThoiKhoaBieu.IRecord[]>([]);
	const [selectEvent, setSelectEvent] = useState<any>();
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);

	useEffect(() => {
		if (dataCalendarProp) {
			setDataCalendar(dataCalendarProp);
		} else {
			getThoiKhoaBieu();
		}
	}, [dataCalendarProp, dateRange[0].valueOf(), dateRange[1].valueOf()]);

	const getThoiKhoaBieu = async () => {
		try {
			const data = await getTrongKhoangModel({
				fromDate: dateRange[0].toISOString(),
				toDate: dateRange[1].toISOString(),
			});

			const temp = data.map((item) => ({
				...item,
				title: [item.lopHocPhan?.hocPhan?.ten, item.phongHoc].filter(Boolean).join(' - '),
				loaiSuKien: ELoaiSuKien.LICH_HOC,
				start: dayjs(item?.thoiGianBatDau).toDate(),
				end: dayjs(item?.thoiGianKetThuc).toDate(),
			}));

			setDataCalendar(temp);
		} catch (error) {
			console.error('Error fetching thoikhoabieu:', error);
		}
	};

	// Lọc và nhóm dữ liệu theo ngày
	const data = dataCalendar
		?.filter((event) => dayjs(event.thoiGianBatDau).isSameOrAfter(dayjs(), 'd'))
		?.reduce<any>((result, item) => {
			if (!item?.thoiGianBatDau) {
				return result;
			}
			const ngayMoment = dayjs(item?.thoiGianBatDau);
			const ngayString = ngayMoment.format('YYYY-MM-DD');

			return {
				...result,
				[ngayString]: {
					thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayMoment.toDate().getDay()],
					cacBuoiHoc: (result[ngayString]?.cacBuoiHoc ?? []).concat({
						...item,
						tenBuoiHoc:
							item.tenLopHocPhan || [item.lopHocPhan?.hocPhan?.ten, item.phongHoc].filter(Boolean).join(' - '),
					}),
				},
			};
		}, {});

	const keysSorted = sortBy(Object.keys(data || {}));
	const loading = loadingProp ?? loadingModel;

	// Lấy tiết học gần nhất
	const getTietGanNhat = () => {
		const allBuoiHoc = keysSorted.flatMap((ngay) => data[ngay].cacBuoiHoc);
		const sortedBuoiHoc = sortBy(allBuoiHoc, (buoiHoc) => new Date(buoiHoc.thoiGianBatDau));
		return sortedBuoiHoc[0];
	};

	const tietGanNhat = !isEmpty(data) ? getTietGanNhat() : null;

	if (!loading && isEmpty(data)) {
		return (
			<Card title='Tiết học sắp tới' className='card-big-title card-borderless' variant='borderless'>
				<Card variant='borderless'>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có lịch giảng dạy' />
				</Card>
			</Card>
		);
	}

	return (
		<Card
			title='Tiết học sắp tới'
			className='card-big-title card-borderless'
			variant='borderless'
			extra={
				tietGanNhat && (
					<Link
						to='#!'
						className='xem-tat-ca-link'
						onClick={(e) => {
							e.preventDefault();
							history.push(
								`/giang-day/lop-tin-chi/${tietGanNhat.lopHocPhan?.parent?._id ?? tietGanNhat?.lopHocPhan?._id}#buoi-hoc`,
							);
						}}
					>
						{tietGanNhat.tenBuoiHoc} - {dayjs(tietGanNhat.thoiGianBatDau).format('HH:mm DD/MM')} <ArrowRightOutlined />
					</Link>
				)
			}
		>
			<Card variant='borderless'>
				<Spin spinning={loading}>
					<div className={styles.tiet_hoc_sap_toi}>
						{keysSorted.map((ngay) => {
							const { cacBuoiHoc, thuTrongTuan } = data[ngay];
							const cacBuoiHocSorted = sortBy(cacBuoiHoc, (buoiHoc) => new Date(buoiHoc.thoiGianBatDau));

							return (
								<div key={ngay} className={styles.ngay}>
									<Space style={{ marginBottom: 8 }}>
										<Badge count={cacBuoiHoc.length} size='small' offset={[15, 11]} color='#D66'>
											<div
												className={styles.ngay__title}
												style={{ color: dayjs().isSame(ngay, 'day') ? 'var(--color-primary)' : undefined }}
											>
												{thuTrongTuan}, ngày {dayjs(ngay).format('DD/MM')}
											</div>
										</Badge>
									</Space>

									{cacBuoiHocSorted.map((buoiHoc: ThoiKhoaBieu.IRecord & { tenBuoiHoc: string }) => {
										const onProgress =
											dayjs().isSameOrAfter(buoiHoc.thoiGianBatDau) && dayjs().isSameOrBefore(buoiHoc.thoiGianKetThuc);

										return (
											<div
												key={buoiHoc._id}
												className={styles.tiet_hoc}
												onClick={() => {
													setSelectEvent(buoiHoc);
													setVisibleDetail(true);
													onClick?.(buoiHoc);
												}}
											>
												<div className={styles.tiet_hoc__left}>
													{onProgress ? <div className={styles.pulse} /> : null}
													<div className={styles.tiet_hoc__thoi_gian}>
														{dayjs(buoiHoc.thoiGianBatDau).format('HH:mm')}
													</div>
												</div>

												<Space className={styles.tiet_hoc__right} style={{ borderColor: primaryColor }} wrap>
													<div className={styles.tiet_hoc__right_header}>
														<div>
															{buoiHoc.lopHocPhan?.hocPhan?.ten ?? ''}
															{buoiHoc.phongHoc && <i> ({buoiHoc.phongHoc})</i>}
														</div>
													</div>

													{/* Nút QR điểm danh */}
													<div className={styles.tiet_hoc__right_QR}>
														{/* <Link
															className={`${onProgress ? undefined : styles.hover_link} xem-tat-ca-link`}
															to='#!'
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																setTkb(buoiHoc);
																setVisibleTkb(true);
																history.push(
																	`/giang-day/lop-tin-chi/${buoiHoc.lopHocPhan?.parent?._id ?? buoiHoc?.lopHocPhan?._id}#buoi-hoc`,
																);
															}}
														>
															<QrcodeOutlined /> Điểm danh
														</Link> */}
														{/* Thay QR điểm danh của CCB bằng Nút vào xem chi tiết lớp */}
														<Link
															className={`${onProgress ? undefined : styles.hover_link} xem-tat-ca-link`}
															to='#!'
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																setTkb(buoiHoc);
																setVisibleTkb(true);
																history.push(
																	`/giang-day/lop-tin-chi/${buoiHoc.lopHocPhan?.parent?._id ?? buoiHoc?.lopHocPhan?._id}#buoi-hoc`,
																);
															}}
														>
															<BookOutlined /> Xem buổi học
														</Link>

														{/* Hiển thị trạng thái điểm danh */}
														{buoiHoc.trangThaiDiemDanh && (
															<Tag
																color={colorTrangThaiLopDiemDanh[buoiHoc.trangThaiDiemDanh as ETrangThaiLopDiemDanh]}
															>
																{trangThaiLopDiemDanh[buoiHoc.trangThaiDiemDanh as ETrangThaiLopDiemDanh]}
															</Tag>
														)}

														<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay as EHinhThucGiangDay]}>
															{buoiHoc.hinhThucGiangDay}
														</Tag>
													</div>
												</Space>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</Spin>
			</Card>

			{/* Modal xem chi tiết */}
			{selectEvent ? (
				<ModalViewDetailCalendar
					visible={visibleDetail}
					setVisible={setVisibleDetail}
					event={selectEvent}
					getData={getThoiKhoaBieu}
				/>
			) : null}
		</Card>
	);
};

export default RenderLichGiangDay;
