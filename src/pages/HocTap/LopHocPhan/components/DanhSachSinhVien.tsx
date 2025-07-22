import { vaiTroSvLhc } from '@/services/DaoTao/SinhVien/constants';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EGioiTinh } from '@/services/DaoTao/constant';
import { EyeOutlined, FileOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, Dropdown, List, Menu, Modal, Row, Tooltip } from 'antd';

import { saveAs } from 'file-saver';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

type TSinhVien = Partial<SinhVien.IRecord> & Partial<SinhVien.ISinhVienHocKy>;

const DanhSachSinhVien = (props: { sinhVienList: TSinhVien[]; loading: boolean; fromLopHocPhan?: boolean }) => {
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
				Xem thông tin chi tiết
			</Menu.Item>
		</Menu>
	);

	const isMobile = screenSize.width <= 768;

	const handleExport = () => {
		const data = sinhVienList.map((sv) => ({
			'Họ tên': sv.ten,
			'Mã sinh viên': sv.ma,
			Email: sv.email,
			'Giới tính': sv.gioiTinh,
			'Ngày sinh': sv.ngaySinh ? moment(sv.ngaySinh).format('DD/MM/YYYY') : '',
			'Số điện thoại': sv.soDienThoai,
			...(fromLopHocPhan
				? {}
				: {
						'Vai trò': sv.vaiTro ? vaiTroSvLhc[sv.vaiTro] : '',
					}),
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachSinhVien');

		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(blob, 'DanhSachSinhVien.xlsx');
	};

	const renderStudentList = () => (
		<Card
			style={{
				overflow: 'auto',
				scrollbarWidth: 'none',
				msOverflowStyle: 'none',
				maxHeight: '120vh',
				borderRadius: '8px',
			}}
			title={
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<span>Danh sách sinh viên</span>
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
					<Tooltip title='Xuất danh sách'>
						<Button
							onClick={handleExport}
							size='small'
							style={{
								border: 'none',
							}}
							icon={
								<FileOutlined
									style={{
										position: 'relative',
										display: 'inline-block',
										fontSize: 16,
										color: '#1677ff',
									}}
								/>
							}
						></Button>
					</Tooltip>
				</div>
			}
			bodyStyle={{ padding: 0 }}
			loading={loading}
		>
			<div
				style={{
					maxHeight: isMobile ? 450 : 'unset',
					overflowY: isMobile ? 'auto' : 'unset',
				}}
			>
				<List
					dataSource={sinhVienList}
					renderItem={(student) => (
						<List.Item
							style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}
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
								title={<div style={{ fontSize: '16px', fontWeight: 500, color: '#333' }}>{student.ten}</div>}
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
			</div>
		</Card>
	);

	return (
		<>
			{renderStudentList()}

			<Modal
				title='Thông tin sinh viên'
				visible={modalVisible}
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
							<Descriptions.Item label='Họ tên'>{record?.ten}</Descriptions.Item>
							<Descriptions.Item label='Mã sinh viên'>{record?.ma}</Descriptions.Item>
							<Descriptions.Item label='Email'>{record?.email}</Descriptions.Item>
							<Descriptions.Item label='Giới tính'>{record?.gioiTinh ?? ''}</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>
								{record?.ngaySinh && moment(record.ngaySinh).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Số điện thoại'>{record?.soDienThoai}</Descriptions.Item>
							{!fromLopHocPhan ? (
								<Descriptions.Item label='Vai trò trong lớp'>
									{record?.vaiTro ? vaiTroSvLhc[record.vaiTro] : '--'}
								</Descriptions.Item>
							) : null}
						</Descriptions>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default DanhSachSinhVien;
