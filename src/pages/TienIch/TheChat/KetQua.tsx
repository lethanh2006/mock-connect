import ButtonExtend from '@/components/Table/ButtonExtend';
import { colorXepLoaiTheChat, EChiSoSoSanh } from '@/services/TienIch/TheChat/constant';
import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { CaretRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Collapse, Descriptions, Space, Tag } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import ViewMetaData from './ViewMetaData';

const { Panel } = Collapse;

interface KetQuaDanhGiaCollapseProps {
	danhSachKetQua?: TheChat.IKetQuaTheChat[];
}

const ChiTietKetQuaDanhGia: React.FC<KetQuaDanhGiaCollapseProps> = ({ danhSachKetQua = [] }) => {
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [data, setData] = useState<TheChat.IMetaData>();

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

		const soSanh = ketQuaDanhMuc[0]?.danhMuc?.soSanh;

		if (soSanh === EChiSoSoSanh.LON || soSanh === EChiSoSoSanh.LON_HON_HOAC_BANG) {
			ketQuaDanhMuc.sort((a, b) => b.giaTri - a.giaTri);
		} else if (soSanh === EChiSoSoSanh.NHO || soSanh === EChiSoSoSanh.NHO_HON_HOAC_BANG) {
			ketQuaDanhMuc.sort((a, b) => a.giaTri - b.giaTri);
		} else {
			ketQuaDanhMuc.sort((a, b) => b.giaTri - a.giaTri);
		}

		ketQuaTotNhatTheoDanhMuc[maDanhMuc] = ketQuaDanhMuc[0];
	});

	return (
		<>
			<Collapse expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}>
				{Object.keys(ketQuaTheoDanhMuc).map((maDanhMuc) => {
					const ketQuaDanhMuc = ketQuaTheoDanhMuc[maDanhMuc];
					const ketQuaTotNhat = ketQuaTotNhatTheoDanhMuc[maDanhMuc];
					const danhMuc = ketQuaDanhMuc[0]?.danhMuc;

					if (!danhMuc) return null;

					const header = (
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
							<span style={{ fontWeight: 'bold' }}>{danhMuc?.ten}</span>
							<Space>
								<span>
									{ketQuaTotNhat?.giaTri} {danhMuc?.donViDoLuong}
								</span>
								{ketQuaTotNhat?.xepLoai && (
									<Tag color={colorXepLoaiTheChat[ketQuaTotNhat?.xepLoai]} style={{ marginRight: 8 }}>
										{ketQuaTotNhat?.xepLoai}
									</Tag>
								)}
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
												<Space>
													<span>Lần {item?.lanDanhGia}</span>
													{danhMuc?.suDungThietBiNgoaiVi && (
														<ButtonExtend
															type='link'
															icon={<InfoCircleOutlined />}
															onClick={() => {
																setData(item?.metadata);
																setVisibleModal(true);
															}}
														/>
													)}
												</Space>{' '}
												{item?.xepLoai && <Tag color={colorXepLoaiTheChat[item?.xepLoai]}>{item?.xepLoai}</Tag>}
											</div>
										}
									>
										<div>
											<div style={{ fontWeight: 'bold' }}>
												{item?.giaTri} {item?.donViDoLuong}
											</div>

											<div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
												Thời gian đánh giá:{' '}
												{item?.thoiGianDanhGia && moment(item?.thoiGianDanhGia).format('HH:mm DD/MM/YYYY')}
											</div>
										</div>
									</Descriptions.Item>
								))}
							</Descriptions>
						</Panel>
					);
				})}
			</Collapse>

			{data && <ViewMetaData visible={visibleModal} setVisible={setVisibleModal} data={data} />}
		</>
	);
};

export default ChiTietKetQuaDanhGia;
