import anh from '@/assets/noimg.png';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { ELoaiThongTinXemSau } from '@/services/TienIch/XemSau/constant';
import { Col, Empty, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';
import { CardTinTuc, ContentLargeCard } from '../components/TinTuc.style';

export const renderParagraph = (text: string, rows: number, style: any) => (
	<Typography.Paragraph ellipsis={{ rows, expandable: false }} style={style}>
		{text}
	</Typography.Paragraph>
);

const BlockTinTuc = (props: { empty?: string; getData?: () => void }) => {
	const { danhSach: danhSachChuDe, setRecord: setChuDe } = useModel('tintuc.chude');
	const { danhSach, setPage } = useModel('tintuc.tintuc');
	const { postModel, danhSach: danhSachXemSau, deleteModel } = useModel('tienich.xemsau');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	const { empty } = props;
	const url = 'tin-tuc';

	const handleXemSau = (rec: any) => {
		const data = {
			userSsoId: recSinhVien?.ssoId,
			sourceId: String(rec?._id),
			loaiThongTin: ELoaiThongTinXemSau.TIN_TUC,
			thongTin: rec,
			idChuDe: null,
		};
		postModel(data, props.getData, undefined, 'Lưu thành công')
			.then()
			.catch((err) => console.log(err));
	};

	const handleBoXemSau = (rec: any) => {
		deleteModel(rec?._id, props.getData)
			.then()
			.catch((err) => console.log(err));
	};

	const changeMenu = (k: string) => {
		setChuDe(danhSachChuDe.find((item) => item._id === k));
		window.location.hash = '#' + k;
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setPage(1);
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
									query: { id: danhSach?.[0]?._id },
								});
							}}
							first={true}
							style={{ minHeight: '450px' }}
						>
							<div
								style={{
									background: danhSach?.[0]?.urlAnhDaiDien
										? `url(${danhSach?.[0]?.urlAnhDaiDien}) center center/cover no-repeat`
										: `url(${anh}) center center/cover no-repeat`,
									width: '100%',
									height: '67%',
									minHeight: 220,
									backgroundSize: 'cover',
								}}
							/>
							<ContentLargeCard>
								<Tooltip title={danhSach?.[0]?.tieuDe}>
									{renderParagraph(danhSach?.[0]?.tieuDe, 2, {
										fontSize: 'calc(1em + 0.2vw)',
										fontWeight: 500,
										marginBottom: 5,
										color: 'black',
									})}
								</Tooltip>
								{renderParagraph(danhSach?.[0]?.moTa, 2, { color: '#364954', marginBottom: 5 })}

								<div
									style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8 }}
								>
									{danhSach?.[0]?.ngayDang && (
										<span className='thoi-gian'>
											{moment(danhSach?.[0]?.ngayDang).format('DD/MM/YYYY')} -{' '}
											<a
												type='link'
												onClick={(e) => {
													e.stopPropagation();
													changeMenu(danhSach?.[0]?.chuDe?._id);
												}}
											>
												{danhSach?.[0]?.chuDe?.name}
											</a>
										</span>
									)}
									{danhSachXemSau?.find((item) => item?.sourceId === danhSach?.[0]?._id)?._id ? (
										<ButtonExtend
											type='link'
											onClick={(event) => {
												event.stopPropagation();
												handleBoXemSau(danhSachXemSau?.find((item) => item?.sourceId === danhSach?.[0]?._id));
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
									key={tintuc?._id}
									onClick={() => {
										history.push({
											pathname: url + '/chi-tiet',
											query: { id: tintuc?._id },
										});
									}}
									style={{ height: '33.33%' }}
								>
									<Row gutter={[12, 0]}>
										<Col xs={8} style={{ height: '100%' }}>
											<div
												style={{
													background: tintuc?.urlAnhDaiDien
														? `url(${tintuc?.urlAnhDaiDien}) center center/ cover no-repeat`
														: `url(${anh}) center center/ cover no-repeat`,
													width: '100%',
													height: '100%',
													minHeight: 130,
													backgroundSize: 'cover',
												}}
											/>
										</Col>
										<Col xs={16}>
											<Tooltip title={tintuc?.tieuDe}>
												{renderParagraph(tintuc?.tieuDe, 2, {
													fontSize: 'calc(1em + 0.2vw)',
													fontWeight: 500,
													marginBottom: 6,
													color: 'black',
												})}
											</Tooltip>
											{renderParagraph(tintuc?.moTa, 2, { color: '#364954', marginBottom: 0 })}
											<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
												{tintuc.ngayDang && (
													<span className='thoi-gian'>
														{moment(tintuc.ngayDang).format('DD/MM/YYYY')} -{' '}
														<a
															type='link'
															onClick={(e) => {
																e.stopPropagation();
																changeMenu(tintuc?.chuDe?._id);
															}}
														>
															{tintuc?.chuDe?.name}
														</a>
													</span>
												)}
												{danhSachXemSau?.find((item) => item?.sourceId === tintuc?._id)?._id ? (
													<ButtonExtend
														type='link'
														onClick={(event) => {
															event.stopPropagation();
															handleBoXemSau(danhSachXemSau?.find((item) => item?.sourceId === tintuc?._id));
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
						<Col span={24} md={8} key={tintuc?._id}>
							<CardTinTuc
								style={{ height: '100%' }}
								onClick={() => {
									history.push({
										pathname: url + '/chi-tiet',
										query: { id: tintuc?._id },
									});
								}}
							>
								<Row gutter={12} style={{ height: '100%' }}>
									<Col xs={8}>
										<div
											style={{
												background: tintuc?.urlAnhDaiDien
													? `url(${tintuc?.urlAnhDaiDien}) center center/ cover no-repeat`
													: `url(${anh}) center center/ cover no-repeat`,
												width: '100%',
												height: '100%',
											}}
										/>
									</Col>
									<Col xs={16}>
										<Tooltip title={tintuc?.tieuDe}>
											{renderParagraph(tintuc?.tieuDe, 2, {
												fontSize: 'calc(1em + 0.2vw)',
												fontWeight: 500,
												marginBottom: 6,
												color: 'black',
											})}
										</Tooltip>

										<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
											{tintuc?.ngayDang && (
												<span className='thoi-gian'>
													{moment(tintuc?.ngayDang).format('DD/MM/YYYY')} -{' '}
													<a
														type='link'
														onClick={(e) => {
															e.stopPropagation();
															changeMenu(tintuc?.chuDe?._id);
														}}
													>
														{tintuc?.chuDe?.name}
													</a>
												</span>
											)}
											{danhSachXemSau?.find((item) => item?.sourceId === tintuc?._id)?._id ? (
												<ButtonExtend
													type='link'
													onClick={(event) => {
														event.stopPropagation();
														handleBoXemSau(danhSachXemSau?.find((item) => item?.sourceId === tintuc?._id));
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
