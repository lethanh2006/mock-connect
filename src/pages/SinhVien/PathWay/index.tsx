import ButtonExtend from '@/components/Table/ButtonExtend';
import { ETrangThaiDuyetLoTrinh } from '@/services/DaoTao/ChuongTrinhDaoTao/constant';
import { Card, Col, Descriptions, Row, Spin, Steps, Tag } from 'antd';
import dayjs from 'dayjs';
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
		danhSach,
		getKhoiLuaChonListDataModel,
		registeredPathway,
		khoiLuaChonList,
		isLoadingKhoiLuaChon,
		selectedKhoiLuaChon,
		setSelectedKhoiLuaChon,
		getChosenPathwayDataModel,
		handleSelectPathway,
		formSubmiting,
		getPathwayListModel,
	} = useModel('sinhvien.pathway');
	const { record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');
	const [data, setData] = useState<
		{
			maKhoaNganh: string;
			maKhoiCha: string;
			maKhoiCon: string;
			dotDangKyPathwayId: string;
		}[]
	>([]);
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('35%');
	const { getData } = props;

	const foundIndex = khoiLuaChonList.findIndex((khoi) => khoi?.ma === selectedKhoiLuaChon?.ma);
	const currentIndex = foundIndex >= 0 ? foundIndex : 0;

	const ngoaiThoiGian =
		recLoTrinh?.dotDangKyPathway?.kichHoat === false ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianBatDau ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc ||
		dayjs().isBefore(recLoTrinh?.dotDangKyPathway?.thoiGianBatDau) ||
		dayjs().isAfter(recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc);

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	useEffect(() => {
		if (maKhoaNganh) {
			getKhoiLuaChonListDataModel(maKhoaNganh);
			getChosenPathwayDataModel(maKhoaNganh);
		}
	}, [maKhoaNganh]);

	useEffect(() => {
		if (maKhoaNganh && selectedKhoiLuaChon?.ma) {
			getPathwayListModel(maKhoaNganh, selectedKhoiLuaChon?.ma);
		}
	}, [selectedKhoiLuaChon?.ma]);

	useEffect(() => {
		if (!khoiLuaChonList?.length) return;

		const data = khoiLuaChonList.map((khoi) => {
			const registered = registeredPathway?.find((item) => item.maKhoiCha === khoi.ma);

			return {
				maKhoaNganh: maKhoaNganh ?? '',
				maKhoiCha: khoi.ma ?? '',
				maKhoiCon: registered?.maKhoiKienThuc || khoi.khoiCon?.[0]?.ma || '',
				dotDangKyPathwayId: recLoTrinh?.dotDangKyPathwayId ?? '',
			};
		});

		setData(data);
	}, [khoiLuaChonList, registeredPathway, maKhoaNganh, recLoTrinh?._id]);

	const handleChoosePathway = async () => {
		await handleSelectPathway(data, () => {
			getData && getData();
			maKhoaNganh && getChosenPathwayDataModel(maKhoaNganh);
		});
	};

	const disabledReason = (() => {
		if (recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.DA_DUYET) {
			return 'Lộ trình đã được duyệt';
		}

		if (recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.CHO_DUYET) {
			return 'Lộ trình đang chờ duyệt';
		}

		if (recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.TU_CHOI) {
			return 'Lộ trình đã bị từ chối';
		}

		if (ngoaiThoiGian) {
			return 'Đã ngoài thời gian đăng ký pathway';
		}

		if (data?.length !== danhSach?.length) {
			return 'Vui lòng chọn đầy đủ pathway';
		}

		return 'Đăng ký lộ trình';
	})();

	return (
		<>
			{recLoTrinh?._id && <CardNotePathWay />}

			<Spin spinning={isLoadingKhoiLuaChon}>
				{khoiLuaChonList?.length > 1 && (
					<Steps
						style={{ marginBottom: 12 }}
						current={currentIndex}
						onChange={(current) => {
							const khoi = khoiLuaChonList[current];
							setSelectedKhoiLuaChon(khoi);
						}}
						items={khoiLuaChonList.map((khoi) => ({
							title: khoi?.ten,
						}))}
					/>
				)}
			</Spin>

			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='15%'>
					<Card
						title={selectedKhoiLuaChon?.ten ?? intl.formatMessage({ id: 'pathway.card.title' })}
						variant='borderless'
						className='card-borderless'
					>
						<Spin spinning={loading}>
							{danhSach?.length ? (
								<Row gutter={[0, 12]}>
									{danhSach?.map((p) => {
										const isSelected = data?.some((item) => item?.maKhoiCon === p.ma);
										const isChosen = registeredPathway?.find((item) => item?.maKhoiKienThuc === p?.ma);

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
													onClick={() =>
														setData((prev) => {
															const existedIndex = prev.findIndex((item) => item.maKhoiCha === p.maCha);

															const newItem = {
																maKhoaNganh: maKhoaNganh ?? '',
																maKhoiCha: p.maCha ?? '',
																maKhoiCon: p.ma ?? '',
																dotDangKyPathwayId: recLoTrinh?.dotDangKyPathwayId ?? '',
															};

															if (existedIndex !== -1) {
																return prev.map((item, index) => (index === existedIndex ? newItem : item));
															}

															return [...prev, newItem];
														})
													}
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
								</Row>
							) : (
								<div style={{ textAlign: 'center' }}>{intl.formatMessage({ id: 'pathway.empty.noPathway' })}</div>
							)}
						</Spin>
					</Card>
				</Pane>
				<Pane minSize='65%'>
					<PathwayCard pathway={danhSach?.find((p) => data?.some((item) => item?.maKhoiCon === p.ma))} />
				</Pane>
			</SplitPane>

			<div className='form-footer'>
				<ButtonExtend
					tooltip={disabledReason}
					type='primary'
					loading={formSubmiting}
					onClick={handleChoosePathway}
					disabled={
						ngoaiThoiGian ||
						recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.DA_DUYET ||
						recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.CHO_DUYET ||
						recLoTrinh?.trangThaiDuyet === ETrangThaiDuyetLoTrinh.TU_CHOI ||
						data?.length !== danhSach?.length
					}
				>
					{intl.formatMessage({ id: 'pathway.button.choose' })}
				</ButtonExtend>
			</div>
		</>
	);
};

export default PathWayPage;
