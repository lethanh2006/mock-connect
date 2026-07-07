import PageCard from '@/components/PageCard';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { FilterOutlined, InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Row, Select, Space } from 'antd';
import { useModel } from 'umi';
import SelectDanhMucChungKTX from '../DanhMucChung/Select';
import SelectToaNhaKTX from '../ToaNha/Select';
import CardPhong from './components/CardPhong';
import ChiTietPhong from './components/ChiTiet';
import ModalDanKyKTX from './components/Modal';
import './style.less';
import { useEffect } from 'react';

const DangKyKyTucXa = () => {
	const { getModel, danhSach, handleView, setVisibleDangKy } = useModel('kytucxa.phong');

	const getData = () => {
		getModel();
	};

	useEffect(() => {
		getData();
	}, []);

	const handleXemChiTiet = (phong: Phong.IChinhSachPhongRecord) => {
		handleView(phong);
	};

	const handleDangKy = (phong: Phong.IChinhSachPhongRecord) => {
		handleView(phong);
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
				{danhSach.map((phong) => (
					<Col key={phong._id} xs={24} md={12} xl={8} className='room-list-col'>
						<CardPhong phong={phong} onXemChiTiet={handleXemChiTiet} onDangKy={handleDangKy} />
					</Col>
				))}
			</Row>

			{!danhSach.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

			<ChiTietPhong />
			<ModalDanKyKTX />
		</PageCard>
	);
};

export default DangKyKyTucXa;
