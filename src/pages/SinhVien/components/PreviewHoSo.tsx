import { colorTrangThaiHocSv, type ETrangThaiHocSv } from '@/services/DaoTao/constant';
import dayjs from '@/utils/dayjs';
import { formatPhoneNumber } from '@/utils/utils';
import { Col, Image, Row, Space, Spin, Tag } from 'antd';
import { JSX, useEffect } from 'react';
import { useIntl, useModel } from 'umi';

type DescriptionItem = {
	label?: string;
	content?: JSX.Element | string;
	md?: 6 | 8 | 12 | 16 | 18 | 24;
	children?: DescriptionItem[];
};

const PreviewHoSo = () => {
	const intl = useIntl();
	const { record, loading } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachQuocTich, getAllModel } = useModel('core.quoctich');

	useEffect(() => {
		if (!danhSachQuocTich.length) getAllModel();
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
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.masv' }), content: record?.ma, md: 8 },
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.hoten' }), content: record?.ten, md: 16 },
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.gioitinh' }), content: record?.gioiTinh, md: 8 },
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.ngaysinh' }),
			content: record?.ngaySinh ? dayjs(record.ngaySinh).format('DD/MM/YYYY') : '',
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.trangthaihoc' }),
			content: <Tag color={colorTrangThaiHocSv[record?.trangThaiHoc as ETrangThaiHocSv]}>{record?.trangThaiHoc}</Tag>,
			md: 8,
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.cccd' }),
			content: `${record?.cccd ?? ''}, ${intl.formatMessage({ id: 'thongtincanhan.hoso.ngaycap' })}: ${
				record?.ngayCapCccd ? dayjs(record.ngayCapCccd).format('DD/MM/YYYY') : '--'
			}, ${intl.formatMessage({ id: 'thongtincanhan.hoso.noicap' })}: ${record?.noiCapCccd ?? ''}`,
			md: 24,
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.sdt' }),
			content: record?.soDienThoai ? formatPhoneNumber(record.soDienThoai) : '',
			md: 8,
		},
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.email' }), content: record?.email, md: 16 },
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.khoanganh' }),
			content: (
				<>
					{[
						[record?.khoaNganh?.ten, record?.trangThaiHocNganh1, record?.chuyenNganh?.ten ?? record?.maChuyenNganh],
						[record?.khoaNganh2?.ten, record?.trangThaiHocNganh2, record?.chuyenNganh2?.ten ?? record?.maChuyenNganh2],
					]
						.filter(([ten]) => ten)
						.map(([ten, trangThai, chuyenNganh], index) => (
							// eslint-disable-next-line react/jsx-key
							<Space key={index} wrap>
								{ten}
								{trangThai && <Tag color={colorTrangThaiHocSv[trangThai as ETrangThaiHocSv]}>{trangThai}</Tag>}
								<span>
									({intl.formatMessage({ id: 'thongtincanhan.hoso.chuyennganh' })}:{' '}
									{chuyenNganh ?? <i>{intl.formatMessage({ id: 'thongtincanhan.hoso.chuacapnhat' })}</i>})
								</span>
							</Space>
						))}
				</>
			),
			md: 24,
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.quoctich' }),
			content: record?.quocTich,
			// content: danhSachQuocTich?.find((item) => item?._id === record?.quocTich)?.tenQuocTich,
			md: 8,
		},
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.dantoc' }), content: record?.danToc, md: 8 },
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.tongiao' }), content: record?.tonGiao, md: 8 },
	];

	const dataThem: DescriptionItem[] = [
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.diachi' }),
			md: 24,
			children: [
				{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.tp' }), content: record?.tinhTpThuongTru },
				// { label: 'Quận/Huyện', content: record?.quanHuyenThuongTru },
				{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.xa' }), content: record?.xaPhuongThuongTru },
				{
					label: intl.formatMessage({ id: 'thongtincanhan.hoso.diachi.chitiet' }),
					content: record?.soNhaTenDuongThuongTru,
				},
			],
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.dang' }),
			md: 24,
			children: [
				{
					label: intl.formatMessage({ id: 'thongtincanhan.hoso.dang.dubi' }),
					content: record?.ngayVaoDang ? dayjs(record.ngayVaoDang).format('DD/MM/YYYY') : '',
					md: 12,
				},
				{
					label: intl.formatMessage({ id: 'thongtincanhan.hoso.dang.chinhthuc' }),
					content: record?.ngayVaoDangChinhThuc ? dayjs(record.ngayVaoDangChinhThuc).format('DD/MM/YYYY') : '',
					md: 12,
				},
			],
		},
		{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.baohiem' }), content: record?.soBaoHiemSinhVien, md: 12 },
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.benhvien' }),
			content: record?.maBenhVienKhamChuaBenh,
			md: 12,
		},
		{
			label: intl.formatMessage({ id: 'thongtincanhan.hoso.nganhang' }),
			children: [
				{ label: intl.formatMessage({ id: 'thongtincanhan.hoso.nganhang.ten' }), content: record?.tenNganHang, md: 12 },
				{
					label: intl.formatMessage({ id: 'thongtincanhan.hoso.nganhang.stk' }),
					content: record?.soTaiKhoanNganHang,
					md: 12,
				},
			],
			md: 24,
		},
	];

	return (
		<Spin spinning={loading}>
			<h2 style={{ textAlign: 'center', marginBottom: 32 }}>
				{intl.formatMessage({ id: 'thongtincanhan.hoso.title' })}
			</h2>

			<Row gutter={[18, 18]} style={{ maxWidth: 1200, margin: 'auto' }}>
				<Col span={24} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
					<div className='avatar-container'>
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
