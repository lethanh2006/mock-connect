import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { primaryColor } from '@/services/base/constant';
import { colorTrangThaiUserDiemDanh, ETrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
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

interface RenderLichHocProps {
	dataCalendar?: ThoiKhoaBieu.IRecord[];
	loading?: boolean;
	onClick?: (val: ThoiKhoaBieu.IRecord) => void;
}

const RenderLichHoc = (props: RenderLichHocProps) => {
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

	const mockThoiKhoaBieu = [
		// Tiết học đang diễn ra (hôm nay)
		{
			_id: '1',
			thoiGianBatDau: dayjs().subtract(30, 'minute').toISOString(),
			thoiGianKetThuc: dayjs().add(60, 'minute').toISOString(),
			phongHoc: 'A101',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: 'DA_DIEM_DANH',
			lopHocPhan: {
				_id: 'lhp1',
				parent: {
					_id: 'parent1',
				},
				hocPhan: {
					ten: 'Lập trình Web nâng cao',
					ma: 'IT4409',
				},
			},
			tenLopHocPhan: 'Lập trình Web nâng cao',
			tenBuoiHoc: 'Lập trình Web nâng cao - A101',
		},
		// Tiết học tiếp theo (hôm nay)
		{
			_id: '2',
			thoiGianBatDau: dayjs().add(2, 'hour').toISOString(),
			thoiGianKetThuc: dayjs().add(4, 'hour').toISOString(),
			phongHoc: 'B205',
			hinhThucGiangDay: 'Trực tuyến',
			trangThaiDiemDanh: 'CHUA_DIEM_DANH',
			lopHocPhan: {
				_id: 'lhp2',
				parent: {
					_id: 'parent2',
				},
				hocPhan: {
					ten: 'Cơ sở dữ liệu',
					ma: 'IT3090',
				},
			},
			tenLopHocPhan: 'Cơ sở dữ liệu',
			tenBuoiHoc: 'Cơ sở dữ liệu - B205',
		},
		{
			_id: '3',
			thoiGianBatDau: dayjs().add(5, 'hour').toISOString(),
			thoiGianKetThuc: dayjs().add(7, 'hour').toISOString(),
			phongHoc: 'C304',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp3',
				parent: {
					_id: 'parent3',
				},
				hocPhan: {
					ten: 'Trí tuệ nhân tạo',
					ma: 'IT4490',
				},
			},
			tenLopHocPhan: 'Trí tuệ nhân tạo',
			tenBuoiHoc: 'Trí tuệ nhân tạo - C304',
		},
		// Ngày mai
		{
			_id: '4',
			thoiGianBatDau: dayjs().add(1, 'day').hour(8).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(1, 'day').hour(10).minute(0).toISOString(),
			phongHoc: 'D101',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp4',
				parent: {
					_id: 'parent4',
				},
				hocPhan: {
					ten: 'Phân tích và thiết kế hệ thống',
					ma: 'IT4320',
				},
			},
			tenLopHocPhan: 'Phân tích và thiết kế hệ thống',
			tenBuoiHoc: 'Phân tích và thiết kế hệ thống - D101',
		},
		{
			_id: '5',
			thoiGianBatDau: dayjs().add(1, 'day').hour(13).minute(30).toISOString(),
			thoiGianKetThuc: dayjs().add(1, 'day').hour(15).minute(30).toISOString(),
			phongHoc: 'E202',
			hinhThucGiangDay: 'Trực tuyến',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp5',
				parent: {
					_id: 'parent5',
				},
				hocPhan: {
					ten: 'Lập trình di động',
					ma: 'IT4788',
				},
			},
			tenLopHocPhan: 'Lập trình di động',
			tenBuoiHoc: 'Lập trình di động - E202',
		},
		// Ngày kia
		{
			_id: '6',
			thoiGianBatDau: dayjs().add(2, 'day').hour(9).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(2, 'day').hour(11).minute(0).toISOString(),
			phongHoc: 'F305',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: 'DA_DIEM_DANH',
			lopHocPhan: {
				_id: 'lhp6',
				parent: {
					_id: 'parent6',
				},
				hocPhan: {
					ten: 'Mạng máy tính',
					ma: 'IT4060',
				},
			},
			tenLopHocPhan: 'Mạng máy tính',
			tenBuoiHoc: 'Mạng máy tính - F305',
		},
		{
			_id: '7',
			thoiGianBatDau: dayjs().add(2, 'day').hour(14).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(2, 'day').hour(16).minute(0).toISOString(),
			phongHoc: 'A203',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp7',
				parent: {
					_id: 'parent7',
				},
				hocPhan: {
					ten: 'An toàn và bảo mật thông tin',
					ma: 'IT4240',
				},
			},
			tenLopHocPhan: 'An toàn và bảo mật thông tin',
			tenBuoiHoc: 'An toàn và bảo mật thông tin - A203',
		},
		// Thứ 4 tuần sau
		{
			_id: '8',
			thoiGianBatDau: dayjs().add(3, 'day').hour(8).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(3, 'day').hour(10).minute(0).toISOString(),
			phongHoc: 'B104',
			hinhThucGiangDay: 'Trực tuyến',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp8',
				parent: {
					_id: 'parent8',
				},
				hocPhan: {
					ten: 'Công nghệ phần mềm',
					ma: 'IT3180',
				},
			},
			tenLopHocPhan: 'Công nghệ phần mềm',
			tenBuoiHoc: 'Công nghệ phần mềm - B104',
		},
		{
			_id: '9',
			thoiGianBatDau: dayjs().add(3, 'day').hour(15).minute(30).toISOString(),
			thoiGianKetThuc: dayjs().add(3, 'day').hour(17).minute(30).toISOString(),
			phongHoc: 'C201',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp9',
				parent: {
					_id: 'parent9',
				},
				hocPhan: {
					ten: 'Xử lý ảnh số và video số',
					ma: 'IT4340',
				},
			},
			tenLopHocPhan: 'Xử lý ảnh số và video số',
			tenBuoiHoc: 'Xử lý ảnh số và video số - C201',
		},
		// Thứ 5
		{
			_id: '10',
			thoiGianBatDau: dayjs().add(4, 'day').hour(10).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(4, 'day').hour(12).minute(0).toISOString(),
			phongHoc: 'D302',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: 'CHUA_DIEM_DANH',
			trangThaiDiemDanhCaNhan: ETrangThaiUserDiemDanh.CHUA_DIEM_DANH,
			lopHocPhan: {
				_id: 'lhp10',
				parent: {
					_id: 'parent10',
				},
				hocPhan: {
					ten: 'Học máy và khai phá dữ liệu',
					ma: 'IT4735',
				},
			},
			tenLopHocPhan: 'Học máy và khai phá dữ liệu',
			tenBuoiHoc: 'Học máy và khai phá dữ liệu - D302',
		},
		// Thứ 6
		{
			_id: '11',
			thoiGianBatDau: dayjs().add(5, 'day').hour(7).minute(30).toISOString(),
			thoiGianKetThuc: dayjs().add(5, 'day').hour(9).minute(30).toISOString(),
			phongHoc: 'E101',
			hinhThucGiangDay: 'Trực tuyến',
			trangThaiDiemDanh: null,
			trangThaiDiemDanhCaNhan: ETrangThaiUserDiemDanh.MUON_VE_SOM,

			lopHocPhan: {
				_id: 'lhp11',
				parent: {
					_id: 'parent11',
				},
				hocPhan: {
					ten: 'Phát triển ứng dụng web',
					ma: 'IT4552',
				},
			},
			tenLopHocPhan: 'Phát triển ứng dụng web',
			tenBuoiHoc: 'Phát triển ứng dụng web - E101',
		},
		{
			_id: '12',
			thoiGianBatDau: dayjs().add(5, 'day').hour(13).minute(0).toISOString(),
			thoiGianKetThuc: dayjs().add(5, 'day').hour(15).minute(0).toISOString(),
			phongHoc: 'F202',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: null,
			lopHocPhan: {
				_id: 'lhp12',
				parent: {
					_id: 'parent12',
				},
				hocPhan: {
					ten: 'Lập trình Java',
					ma: 'IT3100',
				},
			},
			tenLopHocPhan: 'Lập trình Java',
			tenBuoiHoc: 'Lập trình Java - F202',
		},
		{
			_id: '13',
			thoiGianBatDau: dayjs().add(1, 'hour').toISOString(),
			thoiGianKetThuc: dayjs().add(3, 'hour').toISOString(),
			phongHoc: 'Phòng thí nghiệm A101',
			hinhThucGiangDay: 'Trực tiếp',
			trangThaiDiemDanh: 'CHUA_DIEM_DANH',
			lopHocPhan: {
				_id: 'lhp13',
				parent: {
					_id: 'parent13',
				},
				hocPhan: {
					ten: 'Phương pháp nghiên cứu khoa học và phát triển dự án công nghệ thông tin',
					ma: 'IT4999',
				},
			},
			tenLopHocPhan: 'Phương pháp nghiên cứu khoa học và phát triển dự án công nghệ thông tin',
			tenBuoiHoc: 'Phương pháp nghiên cứu khoa học và phát triển dự án công nghệ thông tin - Phòng thí nghiệm A101',
		},
	];

	// Lọc và nhóm dữ liệu theo ngày
	const data = mockThoiKhoaBieu
		?.filter(
			(event) =>
				dayjs(event.thoiGianKetThuc).isAfter(dayjs(), 'minute') || dayjs(event.thoiGianBatDau).isSame(dayjs(), 'day'),
		)
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
	const tietGanNhat = !isEmpty(data) && keysSorted.length > 0 ? data[keysSorted[0]].cacBuoiHoc[0] : null;

	if (!loading && isEmpty(data)) {
		return (
			<Card title='Tiết học sắp tới' className='card-big-title card-borderless' variant='borderless'>
				<Card variant='borderless'>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có lịch học' />
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
										<Badge count={cacBuoiHoc.length} size='small' offset={[15, 8]} color='#D66'>
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
												className={`${styles.tiet_hoc} ${onProgress ? styles.on_progress : ''}`}
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
															<BookOutlined /> Xem tiết
														</Link>

														{/* Hiển thị trạng thái điểm danh */}
														{buoiHoc.trangThaiDiemDanhCaNhan ? (
															<Tag
																color={
																	colorTrangThaiUserDiemDanh[buoiHoc.trangThaiDiemDanhCaNhan as ETrangThaiUserDiemDanh]
																}
															>
																{trangThaiUserDiemDanh[buoiHoc.trangThaiDiemDanhCaNhan as ETrangThaiUserDiemDanh]}
															</Tag>
														) : (
															<></>
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

export default RenderLichHoc;
