import ModalViewDetailCalendar from '@/pages/Calendar/components/ModalViewDetail';
import { ColorSuKien, ELoaiQR, MapTitleELoaiQR, THU_TRONG_TUAN } from '@/services/SuKien/constant';
import type { SuKien } from '@/services/SuKien/typings';
import { useModel } from '@@/plugin-model/useModel';
import { Badge, Card, Empty, Pagination, Segmented, Space, Typography } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import styles from './styles.less';

type Ngay = string;

type State = Record<
	Ngay,
	{
		thuTrongTuan: string;
		cacSuKien: SuKien.IRecordSinhVien[];
	}
>;

const SuKienDaThamGia = () => {
	const { loading, getModel, total, setLimit, limit, page, setPage } = useModel('sukien.sukiendathamgia');
	const [loaiQR, setLoaiQR] = useState<ELoaiQR>(ELoaiQR.THAM_GIA);
	const [dataCalendar, setDataCalendar] = useState<State>({});
	const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
	const [selectEvent, setSelectEvent] = useState<any>();

	const getSuKien = async () => {
		return getModel({ loaiQR: loaiQR }, undefined, undefined, undefined, limit, 'me').then((data) => {
			const temp = data
				.filter((item) => item?.suKien)
				.map((item) => ({
					...item,
					title: item?.suKien?.tenSuKien ?? '',
				}));

			return temp;
		});
	};

	const getData = () => {
		const promises = [getSuKien()];
		Promise.allSettled(promises)
			.then((values) => {
				const responses = values.filter((item) => item.status === 'fulfilled').map((item: any) => item.value);
				const data = responses.flat();
				const nextState = data.reduce<State>((result, item) => {
					if (!item?.suKien?.thoiGianBatDau) {
						return result;
					}
					const ngayMoment = moment(item?.suKien?.thoiGianBatDau);
					const ngayString = ngayMoment.format('YYYY-MM-DD');
					return {
						...result,
						[ngayString]: {
							thuTrongTuan: result[ngayString]?.thuTrongTuan ?? THU_TRONG_TUAN[ngayMoment.toDate().getDay()],
							cacSuKien: (result[ngayString]?.cacSuKien ?? []).concat({
								...item,
								suKien: { ...item.suKien, cauHinhMinhChungId: item?.cauHinhMinhChungId },
								tenSuKien: item.title,
								diaDiem: item.phongHoc ?? item.diaDiem,
							}),
						},
					};
				}, {});

				setDataCalendar(nextState);
			})
			.catch((er) => console.log(er));
	};

	// useEffect(() => {
	// 	getAllHocKy();
	// }, []);
	useEffect(() => {
		getData();
	}, [loaiQR, limit, page]);

	const renderContent = () => {
		const keysSorted = sortBy(Object.keys(dataCalendar));
		if (!loading && !loading && isEmpty(dataCalendar)) {
			return (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={
						loaiQR === ELoaiQR.THAM_GIA ? (
							<>Bạn chưa tham gia sự kiện nào, hãy theo dõi những sự kiện đang diễn ra.</>
						) : (
							<>Bạn chưa đăng ký sự kiện nào, hãy theo dõi những sự kiện đang diễn ra.</>
						)
					}
				/>
			);
		}

		return keysSorted.map((ngay) => {
			const { cacSuKien, thuTrongTuan } = dataCalendar[ngay];
			const cacSuKienSorted = sortBy(cacSuKien, (suKien) => new Date(suKien?.suKien?.thoiGianBatDau ?? ''));
			return (
				<div key={ngay} className={styles.ngay}>
					<Space style={{ marginBottom: 8 }}>
						<Badge count={cacSuKien.length} size='small' offset={[15, 11]} color='#D66'>
							<div className={styles.ngay__title}>
								{thuTrongTuan}, ngày {moment(ngay).format('DD/MM/YYYY')}
							</div>
						</Badge>
					</Space>
					{cacSuKienSorted.map((sukien) => (
						<div
							key={sukien._id}
							className={styles.su_kien}
							// style={{ background: ColorSuKien[sukien.loaiSuKien] }}
							onClick={() => {
								setSelectEvent(sukien?.suKien ?? {});
								setVisibleDetail(true);
							}}
						>
							<div className={styles.su_kien__left}>
								<div className={styles.su_kien__thoi_gian}>
									{moment(sukien?.suKien?.thoiGianBatDau).format('HH:mm')}
								</div>
							</div>
							<div
								className={styles.su_kien__right}
								style={{
									borderColor: ColorSuKien[sukien?.suKien?.loaiSuKien],
								}}
							>
								<div>{[sukien?.suKien.tenSuKien, sukien?.suKien?.diaDiem].filter(Boolean).join(' - ')}</div>
							</div>
						</div>
					))}
				</div>
			);
		});
	};

	const onChangePaging = (p: number, size: number) => {
		setPage(p);
		setLimit(size);
	};

	return (
		<>
			<Card
				style={{ minHeight: 863, height: 'auto' }}
				// loading={loading}
				title={
					<div>
						<Typography.Text>Sự kiện tham gia</Typography.Text>
					</div>
				}
			>
				<div style={{ marginBottom: 12 }}>
					<Segmented
						value={loaiQR}
						onChange={(val: any) => setLoaiQR(val)}
						options={Object.values(ELoaiQR).map((item) => ({ value: item, label: MapTitleELoaiQR?.[item] }))}
					/>
				</div>
				{/*<div*/}
				{/*	id='scrollableDiv'*/}
				{/*	style={{*/}
				{/*		height: 700,*/}
				{/*		overflow: 'auto',*/}
				{/*	}}*/}
				{/*>*/}
				{/*<InfiniteScroll*/}
				{/*	style={{ overflow: 'unset' }}*/}
				{/*	dataLength={danhSach.length}*/}
				{/*	next={() => onViewMore?.()}*/}
				{/*	hasMore={danhSach.length < total}*/}
				{/*	loader={*/}
				{/*		<div style={{ padding: '12px 24px' }}>*/}
				{/*			<Skeleton paragraph={{ rows: 1 }} active />*/}
				{/*		</div>*/}
				{/*	}*/}
				{/*	scrollableTarget='root'*/}
				{/*>*/}
				{renderContent()}
				{/*</InfiniteScroll>*/}
				{/* </Scrollbars> */}
				{/*</div>*/}

				<Pagination
					onChange={onChangePaging}
					defaultPageSize={22}
					current={page}
					pageSize={limit}
					total={total}
					pageSizeOptions={[10, 22, 34]}
					style={{ textAlign: 'right' }}
				/>
			</Card>
			{/*<TableBase buttons={{create:false}} title={'Sự kiện đã tham gia'} modelName={'sukien.sukiendathamgia'} columns={columns} />*/}
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
export default SuKienDaThamGia;
