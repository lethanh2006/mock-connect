import { ColorSuKien, ELoaiSuKien, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { Card, Empty, Space, Tag, Typography, List } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
import { v4 } from 'uuid';
import styles from './styles.less';

const getThoiGianMotTuanKeTuHomNay = () => {
	return {
		fromDate: moment().startOf('day').toISOString(),
		toDate: moment().add(7, 'day').endOf('day').toISOString(),
	};
};

type Ngay = string;
interface StateItem {
	tenSuKien: string;
	diaDiem: string;
	loaiSuKien: ELoaiSuKien;
	thoiGianBatDau: string;
	thoiGianKetThuc: string;
	id: string;
}
type State = Record<
	Ngay,
	{
		thuTrongTuan: string;
		cacSuKien: StateItem[];
	}
>;

export const LichTrongTuan = () => {
	const { selectSuKiens, getSuKienTrongKhoangModel, loading: loadingSuKien } = useModel('sukien');
	const { getTrongKhoangModel, loading: loadingTKB } = useModel('daotao.thoikhoabieu');

	const [dataCalendar, setDataCalendar] = useState<State>({});

	//#region Get Data
	const getThoiKhoaBieu = async () => {
		return getTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item.lopHocPhan?.hocPhan?.ten || item.lopHocPhan?.maHocPhan || item?.tenLopHocPhan || '',
				loaiSuKien: ELoaiSuKien.LICH_GIANG_DAY,
				start: moment(item?.thoiGianBatDau).toDate(),
				end: moment(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});
	};

	const getSuKien = async () => {
		return getSuKienTrongKhoangModel(getThoiGianMotTuanKeTuHomNay()).then((data) => {
			const temp = data.map((item) => ({
				...item,
				title: item?.tenSuKien ?? '',
				start: moment(item?.thoiGianBatDau).toDate(),
				end: moment(item?.thoiGianKetThuc).toDate(),
			}));
			return temp;
		});
	};

	const getData = () => {
		const promises = [];
		if (selectSuKiens.includes(ELoaiSuKien.LICH_GIANG_DAY)) promises.push(getThoiKhoaBieu());
		if (selectSuKiens.includes(ELoaiSuKien.CA_NHAN) || selectSuKiens.includes(ELoaiSuKien.CHUNG))
			promises.push(getSuKien());

		Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				const data = responses.flat();
				const nextState = data.reduce<State>((result, item) => {
					if (!item.thoiGianBatDau) {
						return result;
					}
					const ngayMoment = moment(item.thoiGianBatDau);
					const ngayString = ngayMoment.format('DD/MM/YYYY');

					return {
						...result,
						[ngayString]: {
							thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayMoment.toDate().getDay()],
							cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
								tenSuKien: item.title ?? item.tenSuKien,
								thoiGianBatDau: item.thoiGianBatDau ?? item.start,
								thoiGianKetThuc: item.thoiGianKetThuc ?? item.end,
								loaiSuKien: ELoaiSuKien.CA_NHAN,
								diaDiem: item.phongHoc ?? item.diaDiem,
								id: v4(),
							}),
						},
					};
				}, {});
				setDataCalendar(nextState);
			})
			.catch((er) => console.log(er));
	};
	//#endregion

	useEffect(() => {
		getData();
	}, [selectSuKiens.length]);

	const renderContent = () => {
		const keysSorted = sortBy(Object.keys(dataCalendar), (ngay) => new Date(ngay));
		if (!loadingSuKien && !loadingSuKien && isEmpty(dataCalendar)) {
			return <Empty description='Không có sự kiên nào' />;
		}
		return keysSorted.map((ngay) => {
			const { cacSuKien, thuTrongTuan } = dataCalendar[ngay];
			const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien.thoiGianBatDau));
			return (
				<div key={ngay} className={styles.ngay}>
					<Space style={{ marginBottom: 6 }}>
						<Typography.Text className={styles.ngay__title}>
							{thuTrongTuan} {ngay}
						</Typography.Text>
						<Tag color='#108ee9'>{cacSuKien.length} sự kiện</Tag>
					</Space>
					<List
						style={{ maxHeight: 400, overflowX: 'hidden', overflowY: 'auto' }}
						size='small'
						dataSource={cacSuKienSorted}
						renderItem={(sukien) => {
							return (
								<List.Item style={{ width: '100%', display: 'block' }}>
									<div
										key={sukien.id}
										className={styles.su_kien}
										style={{ color: '#fff', background: ColorSuKien[sukien.loaiSuKien] }}
									>
										<div className={styles.su_kien__left}>
											<div className={styles.su_kien__thoi_gian}>{moment(sukien.thoiGianBatDau).format('HH:mm')}</div>
										</div>
										<div
											className={styles.su_kien__right}
											style={{
												borderColor: ColorSuKien[sukien.loaiSuKien],
											}}
										>
											<div>{[sukien.tenSuKien, sukien.diaDiem].filter(Boolean).join(' - ')}</div>
										</div>
									</div>
								</List.Item>
							);
						}}
					/>
				</div>
			);
		});
	};

	return (
		<Card
			className={styles.container}
			loading={loadingSuKien || loadingTKB}
			title={
				<div className={styles.title}>
					<Typography.Text>Lịch sắp tới</Typography.Text>
					<Link to={'/calendar'} type='link' style={{ fontSize: 14 }}>
						Xem thêm
					</Link>
				</div>
			}
		>
			<div>{renderContent()}</div>
		</Card>
	);
};
