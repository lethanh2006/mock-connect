import DiemThiHocKy from '@/pages/KhaoThi/KyThi/DiemThiHocKy';
import { ETrangThaiThi } from '@/services/HocTap/constant';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Empty, Space, Spin, Tabs, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

const DetailKetQuaHocTap = (props: {
	lopHocPhanId?: string;
	diemHpSvHk?: LopHocPhan.IDiemHpSvHk;
	toDanhGiaGiangVien?: () => void;
}) => {
	const intl = useIntl();
	const { lopHocPhanId, diemHpSvHk, toDanhGiaGiangVien } = props;
	const { danhSach: danhSachDauDiem, getModel } = useModel('daotao.daudiemhocphan');
	const { sinhVienGetDiemLHPModel, record: recSinhVienLhp, loading } = useModel('lophocphan.sinhvienlophocphan');
	const [hienThiDiemThi, setHienThiDiemThi] = useState<boolean>(false);
	const recDiem = diemHpSvHk ?? recSinhVienLhp?.diemHpSvHk;

	const hasTrongSoThi =
		!!recDiem?.trongSoThi1 ||
		!!recDiem?.trongSoThi2 ||
		!!recDiem?.trongSoThi3 ||
		!!recDiem?.trongSoThi4 ||
		!!recDiem?.trongSoThi5;

	const trongSoThanhPhan = _.range(1, 11).reduce((pre, cur) => {
		const trongSo = +(recDiem?.[`trongSo${cur}` as keyof LopHocPhan.IDiemHpSvHk] ?? 0);
		return pre + trongSo;
	}, 0);
	const hasTrongSo = !!trongSoThanhPhan;
	// Đầu điểm học phần theo đề cương
	const dauDiemCoTrongSo = danhSachDauDiem.filter(
		(item) =>
			!hasTrongSo || // Đề cương học phần học kỳ này ko có trọng số
			!!recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk],
	);

	useEffect(() => {
		setHienThiDiemThi(false);
	}, [recDiem?._id]);

	useEffect(() => {
		if (!danhSachDauDiem.length) getModel();
	}, []);

	useEffect(() => {
		if (lopHocPhanId && !diemHpSvHk) sinhVienGetDiemLHPModel(lopHocPhanId);
	}, [lopHocPhanId]);

	const renderDiem = (diem?: any) => (
		<div>
			<b>{diem ?? '--'}</b>
		</div>
	);

	const renderDiemCloThanhPhan = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length) return null;
		const gClos = _.groupBy(
			_.sortBy(recDiem.danhSachDiemChuanDauRaThanhPhan, (i) => i.maClo),
			(i) => i.field,
		);

		return (
			<>
				<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.danhgia' })}</Divider>
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item
								label={`${intl.formatMessage({ id: 'lophocphan.id.ketqua.baodanhgia' })} ${index + 1}`}
								key={field}
							>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			</>
		);
	};

	const renderDiemCloKthp = () => {
		if (!recDiem?.danhSachDiemChuanDauRaThi?.length) return null;
		const diemThiClos = _.sortBy(
			recDiem.danhSachDiemChuanDauRaThi.filter((i) => i.field.includes('diemThi')),
			(i) => i.maClo,
		);
		const gClosThiLan1 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi1')),
			(i) => i.field,
		);
		const gClosThiLan2 = _.groupBy(
			diemThiClos.filter((i) => i.field.includes('diemThi2')),
			(i) => i.field,
		);

		const render = (gClos: _.Dictionary<LopHocPhan.TChiTietDiemCdr[]>) => {
			return (
				<Descriptions bordered>
					{Object.keys(gClos).map((field, index) => {
						const cdrs = gClos[field];
						return (
							<Descriptions.Item
								label={`${intl.formatMessage({ id: 'lophocphan.id.ketqua.baidanhgia' })} ${index + 1}`}
								key={field}
							>
								{cdrs.map((cdr) => (
									<div key={cdr.maClo}>
										{cdr.maClo}: <b>{cdr.diem ?? '--'}</b> <small>({cdr.trongSo}%)</small>
									</div>
								))}
							</Descriptions.Item>
						);
					})}
				</Descriptions>
			);
		};

		// TODO: Hiển thị điểm chuẩn đầu ra thi cuối

		return (
			<>
				{!!Object.keys(gClosThiLan1).length && (
					<>
						<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.hthp' })}</Divider>
						{render(gClosThiLan1)}
					</>
				)}

				{!!Object.keys(gClosThiLan2).length && (
					<>
						<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.hthp2' })}</Divider>
						{render(gClosThiLan2)}
					</>
				)}
			</>
		);
	};

	const renderTrungBinhClo = () => {
		if (!recDiem?.danhSachDiemMucTieuDauRa?.length) return null;
		const trungBinhClos = _.sortBy(recDiem.danhSachDiemMucTieuDauRa, (i) => i.maClo);

		return (
			<>
				<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.diemtb' })}</Divider>
				<Descriptions bordered>
					{trungBinhClos.map((cdr) => (
						<Descriptions.Item label={cdr.maClo} key={cdr.maClo}>
							<Space wrap>
								<span className={cdr.pass ? 'text-success' : 'text-error'}>{renderDiem(cdr.diem)}</span>
								{cdr.diemToiThieu ? <small>/{cdr.diemToiThieu}</small> : null}
							</Space>
						</Descriptions.Item>
					))}
				</Descriptions>
			</>
		);
	};

	return (
		<Spin spinning={loading}>
			{recDiem ? (
				recDiem.daDanhGiaGiangVien !== false ? (
					<Tabs type='card' defaultActiveKey='1'>
						<Tabs.TabPane
							tab={
								<>
									{intl.formatMessage({ id: 'lophocphan.id.ketqua.diemGPA' })}
									{recDiem?.diemChu === ELoaiDiemChu.F ? (
										<Tag color={'red'} style={{ marginLeft: 8 }}>
											{intl.formatMessage({ id: 'lophocphan.id.ketqua.khongdat' })}
										</Tag>
									) : recDiem?.dat === true ? (
										<Tag color={'green'} style={{ marginLeft: 8 }}>
											{intl.formatMessage({ id: 'lophocphan.id.ketqua.dat' })}
										</Tag>
									) : null}
								</>
							}
							key='1'
						>
							<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.diemtp' })}</Divider>
							{hasTrongSo ? (
								<Descriptions bordered>
									{dauDiemCoTrongSo?.map((item) => (
										<Descriptions.Item
											label={`${item.ten}${
												hasTrongSo ? ` (${recDiem?.[`trongSo${item.field}` as keyof LopHocPhan.IDiemHpSvHk]}%)` : ''
											}`}
											key={item._id}
										>
											{renderDiem(recDiem?.[`diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk])}
										</Descriptions.Item>
									))}
									<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.dkthi' })}>
										<span style={{ color: recDiem?.trangThaiThi === ETrangThaiThi.CAM_THI ? 'red' : undefined }}>
											{recDiem?.trangThaiThi ?? '--'}
										</span>
									</Descriptions.Item>
								</Descriptions>
							) : (
								<Empty
									image={Empty.PRESENTED_IMAGE_SIMPLE}
									description={intl.formatMessage({ id: 'lophocphan.id.ketqua.empty' })}
								/>
							)}

							<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.diemthi' })}</Divider>
							<Descriptions bordered>
								{!hasTrongSoThi ? (
									<>
										<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.thi1' })}>
											{renderDiem(recDiem?.diemThi1)}
										</Descriptions.Item>
										<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.thi2' })}>
											{renderDiem(recDiem?.diemThi2)}
										</Descriptions.Item>
									</>
								) : (
									_.range(1, 6).map((i) => {
										const trongSoThi = recDiem?.[`trongSoThi${i}` as keyof LopHocPhan.IDiemHpSvHk] as number;
										const suffix = i > 1 ? i : '';
										const diemThi1 = recDiem?.[`diemThi1${suffix}` as keyof LopHocPhan.IDiemHpSvHk];
										const diemThi2 = recDiem?.[`diemThi2${suffix}` as keyof LopHocPhan.IDiemHpSvHk];

										if (!!trongSoThi) {
											return (
												<>
													<Descriptions.Item
														label={`${intl.formatMessage({ id: 'lophocphan.id.ketqua.trongso' })} ${i}`}
													>
														<div>{trongSoThi}%</div>
													</Descriptions.Item>
													<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.thi1' })}>
														{renderDiem(diemThi1)}
													</Descriptions.Item>
													<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.thi2' })}>
														{renderDiem(diemThi2)}
													</Descriptions.Item>
												</>
											);
										}
										return null;
									})
								)}

								{/* <Descriptions.Item
							label={`${intl.formatMessage({ id: 'lophocphan.id.ketqua.diemcuoi' })} (${100 - trongSoThanhPhan}%)`}
						>
							{recDiem?.trangThaiDuThi && recDiem.trangThaiDuThi !== ETrangThaiDuThi.OK ? (
								<span title={trangThaiDuThi[recDiem.trangThaiDuThi]}>{recDiem?.trangThaiDuThi}</span>
							) : (
								renderDiem(recDiem?.diemKthp)
							)}
						</Descriptions.Item> */}
							</Descriptions>

							{recDiem && (
								<div style={{ marginTop: 8 }}>
									<Space wrap>
										{!hienThiDiemThi && (
											<a
												onClick={(e) => {
													e.preventDefault();
													setHienThiDiemThi(true);
												}}
											>
												{intl.formatMessage({ id: 'lophocphan.id.ketqua.chitiet' })}
											</a>
										)}
										<a
											onClick={() => {
												history.push('/khai-bao-quy-trinh/dang-ky');
											}}
										>
											{intl.formatMessage({ id: 'lophocphan.id.ketqua.phuckhao' })}
										</a>
									</Space>

									{hienThiDiemThi && (
										<>
											<DiemThiHocKy maHocKy={recDiem?.maHocKy} maHocPhan={recDiem?.maHocPhan} />
										</>
									)}
								</div>
							)}

							<Divider>{intl.formatMessage({ id: 'lophocphan.id.ketqua.diemtongket' })}</Divider>
							<Descriptions bordered>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.diem10' })}>
									{renderDiem(recDiem?.diemTongKet)}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.diem4' })}>
									{renderDiem(recDiem?.diemThang4)}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.id.ketqua.diemchu' })}>
									{recDiem?.diemChu ? <Tag color={ColorDiemChu[recDiem.diemChu]}>{recDiem.diemChu}</Tag> : '--'}{' '}
									{recDiem?.isCongNhanQuyDoiDiem && (
										<Tooltip title={intl.formatMessage({ id: 'lophocphan.id.ketqua.diemquydoi' })}>
											(R
											{recDiem.coTichLuyQuyDoi
												? ` - ${intl.formatMessage({ id: 'lophocphan.id.ketqua.tichluy' })}`
												: ''}
											)
										</Tooltip>
									)}
								</Descriptions.Item>
							</Descriptions>
						</Tabs.TabPane>

						{recDiem?.danhSachDiemChuanDauRaThanhPhan?.length ||
						recDiem?.danhSachDiemChuanDauRaThi?.length ||
						recDiem?.danhSachDiemMucTieuDauRa?.length ? (
							<Tabs.TabPane
								tab={
									<>
										{intl.formatMessage({ id: 'lophocphan.id.ketqua.clo' })}
										{!!recDiem.danhSachDiemMucTieuDauRa?.length && (
											<Tag
												color={recDiem?.danhSachDiemMucTieuDauRa?.every((i) => i.pass) ? 'green' : 'red'}
												style={{ marginLeft: 8 }}
											>
												{recDiem?.danhSachDiemMucTieuDauRa?.filter((i) => i.pass)?.length}/
												{recDiem.danhSachDiemMucTieuDauRa?.length}
											</Tag>
										)}
									</>
								}
								key='2'
							>
								{!!recDiem?.danhSachDiemChuanDauRaThanhPhan?.length && renderDiemCloThanhPhan()}

								{!!recDiem?.danhSachDiemChuanDauRaThi?.length && renderDiemCloKthp()}

								{!!recDiem?.danhSachDiemMucTieuDauRa?.length && renderTrungBinhClo()}
							</Tabs.TabPane>
						) : null}
					</Tabs>
				) : (
					<Empty
						description={
							<>
								{intl.formatMessage({ id: 'lophocphan.id.ketqua.noti' })}
								{toDanhGiaGiangVien ? (
									<div style={{ marginTop: 12 }}>
										<Button type='link' onClick={() => toDanhGiaGiangVien()}>
											{intl.formatMessage({ id: 'lophocphan.id.ketqua.danhgiangay' })} <ArrowRightOutlined />
										</Button>
									</div>
								) : null}
							</>
						}
						style={{ margin: '18px 0' }}
					/>
				)
			) : (
				<Empty
					description={intl.formatMessage({ id: 'lophocphan.id.ketqua.emptyhoctap' })}
					style={{ margin: '18px 0' }}
				/>
			)}
		</Spin>
	);
};

export default DetailKetQuaHocTap;
