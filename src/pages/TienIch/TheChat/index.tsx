import { formatDate } from '@/utils/formatDate';
import { Descriptions, Divider, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import Sticky from 'react-stickynode';
import { useIntl, useModel } from 'umi';
import DotTheChatPage from './Dot';
import ChiTietKetQuaDanhGia from './KetQua';
import './style.less';

const TheChatPage = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { record: recDot } = useModel('tienich.thechat.dot');
	const { record, getOneModel, loading: loadingChiSo } = useModel('tienich.thechat.chisothehinh');
	const { getAllModel, danhSach, loading: loadingKetQua } = useModel('tienich.thechat.ketquathechat');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('30%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	useEffect(() => {
		if (initialState?.currentUser?.ssoId && recDot?._id) {
			getOneModel({ dotDanhGiaTheChatId: recDot?._id, ssoIdSinhVien: initialState?.currentUser?.ssoId });
			getAllModel(
				undefined,
				undefined,
				{
					dotDanhGiaTheChatId: recDot?._id,
					ssoIdSinhVien: initialState?.currentUser?.ssoId,
				},
				undefined,
				'me/many',
			);
		}
	}, [initialState?.currentUser?.ssoId, recDot?._id]);

	return (
		<>
			<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
				<Pane initialSize={paneSize} minSize='20%'>
					<Sticky top={110} bottomBoundary='#content'>
						<DotTheChatPage />
					</Sticky>
				</Pane>

				<Pane minSize='40%'>
					<div id='content'>
						<Spin spinning={loadingChiSo || loadingKetQua}>
							<Descriptions
								style={{ marginBottom: 12 }}
								column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
								className='highlight'
								layout='vertical'
								colon={false}
							>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.dotdanhgiathechat.description' })}
									span={2}
								>
									{recDot?.tenDot ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.namhoc.description' })}>
									{recDot?.namHoc ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.hocky.description' })}>
									{recDot?.hocKy?.ten ?? recDot?.maHocKy}
								</Descriptions.Item>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.thoigianbatdau.description' })}
								>
									{formatDate(recDot?.thoiGianBatDau) || '--'}
								</Descriptions.Item>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.thoigianketthuc.description' })}
								>
									{formatDate(recDot?.thoiGianKetThuc) || '--'}
								</Descriptions.Item>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'hoctapkhac.thechatsinhvien.tieuchidanhgia.description' })}
									span={2}
								>
									{recDot?.danhMucTheChat
										?.map((item) => item?.danhMuc?.ten)
										.filter(Boolean)
										.join(', ')}
								</Descriptions.Item>
							</Descriptions>

							{danhSach?.length ? (
								<div style={{ marginTop: 12 }}>
									<ChiTietKetQuaDanhGia danhSachKetQua={danhSach} />
								</div>
							) : null}

							{record?._id && (
								<div style={{ fontSize: '14px', lineHeight: '1.8', color: '#333' }}>
									<Divider orientation='left'>Chỉ số hình thể</Divider>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
										<div className='height-card' style={{ background: '#DCFFFF' }}>
											<div className='left'>
												<img
													src='/images/thechat/chieucao.png'
													alt='Chiều cao'
													className='icon-vertical'
													style={{ color: '#18BBC2' }}
												/>
												<div className='label'>Chiều cao</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#26C2C8' }}>
													{record?.chieuCao}
												</span>
												<span className='unit'>cm</span>
											</div>
										</div>
										<div className='height-card' style={{ background: '#F8DDD3' }}>
											<div className='left'>
												<img
													src='/images/thechat/cannang.png'
													alt='Cân nặng'
													className='icon-vertical'
													style={{ color: '#E20404' }}
												/>
												<div className='label'>Cân nặng</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#E20404' }}>
													{record?.canNang}
												</span>
												<span className='unit'>kg</span>
											</div>
										</div>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
										<div className='height-card' style={{ background: '#FFE7BF' }}>
											<div className='left'>
												<img
													src='/images/thechat/vongeo.png'
													alt='Vòng eo'
													className='icon-vertical'
													style={{ color: '#FFAF0B' }}
												/>
												<div className='label'>Vòng eo</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#FFAF0B' }}>
													{record?.vongEo}
												</span>
												<span className='unit'>cm</span>
											</div>
										</div>
										<div className='height-card' style={{ background: '#ECD7F5' }}>
											<div className='left'>
												<img
													src='/images/thechat/vongmong.png'
													alt='Vòng mông'
													className='icon-vertical'
													style={{ color: '#A61ADE' }}
												/>
												<div className='label'>Vòng mông</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#A61ADE' }}>
													{record?.vongMong}
												</span>
												<span className='unit'>cm</span>
											</div>
										</div>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
										<div className='height-card' style={{ background: '#FFEEFB' }}>
											<div className='left'>
												<img
													src='/images/thechat/nhimtimnghi.png'
													alt='Nhịp tim nghỉ ngơi'
													className='icon-vertical'
													style={{ color: '#F5D7EA' }}
												/>
												<div className='label'>Nhịp tim nghỉ ngơi</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#F5D7EA' }}>
													{record?.nhipTimBatDau}
												</span>
												<span className='unit'>bpm</span>
											</div>
										</div>

										<div className='height-card' style={{ background: '#E6FBFF' }}>
											<div className='left'>
												<img
													src='/images/thechat/nhimtimsautap.png'
													alt='Nhịp tim sau tập'
													className='icon-vertical'
													style={{ color: '#D0EEFF' }}
												/>
												<div className='label'>Nhịp tim sau tập</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#D0EEFF' }}>
													{record?.nhipTimKetThuc}
												</span>
												<span className='unit'>bpm</span>
											</div>
										</div>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
										<div className='height-card' style={{ background: '#CDE1F4' }}>
											<div className='left'>
												<img
													src='/images/thechat/BMI.png'
													alt='BMI'
													className='icon-vertical'
													style={{ color: '#0047FF' }}
												/>
												<div className='label'>BMI</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#0047FF' }}>
													{record?.bmi}
												</span>
											</div>
										</div>
										<div className='height-card' style={{ background: '#DAEFDA' }}>
											<div className='left'>
												<img
													src='/images/thechat/WHR.png'
													alt='WHR'
													className='icon-vertical'
													style={{ color: '#399500' }}
												/>
												<div className='label'>WHR</div>
											</div>
											<div className='right'>
												<span className='value' style={{ color: '#399500' }}>
													{record?.whr || 'N/A'}
												</span>
											</div>
										</div>
									</div>
									<div
										style={{
											marginTop: '15px',
											fontSize: '13px',
											background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
											padding: '14px',
											borderRadius: '8px',
											color: '#2e7d32',
											lineHeight: '1.6',
											border: '1px solid #c8e6c9',
										}}
									>
										{record?.danhGiaChung}
									</div>
								</div>
							)}
						</Spin>
					</div>
				</Pane>
			</SplitPane>
		</>
	);
};

export default TheChatPage;
