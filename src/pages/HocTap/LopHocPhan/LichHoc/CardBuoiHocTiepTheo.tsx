import ButtonExtend from '@/components/Table/ButtonExtend';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { colorHinhThucGiangDay } from '@/services/HocTap/LopHocPhan/constant';
import { THU_TRONG_TUAN } from '@/services/SuKien/constant';
import { ArrowRightOutlined, CheckSquareOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Empty, Progress, Row, Space, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalThoiKhoaBieu from './Modal';

const CardBuoiHocTiepTheo = () => {
	const { record: recLopHocPhan } = useModel('lophocphan.lophocphan');
	const { getTheoLopHocPhan, setRecord, setVisibleForm, danhSach, loading, setDanhSach } =
		useModel('daotao.thoikhoabieu');
	const [buoiHocHienTai, setBuoiHocHienTai] = useState<ThoiKhoaBieu.IRecord>();
	const [buoiHocTiepTheo, setBuoiHocTiepTheo] = useState<ThoiKhoaBieu.IRecord>();
	const buoiHocTruoc = buoiHocTiepTheo?._id
		? _.indexOf(danhSach, buoiHocTiepTheo)
			? danhSach[_.indexOf(danhSach, buoiHocTiepTheo) - 1]
			: undefined
		: danhSach.at(-1);

	const getData = async () => {
		if (recLopHocPhan?.ten) {
			// Nếu trong lớp học phần đã populate rồi thì ko get lại TKB nữa
			const tkbList = recLopHocPhan.thoiKhoaBieuList?.length
				? _.sortBy(recLopHocPhan.thoiKhoaBieuList, (i) => i.ngay)
				: await getTheoLopHocPhan(recLopHocPhan.ten);
			setDanhSach(tkbList);

			tkbList.every((item) => {
				// Nếu có 1 buổi học đang diễn ra
				if (moment().isSameOrAfter(item.thoiGianBatDau) && moment().isSameOrBefore(item.thoiGianKetThuc))
					setBuoiHocHienTai(item);
				else if (moment().isBefore(item.thoiGianBatDau)) {
					setBuoiHocTiepTheo(item);
					return false;
				}
				return true;
			});
		}
	};

	useEffect(() => {
		getData();
	}, [recLopHocPhan?._id]);

	const renderBuoihoc = (buoiHoc: ThoiKhoaBieu.IRecord, isPass?: boolean) => {
		const index = _.indexOf(danhSach, buoiHoc) + 1;

		return (
			<>
				{!isPass ? (
					<Progress percent={Math.round((index / danhSach.length) * 100)} style={{ marginBottom: 12 }} size='small' />
				) : null}

				<Descriptions column={1} size='small'>
					<Descriptions.Item label='Ngày học' span={2}>
						{THU_TRONG_TUAN[moment(buoiHoc.ngay).day()]}, {moment(buoiHoc.ngay).format('DD/MM/YYYY')}
					</Descriptions.Item>
					<Descriptions.Item label='Thời gian'>
						{buoiHoc.thoiGianBatDau && buoiHoc.thoiGianKetThuc
							? `${moment(buoiHoc.thoiGianBatDau).format('HH:mm')} - ${moment(buoiHoc.thoiGianKetThuc).format('HH:mm')}`
							: `Tiết ${buoiHoc.tietBatDau} - ${buoiHoc.tietKetThuc}`}
					</Descriptions.Item>
					<Descriptions.Item label='Phòng'>
						<Space>
							{buoiHoc?.phongHoc ?? <i>Chưa cập nhật</i>}
							{buoiHoc.hinhThucGiangDay ? (
								<Tag color={colorHinhThucGiangDay[buoiHoc.hinhThucGiangDay]}>{buoiHoc.hinhThucGiangDay}</Tag>
							) : null}
						</Space>
					</Descriptions.Item>
				</Descriptions>

				<div style={{ textAlign: 'right' }}>
					<a
						onClick={() => {
							setRecord(buoiHoc);
							setVisibleForm(true);
						}}
					>
						{isPass ? (
							<>
								<CheckSquareOutlined /> Đánh giá
							</>
						) : (
							<>
								<EyeOutlined /> Chi tiết
							</>
						)}
					</a>
				</div>
			</>
		);
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				{buoiHocHienTai?._id ? (
					<Col span={24} sm={12} md={24}>
						<Card size='small' title='Buổi học đang diễn ra' className='card-highlight'>
							{renderBuoihoc(buoiHocHienTai)}
						</Card>
					</Col>
				) : null}

				<Col span={24} sm={12} md={24}>
					<Card
						size='small'
						title='Buổi học sắp tới'
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
						className={!!buoiHocHienTai?._id ? undefined : 'card-highlight'}
					>
						{buoiHocTiepTheo?._id ? (
							renderBuoihoc(buoiHocTiepTheo)
						) : (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có buổi học tiếp theo' />
						)}
					</Card>
				</Col>

				{buoiHocTruoc ? (
					<Col span={24} sm={12} md={24}>
						<Card size='small' title='Buổi học đã qua' loading={loading}>
							{renderBuoihoc(buoiHocTruoc, true)}
						</Card>
					</Col>
				) : null}
			</Row>

			<ModalThoiKhoaBieu />
		</>
	);
};

export default CardBuoiHocTiepTheo;
