import PageCard from '@/components/PageCard';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Input, Row, Select, Space } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import SelectDanhMucChungKTX from '../DanhMucChung/Select';
import SelectDotDangKyKTX from '../DotDangKyKTX/Select';
import SelectToaNhaKTX from '../ToaNha/Select';
import CardPhong from './components/CardPhong';
import ChiTietPhong from './components/ChiTiet';
import ModalDanKyKTX from './components/Modal';
import './style.less';

const { Search } = Input;

const DangKyKyTucXa = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
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
			extra={
				<FilterHocKy isSetHocKy>
					<SelectDotDangKyKTX condition={{ maHocKy: recHocKy?.ma }} style={{ width: 250 }} allowClear />
				</FilterHocKy>
			}
		>
			<Flex justify='space-between' align='center' style={{ marginBottom: 8 }}>
				<Space wrap>
					<Search placeholder='Tìm kiếm tên phòng' style={{ width: 250 }} allowClear />

					<SelectToaNhaKTX style={{ width: 250 }} allowClear />
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

			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<Alert
				type='info'
				showIcon
				icon={<InfoCircleOutlined />}
				style={{ marginBottom: 12 }}
				message={
					<span>
						Registration is open from <b>31/07/2026</b> to <b>10/08/2026</b>.
					</span>
				}
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
