import PageCard from '@/components/PageCard';
import { EOperatorType } from '@/components/Table/constant';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { getPublicAssetPath } from '@/utils/path';
import { FileDoneOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Input, message, Pagination, Row, Select, Space, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDanhMucChungKTX from '../DanhMucChung/Select';
import SelectToaNhaKTX from '../ToaNha/Select';
import CardPhong from './components/CardPhong';
import ChiTietPhong from './components/ChiTiet';
import ModalDanKyKTX from './components/Modal';
import { ETrangThaiDuyetKTX } from '@/services/TaiChinh/constant';

const { Search } = Input;

const getPhongDangKyKeys = (phong?: Phong.IChinhSachPhongRecord) =>
	[phong?._id, phong?.roomId, phong?.room?._id, phong?.room?.ma].filter(Boolean).map((item) => String(item));

const getLichSuDangKyKeys = (lichSu?: PhieuDangKyKTX.IRecord) =>
	[lichSu?.maPhong, lichSu?.phong?._id, lichSu?.phong?.ma, (lichSu as any)?.roomId]
		.filter(Boolean)
		.map((item) => String(item));

const coFormDonDangKy = (lichSu?: PhieuDangKyKTX.IRecord) => !!(lichSu?.formDon?._id && lichSu?.trangThaiDuyet!==ETrangThaiDuyetKTX.HUY);

const DangKyKyTucXa = () => {
	const intl = useIntl();``
	const {
		getModel,
		danhSach,
		page,
		limit,
		setPage,
		setLimit,
		total,
		handleView,
		setVisibleDangKy,
		loading,
		setVisibleForm,
		setRecord,
		setFilters,
		filters,
	} = useModel('kytucxa.phong');
	const { getByIdModel: getDotDangKy, record: recDot, setRecord: setRecDot } = useModel('kytucxa.dotdangky');
	const {
		getModel: getLichSuDangKy,
		record: recLichSu,
		setRecord: setRecLichSu,
		loading: loadingLichSu,
	} = useModel('kytucxa.phieudangky');

	//Get đợt đăng ký
	useEffect(() => {
		getDotDangKy('me/one', true).then((res: any) => setRecDot(res?.data));
	}, []);

	//Get lịch sử đăng ký
	const getLichSuDangKyData = async () => {
		if (!recDot?._id || recDot?.isMienKyTucXa) {
			setRecLichSu(undefined);
			return;
		}

		const res = await getLichSuDangKy(
			{ maDotId: recDot?._id },
			undefined,
			undefined,
			undefined,
			undefined,
			'me/page',
			undefined,
			false,
		);
		setRecLichSu(res?.[0]);
	};

	useEffect(() => {
		getLichSuDangKyData();
	}, [recDot?._id, recDot?.isMienKyTucXa]);

	const getData = () => {
		if (recDot?._id && !recDot?.isMienKyTucXa) {
			getModel({ maDotId: recDot?._id }, undefined, undefined, undefined, undefined, 'ktx/chinh-sach-phong/page');
		}
	};

	useEffect(() => {
		getData();
	}, [page, limit, filters, recDot?._id, recDot?.isMienKyTucXa]);

	const handleFilterChange = useCallback(
		(fieldPath: string[], value: any, operator = EOperatorType.EQUAL) => {
			setFilters((prevFilters: any) => {
				const currentFilters = prevFilters || [];
				const newFilters = currentFilters.filter((f: any) => JSON.stringify(f.field) !== JSON.stringify(fieldPath));

				if (value) {
					newFilters.push({
						field: fieldPath,
						operator: operator,
						values: Array.isArray(value) ? value : [value],
					});
				}
				return newFilters;
			});
			setPage(1);
		},
		[setFilters, setPage],
	);

	const searchTenPhong = useMemo(
		() =>
			_.debounce((val: string) => {
				const keyword = val.trim();
				handleFilterChange(['room', 'ten'], keyword, EOperatorType.CONTAIN);
			}, 500),
		[handleFilterChange],
	);

	const handleXemChiTiet = (phong: Phong.IChinhSachPhongRecord) => {
		handleView(phong);
	};

	const handleDangKy = (phong: Phong.IChinhSachPhongRecord) => {
		if (coFormDonDangKy(recLichSu)) {
			message.warning(intl.formatMessage({ id: 'kytucxa.dangky.message.daCoLichSu' }));
			return;
		}

		setVisibleForm(false);
		setRecord(phong);
		setVisibleDangKy(true);
	};

	const lichSuDangKyKeys = useMemo(() => getLichSuDangKyKeys(recLichSu), [recLichSu]);
	const daCoLichSuDangKy = coFormDonDangKy(recLichSu);

	const isPhongDaDangKy = useCallback(
		(phong: Phong.IChinhSachPhongRecord) => {
			if (!daCoLichSuDangKy) return false;

			const phongKeys = getPhongDangKyKeys(phong);
			return phongKeys.some((key) => lichSuDangKyKeys.includes(key));
		},
		[daCoLichSuDangKy, lichSuDangKyKeys],
	);

	const handlePaginationChange = (newPage: number, newPageSize: number) => {
		if (newPageSize !== limit) {
			setPage(1);
			setLimit(newPageSize);
		} else {
			setPage(newPage);
		}
	};

	const handlePageSizeChange = (current: number, size: number) => {
		setPage(1);
		setLimit(size);
	};

	if (!recDot?._id) {
		return (
			<PageCard title={intl.formatMessage({ id: 'kytucxa.dangky.title' })}>
				<Empty description={intl.formatMessage({ id: 'kytucxa.dangky.empty.noDotDangKy' })} />
			</PageCard>
		);
	}

	if (recDot?.isMienKyTucXa) {
		return (
			<PageCard title={intl.formatMessage({ id: 'kytucxa.dangky.title' })}>
				<div className='room-exempt-state'>
					<div className='room-exempt-state__icon'>
						<FileDoneOutlined />
					</div>
					<div className='room-exempt-state__text'>{intl.formatMessage({ id: 'kytucxa.dangky.exempt.message' })}</div>
				</div>
			</PageCard>
		);
	}

	return (
		<PageCard title={intl.formatMessage({ id: 'kytucxa.dangky.title' })}>
			<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
				<Space wrap>
					<Search
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.filter.searchPlaceholder' })}
						style={{ width: 250 }}
						allowClear
						onChange={(e) => searchTenPhong(e.target.value)}
						onSearch={(value) => {
							searchTenPhong.cancel();
							searchTenPhong(value);
							searchTenPhong.flush();
						}}
					/>
					<SelectToaNhaKTX
						style={{ width: 250 }}
						allowClear
						onChange={(val) => handleFilterChange(['room', 'toaNha', '_id'], val, EOperatorType.INCLUDE)}
					/>
					<SelectDanhMucChungKTX
						condition={{ maLoai: 'LOAI_PHONG_KTX' }}
						style={{ width: 250 }}
						allowClear
						onChange={(val) => handleFilterChange(['maLoaiPhongKtx'], val, EOperatorType.INCLUDE)}
					/>
					<Select
						style={{ width: 250 }}
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.placeholder' })}
						onChange={(val) => {
							if (val) {
								const [min, max] = val.split('-').map(Number);
								handleFilterChange(['sucChua'], [min, max], EOperatorType.BETWEEN);
							} else {
								handleFilterChange(['sucChua'], undefined, EOperatorType.BETWEEN);
							}
						}}
						options={[
							{
								value: '3-6',
								label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option1' }),
							},
							{
								value: '6-12',
								label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option2' }),
							},
							{
								value: '12-50',
								label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option3' }),
							},
						]}
						allowClear
					/>
				</Space>

				<Button icon={<ReloadOutlined />} onClick={getData} />
			</Flex>

			<Alert
				type='info'
				showIcon
				icon={<InfoCircleOutlined />}
				style={{ marginBottom: 12, marginTop: 12 }}
				message={
					<span>
						{intl.formatMessage(
							{ id: 'kytucxa.dangky.alert.thoiGianDangKy' },
							{
								tenDot: <b style={{ color: '#0E50CF' }}>{recDot?.tenDot}</b>,
								tuNgay: (
									<b style={{ color: '#0E50CF' }}>
										{recDot?.thoiGianBatDau ? moment(recDot.thoiGianBatDau).format('HH:mm DD/MM/YYYY') : '--'}
									</b>
								),
								denNgay: (
									<b style={{ color: '#0E50CF' }}>
										{recDot?.thoiGianKetThuc ? moment(recDot.thoiGianKetThuc).format('HH:mm DD/MM/YYYY') : '--'}
									</b>
								),
							},
						)}
					</span>
				}
			/>

			{daCoLichSuDangKy ? (
				<Alert
					type='warning'
					showIcon
					style={{ marginBottom: 12 }}
					message={intl.formatMessage({ id: 'kytucxa.dangky.alert.daCoLichSu' })}
				/>
			) : null}

			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<Spin spinning={loading || loadingLichSu}>
				{danhSach?.length ? (
					<>
						<Row gutter={[12, 12]}>
							{danhSach.map((phong) => (
								<Col key={phong._id} xs={24} md={12} xl={8} className='room-list-col'>
									<CardPhong
										phong={phong}
										daCoLichSuDangKy={daCoLichSuDangKy}
										laPhongDaDangKy={isPhongDaDangKy(phong)}
										onXemChiTiet={handleXemChiTiet}
										onDangKy={handleDangKy}
									/>
								</Col>
							))}
						</Row>

						{total > 0 && (
							<div className='pagination-container'>
								<Pagination
									current={page}
									pageSize={limit}
									total={total}
									onChange={handlePaginationChange}
									onShowSizeChange={handlePageSizeChange}
									pageSizeOptions={['5', '10', '20', '50']}
									showSizeChanger={false}
									disabled={loading}
									size='default'
									className='pagination'
								/>
							</div>
						)}
					</>
				) : (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={intl.formatMessage({ id: 'kytucxa.dangky.empty.noData' })}
						image={getPublicAssetPath('images/empty.png')}
					/>
				)}
			</Spin>

			<ChiTietPhong daCoLichSuDangKy={daCoLichSuDangKy} isPhongDaDangKy={isPhongDaDangKy} />
			<ModalDanKyKTX getData={getData} daCoLichSuDangKy={daCoLichSuDangKy} onDangKyThanhCong={getLichSuDangKyData} />
		</PageCard>
	);
};

export default DangKyKyTucXa;
