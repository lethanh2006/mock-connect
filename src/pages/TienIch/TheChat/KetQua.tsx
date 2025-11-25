import { colorXepLoaiTheChat } from '@/services/TienIch/TheChat/constant';
import { TheChat } from '@/services/TienIch/TheChat/typing';
import dayjs from '@/utils/dayjs';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Descriptions, Space, Tag } from 'antd';
import React from 'react';

const { Panel } = Collapse;

interface KetQuaDanhGiaCollapseProps {
	danhSachKetQua?: TheChat.IKetQuaTheChat[];
}

const ChiTietKetQuaDanhGia: React.FC<KetQuaDanhGiaCollapseProps> = ({ danhSachKetQua = [] }) => {
	if (!danhSachKetQua.length) return null;

	const ketQuaTheoDanhMuc = danhSachKetQua?.reduce<Record<string, TheChat.IKetQuaTheChat[]>>((acc, item) => {
		const key = item?.maDanhMuc;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(item);
		return acc;
	}, {});

	const ketQuaTotNhatTheoDanhMuc: Record<string, TheChat.IKetQuaTheChat> = {};

	Object.keys(ketQuaTheoDanhMuc)?.forEach((maDanhMuc) => {
		const ketQuaDanhMuc = ketQuaTheoDanhMuc[maDanhMuc];

		ketQuaDanhMuc?.sort((a, b) => b.giaTri - a.giaTri);

		ketQuaTotNhatTheoDanhMuc[maDanhMuc] = ketQuaDanhMuc[0];
	});

	return (
		<Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
			{Object.keys(ketQuaTheoDanhMuc).map((maDanhMuc) => {
				const ketQuaDanhMuc = ketQuaTheoDanhMuc[maDanhMuc];
				const ketQuaTotNhat = ketQuaTotNhatTheoDanhMuc[maDanhMuc];
				const danhMuc = ketQuaDanhMuc[0]?.danhMuc;

				if (!danhMuc) return null;

				const header = (
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<span style={{ fontWeight: 'bold' }}>{danhMuc?.ten}</span>
						<Space>
							<span>
								{ketQuaTotNhat?.giaTri} {danhMuc?.donViDoLuong}
							</span>
							<Tag color={colorXepLoaiTheChat[ketQuaTotNhat?.xepLoai]} style={{ marginRight: 8 }}>
								{ketQuaTotNhat?.xepLoai}
							</Tag>
						</Space>
					</div>
				);

				return (
					<Panel header={header} key={maDanhMuc}>
						<Descriptions
							column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
							className='highlight'
							layout='vertical'
							colon={false}
						>
							{ketQuaDanhMuc.map((item) => (
								<Descriptions.Item
									key={item._id}
									label={
										<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
											<span>Lần {item?.lanDanhGia}</span>
											<Tag color={colorXepLoaiTheChat[item?.xepLoai]}>{item?.xepLoai}</Tag>
										</div>
									}
								>
									<div>
										<div style={{ fontWeight: 'bold' }}>
											{item?.giaTri} {item?.donViDoLuong}
										</div>

										<div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
											Thời gian đánh giá: {item?.createdAt && dayjs(item?.createdAt).format('HH:mm DD/MM/YYYY')}
										</div>
									</div>
								</Descriptions.Item>
							))}
						</Descriptions>
					</Panel>
				);
			})}
		</Collapse>
	);
};

export default ChiTietKetQuaDanhGia;
