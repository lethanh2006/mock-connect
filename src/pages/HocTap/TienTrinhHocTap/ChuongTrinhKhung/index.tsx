import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { Collapse, Descriptions, Divider, Spin, Typography } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';
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

const TienTrinhChuongTrinhKhung = () => {
	const {
		loading,
		sinhVienGetTienTrinhKhungModel,
		record: recChuongTrinh,
		setRecord: setChuongTrinh,
	} = useModel('daotao.chuongtrinhdaotao');
	const { khoaNganhMe, maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh } = useModel('sinhvien.tientrinhtotnghiep');
	const [danhSachHocKy, setDanhSachHocKy] = useState<TChuongTrinhHocKy[]>([]);
	const [mapColorKhoiKienThuc, setMapColorKhoiKienThuc] = useState<Record<string, string>>({});
	const [visibleDiem, setVisibleDiem] = useState(false);
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);

	const getColorMap = (listKhoiHpCt: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]) => {
		const listKhoi = _.uniq(listKhoiHpCt.map((item) => item.maKhoiKienThuc));
		const temp: Record<string, string> = {};
		listKhoi.forEach(
			(khoi) =>
				(temp[khoi] = `rgb(${Math.random() * 190 + 15}, ${Math.random() * 190 + 15}, ${Math.random() * 190 + 15})`),
		);
		setMapColorKhoiKienThuc(temp);
	};

	const fetch = async () => {
		await sinhVienGetTienTrinhKhungModel(maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma ? true : false).then((data) => {
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

	const renderHocPhan = (data: TChuongTrinhHocKy) => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
				gap: '16px',
			}}
		>
			{data.khoiHocPhan.map((ctk) =>
				ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<CardHocPhanV2
						key={ctk._id}
						hocPhan={ctk.hocPhan}
						colorKhoiKienThuc={mapColorKhoiKienThuc?.[ctk.maKhoiKienThuc]}
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
						colorKhoiKienThuc={mapColorKhoiKienThuc?.[ctk.maKhoiKienThuc]}
						onClickHocPhan={() => setVisibleDiem(true)}
					/>
				),
			)}
		</div>
	);

	return (
		<div style={{ backgroundColor: 'transparent', minHeight: '100vh' }}>
			{recTienTrinh?.ctdtKeHoach?._id && (
				<>
					<Descriptions>
						<Descriptions.Item label='Chương trình/Kế hoạch' span={2}>
							<Link
								to=''
								onClick={(e) => {
									e.preventDefault();
									setVisibleChuongTrinh(true);
								}}
							>
								{recTienTrinh?.ctdtKeHoach?.ten}
							</Link>
						</Descriptions.Item>
						<Descriptions.Item label='Loại chương trình'>
							{recTienTrinh?.ctdtKeHoach?.loai && LoaiChuongTrinhDaoTao[recTienTrinh?.ctdtKeHoach?.loai]}
						</Descriptions.Item>
					</Descriptions>
				</>
			)}

			<Spin spinning={loading}>
				{danhSachHocKy?.map((data, index) => (
					<React.Fragment key={data.soThuTuKy}>
						<div style={{ marginBottom: '32px' }}>
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
										Học kỳ {data.soThuTuKy}
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
										{data.soTinChiPhaiHoc} tín chỉ
									</div>
								</div>
							</div>

							{/* Grid các môn học */}
							{renderHocPhan(data)}
						</div>

						{data.chuyenNganhList?.length ? (
							<div style={{ marginBottom: '32px' }}>
								<Collapse bordered={false}>
									{data.chuyenNganhList.map((chuyenNganh) => (
										<Collapse.Panel
											key={chuyenNganh.khoiHocPhan[0]._id}
											header={`Chuyên ngành: ${
												chuyenNganh.khoiHocPhan[0].chuyenNganh?.ten ?? chuyenNganh.khoiHocPhan[0].maChuyenNganh
											}`}
										>
											{renderHocPhan(chuyenNganh)}
										</Collapse.Panel>
									))}
								</Collapse>
							</div>
						) : null}

						{/* Divider giữa các học kỳ */}
						{index < danhSachHocKy.length - 1 && <Divider style={{ margin: '32px 0', borderColor: '#e8e8e8' }} />}
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
