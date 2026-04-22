import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { Collapse, Descriptions, Divider, Spin, Typography } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useAccess, useIntl, useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhanV2 from '../components/CardHocPhan';
import CardKhoiHocPhan from '../components/CardKhoiHocPhan';

const { Title } = Typography;

type TChuongTrinhHocKy = {
	khoiHocPhan: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	soThuTuKy?: number;
	soTinChiPhaiHoc?: number;
	soTinChiTuChon?: number;
	soTinChiDaDat?: number;
	chuyenNganhList?: TChuongTrinhHocKy[];
};

const TienTrinhChuongTrinhKhung = ({
	hienKhoi = true,
	hienTenLoai = true,
}: {
	hienKhoi?: boolean;
	hienTenLoai?: boolean;
}) => {
	const intl = useIntl();
	const {
		loading,
		sinhVienGetTienTrinhKhungModel,
		record: recChuongTrinh,
		setRecord: setChuongTrinh,
	} = useModel('daotao.chuongtrinhdaotao');
	const { khoaNganhMe, maKhoaNganh, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const [danhSachHocKy, setDanhSachHocKy] = useState<TChuongTrinhHocKy[]>([]);
	const [mapColorKhoiKienThuc, setMapColorKhoiKienThuc] = useState<Record<string, string>>({});
	const [visibleDiem, setVisibleDiem] = useState(false);
	const { cctFilter } = useAccess();
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);
	const isSongNganh = maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma;
	const chuyenNganhHienTai = isSongNganh ? recSinhVien?.chuyenNganh : recSinhVien?.chuyenNganh;

	const getColorMap = (listKhoiHpCt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const listKhoi = _.uniq(listKhoiHpCt.map((item) => item.maKhoiKienThuc)) as string[];
		const temp: Record<string, string> = {};
		listKhoi.forEach(
			(khoi) =>
				(temp[khoi] = `rgb(${Math.random() * 190 + 15}, ${Math.random() * 190 + 15}, ${Math.random() * 190 + 15})`),
		);
		setMapColorKhoiKienThuc(temp);
	};

	const fetch = async () => {
		await sinhVienGetTienTrinhKhungModel(isSongNganh).then((data) => {
			// Các mã chuyên ngành (nếu có)
			const uniqchuyenNganh = _.uniq(data?.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh));

			const gHocKy = _.groupBy(data, (item) => item.soThuTuKy);
			const dataHocKy: TChuongTrinhHocKy[] = Object.values(gHocKy).map((hk) => {
				// Học phần không phân chuyên ngành. Nếu chỉ có 1 chuyên ngành thì hiện hết ở khối chính
				const khoiHocPhan = hk.filter((item) => !item.maChuyenNganh || uniqchuyenNganh.length < 2);

				// Học phần ko có chuyên ngành hoặc thuộc chuyên ngành đầu tiên
				const da1 = hk.filter((item) => !item.maChuyenNganh || item.maChuyenNganh === uniqchuyenNganh?.[0]);
				const soTinChiPhaiHoc = _.sumBy(da1, (item) => item.hocPhan?.soTinChi ?? item.soTinChiTuChonPhaiHoc ?? 0);
				const soTinChiTuChon = _.sumBy(da1, (item) => item.soTinChiTuChonPhaiHoc || 0);

				const chuyenNganh = hk.filter((item) => !!item.maChuyenNganh && uniqchuyenNganh.length >= 2);
				const chuyenNganhList = Object.values(_.groupBy(chuyenNganh, (item) => item.maChuyenNganh)).map((item) => ({
					khoiHocPhan: item,
				}));

				return { khoiHocPhan, soTinChiPhaiHoc, soTinChiTuChon, chuyenNganhList, soThuTuKy: hk[0].soThuTuKy };
			});
			setDanhSachHocKy(dataHocKy);
			getColorMap(data);
		});
	};

	useEffect(() => {
		fetch();
	}, [maKhoaNganh]);

	const renderListHocPhan = (data: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
				gap: '12px',
			}}
		>
			{data.map((ctk) =>
				ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<CardHocPhanV2
						key={ctk._id}
						hocPhan={ctk.hocPhan}
						loaiHocPhan={ctk.loaiHocPhanCtdt}
						onClick={() => {
							setChuongTrinh(ctk);
							setVisibleDiem(true);
						}}
						trangThaiHoc={ctk.hoc}
						listDiem={ctk.lichSuDiem}
					/>
				) : (
					<CardKhoiHocPhan
						khoi={ctk}
						key={ctk._id}
						colorKhoiKienThuc={mapColorKhoiKienThuc?.[ctk.maKhoiKienThuc ?? '']}
						onClickHocPhan={() => setVisibleDiem(true)}
					/>
				),
			)}
		</div>
	);

	const renderChuyenNganh = (dataChuyenNganh: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const dataTuChon = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TU_CHON);
		const dataBatBuoc = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC);
		const dataTotNghiep = dataChuyenNganh.filter((item) => item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.TOT_NGHIEP);
		return (
			<>
				{dataBatBuoc?.length ? (
					<>
						{hienTenLoai && (
							<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hpbatbuoc' })}
							</div>
						)}
						{renderListHocPhan(dataBatBuoc)}
					</>
				) : null}
				{dataTuChon?.length ? (
					<>
						{hienTenLoai && (
							<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hptuchon' })}
							</div>
						)}
						{renderListHocPhan(dataTuChon)}
					</>
				) : null}
				{dataTotNghiep?.length ? (
					<>
						{hienTenLoai && (
							<div className='fw500' style={{ marginTop: 8, marginBottom: 8 }}>
								{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hptotnghiep' })}
							</div>
						)}
						{renderListHocPhan(dataTotNghiep)}
					</>
				) : null}
			</>
		);
	};

	const renderKhoi = (dataKhoi: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const groupKhoi = _.groupBy(dataKhoi, (item) => item.maKhoiKienThuc || 'undefined');
		return (
			<Collapse
				ghost
				defaultActiveKey={Object.keys(groupKhoi)}
				style={{ marginLeft: -16 }}
			>
				{Object.entries(groupKhoi).map(([maKhoi, dataHp]) => {
					const tenKhoi =
						dataHp[0]?.khoiKienThuc?.ten ||
						(maKhoi !== 'undefined' ? maKhoi : intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khongten' }));

					// Nhóm theo chuyên ngành bên trong khối (nếu có chuyên ngành)
					const groupChuyenNganh = _.groupBy(dataHp, (item) => item.maChuyenNganh || 'common');
					const hasMultipleMajors = Object.keys(groupChuyenNganh).filter((k) => k !== 'common').length > 0;

					return (
						<Collapse.Panel
							key={maKhoi}
							header={
								<>
									{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.khoi' })}: {tenKhoi.toLocaleUpperCase()}
								</>
							}
						>
							<div style={{ margin: '-16px 0px' }}>
								{/* Hiện môn chung/bắt buộc của khối trước */}
								{renderChuyenNganh(groupChuyenNganh.common || [])}
							</div>

							{/* Hiện chuyên ngành hẹp nồng bên trong khối */}
							{hasMultipleMajors && (
								<Collapse
									bordered={false}
									defaultActiveKey={[chuyenNganhHienTai?.ma ?? '']}
								>
									{Object.entries(groupChuyenNganh)
										.filter(([nganh]) => nganh !== 'common')
										.map(([nganh, dsHocPhan]) => (
											<Collapse.Panel
												key={nganh}
												header={
													<>
														{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}: {dsHocPhan?.[0].chuyenNganh?.ten || nganh} (
														{_.sumBy(dsHocPhan, (i) => i.hocPhan?.soTinChi || i.soTinChiTuChonPhaiHoc || 0)} tín)
													</>
												}
											>
												<div style={{ margin: '-16px 0px 8px 0px' }}>
													{renderChuyenNganh(dsHocPhan)}
												</div>
											</Collapse.Panel>
										))}
								</Collapse>
							)}
						</Collapse.Panel>
					);
				})}
			</Collapse>
		);
	};

	return (
		<div>
			{recTienTrinh?.ctdtKeHoach?._id && (
				<Descriptions
					style={{ marginBottom: 12 }}
					layout='vertical'
					column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
					className='highlight'
					colon={false}
				>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuongtrinh' })} span={2}>
						<Link
							to='#'
							onClick={(e) => {
								e.preventDefault();
								setVisibleChuongTrinh(true);
							}}
						>
							{recTienTrinh?.ctdtKeHoach?.ten}
						</Link>
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.loai' })}>
						{recTienTrinh?.ctdtKeHoach?.loai && LoaiChuongTrinhDaoTao[recTienTrinh?.ctdtKeHoach?.loai]}
					</Descriptions.Item>

					{!chuyenNganhHienTai && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}>
							{(chuyenNganhHienTai as any)?.ten ?? <i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuadk' })}</i>}
						</Descriptions.Item>
					)}
					<Descriptions.Item
						style={{ display: !cctFilter() ? 'none' : '' }}
						label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
					>
						<i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.dangcapnhat' })}</i>
					</Descriptions.Item>
					<Descriptions.Item
						style={{ display: !cctFilter() ? 'none' : '' }}
						label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.pathway' })}
					>
						<i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.dangcapnhat' })}</i>
					</Descriptions.Item>
				</Descriptions>
			)}

			<Spin spinning={loading}>
				{danhSachHocKy?.map((data, index) => (
					<React.Fragment key={data.soThuTuKy}>
						<div style={{ marginBottom: '16px' }}>
							{/* Header học kỳ */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginBottom: '16px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<Title level={5} style={{ margin: 0, color: '#262626' }}>
										{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.hocky' })} {data.soThuTuKy}
									</Title>
									<div
										style={{
											width: '8px',
											height: '8px',
											backgroundColor: '#ff4d4f',
											borderRadius: '50%',
										}}
									/>
									<div
										style={{
											color: 'red',
											padding: '2px',
											fontWeight: 500,
										}}
									>
										{data.soTinChiPhaiHoc} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.tinchi' })}
									</div>
								</div>
							</div>

							{/* Consolidated rendering based on hienKhoi and hienTenLoai props */}
							{(() => {
								const allSubjects = [
									...(data.khoiHocPhan || []),
									...(data.chuyenNganhList?.flatMap((cn) => cn.khoiHocPhan) || []),
								];
								return hienKhoi ? renderKhoi(allSubjects) : renderChuyenNganh(allSubjects);
							})()}
						</div>

						{/* Redundant specialized major loop removed as it's now nested within renderKhoi */}

						{/* Divider giữa các học kỳ */}
						{index < danhSachHocKy.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</Spin>

			<ModalChiTietDiem
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={recChuongTrinh?.hocPhan}
				listDiem={recChuongTrinh?.lichSuDiem ?? []}
				maKhoaNganh={maKhoaNganh}
				khoiChuongTrinh={recChuongTrinh}
				colorKhoiKienThuc={
					recChuongTrinh?.maKhoiKienThuc ? mapColorKhoiKienThuc[recChuongTrinh?.maKhoiKienThuc] : undefined
				}
				trangThaiHoc={recChuongTrinh?.hoc}
			/>

			<ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />
		</div>
	);
};

export default TienTrinhChuongTrinhKhung;
