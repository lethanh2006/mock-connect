import { KyTucXa } from '@/services/KyTucXa/typings';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { ReloadOutlined, InfoCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Skeleton, Typography, Modal, message, Tag, Form, Spin } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import RoomCard from './components/CardRoom';
import FormDangKy from './components/Form/Form';
import RoomDetailModal from './components/Modal/ModalDetailRoom';
import SelectToaNhaKTX from './components/Select/SelectBuilding';
import SelectFloorKTX from './components/Select/SelectFloor';
import './style.less';
import { FilterIconCustom } from './components/IconsRoom';
import { ETrangThaiThanhToan } from '@/services/KyTucXa/constant';
import SelectCapacityKTX from './components/Select/SelectCapacity';
import SelectRoomTypeKTX from './components/Select/SelectRoomType';
import PageCard from '@/components/PageCard';
import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';

const DangKyKyTucXaPage = () => {
	const intl = useIntl();
	const { danhSach: danhSachToa } = useModel('kytucxa.toanha');
	const { danhSach: danhSachDotDangKy, getModel: getDotDangKy, loading: loadingDotDangKy, setRecord: setDotDangKyRecord, record: recordDot } = useModel('kytucxa.dotdangky');
	const { danhSach: danhSachMien, getModel: getDanhSachMien } = useModel('kytucxa.danhsachmien');
	const { record: thongTinSinhVien } = useModel('kytucxa.thongtinsinhvien');
	const { danhSach: danhSachPhong, getModel: getPhongModel, loading: loadingPhong, setRecord: setPhongRecord, setVisibleForm, setIsView } = useModel('kytucxa.phong');
	const { danhSach: danhSachLichSu, getModel: getLichSu } = useModel('kytucxa.dangky');
	const { getAllModel: getAllDanhTienIch } = useModel('kytucxa.tienich');
	const { loaiPhongMap } = useModel('kytucxa.loaiphong');

	const [selectedToa, setSelectedToa] = useState<string | undefined>(undefined);
	const [selectedCapacity, setSelectedCapacity] = useState<number | undefined>(undefined);
	const [selectedRoomType, setSelectedRoomType] = useState<string | undefined>(undefined);
	const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);

	const [hangCho, setHangCho] = useState<KyTucXa.IYeuCauChoPhong | null>(null);
	const [loadingHangCho, setLoadingHangCho] = useState(false);
	const [formExempt] = Form.useForm();
	const [submittingExempt, setSubmittingExempt] = useState(false);

	const activeRegistration = useMemo(() => {
		return danhSachLichSu.find(
			(item) => item.trangThaiThanhToan !== ETrangThaiThanhToan.HUY,
		);
	}, [danhSachLichSu]);

	const fetchHangCho = async () => {
		setLoadingHangCho(true);
		try {
			const res = await axios.get(`${ipCsvc}/dang-ky-ky-tuc-xa/waiting-request/me`);
			if (res?.data?.data) {
				const list = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
				const active = list.find((item: any) => item.trangThai === 'CHO_XU_LY') || list[0] || null;
				setHangCho(active);
			} else {
				setHangCho(null);
			}
		} catch (err) {
			console.error('Lỗi khi tải hàng chờ:', err);
		} finally {
			setLoadingHangCho(false);
		}
	};

	useEffect(() => {
		getDotDangKy();
		getDanhSachMien(undefined, undefined, undefined, undefined, undefined, '');
		getLichSu();
		getAllDanhTienIch();
		fetchHangCho();
	}, []);

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

	const handleDangKyHangCho = useCallback(async (phong: KyTucXa.IPhong) => {
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

		Modal.confirm({
			title: 'Xác nhận đăng ký hàng chờ',
			content: `Bạn có chắc chắn muốn đăng ký vào hàng chờ cho phòng thuộc tòa ${phong.toaNha?.ten || phong.maToaNha} không?`,
			okText: 'Đăng ký',
			cancelText: 'Hủy',
			onOk: async () => {
				try {
					await axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/waiting-request`, {
						maDotId: dotChuaPhong._id,
						maToaNha: phong.maToaNha,
						maLoaiPhong: phong.maLoaiPhongKtx,
					});
					message.success('Đăng ký hàng chờ thành công');
					fetchHangCho();
				} catch (err: any) {
					console.error(err);
					message.error(err?.response?.data?.message || 'Không thể đăng ký hàng chờ, vui lòng thử lại');
				}
			}
		});
	}, [cacDotDangKyHienTai]);

	const handleCancelHangCho = async () => {
		if (!hangCho?._id) return;
		Modal.confirm({
			title: 'Hủy đăng ký hàng chờ',
			content: 'Bạn có chắc chắn muốn hủy yêu cầu hàng chờ này không?',
			onOk: async () => {
				try {
					await axios.delete(`${ipCsvc}/dang-ky-ky-tuc-xa/waiting-request/${hangCho._id}`);
					message.success('Hủy đăng ký hàng chờ thành công');
					fetchHangCho();
				} catch (err) {
					console.error('Lỗi khi hủy hàng chờ:', err);
					message.error('Không thể hủy hàng chờ, vui lòng thử lại sau');
				}
			}
		});
	};

	const isExempted = useMemo(() => {
		if (!danhSachMien || danhSachMien.length === 0 || cacDotDangKyHienTai.length === 0 || !thongTinSinhVien?.ma) return false;

		const maHocKy = cacDotDangKyHienTai.map((dot) => dot.maHocKy);
		return danhSachMien.some(
			(item: KyTucXa.IDanhSachMien) => item.maSinhVien === thongTinSinhVien.ma && maHocKy.includes(item.maHocKy)
		);
	}, [danhSachMien, cacDotDangKyHienTai, thongTinSinhVien?.ma]);

	const activeExemption = useMemo(() => {
		if (!danhSachMien || danhSachMien.length === 0 || cacDotDangKyHienTai.length === 0 || !thongTinSinhVien?.ma) return null;

		const maHocKy = cacDotDangKyHienTai.map((dot) => dot.maHocKy);
		return danhSachMien.find(
			(item: KyTucXa.IDanhSachMien) => item.maSinhVien === thongTinSinhVien.ma && maHocKy.includes(item.maHocKy)
		);
	}, [danhSachMien, cacDotDangKyHienTai, thongTinSinhVien?.ma]);

	const getExemptionStatusTag = (status: string) => {
		switch (status) {
			case 'CHO_NOP_MINH_CHUNG':
				return <Tag color="warning">Chờ nộp minh chứng</Tag>;
			case 'CHO_DUYET':
				return <Tag color="processing">Chờ duyệt</Tag>;
			case 'DA_DUYET':
				return <Tag color="success">Đã duyệt</Tag>;
			case 'TU_CHOI':
				return <Tag color="error">Từ chối (Cần nộp lại)</Tag>;
			default:
				return <Tag>{status}</Tag>;
		}
	};

	const handleNopMinhChung = async () => {
		if (!activeExemption) return;
		try {
			const values = await formExempt.validateFields();
			setSubmittingExempt(true);
			const fileUrl = await buildUpLoadFile(values, 'urlMinhChung').catch(console.log);
			if (!fileUrl) {
				message.error('Vui lòng chọn file minh chứng');
				setSubmittingExempt(false);
				return;
			}
			await axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/me/mien-dang-ky/${activeExemption._id}/minh-chung`, { urlMinhChung: fileUrl });
			message.success('Nộp minh chứng thành công');
			getDanhSachMien(undefined, undefined, undefined, undefined, undefined, '');
		} catch (err) {
			console.error(err);
			message.error('Có lỗi xảy ra, vui lòng thử lại');
		} finally {
			setSubmittingExempt(false);
		}
	};

	const toaNhaName = useMemo(() => {
		if (!hangCho?.maToaNha) return '';
		const list = Array.isArray(danhSachToa) ? (danhSachToa as KyTucXa.IToa[]) : [];
		const found = list.find((toa) => toa.ma === hangCho.maToaNha);
		return found ? found.ten : hangCho.maToaNha;
	}, [hangCho?.maToaNha, danhSachToa]);

	const loaiPhongName = useMemo(() => {
		if (!hangCho?.maLoaiPhong) return '';
		const found = loaiPhongMap.get(hangCho.maLoaiPhong);
		return found ? found.ten : hangCho.maLoaiPhong;
	}, [hangCho?.maLoaiPhong, loaiPhongMap]);

	return (
		<PageCard
			title={intl.formatMessage({ id: 'kytucxa.dangky.title' })}
		>
			{hangCho && (
				<Spin spinning={loadingHangCho}>
					<Card title="Yêu cầu hàng chờ phòng" style={{ marginBottom: 16, borderRadius: 12 }} extra={
						hangCho.trangThai === 'CHO_XU_LY' && (
							<Button type="primary" danger onClick={handleCancelHangCho}>
								Hủy yêu cầu hàng chờ
							</Button>
						)
					}>
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={6}>
								<Typography.Text type="secondary">Tòa nhà: </Typography.Text>
								<Typography.Text strong>{toaNhaName}</Typography.Text>
							</Col>
							<Col xs={24} sm={6}>
								<Typography.Text type="secondary">Loại phòng: </Typography.Text>
								<Typography.Text strong>{loaiPhongName}</Typography.Text>
							</Col>
							<Col xs={24} sm={6}>
								<Typography.Text type="secondary">Số thứ tự xếp hàng: </Typography.Text>
								<Typography.Text strong style={{ fontSize: 16, color: '#1890ff' }}>{hangCho.soThuTu}</Typography.Text>
							</Col>
							<Col xs={24} sm={6}>
								<Typography.Text type="secondary">Trạng thái: </Typography.Text>
								<Tag color={hangCho.trangThai === 'CHO_XU_LY' ? 'processing' : hangCho.trangThai === 'DA_XU_LY' ? 'success' : 'default'}>
									{hangCho.trangThai === 'CHO_XU_LY' ? 'Chờ xử lý' : hangCho.trangThai === 'DA_XU_LY' ? 'Đã xử lý' : 'Đã hủy'}
								</Tag>
							</Col>
						</Row>
					</Card>
				</Spin>
			)}

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
						{!isExempted && (
							<>
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
												condition={{ maDotId: recordDot?._id }}
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
							</>
						)}

						{isExempted ? (
							<div style={{ padding: '24px', background: '#fff', borderRadius: '0 0 12px 12px' }}>
								<div style={{ textAlign: 'center', marginBottom: 24 }}>
									<FileDoneOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
									<Typography.Title level={4}>
										{intl.formatMessage({ id: 'kytucxa.dangky.exemptedMsg' })}
									</Typography.Title>
								</div>
								
								{activeExemption && (
									<Card title="Chi tiết miễn giảm Ký túc xá" style={{ maxWidth: 600, margin: '0 auto', borderRadius: 8 }}>
										<div style={{ marginBottom: 16 }}>
											<Typography.Text type="secondary">Học kỳ: </Typography.Text>
											<Typography.Text strong>{activeExemption.maHocKy}</Typography.Text>
										</div>
										<div style={{ marginBottom: 16 }}>
											<Typography.Text type="secondary">Trạng thái minh chứng: </Typography.Text>
											{getExemptionStatusTag(activeExemption.trangThaiMinhChung)}
										</div>
										{activeExemption.ghiChuDuyet && (
											<div style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
												<Typography.Text type="secondary">Ghi chú duyệt: </Typography.Text>
												<Typography.Text>{activeExemption.ghiChuDuyet}</Typography.Text>
											</div>
										)}
										
										{(activeExemption.trangThaiMinhChung === 'CHO_NOP_MINH_CHUNG' || activeExemption.trangThaiMinhChung === 'TU_CHOI') && (
											<Form form={formExempt} layout="vertical" style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
												<Form.Item
													name="urlMinhChung"
													label="Tải lên minh chứng miễn giảm (PDF, PNG, JPG, JPEG, tối đa 5MB)"
													rules={[{ required: true, message: 'Vui lòng chọn file minh chứng' }]}
												>
													<UploadFile maxCount={1} accept=".pdf,.png,.jpg,.jpeg" maxFileSize={5} />
												</Form.Item>
												<Button type="primary" loading={submittingExempt} onClick={handleNopMinhChung} style={{ width: '100%' }}>
													Nộp minh chứng
												</Button>
											</Form>
										)}
									</Card>
								)}
							</div>
						) : (
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
												<RoomCard 
													phong={phong} 
													onXemChiTiet={handleXemChiTiet} 
													onDangKy={handleDangKy} 
													onDangKyHangCho={handleDangKyHangCho}
													maPhongDaDangKy={maPhongDaDangKy} 
												/>
											</Col>
										))}
									</Row>
								)}
							</div>
						)}
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
