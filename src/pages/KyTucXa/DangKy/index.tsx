import { KyTucXa } from '@/services/KyTucXa/typings';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Skeleton, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import RoomCard from './components/CardRoom';
import FormDangKy from './components/Form';
import RoomDetailModal from './components/ModalDetailRoom';
import SelectToaNhaKTX from './components/SelectToaNha';
import SelectFloorKTX from './components/SelectFloor';
import './style.less';
import { FilterIconCustom } from './components/IconsRoom';
import { ETrangThaiDuyet } from '@/services/KyTucXa/constant';
import SelectCapacityKTX from './components/SelectCapacity';
import SelectRoomTypeKTX from './components/SelectRoomType';
import PageCard from '@/components/PageCard';

const DangKyKyTucXaPage = () => {
	const intl = useIntl();
	const { danhSach: danhSachToa } = useModel('kytucxa.toanha');
	const { danhSach: danhSachDotDangKy, getModel: getDotDangKy, loading: loadingDotDangKy, setRecord: setDotDangKyRecord, record: recordDot } = useModel('kytucxa.dotdangky');
	const { danhSach: danhSachPhong, getModel: getPhongModel, loading: loadingPhong, setRecord: setPhongRecord, setVisibleForm, setIsView } = useModel('kytucxa.phong');
	const { danhSach: danhSachLichSu, getModel: getLichSu } = useModel('kytucxa.dangky');

	const [selectedToa, setSelectedToa] = useState<string | undefined>(undefined);
	const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);
	const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(undefined);
	const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);

	const activeRegistration = useMemo(() => {
		return danhSachLichSu.find(
			(item) => item.trangThaiDuyet !== ETrangThaiDuyet.HUY,
		);
	}, [danhSachLichSu]);

	useEffect(() => {
		if (recordDot?._id) {
			getPhongModel({ maDotId: recordDot._id }, undefined, undefined, undefined, undefined, '');
		}
	}, [recordDot?._id]);

	const maPhongDaDangKy = activeRegistration?.phong?.ma || activeRegistration?.maPhong;

	const handleChangeToa = (toaId?: string) => {
		setSelectedToa(toaId);
	};

	const handleChangeCapacity = (capacity?: number) => {
		setSelectedCapacity(capacity);
	};

	const handleChangeFloor = (floor?: number) => {
		setSelectedFloor(floor);
	};

	const listToa = useMemo(
		() => (Array.isArray(danhSachToa) ? (danhSachToa as KyTucXa.IToa[]) : []),
		[danhSachToa],
	);

	const listPhong = useMemo(
		() => (Array.isArray(danhSachPhong) ? (danhSachPhong as KyTucXa.IPhong[]) : []),
		[danhSachPhong],
	);

	const selectedMaToa = useMemo(() => {
		if (!selectedToa) return undefined;
		return listToa.find((toa) => toa._id === selectedToa)?.ma;
	}, [selectedToa, listToa]);

	const cacDotDangKyHienTai = useMemo(() => {
		const listDot = Array.isArray(danhSachDotDangKy) ? danhSachDotDangKy : [];
		const now = dayjs();

		return listDot.filter((dot) => now.isBetween(dayjs(dot.thoiGianBatDau), dayjs(dot.thoiGianKetThuc), null, '[]'));
	}, [danhSachDotDangKy]);

	const danhSachMaToaHienTai = useMemo(() => {
		if (cacDotDangKyHienTai.length === 0) return [];
		const maToas = new Set<string>();
		cacDotDangKyHienTai.forEach(dot => {
			if (dot.danhSachToaNha) {
				dot.danhSachToaNha.forEach(ma => maToas.add(ma));
			}
		});
		return Array.from(maToas);
	}, [cacDotDangKyHienTai]);

	const danhSachMaPhongHienTai = useMemo(() => {
		if (cacDotDangKyHienTai.length === 0) return [];
		const maPhongs = new Set<string>();
		cacDotDangKyHienTai.forEach(dot => {
			if (dot.danhSachPhong) {
				dot.danhSachPhong.forEach(ma => maPhongs.add(ma));
			}
		});
		return Array.from(maPhongs);
	}, [cacDotDangKyHienTai]);

	const filteredPhong = useMemo(() => {
		let list = listPhong;

		if (danhSachMaPhongHienTai.length > 0) {
			list = list.filter((p) => danhSachMaPhongHienTai.includes(p.ma));
		}

		if (selectedMaToa) {
			list = list.filter((p) => p.maToaNha === selectedMaToa);
		}

		if (selectedCapacity !== undefined) {
			list = list.filter((p) => p.soLuongToiDa === selectedCapacity);
		}

		if (selectedFloor !== undefined) {
			list = list.filter((p) => p.tangThu === selectedFloor);
		}

		if (selectedRoomType !== undefined) {
			list = list.filter((p) => p.maLoaiPhongKtx === selectedRoomType);
		}

		return list;
	}, [listPhong, selectedMaToa, selectedCapacity, selectedFloor, selectedRoomType, danhSachMaPhongHienTai]);

	useEffect(() => {
		if (cacDotDangKyHienTai.length === 0) {
			setDotDangKyRecord(undefined);
			return;
		}
		setDotDangKyRecord(cacDotDangKyHienTai[0]);
	}, [cacDotDangKyHienTai]);

	const handleReset = () => {
		setSelectedToa(undefined);
		setSelectedCapacity(undefined);
		setSelectedFloor(undefined);
		setSelectedRoomType(undefined);
		getDotDangKy();
		getLichSu();
	};

	const handleXemChiTiet = useCallback((phong: KyTucXa.IPhong) => {
		setPhongRecord(phong);
		setIsView(true);
	}, []);

	const handleDangKy = useCallback((phong: KyTucXa.IPhong) => {
		if (cacDotDangKyHienTai.length === 0) return;

		const dotChuaPhong = cacDotDangKyHienTai.find(dot => {
			if (dot.danhSachPhong && dot.danhSachPhong.length > 0) {
				return dot.danhSachPhong.includes(phong.ma);
			}
			if (dot.danhSachToaNha && dot.danhSachToaNha.length > 0) {
				return dot.danhSachToaNha.includes(phong.maToaNha);
			}
			return true;
		}) || cacDotDangKyHienTai[0];

		setDotDangKyRecord(dotChuaPhong);
		setPhongRecord(phong);
		setIsView(false);
		setVisibleForm(true);
	}, [cacDotDangKyHienTai]);

	return (
		<PageCard
			title={intl.formatMessage({ id: 'kytucxa.dangky.title' })}
		>

			{loadingDotDangKy ? (
				<Card className='ktx-page__dot-card' style={{ borderRadius: 12 }}>
					<Skeleton active paragraph={{ rows: 2 }} />
				</Card>
			) : cacDotDangKyHienTai.length === 0 ? (
				<Empty
					description={intl.formatMessage({ id: 'kytucxa.dangky.noPeriod' })}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					className='ktx-page__empty'
				/>
			) : (
				<>
					<div className='ktx-page__main-card'>
						<div className='ktx-page__filter-bar'>
							<Row gutter={[12, 8]} align='middle' wrap={false}>
								<Col flex='none' style={{ display: 'flex', alignItems: 'center', marginLeft: 4 }}>
									<FilterIconCustom />
								</Col>

								<Col flex='220px'>
									<SelectToaNhaKTX
										value={selectedToa}
										onChange={handleChangeToa}
										allowClear={true}
										danhSachMaToa={danhSachMaToaHienTai}
									/>
								</Col>

								<Col flex='220px'>
									<SelectFloorKTX value={selectedFloor} onChange={handleChangeFloor} allowClear={true} condition={{ maDotId: recordDot?._id }} disableFetch={true} />
								</Col>

								<Col flex='220px'>
									<SelectRoomTypeKTX value={selectedRoomType} onChange={setSelectedRoomType} allowClear={true} />
								</Col>

								<Col flex='220px'>
									<SelectCapacityKTX value={selectedCapacity} onChange={handleChangeCapacity} allowClear={true} condition={{ maDotId: recordDot?._id }} disableFetch={true} />
								</Col>

								<Col flex='none'>
									<Button icon={<ReloadOutlined />} onClick={handleReset} className='ktx-page__reset-btn' />
								</Col>
							</Row>
						</div>

						{cacDotDangKyHienTai.map(dot => (
							<div key={dot._id} style={{ padding: '16px 20px', borderBottom: '1px solid #e8edf5', background: '#fafcff' }}>
								<Typography.Title level={5} style={{ marginBottom: 4, color: '#1d3a6b' }}>
									{dot.tenDot}
								</Typography.Title>
								<div
									style={{
										marginTop: 10,
										padding: '10px 14px',
										background: '#f0f5ff',
										borderLeft: '4px solid #1d3a6b',
										borderRadius: '0 8px 8px 0',
										display: 'flex',
										alignItems: 'flex-start',
										gap: 10,
									}}
								>
									<InfoCircleOutlined style={{ color: '#1d3a6b', marginTop: 3, fontSize: '15px' }} />
									<Typography.Text style={{ fontSize: '14px', color: '#2E2E2E' }}>
										{intl.formatMessage({ id: 'kytucxa.dangky.registerTime' })} <strong style={{ color: '#0051FF' }}>{formatDateTime(dot.thoiGianBatDau)}</strong> {intl.formatMessage({ id: 'kytucxa.dangky.to' })}{' '}
										<strong style={{ color: '#0051FF' }}>{formatDateTime(dot.thoiGianKetThuc)}</strong>.
										{activeRegistration && (
											<>
												{' '}{intl.formatMessage({ id: 'kytucxa.dangky.paymentBefore' })}{' '}
												<strong style={{ color: '#0051FF' }}>{formatDateTime(dot.thoiGianKetThuc)}</strong>.
											</>
										)}
									</Typography.Text>
								</div>
							</div>
						))}

						<div className='ktx-page__list'>
							{loadingPhong ? (
								<Row gutter={[12, 12]}>
									{[1, 2, 3].map((i) => (
										<Col key={i} xs={24} sm={12} md={8}>
											<Card style={{ borderRadius: 12 }}>
												<Skeleton active />
											</Card>
										</Col>
									))}
								</Row>
							) : filteredPhong.length === 0 ? (
								<Empty
									description={intl.formatMessage({ id: 'kytucxa.dangky.roomNotFound' })}
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									className='ktx-page__empty'
								/>
							) : (
								<Row gutter={[12, 12]}>
									{filteredPhong.map((phong) => (
										<Col key={phong._id} xs={24} sm={12} md={8}>
											<RoomCard phong={phong} onXemChiTiet={handleXemChiTiet} onDangKy={handleDangKy} maPhongDaDangKy={maPhongDaDangKy} />
										</Col>
									))}
								</Row>
							)}
						</div>
					</div>

					<RoomDetailModal
						onDangKy={(p) => {
							setIsView(false);
							handleDangKy(p);
						}}
						maPhongDaDangKy={maPhongDaDangKy}
					/>

					<FormDangKy />
				</>
			)} 
		</PageCard>
	);
};

export default DangKyKyTucXaPage;
