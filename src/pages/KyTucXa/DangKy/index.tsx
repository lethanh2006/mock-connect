import { DangKyKyTucXa } from '@/services/KyTucXa/typings';
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
import { ETrangThaiDuyetKTX } from '@/services/KyTucXa/constant';
import SelectCapacityKTX from './components/SelectCapacity';
import SelectRoomTypeKTX from './components/SelectRoomType';

const DangKyKyTucXaPage = () => {
	const intl = useIntl();
	const { danhSach: danhSachToa } = useModel('kytucxa.toanha');
	const { danhSach: danhSachDotDangKy, getModel: getDotDangKy, loading: loadingDotDangKy, setRecord: setDotDangKyRecord } = useModel('kytucxa.dotdangky');
	const { danhSach: danhSachPhong, getModel: getPhong, loading: loadingPhong, setRecord: setPhongRecord, setVisibleForm, setIsView } = useModel('kytucxa.phong');
	const { danhSach: danhSachLichSu, getModel: getLichSu } = useModel('kytucxa.dangky');
	const { getAllModel: getAllKhoanThu } = useModel('kytucxa.khoanthu');
	const { getAllModel: getAllDanhTienIch } = useModel('kytucxa.tienich');

	const [selectedToa, setSelectedToa] = useState<string | undefined>(undefined);
	const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);
	const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);

	const maPhongDaDangKy = useMemo(() => {
		const lichSuHoatDong = danhSachLichSu.find(
			(item) => item.trangThaiDuyet !== ETrangThaiDuyetKTX.HUY,
		);
		return lichSuHoatDong?.maPhong;
	}, [danhSachLichSu]);

	useEffect(() => {
		getDotDangKy();
		getLichSu();
		getAllKhoanThu();
		getAllDanhTienIch();
	}, []);

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
		() => (Array.isArray(danhSachToa) ? (danhSachToa as DangKyKyTucXa.IToaKTX[]) : []),
		[danhSachToa],
	);

	const listPhong = useMemo(
		() => (Array.isArray(danhSachPhong) ? (danhSachPhong as DangKyKyTucXa.IPhongKTXSinhVien[]) : []),
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

		return list;
	}, [listPhong, selectedMaToa, selectedCapacity, selectedFloor, danhSachMaPhongHienTai]);

	useEffect(() => {
		if (cacDotDangKyHienTai.length === 0) {
			setDotDangKyRecord(undefined);
			return;
		}
		setDotDangKyRecord(cacDotDangKyHienTai[0]);
		getPhong(undefined, undefined, undefined, undefined, undefined, '');
	}, [cacDotDangKyHienTai]);

	const handleReset = () => {
		setSelectedToa(undefined);
		setSelectedCapacity(undefined);
		setSelectedFloor(undefined);
		getDotDangKy();
		getLichSu();
	};

	const handleXemChiTiet = useCallback((phong: DangKyKyTucXa.IPhongKTXSinhVien) => {
		setPhongRecord(phong);
		setIsView(true);
	}, []);

	const handleDangKy = useCallback((phong: DangKyKyTucXa.IPhongKTXSinhVien) => {
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
		<div className='ktx-page'>
			<Typography.Title level={4} className='ktx-page__title'>
				{intl.formatMessage({ id: 'kytucxa.dangky.title' })}
			</Typography.Title>

			{loadingDotDangKy ? (
				<Card className='ktx-page__dot-card' style={{ borderRadius: 12 }}>
					<Skeleton active paragraph={{ rows: 2 }} />
				</Card>
			) : cacDotDangKyHienTai.length === 0 ? (
				<Empty
					description={intl.formatMessage({ id: 'kytucxa.dangky.noBatch' })}
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					className='ktx-page__empty'
				/>
			) : (
				<>
					{cacDotDangKyHienTai.map(dot => (
						<div key={dot._id} className='ktx-page__dot-card' style={{ padding: '10px 14px', marginBottom: 16 }}>
							<Typography.Title level={5} style={{ marginBottom: 4, color: '#1d3a6b' }}>
								{dot.tenDot}
							</Typography.Title>
							<Typography.Text type='secondary' style={{ fontSize: '13px' }}>
								{intl.formatMessage({ id: 'kytucxa.dangky.registerTime' })} <strong>{formatDateTime(dot.thoiGianBatDau)}</strong> {intl.formatMessage({ id: 'kytucxa.dangky.to' })}{' '}
								<strong>{formatDateTime(dot.thoiGianKetThuc)}</strong>
							</Typography.Text>

							{dot.ghiChu && (
								<div
									style={{
										marginTop: 14,
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
									<Typography.Text style={{ color: '#1d3a6b', fontWeight: 600, display: 'block', fontSize: '13px', marginBottom: 2 }}>
										{intl.formatMessage({ id: 'kytucxa.dangky.note' })}: {dot.ghiChu}
									</Typography.Text>
								</div>
							)}
						</div>
					))}

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
									<SelectFloorKTX value={selectedFloor} onChange={handleChangeFloor} allowClear={true} />
								</Col>
								
								<Col flex='220px'>
									<SelectRoomTypeKTX value={selectedCapacity} onChange={handleChangeCapacity} allowClear={true} />
								</Col>

								<Col flex='220px'>
									<SelectCapacityKTX value={selectedCapacity} onChange={handleChangeCapacity} allowClear={true} />
								</Col>

								<Col flex='none'>
									<Button icon={<ReloadOutlined />} onClick={handleReset} className='ktx-page__reset-btn' />
								</Col>
							</Row>
						</div>

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
		</div>
	);
};

export default DangKyKyTucXaPage;
