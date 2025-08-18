import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import dayjs from '@/utils/dayjs';
import { Button, Card, Empty, Space, Tag, Typography } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SlideButtonIcon from '../SlideButtonIcon';
import '../style.less';

const { Title } = Typography;

const CardSuKienSapToi = () => {
	const {
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		dataLichDashboard,
		setDataLichDashboard,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { record: recSetting } = useModel('tienich.settinglich');

	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();
	const [currentIndex, setCurrentIndex] = useState(0);

	const getThoiGianMotTuanKeTuHomNay = () => {
		return {
			fromDate: dayjs().startOf('week').toISOString(),
			toDate: dayjs().add(7, 'day').endOf('day').toISOString(),
		};
	};

	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || ''}`,
				suffix: [item?.lopHocPhan?.ten, item?.phongHoc].filter(Boolean).join(', '),
				loaiSuKien: ELoaiSuKien.LICH_HOC,
			}));
			return temp;
		});
	};

	const getLichThi = async () => {
		return getLichThiModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `Lịch thi: ${item.danhSachHocPhan?.map((i) => i.ten).join(', ')}`,
				suffix: item.phong?.ma ?? '',
				loaiSuKien: ELoaiSuKien.LICH_THI,
			}));
			return temp;
		});
	};

	const getSuKien = async () => {
		return getSuKienTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
			}));
			return temp;
		});
	};

	const getBaiTap = async () => {
		return thongKeBaiTapModel(
			dayjs().startOf('week').toISOString(),
			dayjs().add(2, 'months').endOf('day').toISOString(),
		).then((data) => {
			const aWeekLater = dayjs().add(7, 'day').endOf('day');
			const temp = data
				.map((item) => ({
					...item,
					title: item?.assignment?.noiDung ?? '',
					suffix: item?.assignment?.tenLopHocPhan,
					thoiGianBatDau: dayjs(item?.assignment?.thoiGianKetThuc),
					thoiGianKetThuc: dayjs(item?.assignment?.thoiGianKetThuc),
					loaiSuKien: ELoaiSuKien.BAI_TAP,
				}))
				.filter((i) => i.thoiGianKetThuc.isBefore(aWeekLater));
			return temp;
		});
	};

	const getData = () => {
		const promises = [getThoiKhoaBieu(), getSuKien(), getLichThi(), getBaiTap()];

		Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				const data = responses.flat();
				setDataLichDashboard(data);
			})
			.catch((er) => console.log(er));
	};

	useEffect(() => {
		getData();
	}, []);

	const getSuKienSapToi = () => {
		const dataToUse = dataLichDashboard;

		if (!dataToUse?.length) return [];

		const now = dayjs();
		const next24Hours = now.add(24, 'hour');

		return dataToUse
			.filter((event) => {
				const eventTime = dayjs(event.thoiGianBatDau);
				return eventTime.isAfter(now) && eventTime.isBefore(next24Hours);
			})
			.sort((a, b) => dayjs(a.thoiGianBatDau).diff(dayjs(b.thoiGianBatDau)));
	};

	const handlePrevious = () => {
		const suKienSapToi = getSuKienSapToi();
		setCurrentIndex((prev) => (prev > 0 ? prev - 1 : suKienSapToi.length - 1));
	};

	const handleNext = () => {
		const suKienSapToi = getSuKienSapToi();
		setCurrentIndex((prev) => (prev < suKienSapToi.length - 1 ? prev + 1 : 0));
	};

	const handleEventClick = (event: any) => {
		setSelectEvent(event);
		setVisibleDetail(true);
	};

	const renderCurrentEvent = () => {
		const suKienSapToi = getSuKienSapToi();

		if (isEmpty(suKienSapToi)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' className='empty' />;
		}

		const currentEvent = suKienSapToi[currentIndex];
		if (!currentEvent) return null;

		return (
			<div
				key={currentEvent?._id || currentIndex}
				className={`card fade-in`}
				onClick={() => handleEventClick(currentEvent)}
			>
				<div className='content'>
					<div className='details'>
						<div className='title'>{currentEvent.title || currentEvent.tenSuKien}</div>

						<div className='footer'>
							<div className='date'>{dayjs(currentEvent.thoiGianBatDau).format('DD/MM/YYYY')}</div>
							<div className='tags'>
								<Space size={4} wrap>
									<Tag
										color={
											recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === currentEvent.loaiSuKien)
												?.maMau ?? ColorSuKien[currentEvent.loaiSuKien as ELoaiSuKien]
										}
										style={{ fontSize: 11 }}
									>
										{currentEvent.loaiSuKien}
									</Tag>

									{currentEvent?.isQRDangKy && (
										<Tag color={currentEvent?.isDangKy ? 'green' : 'red'} style={{ fontSize: 11 }}>
											{currentEvent?.isDangKy ? 'Đã đăng ký' : 'Chưa đăng ký'}
										</Tag>
									)}
								</Space>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<Card
				className='tb-sk-wrapper'
				variant='borderless'
				loading={loadingSuKien || loadingTKB || loadingThi}
				styles={{ body: { padding: 0 } }}
			>
				<div className='header-tb-sk'>
					<Title level={5} className='title'>
						Sự kiện
					</Title>
					<div className='navigation-buttons'>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='left' disabled={getSuKienSapToi().length <= 1} />}
							onClick={handlePrevious}
							disabled={getSuKienSapToi().length <= 1}
							className='nav-btn'
						/>
						<Button
							type='text'
							icon={<SlideButtonIcon direction='right' disabled={getSuKienSapToi().length <= 1} />}
							onClick={handleNext}
							disabled={getSuKienSapToi().length <= 1}
							className='nav-btn'
						/>
					</div>
				</div>

				{renderCurrentEvent()}
			</Card>

			{selectEvent && (
				<ModalViewDetailCalendar
					visible={visibleDetail}
					setVisible={setVisibleDetail}
					event={selectEvent}
					getData={getData}
				/>
			)}
		</>
	);
};

export default CardSuKienSapToi;
