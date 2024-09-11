import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiNopBaiTap,
	ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { Col, Row, Space, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';
import FormBaiTap from './Form';

interface IProps {
	data: BaiTap.IDanhSachGiaoBaiTap;
	getData: () => void;
}

const CardStatusBaiTap = (props: IProps) => {
	const { data, getData } = props;
	const { setVisibleForm, setRecord } = useModel('daotao.baitap');

	const quaThoiHanNopBai = !data?.assignment?.thoiGianKetThuc || moment().isAfter(data?.assignment?.thoiGianKetThuc);

	return (
		<div className='card relative' style={{ paddingBottom: 12 }}>
			<div className='header-card flex justify-between'>
				<div className='user-name flex item-center'>
					<Space>
						<div className='name'>{data?.assignment?.noiDung}</div>
						{data?.assignment?.isQuiz && <Tag color='blue'>Quiz</Tag>}
					</Space>
				</div>
				<div className='flex item-center' style={{ gap: 12 }}>
					{moment(data?.thoiGianTraLoi ?? data?.updatedAt).isBefore(data?.assignment?.thoiGianKetThuc) &&
					data?.trangThai === ETrangThaiNopBaiTap.DA_NOP ? (
						<Tag color='green'>Đúng hạn</Tag>
					) : moment(data?.thoiGianTraLoi ?? data?.updatedAt).isAfter(data?.assignment?.thoiGianKetThuc) &&
					  data?.trangThai === ETrangThaiNopBaiTap.DA_NOP ? (
						<Tag color='orange'>Quá hạn</Tag>
					) : null}

					<span style={{ color: APP_CONFIG_PRIMARY_COLOR }}>
						{data?.assignment?.thoiGianLamBaiQuiz ? (
							<span>
								{`${data?.assignment?.thoiGianLamBaiQuiz} phút `}{' '}
								{data?.assignment?.active ? (
									<span>(Hạn {moment(data?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')})</span>
								) : (
									<span style={{ color: 'red' }}>(Chưa kích hoạt)</span>
								)}
							</span>
						) : (
							`Hạn ${moment(data?.assignment?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}`
						)}
					</span>
				</div>
			</div>

			<div className='content'>
				<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
					<Col xs={24} md={{ span: 7, push: 17 }} style={{ textAlign: 'center' }}>
						<Tag color={colorTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}>
							{mapTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}
						</Tag>
					</Col>
					<Col xs={24} md={{ span: 17, pull: 7 }}>
						<div
							dangerouslySetInnerHTML={{ __html: data?.assignment?.huongDanNop ?? '' }}
							style={{ textAlign: 'left', marginLeft: 12 }}
						/>

						<Row gutter={[12, 12]} style={{ marginTop: 8 }}>
							{data?.assignment?.urlTepDinhKem?.map((val) => (
								<Col span={24} md={12} key={val}>
									<BoxFile url={val} />
								</Col>
							))}
						</Row>
					</Col>
					<Col xs={24} style={{ textAlign: 'right' }}>
						<Space style={{ marginRight: 12 }}>
							<ButtonExtend
								tooltip={quaThoiHanNopBai && 'Ngoài thời gian nộp bài'}
								disabled={quaThoiHanNopBai}
								type='primary'
								onClick={() => {
									setRecord(data);
									setVisibleForm(true);
								}}
							>
								Xem chi tiết và làm bài
								{/* {data?.trangThai === ETrangThaiNopBaiTap.DA_NOP ? 'Hủy nộp' : 'Nộp bài'} */}
							</ButtonExtend>
						</Space>
					</Col>
				</Row>
			</div>

			<FormBaiTap getData={getData} />
		</div>
	);
};
export default CardStatusBaiTap;
