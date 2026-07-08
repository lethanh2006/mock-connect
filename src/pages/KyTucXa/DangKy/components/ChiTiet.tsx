import ModalExpandable from '@/components/Table/ModalExpandable';
import { Phong } from '@/services/KyTucXa/Phong/typing';
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
	const { visibleForm, setVisibleForm, record, setVisibleDangKy } = useModel('kytucxa.phong');
	const phong = record as Phong.IChinhSachPhongRecord | undefined;
	const room = phong?.room;
	const danhSachAnh = phong?.danhSachAnh?.length ? phong.danhSachAnh : room?.danhSachAnh;
	const images =
		(danhSachAnh?.length ?? 0) > 0 ? danhSachAnh?.map((item: any) => item.url || item.fileUrl || item) : defaultImages;
	const tienIch = phong?.danhSachTienIch?.length ? phong.danhSachTienIch : (room?.danhSachTienIch ?? []);
	const sucChua = phong?.sucChua ?? room?.soLuongToiDa ?? room?.sucChua ?? 0;

	const tenPhong = `${room?.ma || room?.soPhong || ''} - BUILDING ${room?.maToaNha || room?.toaNha?.ma || ''} - ${
		phong?.loaiPhongKtx?.ten || room?.loaiPhongKtx?.ten || phong?.maLoaiPhongKtx || room?.maLoaiPhongKtx || ''
	}`;

	const soSlotConLai = Math.max(sucChua - (room?.soLuongHienTai ?? 0), 0);

	const handleDangKy = () => {
		setVisibleForm(false);
		setVisibleDangKy(true);
	};

	return (
		<ModalExpandable
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			title={intl.formatMessage({ id: 'kytucxa.dangky.chitiet.title' })}
		>
			<div className='room-gallery'>
				<div>
					<Image
						src={images?.[0]}
						alt='room-main'
						width='100%'
						height={372}
						style={{ objectFit: 'cover' }}
						preview={{
							mask: intl.formatMessage({ id: 'kytucxa.dangky.chitiet.xemAnh' }),
						}}
					/>
				</div>

				<div className='room-gallery-side'>
					{images?.slice(1, 5).map((src: string, index: number) => (
						<div key={index}>
							<Image
								src={src}
								alt={`room-${index}`}
								width='100%'
								height={182}
								style={{ objectFit: 'cover' }}
								preview={{
									mask: intl.formatMessage({ id: 'kytucxa.dangky.chitiet.xemAnh' }),
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
							<ColumnWidthOutlined /> <b>{record?.room?.dienTich || '50.2'} m2</b>
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
										<Icon /> <b>{label}</b>
									</span>
								</Col>
							);
						})}
					</Row>
				</Col>

				<Col span={6}>
					<div className='room-price-box'>
						<div className='room-price'>{room?.giaPhong ? room.giaPhong.toLocaleString('vi-VN') : '3,200,000'} VND</div>

						<div className='room-available-box'>
							<div>{intl.formatMessage({ id: 'kytucxa.dangky.chitiet.available' })}</div>
							<strong>{intl.formatMessage({ id: 'kytucxa.dangky.chitiet.slotConLai' }, { soLuong: soSlotConLai || 5 })}</strong>
						</div>
					</div>
				</Col>
			</Row>

			<div className='room-card__divider' />

			<div className='room-description'>
				{phong?.moTa ||
					room?.moTa ||
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel eros non lectus egestas gravida vulputate ut odio. Etiam tincidunt eget nunc facilisis elementum. Curabitur a dictum massa. Donec ipsum ex auctor molestie odio quis.'}
			</div>

			<div className='form-footer'>
				<Button type='primary' onClick={handleDangKy}>
					{intl.formatMessage({ id: 'kytucxa.dangky.chitiet.button.dangKy' })}
				</Button>
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</ModalExpandable>
	);
};

export default ChiTietPhong;
