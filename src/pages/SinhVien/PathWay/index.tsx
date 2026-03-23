import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { Card, Col, Descriptions, Row, Spin, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';
import PathwayCard from './components/PathwayCard';

const PathWayPage = () => {
	const intl = useIntl();
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const {
		loading,
		fetchPathwayList,
		getSelectedKhoiLuaChonFromCache,
		initializePathwayData,
		refreshChosenPathway,
		currentKhoiLuaChonMa,
		setCurrentKhoiLuaChonMa,
		danhSach,
		registeredPathway,
		khoiLuaChonList,
		isLoadingKhoiLuaChon,
	} = useModel('sinhvien.pathway');
	const [previewingPathway, setPreviewingPathway] = useState<ChuongTrinhDaoTao.IKhoiKienThuc | null>(null);
	const {
		chuongTrinhHienTai,
		loading: loadingChuongTrinh,
		getChuongTrinhHienTaiModel,
	} = useModel('daotao.chuongtrinhdaotao');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('35%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	useEffect(() => {
		if (maKhoaNganh) {
			initializePathwayData(maKhoaNganh);
			getChuongTrinhHienTaiModel(maKhoaNganh);
		} else {
			setPreviewingPathway(null);
		}
	}, [maKhoaNganh]);

	useEffect(() => {
		if (maKhoaNganh && currentKhoiLuaChonMa) {
			getSelectedKhoiLuaChonFromCache(currentKhoiLuaChonMa);

			refreshChosenPathway(maKhoaNganh).then(() => {
				fetchPathwayList(maKhoaNganh, currentKhoiLuaChonMa).then((pathwayData) => {
					if (pathwayData.length > 0 && !previewingPathway) {
						setPreviewingPathway(pathwayData[0]);
					}
				});
			});
		}
	}, [currentKhoiLuaChonMa]);

	return (
		<Card
			variant='borderless'
			className='card-big-title card-borderless'
			title={intl.formatMessage({ id: 'pathway.title' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Row gutter={[0, 16]}>
				<Col span={24}>
					<Row gutter={[16, 0]}>
						<Col span={24}>
							<Card variant='borderless'>
								<Spin spinning={loadingChuongTrinh}>
									<Descriptions
										column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}
										layout='vertical'
										className='highlight'
										colon={false}
									>
										<Descriptions.Item label={intl.formatMessage({ id: 'pathway.info.programType' })}>
											{chuongTrinhHienTai?.loai
												? LoaiChuongTrinhDaoTao[chuongTrinhHienTai.loai]
												: chuongTrinhHienTai?.loai}
										</Descriptions.Item>
										<Descriptions.Item label={intl.formatMessage({ id: 'pathway.info.currentProgram' })}>
											{chuongTrinhHienTai?.nganh?.ten || chuongTrinhHienTai?.ten || '-'}
										</Descriptions.Item>
									</Descriptions>
								</Spin>
								<Spin spinning={isLoadingKhoiLuaChon}>
									<Steps
										style={{ marginTop: 16 }}
										current={khoiLuaChonList.findIndex((khoi) => {
											console.log('khoi', khoi);
											return khoi.ma === currentKhoiLuaChonMa;
										})}
										onChange={(current) => {
											const allKhoi = khoiLuaChonList;
											const khoi = allKhoi[current];
											if (khoi) {
												setCurrentKhoiLuaChonMa(khoi.ma);
											}
										}}
										items={khoiLuaChonList.map((khoi) => {
											return {
												key: khoi.ma,
												title: khoi?.ten,
											};
										})}
									/>
								</Spin>
							</Card>
						</Col>
					</Row>
				</Col>

				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
								<Pane initialSize={paneSize} minSize='15%'>
									<Card
										title={intl.formatMessage({ id: 'pathway.card.title' })}
										styles={{ body: { padding: 16, overflowY: 'auto' } }}
									>
										<Spin spinning={loading}>
											<Row gutter={[0, 12]}>
												{danhSach?.map((p) => {
													const isSelected = p.ma === previewingPathway?.ma;
													const isChosen = registeredPathway?.maKhoiKienThuc === p.ma;

													return (
														<Col span={24} key={p._id}>
															<Card
																size='small'
																style={{
																	width: '100%',
																	borderColor: isSelected ? 'var(--color-primary)' : undefined,
																	backgroundColor: isSelected ? 'var(--color-info-bg)' : undefined,
																}}
																styles={{ body: { padding: 16 } }}
																onClick={() => setPreviewingPathway(p)}
															>
																<Row gutter={[12, 0]} justify='space-between' align='middle'>
																	<Col>
																		<Row gutter={[0, isSelected ? 4 : 0]}>
																			{isChosen && (
																				<Col span={24}>
																					<Tag color='green'>{intl.formatMessage({ id: 'pathway.card.selected' })}</Tag>
																				</Col>
																			)}
																			<Col span={24}>
																				<h3
																					style={{
																						fontWeight: 600,
																						color: isSelected ? `var(--color-primary)` : undefined,
																						margin: 0,
																					}}
																				>
																					{p.ten || ''}
																				</h3>
																			</Col>
																		</Row>
																	</Col>
																</Row>
															</Card>
															{isSelected && p?.huongDanDangKy && (
																<Descriptions className='highlight' column={1}>
																	<Descriptions.Item>
																		<div dangerouslySetInnerHTML={{ __html: p?.huongDanDangKy }} />
																	</Descriptions.Item>
																</Descriptions>
															)}
														</Col>
													);
												})}
												{danhSach?.length === 0 && (
													<Col span={24}>
														<div style={{ textAlign: 'center' }}>
															{intl.formatMessage({ id: 'pathway.empty.noPathway' })}
														</div>
													</Col>
												)}
											</Row>
										</Spin>
									</Card>
								</Pane>
								<Pane minSize='65%'>
									<PathwayCard
										pathway={previewingPathway || null}
										onSuccess={() => {
											if (maKhoaNganh) {
												refreshChosenPathway(maKhoaNganh);
											}
										}}
									/>
								</Pane>
							</SplitPane>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	);
};

export default PathWayPage;
