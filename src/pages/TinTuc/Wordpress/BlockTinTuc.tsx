import ButtonExtend from '@/components/Table/ButtonExtend';
import { ELoaiThongTinXemSau } from '@/services/XemSau/constant';
import { Col, Empty, Row, Tooltip } from 'antd';
import { first } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import { CardTinTuc, ContentLargeCard } from '../TinTuc.style';
import { Excerpt } from './components/Excerpt';
import { Title } from './components/Title';
import { getImageSrc } from './utils/getImageSrc';

const BlockTinTuc = (props: { empty?: string }) => {
	const { danhSach } = useModel('tintuc.tintucwp');
	const { postModel, getAllModel, danhSach: danhSachXemSau, deleteModel } = useModel('xemsau');
	const { getThongTinCuaToiModel, record } = useModel('sinhvien.sinhvien');
	const { empty } = props;
	const url = 'tin-tuc';

	const getData = () => {
		getAllModel(undefined, undefined, { loaiThongTin: ELoaiThongTinXemSau.TIN_TUC }, undefined, 'me/many');
	};

	useEffect(() => {
		getThongTinCuaToiModel();
		getData();
	}, []);

	const handleXemSau = (rec: any) => {
		const data = {
			userSsoId: record?.ssoId,
			sourceId: String(rec?.id),
			loaiThongTin: ELoaiThongTinXemSau.TIN_TUC,
			thongTin: rec,
		};
		postModel(data, getData, undefined, 'Lưu thành công')
			.then()
			.catch((err) => console.log(err));
	};

	const handleBoXemSau = (rec: any) => {
		deleteModel(rec?._id, getData)
			.then()
			.catch((err) => console.log(err));
	};

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
								<Excerpt data={first(danhSach)} rows={2} style={{ color: '#364954', marginBottom: 0 }} />
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									{danhSach?.[0]?.date && (
										<span className='thoi-gian'>{moment(danhSach?.[0]?.date).format('DD/MM/YYYY')}</span>
									)}
									{danhSachXemSau?.find((item) => Number(item?.sourceId) === danhSach?.[0]?.id)?._id ? (
										<ButtonExtend
											type='link'
											onClick={(event) => {
												event.stopPropagation();
												handleBoXemSau(danhSachXemSau?.find((item) => Number(item?.sourceId) === danhSach?.[0]?.id));
											}}
											danger
										>
											Bỏ lưu
										</ButtonExtend>
									) : (
										<ButtonExtend
											type='link'
											onClick={(event) => {
												event.stopPropagation();
												handleXemSau(danhSach?.[0]);
											}}
											tooltip='Lưu xem sau'
										>
											Lưu
										</ButtonExtend>
									)}
								</div>
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
											<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
												{tintuc.date && <span className='thoi-gian'>{moment(tintuc.date).format('DD/MM/YYYY')}</span>}
												{danhSachXemSau?.find((item) => Number(item?.sourceId) === tintuc?.id)?._id ? (
													<ButtonExtend
														type='link'
														onClick={(event) => {
															event.stopPropagation();
															handleBoXemSau(danhSachXemSau?.find((item) => Number(item?.sourceId) === tintuc?.id));
														}}
														danger
													>
														Bỏ lưu
													</ButtonExtend>
												) : (
													<ButtonExtend
														type='link'
														onClick={(event) => {
															event.stopPropagation();
															handleXemSau(tintuc);
														}}
														tooltip='Lưu xem sau'
													>
														Lưu
													</ButtonExtend>
												)}
											</div>
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
										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											{tintuc?.date && <span className='thoi-gian'>{moment(tintuc?.date).format('DD/MM/YYYY')}</span>}
											{danhSachXemSau?.find((item) => Number(item?.sourceId) === tintuc?.id)?._id ? (
												<ButtonExtend
													type='link'
													onClick={(event) => {
														event.stopPropagation();
														handleBoXemSau(danhSachXemSau?.find((item) => Number(item?.sourceId) === tintuc?.id));
													}}
													danger
												>
													Bỏ lưu
												</ButtonExtend>
											) : (
												<ButtonExtend
													type='link'
													onClick={(event) => {
														event.stopPropagation();
														handleXemSau(tintuc);
													}}
													tooltip='Lưu xem sau'
												>
													Lưu
												</ButtonExtend>
											)}
										</div>
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
