import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EGioiTinh } from '@/services/DaoTao/constant';
import { compareFullname } from '@/utils/utils';
import { Avatar, Col, Descriptions, Modal, Row } from 'antd';
import { useState } from 'react';

const DanhSachSinhVien = (props: { sinhVienList: SinhVien.IRecord[]; loading: boolean }) => {
	const { sinhVienList, loading } = props;
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [record, setRecord] = useState<SinhVien.IRecord>();

	const onRow = (rec: SinhVien.IRecord) => ({
		onClick: () => {
			setRecord(rec);
			setModalVisible(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<SinhVien.IRecord>[] = [
		{
			dataIndex: 'anhDaiDienUrl',
			title: 'Ảnh đại diện',
			width: 80,
			align: 'center',
			render: (path, rec) => (
				<Avatar src={path || `/images/${rec.gioiTinh === EGioiTinh.Nam ? 'male.svg' : 'female.svg'}`} />
			),
		},
		{
			dataIndex: 'ma',
			title: 'Mã sinh viên',
			align: 'center',
			width: 120,
			filterType: 'string',
			sortable: true,
		},
		{
			dataIndex: 'ten',
			title: 'Họ tên',
			width: 180,
			filterType: 'string',
			sortable: true,
			customSort: compareFullname,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			filterType: 'select',
			filterData: Object.values(EGioiTinh),
		},
	];

	return (
		<>
			<TableStaticData otherProps={{ loading, onRow }} data={sinhVienList} columns={columns} addStt hasTotal />

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
							src={record?.anhDaiDienUrl || `/images/${record?.gioiTinh === EGioiTinh.Nam ? 'male.svg' : 'female.svg'}`}
							size={{ xs: 80, sm: 128, md: 128, lg: 160, xl: 160, xxl: 160 }}
						/>
					</Col>
					<Col span={24} md={16}>
						<Descriptions bordered column={1}>
							<Descriptions.Item label='Họ và tên'>{record?.ten}</Descriptions.Item>
							<Descriptions.Item label='Mã sinh viên'>{record?.ma}</Descriptions.Item>
							{/* <Descriptions.Item label="Email">{record?.email}</Descriptions.Item> */}
							<Descriptions.Item label='Giới tính'>{record?.gioiTinh ?? ''}</Descriptions.Item>
							{/* <Descriptions.Item label="Ngày sinh">
                {record?.ngaySinh && moment(record.ngaySinh).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{record?.soDienThoai}</Descriptions.Item> */}
						</Descriptions>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default DanhSachSinhVien;
