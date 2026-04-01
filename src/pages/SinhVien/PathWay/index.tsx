import { ETrangThaiDuyetLoTrinh } from '@/services/DaoTao/ChuongTrinhDaoTao/constant';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { Card, Col, Descriptions, Row, Spin, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useIntl, useModel } from 'umi';
import CardNotePathWay from './components/CardNote';
import PathwayCard from './components/PathwayCard';

const PathWayPage = (props: { getData?: () => void }) => {
	const intl = useIntl();
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const {
		loading,
		fetchPathwayList,
		getSelectedKhoiLuaChonFromCache,
		initializePathwayData,
		refreshChosenPathway,
		currentKhoiLuaChonTen,
		currentKhoiLuaChonMa,
		setCurrentKhoiLuaChonMa,
		danhSach,
		registeredPathway,
		khoiLuaChonList,
		isLoadingKhoiLuaChon,
	} = useModel('sinhvien.pathway');
	const { record: recLoTrinh, loading: lotrinhLoading } = useModel('sinhvien.lotrinhhoctap');
	const [previewingPathway, setPreviewingPathway] = useState<ChuongTrinhDaoTao.IKhoiKienThuc | null>(null);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('35%');
	const { getData } = props;

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	useEffect(() => {
		if (maKhoaNganh) {
			initializePathwayData(maKhoaNganh);
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
		<Spin spinning={isLoadingKhoiLuaChon || lotrinhLoading}>
			<Row gutter={[0, 12]}>
				{recLoTrinh?._id && recLoTrinh?.trangThaiDuyet !== ETrangThaiDuyetLoTrinh.CHUA_DANG_KY && (
					<Col span={24}>
						<CardNotePathWay />
					</Col>
				)}

				{khoiLuaChonList?.length > 1 && (
					<Col span={24}>
						<Steps
							style={{ marginTop: 16 }}
							current={khoiLuaChonList.findIndex((khoi) => {
								return khoi.ma === currentKhoiLuaChonMa;
							})}
							onChange={(current) => {
								const allKhoi = khoiLuaChonList;
								const khoi = allKhoi[current];
								if (khoi) {
									setCurrentKhoiLuaChonMa(khoi.ma);
								} else {
									setCurrentKhoiLuaChonMa(null);
								}
							}}
							items={khoiLuaChonList.map((khoi) => {
								return {
									key: khoi.ma,
									title: khoi?.ten,
								};
							})}
						/>
					</Col>
				)}

				<Col span={24}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
								<Pane initialSize={paneSize} minSize='15%'>
									<Card
										title={currentKhoiLuaChonTen ?? intl.formatMessage({ id: 'pathway.card.title' })}
										variant='borderless'
										className='card-borderless'
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
																	cursor: 'pointer',
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

												if (getData) getData();
											}
										}}
									/>
								</Pane>
							</SplitPane>
						</Col>
					</Row>
				</Col>
			</Row>
		</Spin>
	);
};

export default PathWayPage;
