import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiNopBaiTap,
	ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import { formatDateTime } from '@/utils/formatDate';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Empty, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useIntl, useModel } from 'umi';
import BoxFile from '../DienDan/components/BoxFile';

const { Text } = Typography;

interface IProps {
	lopHocPhanId: string;
}

const CardBaiTapLopHp = ({ lopHocPhanId }: IProps) => {
	const intl = useIntl();
	const { getModel, danhSach } = useModel('daotao.baitap');
	const [segment, setSegment] = useState<string>('1');

	const fetchData = () => {
		if (lopHocPhanId) {
			getModel(
				undefined,
				undefined,
				undefined,
				undefined,
				undefined,
				`lop-hoc-phan/${lopHocPhanId}/me/${segment === '1' ? 'dang-dien-ra' : 'da-ket-thuc'}`,
			);
		}
	};

	useEffect(() => {
		fetchData();
	}, [lopHocPhanId, segment]);

	return (
		<Card
			size='small'
			title={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.baitap' })}
			variant='borderless'
			extra={
				// <Segmented
				// 	options={[
				// 		{ label: 'Đang diễn ra', value: '1' },
				// 		{ label: 'Đã kết thúc', value: '2' },
				// 	]}
				// 	value={segment}
				// 	onChange={(value) => setSegment(value as string)}
				// 	size='small'
				// />
				<Link to={`/hoc-tap/lop-tin-chi/${lopHocPhanId}#bai-tap`}>
					<ButtonExtend
						key='all'
						type='link'
						icon={<ArrowRightOutlined />}
						tooltip={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.baitap.xemtatca' })}
					/>
				</Link>
			}
		>
			{!danhSach?.length ? (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description={intl.formatMessage({ id: 'lophocphan.id.thongtinchung.baitap.empty' })}
				/>
			) : (
				<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
					{danhSach.map((item) => {
						const files = item.assignment?.urlTepDinhKem || [];
						return (
							<div key={item._id} style={{ borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
								<Text strong>{item.assignment?.noiDung}</Text>

								{files.length > 0 && (
									<div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
										<BoxFile url={files} />

										{files.length > 2 && (
											<Text type='secondary' italic>
												...và {files.length - 2}{' '}
												{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.baitap.filekhac' })}
											</Text>
										)}
									</div>
								)}

								<div style={{ marginTop: 12, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
									<Text type='secondary'>
										{intl.formatMessage({ id: 'lophocphan.id.thongtinchung.baitap.hannopbai' })}:{' '}
									</Text>

									<Text strong>
										{formatDateTime(item.assignment?.thoiGianKetThuc)}{' '}
										<Tag
											color={colorTrangThaiNopBaiTap[item.trangThai as ETrangThaiNopBaiTap]}
											style={{ marginLeft: item.trangThai == ETrangThaiNopBaiTap.DA_NOP ? 16 : 2 }}
										>
											{mapTrangThaiNopBaiTap[item.trangThai as ETrangThaiNopBaiTap]}
										</Tag>
									</Text>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</Card>
	);
};

export default CardBaiTapLopHp;
