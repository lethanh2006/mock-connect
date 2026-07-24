import { EOperatorType } from '@/components/Table/constant';
import SelectDanhMucChungKTX from '@/pages/KyTucXa/DanhMucChung/Select';
import CardPhong from '@/pages/KyTucXa/DangKy/components/CardPhong';
import ChiTietPhong from '@/pages/KyTucXa/DangKy/components/ChiTiet';
import ModalDanKyKTX from '@/pages/KyTucXa/DangKy/components/Modal';
import SelectToaNhaKTX from '@/pages/KyTucXa/ToaNha/Select';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { formatDateTime } from '@/utils/formatDate';
import { getPublicAssetPath } from '@/utils/path';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Input, Modal, Pagination, Row, Select, Space, Spin, message } from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';

const { Search } = Input;

const getPhongDangKyKeys = (phong?: Phong.IChinhSachPhongRecord) =>
	[phong?._id, phong?.roomId, phong?.room?._id, phong?.room?.ma].filter(Boolean).map((item) => String(item));

const getLichSuDangKyKeys = (lichSu?: PhieuDangKyKTX.IRecord) =>
	[lichSu?.maPhong, lichSu?.phong?._id, lichSu?.phong?.ma, (lichSu as any)?.roomId]
		.filter(Boolean)
		.map((item) => String(item));

const laLichSuDaDong = (lichSu?: PhieuDangKyKTX.IRecord) => lichSu?.trangThaiThanhToan === EMaTrangThaiThanhToan.DONG;

const coFormDonDangKy = (lichSu?: PhieuDangKyKTX.IRecord) => !!lichSu?.formDon?._id && !laLichSuDaDong(lichSu);

const laLichSuCuaPhong = (phong?: Phong.IChinhSachPhongRecord, lichSu?: PhieuDangKyKTX.IRecord) => {
	if (!phong || !lichSu?.formDon?._id) return false;

	const phongKeys = getPhongDangKyKeys(phong);
	const lichSuKeys = getLichSuDangKyKeys(lichSu);

	return phongKeys.some((key) => lichSuKeys.includes(key));
};

type StudentHousingModalProps = {
	open: boolean;
	onClose: () => void;
	onSelectSuccess?: () => void;
};

const StudentHousingModal = ({ open, onClose, onSelectSuccess }: StudentHousingModalProps) => {
	const intl = useIntl();
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

	const [isViewDangKy, setIsViewDangKy] = useState<boolean>(false);
	const [initialModalStep, setInitialModalStep] = useState<number>(0);

	useEffect(() => {
		if (!open) return;
		getDotDangKy('me/one', true)
			.then((res: any) => setRecDot(res?.data))
			.catch(() => setRecDot(undefined));
	}, [open]);

	const getLichSuDangKyData = async () => {
		if (!recDot?._id || recDot?.isMienKyTucXa) {
			setRecLichSu(undefined);
			return;
		}

		try {
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
		} catch {
			setRecLichSu(undefined);
		}
	};

	useEffect(() => {
		if (open) getLichSuDangKyData();
	}, [open, recDot?._id, recDot?.isMienKyTucXa]);

	const getData = () => {
		if (recDot?._id && !recDot?.isMienKyTucXa) {
			getModel({ maDotId: recDot?._id }, undefined, undefined, undefined, undefined, 'ktx/chinh-sach-phong/page');
		}
	};

	const handleDangKyThanhCong = () => {
		getData();
		getLichSuDangKyData();
		onSelectSuccess?.();
	};

	useEffect(() => {
		if (open) getData();
	}, [open, page, limit, filters, recDot?._id, recDot?.isMienKyTucXa]);

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

	const getLichSuDangKyTheoPhong = useCallback(
		(phong: Phong.IChinhSachPhongRecord) => (laLichSuCuaPhong(phong, recLichSu) ? recLichSu : undefined),
		[recLichSu],
	);

	const danhSachHienThi = useMemo(
		() =>
			[...(danhSach ?? [])].sort((a, b) => {
				const aDaDangKy = coFormDonDangKy(getLichSuDangKyTheoPhong(a));
				const bDaDangKy = coFormDonDangKy(getLichSuDangKyTheoPhong(b));

				return Number(bDaDangKy) - Number(aDaDangKy);
			}),
		[danhSach, getLichSuDangKyTheoPhong],
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
		setIsViewDangKy(false);
		setInitialModalStep(0);
		setVisibleDangKy(true);
	};

	const handleOpenLichSuDangKy = (phong: Phong.IChinhSachPhongRecord, initialStep = 0) => {
		if (!getLichSuDangKyTheoPhong(phong)) return;

		setRecord(phong);
		setVisibleForm(false);
		setIsViewDangKy(true);
		setInitialModalStep(initialStep);
		setVisibleDangKy(true);
	};

	const daCoLichSuDangKy = coFormDonDangKy(recLichSu);

	const isPhongDaDangKy = useCallback(
		(phong: Phong.IChinhSachPhongRecord) => {
			const lichSu = getLichSuDangKyTheoPhong(phong);
			return coFormDonDangKy(lichSu);
		},
		[getLichSuDangKyTheoPhong],
	);

	const handlePaginationChange = (newPage: number, newPageSize: number) => {
		if (newPageSize !== limit) {
			setPage(1);
			setLimit(newPageSize);
		} else {
			setPage(newPage);
		}
	};

	const handlePageSizeChange = (_current: number, size: number) => {
		setPage(1);
		setLimit(size);
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			title={
				<span style={{ fontSize: 18, fontWeight: 700, color: '#134d8b' }}>
					Student Housing
				</span>
			}
			width={1200}
			centered
			footer={null}
			bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '16px 24px' }}
		>
			<Flex justify='space-between' align='center' style={{ marginBottom: 12 }}>
				<Space wrap>
					<Search
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.filter.searchPlaceholder' })}
						style={{ width: 220 }}
						allowClear
						onChange={(e) => searchTenPhong(e.target.value)}
						onSearch={(value) => {
							searchTenPhong.cancel();
							searchTenPhong(value);
							searchTenPhong.flush();
						}}
					/>
					<SelectToaNhaKTX
						style={{ width: 200 }}
						allowClear
						onChange={(val) => handleFilterChange(['room', 'toaNha', '_id'], val, EOperatorType.INCLUDE)}
					/>
					<SelectDanhMucChungKTX
						condition={{ maLoai: 'LOAI_PHONG_KTX' }}
						style={{ width: 200 }}
						allowClear
						onChange={(val) => handleFilterChange(['maLoaiPhongKtx'], val, EOperatorType.INCLUDE)}
					/>
					<Select
						style={{ width: 200 }}
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
							{ value: '3-6', label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option1' }) },
							{ value: '6-12', label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option2' }) },
							{ value: '12-50', label: intl.formatMessage({ id: 'kytucxa.dangky.filter.sucChua.option3' }) },
						]}
						allowClear
					/>
				</Space>

				<Button icon={<ReloadOutlined />} loading={loading} onClick={getData} />
			</Flex>

			{recDot?.thoiGianBatDau && (
				<Alert
					type='info'
					showIcon
					icon={<InfoCircleOutlined />}
					style={{ marginBottom: 16 }}
					message={
						<span>
							{intl.formatMessage(
								{ id: 'kytucxa.dangky.alert.thoiGianDangKy' },
								{
									tenDot: <b style={{ color: '#0E50CF' }}>{recDot?.tenDot}</b>,
									tuNgay: (
										<b style={{ color: '#0E50CF' }}>
											{recDot?.thoiGianBatDau ? formatDateTime(recDot.thoiGianBatDau) : '--'}
										</b>
									),
									denNgay: (
										<b style={{ color: '#0E50CF' }}>
											{recDot?.thoiGianKetThuc ? formatDateTime(recDot.thoiGianKetThuc) : '--'}
										</b>
									),
								},
							)}
						</span>
					}
				/>
			)}

			<Spin spinning={loading || loadingLichSu}>
				{danhSachHienThi?.length ? (
					<>
						<Row gutter={[16, 16]}>
							{danhSachHienThi.map((phong) => {
								const lichSuDangKy = getLichSuDangKyTheoPhong(phong);

								return (
									<Col key={phong._id} xs={24} md={12} xl={8} className='room-list-col'>
										<CardPhong
											phong={phong}
											lichSuDangKy={lichSuDangKy}
											daCoLichSuDangKy={daCoLichSuDangKy}
											laPhongDaDangKy={isPhongDaDangKy(phong)}
											onOpenLichSuDangKy={handleOpenLichSuDangKy}
											onXemChiTiet={handleXemChiTiet}
											onDangKy={handleDangKy}
										/>
									</Col>
								);
							})}
						</Row>

						{total > 0 && (
							<div className='pagination-container' style={{ marginTop: 16 }}>
								<Pagination
									current={page}
									pageSize={limit}
									total={total}
									onChange={handlePaginationChange}
									onShowSizeChange={handlePageSizeChange}
									pageSizeOptions={['5', '10', '20', '50']}
									showSizeChanger={false}
									disabled={loading || loadingLichSu}
									size='default'
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

			<ChiTietPhong
				daCoLichSuDangKy={daCoLichSuDangKy}
				getLichSuDangKyTheoPhong={getLichSuDangKyTheoPhong}
				isPhongDaDangKy={isPhongDaDangKy}
				onOpenLichSuDangKy={handleOpenLichSuDangKy}
			/>
			<ModalDanKyKTX
				getData={handleDangKyThanhCong}
				daCoLichSuDangKy={daCoLichSuDangKy}
				isView={isViewDangKy}
				initialStep={initialModalStep}
			/>
		</Modal>
	);
};

export default StudentHousingModal;
