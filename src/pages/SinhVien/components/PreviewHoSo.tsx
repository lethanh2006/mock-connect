import { formatPhoneNumber } from '@/utils/utils';
import { Col, Image, Row, Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

type DescriptionItem = {
	label?: string;
	content?: JSX.Element | string;
	md?: 6 | 8 | 12 | 16 | 18 | 24;
	children?: DescriptionItem[];
};

const PreviewHoSo = () => {
	const { getThongTinCuaToiModel, record, loading } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getThongTinCuaToiModel();
	}, []);

	const renderDescription = (data: DescriptionItem) => (
		<Col key={data.label} span={24} md={data.md ?? 6}>
			{data.label ? (
				<>
					<span className='fw500'>{data.label}: </span>{' '}
				</>
			) : null}
			{data.children ? (
				<Row gutter={[8, 8]} style={{ marginLeft: 18 }}>
					{data.children.map((item) => renderDescription(item))}
				</Row>
			) : (
				data.content
			)}
		</Col>
	);

	const dataChung: DescriptionItem[] = [
		{ label: 'Mã sinh viên', content: record?.ma, md: 8 },
		{ label: 'Họ và tên', content: record?.ten, md: 16 },
		{ label: 'Giới tính', content: record?.gioiTinh, md: 8 },
		{
			label: 'Ngày sinh',
			content: record?.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : '',
			md: 8,
		},
		{
			label: 'CCCD/CMND',
			content: `${record?.cccd ?? ''}, ngày cấp: ${
				record?.ngayCapCccd ? moment(record.ngayCapCccd).format('DD/MM/YYYY') : '--'
			}, nơi cấp: ${record?.noiCapCccd ?? ''}`,
			md: 24,
		},
		{
			label: 'Số điện thoại',
			content: record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : '',
			md: 8,
		},
		{ label: 'Email', content: record?.email, md: 16 },
		{ label: 'Trạng thái học', content: record?.trangThaiHoc, md: 8 },
		{ label: 'Khóa ngành', content: record?.khoaNganh?.ten, md: 16 },
	];

	const dataThem: DescriptionItem[] = [
		{ label: 'Quốc tịch', content: record?.quocTich },
		{ label: 'Dân tộc', content: record?.danToc },
		{ label: 'Tôn giáo', content: record?.tonGiao },
		{
			label: 'Thông tin của cha',
			md: 24,
			children: [
				{ label: 'Họ tên', content: record?.tenCha },
				{
					label: 'Ngày sinh',
					content: record?.ngaySinhCha ? moment(record.ngaySinhCha).format('DD/MM/YYYY') : '',
				},
				{ label: 'Nghề nghiệp', content: record?.ngheNghiepCha },
				{ label: 'SĐT', content: record?.soDienThoaiCha },
			],
		},
		{
			label: 'Thông tin của mẹ',
			md: 24,
			children: [
				{ label: 'Họ tên', content: record?.tenMe },
				{
					label: 'Ngày sinh',
					content: record?.ngaySinhMe ? moment(record.ngaySinhMe).format('DD/MM/YYYY') : '',
				},
				{ label: 'Nghề nghiệp', content: record?.ngheNghiepMe },
				{ label: 'SĐT', content: record?.soDienThoaiMe },
			],
		},
		{
			label: 'Địa chỉ thường trú',
			md: 24,
			children: [
				{ label: 'Tỉnh/Thành phố', content: record?.tinhTpThuongTru },
				{ label: 'Quận/Huyện', content: record?.quanHuyenThuongTru },
				{ label: 'Phường/Xã', content: record?.xaPhuongThuongTru },
				{ label: 'Địa chỉ cụ thể', content: record?.soNhaTenDuongThuongTru },
			],
		},
		{
			label: 'Đảng',
			md: 24,
			children: [
				{
					label: 'Ngày vào Đảng dự bị',
					content: record?.ngayVaoDang ? moment(record.ngayVaoDang).format('DD/MM/YYYY') : '',
					md: 12,
				},
				{
					label: 'Ngày vào Đảng chính thức',
					content: record?.ngayVaoDangChinhThuc ? moment(record.ngayVaoDangChinhThuc).format('DD/MM/YYYY') : '',
					md: 12,
				},
			],
		},
		{ label: 'Số bảo hiểm sinh viên', content: record?.soBaoHiemSinhVien, md: 12 },
		{ label: 'Mã bệnh viện khám chữa bệnh', content: record?.maBenhVienKhamChuaBenh, md: 12 },
		{
			label: 'Tài khoản ngân hàng',
			children: [
				{ label: 'Tên ngân hàng', content: record?.tenNganHang, md: 12 },
				{ label: 'Số tài khoản', content: record?.soTaiKhoanNganHang, md: 12 },
			],
			md: 24,
		},
	];

	return (
		<Spin spinning={loading}>
			<h2 style={{ textAlign: 'center', marginBottom: 32 }}>SƠ YẾU LÝ LỊCH</h2>

			<Row gutter={[18, 18]} style={{ maxWidth: 1200, margin: 'auto' }}>
				<Col span={24} sm={6} style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
					<div style={{ width: 140, height: 180 }}>
						<Image src={record?.anhDaiDienUrl ?? '/metadata.png'} />
					</div>
				</Col>
				<Col span={24} sm={18}>
					<Row gutter={[18, 18]}>
						{dataChung.map((item, index) => renderDescription({ ...item, label: `${index + 1}. ${item.label}` }))}
					</Row>
				</Col>

				<Col span={24}>
					<Row gutter={[18, 18]}>
						{dataThem.map((item, index) =>
							renderDescription({
								...item,
								label: `${index + dataChung.length + 1}. ${item.label}`,
							}),
						)}
					</Row>
				</Col>
			</Row>
		</Spin>
	);
};

export default PreviewHoSo;
