import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	colorTrangThaiNopBaiTap,
	type ETrangThaiNopBaiTap,
	mapTrangThaiNopBaiTap,
} from '@/services/DaoTao/BaiTap/constants';
import type { BaiTap } from '@/services/DaoTao/BaiTap/typing';
import { formatDateTime } from '@/utils/formatDate';
import { Col, Divider, Row, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import BoxFile from '../../DienDan/components/BoxFile';

interface IProps {
	data: BaiTap.IDanhSachGiaoBaiTap;
}

const CardStatusBaiTap = (props: IProps) => {
	const intl = useIntl();
	const { data } = props;
	const { handleEdit } = useModel('daotao.baitap');

	return (
		<div className='card relative' style={{ paddingBottom: 12, paddingTop: 8 }}>
			<div className='content'>
				<Row gutter={[12, 12]}>
					<Col xs={{ span: 24, order: 2 }} md={{ span: 17, order: 1 }}>
						<Space>
							<div
								style={{
									color: 'rgb(0, 0, 0)',
									fontWeight: 600,
									fontSize: 16,
								}}
							>
								{data?.assignment?.noiDung}
							</div>{' '}
							{data?.assignment?.isQuiz && <Tag color='blue'>Quiz</Tag>}
						</Space>
					</Col>
					<Col xs={{ span: 24, order: 1 }} md={{ span: 7, order: 2 }} style={{ textAlign: 'center' }}>
						<span style={{ color: APP_CONFIG_PRIMARY_COLOR }}>
							{data?.assignment?.thoiGianLamBaiQuiz ? (
								<span>
									{`${data?.assignment?.thoiGianLamBaiQuiz} phút `}{' '}
									{data?.assignment?.active ? (
										<span>
											({intl.formatMessage({ id: 'lophocphan.id.baitap.han' })}{' '}
											{formatDateTime(data?.assignment?.thoiGianKetThuc)})
										</span>
									) : (
										<span style={{ color: 'red' }}>
											{intl.formatMessage({ id: 'lophocphan.id.baitap.chuakichhoat' })}
										</span>
									)}
								</span>
							) : (
								`${intl.formatMessage({ id: 'lophocphan.id.baitap.han' })} ${formatDateTime(data?.assignment?.thoiGianKetThuc)}`
							)}
						</span>
					</Col>
				</Row>

				{data?.assignment?.choPhepCapNhatSauNop && <i>{intl.formatMessage({ id: 'lophocphan.id.baitap.noti' })}</i>}

				<Divider />

				<Row gutter={[12, 12]}>
					<Col xs={24} md={{ span: 7, push: 17 }} style={{ textAlign: 'center' }}>
						<Row gutter={[12, 12]}>
							<Col xs={data?.assignment?.isQuiz ? 12 : 24} md={24}>
								<Tag color={colorTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}>
									{mapTrangThaiNopBaiTap[data.trangThai as ETrangThaiNopBaiTap]}
								</Tag>
							</Col>

							<Col xs={12} md={24}>
								<div style={{ marginTop: 8, fontSize: 28, fontWeight: 'bold', color: 'green' }}>
									{(data?.assignment?.isQuiz && data?.assignment?.congBoDiemSauNop) || !data?.assignment?.isQuiz
										? (data?.tongDiem ?? '--')
										: '--'}
								</div>
								<div>{intl.formatMessage({ id: 'lophocphan.id.baitap.diemdo' })}</div>

								{data?.ghiChu ? (
									<div style={{ marginTop: 8, fontStyle: 'italic', color: '#555' }}>
										{intl.formatMessage({ id: 'lophocphan.id.baitap.ghichu' })}: {data.ghiChu}
									</div>
								) : null}
							</Col>

							<Col xs={24}>
								<ButtonExtend type='primary' onClick={() => handleEdit(data)} notHideText>
									{intl.formatMessage({ id: 'lophocphan.id.baitap.chitiet' })}
								</ButtonExtend>
							</Col>
						</Row>
					</Col>

					<Col xs={24} md={{ span: 17, pull: 7 }}>
						<Row gutter={[12, 12]}>
							<Col span={24}>
								{data?.assignment?.huongDanNop ? (
									<div
										className='noi-dung-post'
										dangerouslySetInnerHTML={{
											__html: data?.assignment?.huongDanNop
												? data.assignment?.huongDanNop.replace(
														/<img/g,
														'<img style="max-width:100%;height:auto;display:block;margin:10px 0;"',
													)
												: '',
										}}
									/>
								) : (
									<i>{intl.formatMessage({ id: 'lophocphan.id.baitap.empty' })}</i>
								)}
							</Col>

							{data?.assignment?.urlTepDinhKem?.length && (
								<Col span={24}>
									<BoxFile url={data?.assignment?.urlTepDinhKem} />
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</div>
		</div>
	);
};
export default CardStatusBaiTap;
