import { EVaiTroSvLhc, vaiTroSvLhc } from '@/services/DaoTao/SinhVien/constants';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EGioiTinh } from '@/services/DaoTao/constant';
import { formatDate } from '@/utils/formatDate';
import { EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, Dropdown, List, Menu, Modal, Row, Typography } from 'antd';
import { useIntl } from 'umi';
import './style.less';

import { useEffect, useState } from 'react';
import PageCard from '@/components/PageCard';
const { Text } = Typography;

type TSinhVien = Partial<SinhVien.IRecord> & Partial<SinhVien.ISinhVienHocKy>;

const DanhSachSinhVien = (props: { sinhVienList: TSinhVien[]; loading: boolean; fromLopHocPhan?: boolean }) => {
	const intl = useIntl();
	const { sinhVienList, loading, fromLopHocPhan } = props;
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [record, setRecord] = useState<TSinhVien>();

	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const showStudentDetail = (student: TSinhVien) => {
		setRecord(student);
		setModalVisible(true);
	};

	const getDropdownMenu = (student: TSinhVien) => (
		<Menu>
			<Menu.Item key='detail' icon={<EyeOutlined />} onClick={() => showStudentDetail(student)}>
				{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.chitiet' })}
			</Menu.Item>
		</Menu>
	);

	const isMobile = screenSize.width <= 768;

	const renderStudentList = () => (
		<PageCard
			loading={loading}
			level={3}
			style={{
				borderRadius: '8px',
			}}
			title={
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span>{intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.dssv' })}</span>
						<span
							style={{
								backgroundColor: '#f6ffed',
								padding: '2px 8px',
								borderRadius: '8px',
								fontSize: '12px',
								color: '#49AA19',
								border: '1px solid #B7EB8F',
							}}
						>
							{sinhVienList.length}
						</span>
					</div>
				</div>
			}
			bodyStyle={{ padding: 0 }}
		>
			{/* Di chuyển scroll xuống đây - chỉ áp dụng cho phần danh sách */}
			<div
				style={{
					maxHeight: '60vh',
					overflowY: 'auto',
					overflowX: 'hidden', // ẩn scroll ngang
				}}
			>
				{fromLopHocPhan || isMobile ? (
					<List
						dataSource={sinhVienList}
						renderItem={(student) => (
							<List.Item
								style={{ padding: '12px 0px', borderBottom: '1px solid #f0f0f0' }}
								actions={[
									<Dropdown overlay={getDropdownMenu(student)} trigger={['click']} placement='bottomRight'>
										<Button type='text' icon={<MoreOutlined />} style={{ color: '#666' }} />
									</Dropdown>,
								]}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											src={
												student.anhDaiDienUrl ||
												`/images/${student.gioiTinh === EGioiTinh.Nu ? 'female.svg' : 'male.svg'}`
											}
											size={48}
										/>
									}
									title={
										<div
											style={{ fontSize: '16px', fontWeight: 500, color: '#333', cursor: 'pointer' }}
											onClick={() => showStudentDetail(student)}
										>
											{student.ten}
										</div>
									}
									description={
										<div style={{ color: '#666', fontSize: '14px' }}>
											{student.ma} • {student.gioiTinh}
											{!fromLopHocPhan && student.vaiTro && <> • {vaiTroSvLhc[student.vaiTro]}</>}
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<List
						grid={{ gutter: 12, column: 3 }}
						dataSource={sinhVienList}
						renderItem={(student) => (
							<List.Item
								style={{
									borderBottom: 'none',
									padding: 0,
								}}
							>
								<Card
									className='card-hover'
									style={{
										borderRadius: '8px',
										textAlign: 'left',
										padding: '8px 12px',
										margin: 0,
									}}
									bodyStyle={{ padding: 0 }}
									onClick={() => showStudentDetail(student)}
								>
									<Row align='middle' gutter={12}>
										<Col>
											<Avatar
												src={
													student.anhDaiDienUrl ||
													`/images/${student.gioiTinh === EGioiTinh.Nu ? 'female.svg' : 'male.svg'}`
												}
												size={48}
											/>
										</Col>
										<Col flex='1'>
											<div style={{ fontSize: 16, fontWeight: 500 }}>{student.ten}</div>
											<div style={{ color: '#666', fontSize: 14 }}>
												{student.ma} • {student.gioiTinh}{' '}
												{!fromLopHocPhan && student.vaiTro && (
													<div>
														<Text
															style={{
																color: [EVaiTroSvLhc.LOP_TRUONG, EVaiTroSvLhc.LOP_PHO].includes(student.vaiTro)
																	? 'var(--color-primary)'
																	: '#666',
																fontSize: 14,
															}}
															strong
														>
															{vaiTroSvLhc[student.vaiTro]}
														</Text>
													</div>
												)}
											</div>
										</Col>
									</Row>
								</Card>
							</List.Item>
						)}
					/>
				)}
			</div>
		</PageCard>
	);

	return (
		<>
			{renderStudentList()}

			<Modal
				title={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.thongtin' })}
				open={modalVisible}
				onCancel={() => setModalVisible(false)}
				okButtonProps={{ hidden: true }}
				cancelText='Đóng'
				width={800}
			>
				<Row align='middle' gutter={[0, 12]}>
					<Col span={24} md={8} style={{ textAlign: 'center' }}>
						<Avatar
							src={record?.anhDaiDienUrl || `/images/${record?.gioiTinh === EGioiTinh.Nu ? 'female.svg' : 'male.svg'}`}
							size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
						/>
					</Col>
					<Col span={24} md={16}>
						<Descriptions bordered column={1} size='small'>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.hoten' })}>
								{record?.ten}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.masv' })}>
								{record?.ma}
							</Descriptions.Item>
							<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.email' })}>
								{record?.email}
							</Descriptions.Item>
							<Descriptions.Item
								label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.gioitinh' })}
							>
								{record?.gioiTinh ?? ''}
							</Descriptions.Item>
							<Descriptions.Item
								label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.ngaysinh' })}
							>
								{record?.ngaySinh && formatDate(record.ngaySinh)}
							</Descriptions.Item>
							<Descriptions.Item
								label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.dienthoai' })}
							>
								{record?.soDienThoai}
							</Descriptions.Item>
							{/* {!fromLopHocPhan ? ( */}
							<Descriptions.Item label={intl.formatMessage({ id: 'lophanhchinh.thongtinchung.thongtinlop.sv.vaitro' })}>
								{record?.vaiTro ? (
									<Text
										style={{
											color: [EVaiTroSvLhc.LOP_TRUONG, EVaiTroSvLhc.LOP_PHO].includes(record.vaiTro)
												? 'var(--color-primary)'
												: '#666',
											fontSize: 14,
										}}
										strong
									>
										{vaiTroSvLhc[record.vaiTro]}
									</Text>
								) : (
									'--'
								)}
							</Descriptions.Item>
							{/* ) : null} */}
						</Descriptions>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default DanhSachSinhVien;
