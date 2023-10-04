import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT } from '@/services/DaoTao/constant';
import { Col, Collapse, Row, Spin, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from '../components/CardHocPhan';
import CardKhoiHocPhan from '../components/CardKhoiHocPhan';
import flag from '../components/flag.svg';

type TChuongTrinhHocKy = {
	khoiHocPhan: ChuongTrinhDaoTao.IKhoiHocPhanCTDT[];
	soThuTuKy?: number;
	soTinChiPhaiHoc?: number;
	soTinChiTuChon?: number;
	soTinChiDaDat?: number;
	chuyenNganhList?: TChuongTrinhHocKy[];
};

const TienTrinhChuongTrinhKhung = () => {
	const { loading, sinhVienGetTienTrinhKhungModel } = useModel('daotao.chuongtrinhdaotao');
	const [count, setCount] = useState(0);
	const [tongTinChi, setTongTinChi] = useState(0);
	const [danhSachHocKy, setDanhSachHocKy] = useState<TChuongTrinhHocKy[]>([]);

	const fetch = async () => {
		await sinhVienGetTienTrinhKhungModel().then((data) => {
			// Các mã chuyên ngành (nếu có)
			const uniqchuyenNganh = _.uniq(data?.filter((item) => !!item.maChuyenNganh).map((item) => item.maChuyenNganh));
			// Học phần ko có chuyên ngành hoặc thuộc chuyên ngành đầu tiên
			const da = data?.filter((item) => !item.maChuyenNganh || item.maChuyenNganh === uniqchuyenNganh?.[0]);
			setTongTinChi(
				_.sumBy(da, (item) =>
					item.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC
						? (item.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy && item.hocPhan?.soTinChi) || 0
						: (item.isTinhSoTinChiTichLuy && item.soTinChiTuChonPhaiHoc) || 0,
				),
			);
			// TODO: Xem xét khối tự chọn cùng nhóm học phần, hoặc khác chuyên ngành
			setCount(
				_.sumBy(
					data?.filter((item) => item.lichSuDiem?.length),
					(item) => (item.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy && item.hocPhan?.soTinChi) || 0,
				),
			);

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
		});
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<>
			{/* <Row>
				<Col>Số tín chỉ đã tích lũy:</Col>
			</Row>
			<Row align='middle'>
				<Col span={20} md={22}>
					<div className='progress-wrapper'>
						<div className='proress-bar' style={{ width: `${(count * 100) / tongTinChi}%` }}>
							<div className='progress-label'>{count} tín</div>
						</div>
					</div>
				</Col>
				<Col span={4} md={2}>
					<div className='progress-end'>
						<img src={flag} />
						<br />
						{tongTinChi} tín chỉ
					</div>
				</Col>
			</Row> */}

			<Spin spinning={loading}>
				{danhSachHocKy?.map((data) => (
					<React.Fragment key={data.soThuTuKy}>
						<div className='row-hoc-ky'>
							<div className='col-hoc-ky'>
								<Tooltip
									title={
										<>
											Tổng số tín chỉ cần học: {data.soTinChiPhaiHoc}
											<br />
											Số tín chỉ tự chọn: {data.soTinChiTuChon}
											<br />
											Số tín chỉ đã đạt: {data.soTinChiDaDat}
										</>
									}
								>
									<h4>Học kỳ {data.soThuTuKy}</h4>
									<span className='tin-chi'>({data.soTinChiPhaiHoc} TC)</span>
								</Tooltip>
							</div>
							<div className='col-chi-tiet'>
								{data.khoiHocPhan.map((ctk) =>
									ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
										<CardHocPhan chuongTrinhKhung={ctk} key={ctk._id} />
									) : (
										<CardKhoiHocPhan khoi={ctk} key={ctk._id} />
									),
								)}
							</div>
						</div>

						{data.chuyenNganhList?.length ? (
							<Collapse bordered={false} style={{ marginTop: 8, marginBottom: 8 }}>
								{data.chuyenNganhList.map((chuyenNganh) => (
									<Collapse.Panel
										key={chuyenNganh.khoiHocPhan[0]._id}
										header={`Chuyên ngành: ${
											chuyenNganh.khoiHocPhan[0].chuyenNganh?.ten ?? chuyenNganh.khoiHocPhan[0].maChuyenNganh
										}`}
									>
										<div className='row-hoc-ky'>
											<div className='col-chi-tiet'>
												{chuyenNganh.khoiHocPhan.map((ctk) =>
													ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
														<CardHocPhan chuongTrinhKhung={ctk} key={ctk._id} />
													) : (
														<CardKhoiHocPhan khoi={ctk} key={ctk._id} />
													),
												)}
											</div>
										</div>
									</Collapse.Panel>
								))}
							</Collapse>
						) : null}
					</React.Fragment>
				))}
			</Spin>
		</>
	);
};

export default TienTrinhChuongTrinhKhung;
