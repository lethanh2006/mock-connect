import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiSvDkHpNhuCau as colorTrangThaiSvDkHpNhuCau,
	ETinhChatHocPhanNhuCau,
	ETrangThaiSvDkHpNhuCau as ETrangThaiSvDkHpNhuCau,
	mapNameETinhChatHocPhanNhuCau,
} from '@/services/HocTap/HocPhanNhuCau/constant';
import type { HocPhanNhuCau } from '@/services/HocTap/HocPhanNhuCau/typing';

import { Button, Checkbox, Col, Descriptions, Modal, Row, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useIntl, useModel } from 'umi';

const ChiTietSinhVienDangKy = () => {
	const intl = useIntl();
	const { record, setVisibleForm, visibleForm } = useModel('sinhvien.nhucauhocphan.phieudangky');

	const columns: IColumn<HocPhanNhuCau.IRecord>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 100,
			align: 'center',
		},
		{
			title: 'Tên học phần',
			width: 200,
			render: (val, rec) => rec?.hocPhan?.ten,
		},
		{
			title: 'STC',
			align: 'center',
			dataIndex: 'soTinChi',
			width: 60,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Theo tiến trình',
			align: 'center',
			width: 80,
			render: (val, rec) => <Checkbox checked={rec?.tinhChatHocPhan === ETinhChatHocPhanNhuCau.DUNG_TIEN_TRINH} />,
		},
		{
			title: 'Tính chất học phần',
			dataIndex: 'tinhChatHocPhan',
			width: 150,
			align: 'center',
			render: (val, rec) => mapNameETinhChatHocPhanNhuCau[val as ETinhChatHocPhanNhuCau],
		},
	];

	return (
		<Modal
			title='Sinh viên đăng ký nhu cầu học phần'
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={900}
		>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
						<Descriptions.Item label='Mã sinh viên'>{record?.maSinhVien ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Họ tên'>{record?.hoTen ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Lớp hành chính'>{record?.tenLopHanhChinh ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Khóa ngành'>{record?.khoaNganh?.ten ?? '--'}</Descriptions.Item>

						<Descriptions.Item label='Trạng thái'>
							{record?.trangThai ? (
								<Tag color={colorTrangThaiSvDkHpNhuCau[record?.trangThai as ETrangThaiSvDkHpNhuCau]}>
									{record?.trangThai}
								</Tag>
							) : (
								'--'
							)}
						</Descriptions.Item>
						<Descriptions.Item label='Học phần đúng tiến trình'>
							{record?.soTinChiTrongTienTrinh ?? '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Học phần ngoài tiến trình'>{record?.soTinChiNgoaiCtdt ?? '--'}</Descriptions.Item>
						<Descriptions.Item label='Tổng số tín chỉ'>
							{_.sumBy(record?.danhSachHocPhanDangKy ?? [], 'soTinChi')}
						</Descriptions.Item>
						<Descriptions.Item label='Thời gian đăng ký'>
							{record?.thoiGianDangKy ? moment(record?.thoiGianDangKy).format('DD/MM/YYYY') : '--'}
						</Descriptions.Item>
						<Descriptions.Item label='Ghi chú CVHT' span={2}>
							{record?.ghiChuCVHT ?? '--'}
						</Descriptions.Item>
					</Descriptions>
				</Col>

				{record?.trangThai === ETrangThaiSvDkHpNhuCau.CHUA_DUYET ||
				record?.trangThai === ETrangThaiSvDkHpNhuCau.DA_DUYET ? (
					<Col span={24}>
						<div className='fw500' style={{ marginBottom: 12 }}>
							Danh sách nhu cầu học phần
						</div>
						<TableStaticData
							columns={columns}
							data={record?.danhSachHocPhanDangKy ?? []}
							addStt
							hasTotal
							size='small'
						/>
					</Col>
				) : null}
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ChiTietSinhVienDangKy;
