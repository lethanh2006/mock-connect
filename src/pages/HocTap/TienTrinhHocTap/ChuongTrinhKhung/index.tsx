import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ELoaiHocPhanCTDT, LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { Collapse, Descriptions, Spin, Tooltip } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhan from '../components/CardHocPhan';
import CardKhoiHocPhan from '../components/CardKhoiHocPhan';

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
		<div className='col-chi-tiet'>
			{data.khoiHocPhan.map((ctk) =>
				ctk.loaiHocPhanCtdt === ELoaiHocPhanCTDT.BAT_BUOC ? (
					<CardHocPhan
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
		<>
			{recTienTrinh?.ctdtKeHoach?._id && (
				<>
					<Descriptions>
						<Descriptions.Item label='Chương trình đào tạo' span={2}>
							{recTienTrinh?.ctdtKeHoach?.ten}
						</Descriptions.Item>
						<Descriptions.Item label='Loại chương trình'>
							{recTienTrinh?.ctdtKeHoach?.loai && LoaiChuongTrinhDaoTao[recTienTrinh?.ctdtKeHoach?.loai]}
						</Descriptions.Item>
					</Descriptions>
				</>
			)}

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
									<span className='tin-chi'>({data.soTinChiPhaiHoc} tín chỉ)</span>
								</Tooltip>
							</div>

							{renderHocPhan(data)}
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
										<div className='row-hoc-ky'>{renderHocPhan(chuyenNganh)}</div>
									</Collapse.Panel>
								))}
							</Collapse>
						) : null}
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
		</>
	);
};

export default TienTrinhChuongTrinhKhung;
