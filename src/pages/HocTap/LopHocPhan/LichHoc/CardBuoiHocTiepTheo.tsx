import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { ArrowRightOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Empty, Progress, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalThoiKhoaBieu from './Modal';

const CardBuoiHocTiepTheo = () => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { getTheoLopHocPhan, setRecord, setVisibleForm, danhSach, loading } = useModel('daotao.thoikhoabieu');
	const [buoiHocHienTai, setBuoiHocHienTai] = useState<ThoiKhoaBieu.IRecord>();
	const [buoiHocTiepTheo, setBuoiHocTiepTheo] = useState<ThoiKhoaBieu.IRecord>();

	const getData = () => {
		if (recLopHocPhan?.ten)
			getTheoLopHocPhan(recLopHocPhan.ten).then((data) => {
				data.every((item) => {
					// Nếu có 1 buổi học đang diễn ra
					if (moment().isSameOrAfter(item.thoiGianBatDau) && moment().isSameOrBefore(item.thoiGianKetThuc))
						setBuoiHocHienTai(item);
					else if (moment().isBefore(item.thoiGianBatDau)) {
						setBuoiHocTiepTheo(item);
						return false;
					}
					return true;
				});
			});
	};

	useEffect(() => {
		getData();
	}, [recLopHocPhan?._id]);

	const renderBuoihoc = (buoiHoc: ThoiKhoaBieu.IRecord) => {
		const index = _.indexOf(danhSach, buoiHoc) + 1;

		return (
			<>
				<Progress percent={Math.round((index / danhSach.length) * 100)} style={{ marginBottom: 12 }} size='small' />

				<Descriptions column={1}>
					<Descriptions.Item label='Ngày học' span={2}>
						Tuần {moment(buoiHoc?.ngay).week()}, {moment(buoiHoc?.ngay).format('dddd')}, ngày{' '}
						{moment(buoiHoc?.ngay).format('DD/MM/YYYY')}
					</Descriptions.Item>
					<Descriptions.Item label='Thời gian'>
						{buoiHoc.thoiGianBatDau && buoiHoc.thoiGianKetThuc
							? `${moment(buoiHoc.thoiGianBatDau).format('HH:mm')} - ${moment(buoiHoc.thoiGianKetThuc).format('HH:mm')}`
							: `Tiết ${buoiHoc.tietBatDau} - ${buoiHoc.tietKetThuc}`}
					</Descriptions.Item>
					<Descriptions.Item label='Phòng học'>{buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}</Descriptions.Item>
				</Descriptions>

				<div style={{ textAlign: 'right' }}>
					<a
						onClick={() => {
							setRecord(buoiHoc);
							setVisibleForm(true);
						}}
					>
						<EyeOutlined /> Xem chi tiết
					</a>
				</div>
			</>
		);
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{buoiHocHienTai?._id ? (
					<Col span={24}>
						<Card title='Buổi học hiện tại'>{renderBuoihoc(buoiHocHienTai)}</Card>
					</Col>
				) : null}

				<Col span={24}>
					<Card
						title='Buổi học tiếp theo'
						extra={[
							<ButtonExtend
								key='all'
								onClick={() => (window.location.hash = 'buoi-hoc')}
								type='link'
								icon={<ArrowRightOutlined />}
								tooltip='Xem tất cả'
							/>,
						]}
						loading={loading}
					>
						{buoiHocTiepTheo?._id ? (
							renderBuoihoc(buoiHocTiepTheo)
						) : (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có buổi học tiếp theo' />
						)}
					</Card>
				</Col>
			</Row>

			<ModalThoiKhoaBieu />
		</>
	);
};

export default CardBuoiHocTiepTheo;
