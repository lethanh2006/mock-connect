import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiMuonSach,
	ETrangThaiMuonSach,
	mapNameTrangThaiMuonSach,
} from '@/services/QuanLyThuVien/constant';
import type { MuonSach } from '@/services/QuanLyThuVien/MuonSach/typing';
import { Card, Col, Descriptions, Row, Segmented, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ChiTietMuonTraSach from '../components/ChiTiet';

const LichSuMuonTraPage = (props: any) => {
	const { tatCaLichSu } = props;
	const { record: recPhieu } = useModel('thuvien.phieumuonsach');
	const { getModel, page, limit, handleView } = useModel('thuvien.muonsach');
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [activeKey, setActiveKey] = useState<string>('1');

	const getData = () => {
		const filter: any[] =
			activeKey === '2'
				? [
						{
							active: true,
							field: 'expired',
							values: [moment().toISOString(), moment().add(7, 'day').toISOString()],
							operator: EOperatorType.BETWEEN,
						},
				  ]
				: activeKey === '3'
				? [{ active: true, field: 'expired', values: [moment().toISOString()], operator: EOperatorType.LESS_THAN }]
				: activeKey === '4'
				? [{ active: true, field: 'daLaySach', values: [false], operator: EOperatorType.EQUAL }]
				: [];

		getModel(
			!tatCaLichSu && recPhieu?._id ? { phieuMuonTraId: recPhieu?._id, trangThai } : undefined,
			activeKey !== '1' && trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? filter : undefined,
			undefined,
			undefined,
			undefined,
			'me',
		);
	};

	const onCell = (rec: MuonSach.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<MuonSach.IRecord>[] = [
		{
			title: 'Nhan đề',
			width: 220,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: 'Tác giả',
			width: 180,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBiet',
			width: 120,
			filterType: 'string',
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Thời gian mượn',
			dataIndex: 'thoiGianMuon',
			align: 'center',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const now = moment().startOf('day');
				const isOverdue = now.isAfter(expirationTime);
				const isApproachingDeadline = !isOverdue && expirationTime.diff(now, 'days') <= 7;
				const color = isOverdue ? 'red' : isApproachingDeadline ? 'orange' : 'inherit';
				const fontWeight = isOverdue || isApproachingDeadline ? 600 : 'normal';
				return <span style={{ color, fontWeight }}>{formattedTime}</span>;
			},
			filterType: 'date',
			sortable: true,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		// {
		// 	title: 'Thời gian dự kiến mượn',
		// 	dataIndex: 'thoiGianMuonDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		// },
		// {
		// 	title: 'Thời gian dự kiến trả',
		// 	dataIndex: 'thoiGianTraDuKien',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	hide: trangThai !== ETrangThaiMuonSach.CHO_XU_LY,
		// },
		{
			title: 'Hạn trả',
			align: 'center',
			dataIndex: 'expired',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		// {
		// 	title: 'Trạng thái',
		// 	align: 'center',
		// 	dataIndex: 'daLaySach',
		// 	width: 120,
		// 	render: (val, rec) => (val ? <Tag color='green'>Đã lấy</Tag> : <Tag color='red'>Chưa lấy</Tag>),
		// 	onCell,
		// 	// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		// },
		// {
		// 	title: 'Thời gian gia hạn',
		// 	align: 'center',
		// 	dataIndex: 'thoiGianGiaHan',
		// 	width: 130,
		// 	render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
		// 	filterType: 'date',
		// 	sortable: true,
		// 	onCell,
		// 	// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		// },
		{
			title: 'Thời gian trả',
			dataIndex: 'thoiGianTra',
			width: 150,
			render: (val, rec) => {
				if (!val) return null;
				const formattedTime = moment(val).startOf('day').format('DD/MM/YYYY');
				const expirationTime = rec?.expired ? moment(rec.expired).startOf('day') : moment().startOf('day');
				const isOverdue = moment().startOf('day').isAfter(expirationTime);
				return (
					<span style={{ color: isOverdue ? 'red' : 'inherit', fontWeight: isOverdue ? 600 : 0 }}>{formattedTime}</span>
				);
			},
			filterType: 'date',
			sortable: true,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
			onCell,
		},
		// {
		// 	title: 'Ghi chú đăng ký',
		// 	dataIndex: 'ghiChuDangKy',
		// 	width: 220,
		// 	render: (val, rec) => <ExpandText>{val}</ExpandText>,
		// 	onCell,
		// },
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			// hide: trangThai === ETrangThaiMuonSach.CHO_XU_LY,
		},
		{
			title: 'Ghi chú trả',
			dataIndex: 'ghiChuTra',
			width: 220,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
			onCell,
			hide: trangThai !== ETrangThaiMuonSach.DA_TRA,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiMuonSach[val as ETrangThaiMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiMuonSach),
			onCell,
			hide: !tatCaLichSu,
			fixed: 'right',
		},
	];

	const content = () => (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, trangThai, activeKey]}
			modelName='thuvien.muonsach'
			widthDrawer={800}
			Form={ChiTietMuonTraSach}
			formProps={{ trangThai, getData }}
			hideCard
			buttons={{ create: false }}
			otherButtons={
				trangThai === ETrangThaiMuonSach.DANG_THUE_MUON
					? [
							<Segmented
								key={'1'}
								value={activeKey}
								onChange={(value) => setActiveKey(value.toString())}
								options={[
									{ value: '1', label: 'Tất cả' },
									{ value: '2', label: 'Sắp đến hạn' },
									{ value: '3', label: 'Quá hạn' },
									// { value: '4', label: 'Chưa lấy sách' },
								]}
							/>,
					  ]
					: []
			}
		/>
	);
	if (tatCaLichSu) return content();

	return (
		<Card title='Chi tiết phiếu mượn'>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Descriptions
						column={{ xs: 1, sm: 1, md: 2 }}
						bordered
						style={{ marginBottom: 18 }}
						title='Thông tin người mượn'
					>
						<Descriptions.Item label='Vai trò'>{recPhieu?.vaiTro ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Mã sinh viên'>{recPhieu?.maDinhDanhNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{recPhieu?.hoTenNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Thời gian đăng ký'>
							{recPhieu?.thoiGianDangKy ? moment(recPhieu?.thoiGianDangKy).format('DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Khóa sinh viên'>{recPhieu?.tenKhoaSinhVienNguoiMuon ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Khóa ngành'>{recPhieu?.tenNganhNguoiMuon ?? '--'}</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)}>
				{Object.values(ETrangThaiMuonSach).map((tab) => (
					<Tabs.TabPane key={tab} tab={mapNameTrangThaiMuonSach[tab]} />
				))}
			</Tabs>

			{content()}
		</Card>
	);
};

export default LichSuMuonTraPage;
