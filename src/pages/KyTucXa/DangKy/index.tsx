import PageCard from '@/components/PageCard';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { FilterOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Flex, Row, Select, Space } from 'antd';
import { useModel } from 'umi';
import SelectDanhMucChungKTX from '../DanhMucChung/Select';
import SelectToaNhaKTX from '../ToaNha/Select';
import CardPhong from './components/CardPhong';
import ChiTietPhong from './components/ChiTiet';
import FormDangKyKTX from './components/Form';
import './style.less';

const fakeDanhSachPhong = [
	{
		_id: '6a02bb3600d7f13912b7xxxxx',
		soPhong: 'J103',
		ma: 'J103',
		ten: 'J103',
		maToaNha: 'J',
		maLoaiPhongKtx: '2-BED',
		danhSachTienIch: [
			{ maDanhMucTienIch: 'Chair' },
			{ maDanhMucTienIch: 'Common kitchen' },
			{ maDanhMucTienIch: 'Bookshelf' },
			{ maDanhMucTienIch: 'Bed' },
			{ maDanhMucTienIch: 'Air conditioner' },
		],
		danhSachAnh: [],
		soLuongToiDa: 8,
		soLuongHienTai: 0,
		soPhongTam: null,
		cachBoTri: null,
		isChoThue: true,
		dienTich: null,
		toaNha: {
			ma: 'J',
			ten: 'Tòa J',
		},
		loaiPhongKtx: {
			ma: '2-BED',
			ten: '2-BED APARTMENT',
		},
		danhSachTinhChatPhong: [
			{
				congNangChinh: true,
				loaiPhong: {
					loaiPhong: 'Student apartment',
				},
			},
		],
		dangKyKyTucXaRule: {
			gioiTinh: 'Nam',
		},
		giaPhong: null,
	},
	{
		_id: '6a02bb3600d7f13912b7xxxx',
		soPhong: 'J101',
		ma: 'J101',
		ten: 'J101',
		maToaNha: 'J',
		maLoaiPhongKtx: null,
		danhSachTienIch: null,
		danhSachAnh: null,
		soLuongToiDa: 8,
		soLuongHienTai: 0,
		soPhongTam: null,
		cachBoTri: null,
		isChoThue: true,
		dienTich: null,
		toaNha: {
			ma: 'J',
			ten: 'Tòa J',
		},
		loaiPhongKtx: null,
		danhSachTinhChatPhong: [
			{
				congNangChinh: true,
				loaiPhong: {
					loaiPhong: 'Student apartment',
				},
			},
		],
		dangKyKyTucXaRule: null,
		giaPhong: null,
	},
	{
		_id: '6a02bb3600d7f13912b750axx8',
		soPhong: 'J102',
		ma: 'J102',
		ten: 'J102',
		maToaNha: 'J',
		maLoaiPhongKtx: null,
		danhSachTienIch: null,
		danhSachAnh: null,
		soLuongToiDa: 10,
		soLuongHienTai: 0,
		soPhongTam: null,
		cachBoTri: null,
		isChoThue: true,
		dienTich: null,
		toaNha: {
			ma: 'J',
			ten: 'Tòa J',
		},
		loaiPhongKtx: null,
		danhSachTinhChatPhong: [
			{
				congNangChinh: true,
				loaiPhong: {
					loaiPhong: 'Student apartment',
				},
			},
		],
		dangKyKyTucXaRule: null,
		giaPhong: null,
	},
];

const DangKyKyTucXa = () => {
	const { handleView, setVisibleDangKy } = useModel('kytucxa.phong');

	const handleXemChiTiet = (phong: Phong.IRecord) => {
		handleView(phong);
	};

	const handleDangKy = (phong: Phong.IRecord) => {
		setVisibleDangKy(true);
	};

	return (
		<PageCard
			title='Đăng ký ký túc xá'
		>
			<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
				<Space wrap>
					<FilterOutlined style={{ fontSize: 20, marginLeft: 4, marginRight: 4 }} />
					<SelectToaNhaKTX style={{ width: 250 }} allowClear />
					<Select
						style={{ width: 250 }}
						// showSearch={{ optionFilterProp: 'label', onSearch }}
						placeholder='Chọn tầng'
						// onChange={onChange}
						options={[
							{
								value: 'jack',
								label: 'Từ 3 đến 6',
							},
							{
								value: 'lucy',
								label: 'Từ 6 đến 12',
							},
							{
								value: 'tom',
								label: 'Từ 12 lên',
							},
						]}
						allowClear
					/>
					<SelectDanhMucChungKTX condition={{ maLoai: 'LOAI_PHONG_KTX' }} style={{ width: 250 }} allowClear />
					<Select
						style={{ width: 250 }}
						// showSearch={{ optionFilterProp: 'label', onSearch }}
						placeholder='Chọn sức chứa'
						// onChange={onChange}
						options={[
							{
								value: 'jack',
								label: 'Từ 3 đến 6',
							},
							{
								value: 'lucy',
								label: 'Từ 6 đến 12',
							},
							{
								value: 'tom',
								label: 'Từ 12 lên',
							},
						]}
						allowClear
					/>
				</Space>

				<Button icon={<ReloadOutlined />} />
			</Flex>

			<Alert
				type='info'
				showIcon
				icon={<InfoCircleOutlined />}
				style={{ marginBottom: 12, marginTop: 12 }}
				message={
					<span>
						Registration is open from <b style={{ color: '#0E50CF' }}>31/07/2026</b> to <b style={{ color: '#0E50CF' }}>10/08/2026</b>.
					</span>
				}
			/>

			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<Row gutter={[12, 12]}>
				{fakeDanhSachPhong.map((phong) => (
					<Col key={phong._id} xs={24} md={12} xl={8} className='room-list-col'>
						<CardPhong phong={phong as any} onXemChiTiet={handleXemChiTiet} onDangKy={handleDangKy} />
					</Col>
				))}
			</Row>

			<ChiTietPhong />
			<FormDangKyKTX />
		</PageCard>
	);
};

export default DangKyKyTucXa;
