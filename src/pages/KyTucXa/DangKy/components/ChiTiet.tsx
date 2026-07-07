import ModalExpandable from '@/components/Table/ModalExpandable';
import {
	AppstoreOutlined,
	BgColorsOutlined,
	CarOutlined,
	ColumnWidthOutlined,
	DesktopOutlined,
	HomeOutlined,
	ReadOutlined,
	WifiOutlined,
	WindowsOutlined,
} from '@ant-design/icons';
import { Button, Col, Image, Row } from 'antd';
import { useIntl, useModel } from 'umi';

const defaultImages = [
	'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900',
	'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900',
	'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900',
	'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900',
	'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900',
];

const tienIchIcons: Record<string, any> = {
	Chair: DesktopOutlined,
	'Common kitchen': AppstoreOutlined,
	Bookshelf: ReadOutlined,
	Bed: HomeOutlined,
	'Air conditioner': BgColorsOutlined,
	Microwave: AppstoreOutlined,
	Fridge: AppstoreOutlined,
	'Free gym': WifiOutlined,
	'Free packing': CarOutlined,
	'Study desk': DesktopOutlined,
};

const ChiTietPhong = () => {
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record } = useModel('kytucxa.phong');

	const images =
		(record?.danhSachAnh?.length ?? 0) > 0
			? record?.danhSachAnh?.map((item: any) => item.url || item.fileUrl || item)
			: defaultImages;

	const tienIch = record?.danhSachTienIch ?? [];

	const tenPhong = `${record?.ma || record?.soPhong || ''} - BUILDING ${record?.maToaNha || record?.toaNha?.ma || ''} • ${
		record?.loaiPhongKtx?.ten || record?.maLoaiPhongKtx || ''
	}`;

	const soSlotConLai = Math.max((record?.soLuongToiDa || 0) - (record?.soLuongHienTai || 0), 0);

	return (
		<ModalExpandable
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			title='Dormitory Detail'
		>
			<div className='room-gallery'>
				<div className='room-gallery-main'>
					<Image
						src={images?.[0]}
						alt='room-main'
						width='100%'
						height={240}
						style={{ objectFit: 'cover' }}
						preview={{
							mask: 'Xem ảnh',
						}}
					/>
				</div>

				<div className='room-gallery-side'>
					{images?.slice(1, 5).map((src: string, index: number) => (
						<div key={index} className='room-gallery-item'>
							<Image
								src={src}
								alt={`room-${index}`}
								width='100%'
								height={116}
								style={{ objectFit: 'cover' }}
								preview={{
									mask: 'Xem ảnh',
								}}
							/>
						</div>
					))}
				</div>
			</div>

			<Row gutter={16} className='room-info-wrap'>
				<Col span={18}>
					<h3 className='room-name'>{tenPhong}</h3>

					<div className='room-summary'>
						<span>
							<HomeOutlined /> {record?.soPhongTam || 1} bathrooms
						</span>
						<span>
							<ColumnWidthOutlined /> {record?.dienTich || '50.2'} m2
						</span>
					</div>

					<div className='room-card__divider' />

					<Row gutter={[12, 8]} className='room-utilities'>
						{tienIch.map((item: any) => {
							const label = item?.maDanhMucTienIch;
							const Icon = tienIchIcons[label] || WindowsOutlined;

							return (
								<Col span={8} key={label}>
									<span className='utility-item'>
										<Icon /> {label}
									</span>
								</Col>
							);
						})}
					</Row>
				</Col>

				<Col span={6}>
					<div className='room-price-box'>
						<div className='room-price'>
							{record?.giaPhong ? record.giaPhong.toLocaleString('vi-VN') : '3,200,000'} VND
						</div>

						<div className='room-available-box'>
							<div>AVAILABLE</div>
							<strong>{soSlotConLai || 5} slots left</strong>
						</div>
					</div>
				</Col>
			</Row>

			<div className='room-card__divider' />

			<div className='room-description'>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel eros non lectus egestas gravida vulputate ut
				odio. Etiam tincidunt eget nunc facilisis elementum. Curabitur a dictum massa. Donec ipsum ex auctor molestie
				odio quis.
			</div>

			<div className='form-footer'>
				<Button type='primary'>Đăng ký</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default ChiTietPhong;
