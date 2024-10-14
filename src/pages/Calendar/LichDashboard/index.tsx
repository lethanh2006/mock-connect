import { ColorSuKien, ELoaiSuKien } from '@/services/SuKien/constant';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Empty, Modal, Row, Space, Typography } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import FormLichCaNhan from '../components/FormLichCaNhan';
import GhiChuLich from '../components/GhiChuLich';
import ModalViewDetailCalendar from '../components/ModalViewDetail';
import styles from './styles.less';

const getThoiGianMotTuanKeTuHomNay = () => {
	return {
		fromDate: moment().startOf('day').toISOString(),
		toDate: moment().add(7, 'day').endOf('day').toISOString(),
	};
};

const LichDashboard = () => {
	const {
		visibleForm,
		setVisibleForm,
		getSuKienTrongKhoangModel,
		loading: loadingSuKien,
		dataCalendarDashboard,
		setDataLichDashboard,
		dataLichDashboard,
		setLichHienThiDashboardModel,
	} = useModel('sukien.sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');
	const { getTrongKhoangModel: getLichThiModel, loading: loadingThi } = useModel('khaothi.lichthi');
	const { thongKeBaiTapModel } = useModel('daotao.baitap');
	const { record: recSetting } = useModel('tienich.settinglich');
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();

	//#region Get Data
	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || '',
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
				phongHoc: item.phong?.ma ?? '',
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
			moment().startOf('day').toISOString(),
			moment().add(7, 'day').endOf('day').toISOString(),
		).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: `${item?.assignment?.noiDung} - ${item?.assignment?.tenLopHocPhan}`,
				thoiGianBatDau: moment(item?.assignment?.thoiGianKetThuc).toDate(),
				thoiGianKetThuc: moment(item?.assignment?.thoiGianKetThuc).toDate(),
				loaiSuKien: ELoaiSuKien.BAI_TAP,
			}));
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
	//#endregion

	useEffect(() => {
		setLichHienThiDashboardModel(dataLichDashboard ?? []);
	}, [dataLichDashboard?.length]);

	useEffect(() => {
		getData();
	}, []);

	const renderContent = () => {
		const keysSorted = sortBy(Object.keys(dataCalendarDashboard));
		if (!loadingSuKien && !loadingSuKien && isEmpty(dataCalendarDashboard)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có sự kiện nào' />;
		}

		return keysSorted.map((ngay) => {
			const { cacSuKien, thuTrongTuan } = dataCalendarDashboard[ngay];
			const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau));
			return (
				<div key={ngay} className={styles.ngay}>
					<Space style={{ marginBottom: 8 }}>
						<Badge count={cacSuKien.length} size='small' offset={[15, 11]} color='#D66'>
							<div className={styles.ngay__title}>
								{thuTrongTuan}, ngày {moment(ngay).format('DD/MM')}
							</div>
						</Badge>
					</Space>
					{cacSuKienSorted.map((sukien) => (
						<div
							key={sukien._id}
							className={styles.su_kien}
							// style={{ background: ColorSuKien[sukien.loaiSuKien] }}
							onClick={() => {
								setSelectEvent(sukien);
								setVisibleDetail(true);
							}}
						>
							<div className={styles.su_kien__left}>
								<div className={styles.su_kien__thoi_gian}>{moment(sukien.thoiGianBatDau).format('HH:mm')}</div>
							</div>
							<div
								className={styles.su_kien__right}
								style={{
									borderColor:
										recSetting?.danhSachSettingLich?.find((item) => item?.loaiLich === sukien.loaiSuKien)?.maMau ??
										ColorSuKien[sukien.loaiSuKien],
								}}
							>
								<div>{[sukien.tenSuKien, sukien.diaDiem].filter(Boolean).join(' - ')}</div>
							</div>
						</div>
					))}
				</div>
			);
		});
	};

	return (
		<>
			<Card
				className={styles.container}
				loading={loadingSuKien || loadingTKB || loadingThi}
				title={
					<div className={styles.title}>
						<Typography.Text>Lịch sắp tới</Typography.Text>
						<Link to={'/calendar'} type='link' style={{ fontSize: 14, fontWeight: 400 }}>
							Xem thêm <ArrowRightOutlined />
						</Link>
					</div>
				}
			>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<div style={{ maxHeight: 450, overflowY: 'auto' }}>{renderContent()}</div>
					</Col>
					{!isEmpty(dataLichDashboard) ? (
						<Col span={24}>
							<GhiChuLich />
						</Col>
					) : null}
				</Row>
			</Card>

			<Modal
				visible={visibleForm}
				bodyStyle={{ padding: 0 }}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				maskClosable={false}
			>
				<FormLichCaNhan getData={getData} />
			</Modal>

			{/* Modal xem chi tiết lịch */}
			{selectEvent ? (
				<ModalViewDetailCalendar
					visible={visibleDetail}
					setVisible={setVisibleDetail}
					event={selectEvent}
					getData={getData}
				/>
			) : null}
		</>
	);
};

export default LichDashboard;
