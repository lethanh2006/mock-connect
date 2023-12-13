import { Col, Empty, Row, Tooltip } from 'antd';
import { first } from 'lodash';
import moment from 'moment';
import { history, useModel } from 'umi';
import { CardTinTuc, ContentLargeCard } from './TinTuc.style';
import { Excerpt } from './components/Excerpt';
import { Title } from './components/Title';
import { getImageSrc } from './utils/getImageSrc';

const BlockTinTuc = (props: { empty?: string }) => {
	const { danhSach } = useModel('tintuc.tintucwp');
	const { empty } = props;
	const url = 'tin-tuc';

	if (danhSach?.length === 0) return <Empty description={empty ?? 'Chưa có tin tức'} />;
	else
		return (
			<div style={{ marginBottom: 20 }}>
				<Row
					gutter={[16, 16]}
					align='middle'
					style={{
						alignItems: 'stretch',
						marginBottom: 16,
					}}
				>
					<Col span={24} md={12}>
						<CardTinTuc
							onClick={() => {
								history.push({
									pathname: url + '/chi-tiet',
									query: { id: danhSach?.[0]?.id as any },
								});
							}}
							first={true}
							style={{ minHeight: '450px' }}
						>
							<div
								style={{
									background: `url(${getImageSrc({
										tinTuc: first(danhSach),
										targetSize: 'large',
									})}) center center/cover no-repeat`,
									width: '100%',
									height: '67%',
									minHeight: 220,
									backgroundSize: 'cover',
								}}
							/>
							<ContentLargeCard>
								<Tooltip title={<Title data={first(danhSach)} />}>
									<Title
										data={first(danhSach)}
										rows={2}
										style={{ fontSize: 'calc(1em + 0.2vw)', fontWeight: 500, marginBottom: 10, color: 'black' }}
									/>
								</Tooltip>
								<Excerpt data={first(danhSach)} rows={2} style={{ color: '#364954',marginBottom:0 }} />
								{danhSach?.[0]?.date && (
									<span  className='thoi-gian'>Ngày đăng: {moment(danhSach?.[0]?.date).format('DD/MM/YYYY HH:mm')}</span>
								)}
							</ContentLargeCard>
						</CardTinTuc>
					</Col>

					<Col span={24} md={12}>
						<Row gutter={[0, 16]}>
							{danhSach.slice(1, 4).map((tintuc) => (
								<CardTinTuc
									key={tintuc?.slug}
									onClick={() => {
										history.push({
											pathname: url + '/chi-tiet',
											query: { id: tintuc?.id as any },
										});
									}}
									style={{ height: '33.33%' }}
								>
									<Row gutter={[12, 0]}>
										<Col xs={8} style={{ height: '100%' }}>
											<div
												style={{
													background: `url(${getImageSrc({
														tinTuc: tintuc,
														targetSize: 'medium',
													})}) center center/ cover no-repeat`,
													width: '100%',
													height: '100%',
													minHeight: 130,
													backgroundSize: 'cover',
												}}
											/>
										</Col>
										<Col xs={16}>
											<Tooltip title={<Title data={tintuc} />}>
												<Title
													data={tintuc}
													rows={2}
													style={{ fontSize: 'calc(1em + 0.2vw)', fontWeight: 500, marginBottom: 6, color: 'black' }}
												/>
											</Tooltip>
											<Excerpt data={tintuc} rows={2} style={{ color: '#364954', marginBottom: 0 }} />
											{tintuc.date && (
												<span className='thoi-gian'>Ngày đăng: {moment(tintuc.date).format('DD/MM/YYYY HH:mm')}</span>
											)}
										</Col>
									</Row>
								</CardTinTuc>
							))}
						</Row>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ alignItems: 'stretch', marginBottom: 16 }}>
					{danhSach.slice(4).map((tintuc) => (
						<Col span={24} md={8} key={tintuc?.slug}>
							<CardTinTuc
								style={{ height: '100%' }}
								onClick={() => {
									history.push({
										pathname: url + '/chi-tiet',
										query: { id: tintuc?.id as any },
									});
								}}
							>
								<Row gutter={12} style={{ height: '100%' }}>
									<Col xs={8}>
										<div
											style={{
												background: `url(${getImageSrc({
													tinTuc: tintuc,
													targetSize: 'thumbnail',
												})}) center center/ cover no-repeat`,
												width: '100%',
												height: '100%',
											}}
										/>
									</Col>
									<Col xs={16}>
										<Tooltip title={<Title data={tintuc} />}>
											<Title
												data={tintuc}
												rows={2}
												style={{
													fontSize: 'calc(1em + 0.2vw)',
													fontWeight: 500,
													marginBottom: 6,
													color: 'black',
												}}
											/>
										</Tooltip>
										{tintuc?.date && (
											<span className='thoi-gian'>Ngày đăng: {moment(tintuc?.date).format('DD/MM/YYYY HH:mm')}</span>
										)}
									</Col>
								</Row>
							</CardTinTuc>
						</Col>
					))}
				</Row>
			</div>
		);
};

export default BlockTinTuc;
