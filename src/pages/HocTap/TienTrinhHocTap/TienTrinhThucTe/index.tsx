import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from '../../KetQuaHocTap/components/ModalChiTietDiem';
import CardHocPhan from '../components/CardHocPhan';

const TienTrinhThucTe = () => {
	const { loading, sinhVienGetTienTrinhThucTeModel } = useModel('daotao.chuongtrinhdaotao');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const { record: sinhVienLhp, setRecord: setSinhVienLhp } = useModel('lophocphan.sinhvienlophocphan');
	const [danhSachHocKy, setDanhSachHocKy] = useState<LopHocPhan.IRecordSinhVienLopHP[][]>();
	const [visibleDiem, setVisibleDiem] = useState(false);

	const fetch = async () => {
		if (maKhoaNganh)
			sinhVienGetTienTrinhThucTeModel(maKhoaNganh).then((data) => {
				const gHocKy = Object.entries(_.groupBy(data, (item) => item.kyHoc?.ma));
				const dataHocKy = _.sortBy(gHocKy, ([ma, ds]) => ma);
				setDanhSachHocKy(dataHocKy.map(([ma, ds]) => ds));
			});
	};

	useEffect(() => {
		fetch();
	}, [maKhoaNganh]);

	return (
		<>
			<Spin spinning={loading}>
				{danhSachHocKy?.length ? (
					danhSachHocKy.map((data, index) => (
						// eslint-disable-next-line react/no-array-index-key
						<div className='row-hoc-ky' key={index}>
							<div className='col-hoc-ky'>
								{/* <Tooltip
                title={
                  <>
                    Tổng số tín chỉ cần học: {hocKy.tongSoTinCanHoc}
                    <br />
                    Số tín chỉ tự chọn: {hocKy.so_tin_chi_tu_chon_phai_hoc}
                    <br />
                    Số tín chỉ đã đạt: {hocKy.tongSoTinDaDat}
                  </>
                }
              > */}
								<h4>{data[0].kyHoc?.ten}</h4>
								<span className='tin-chi'>({_.sumBy(data, (i) => i.soTinChi ?? 0)} tín chỉ)</span>
								{/* </Tooltip> */}
							</div>
							<div className='col-chi-tiet'>
								{data.map((sv) => (
									<CardHocPhan
										key={sv._id}
										hocPhan={sv.hocPhan}
										onClick={() => {
											setSinhVienLhp(sv);
											setVisibleDiem(true);
										}}
										listDiem={sv.diemHpSvHk ? [sv.diemHpSvHk] : []}
									/>
								))}
							</div>
						</div>
					))
				) : (
					<Empty description='Không có dữ liệu' style={{ marginTop: 50, marginBottom: 32 }} />
				)}
			</Spin>

			<ModalChiTietDiem
				setVisible={setVisibleDiem}
				visible={visibleDiem}
				hocPhan={sinhVienLhp?.hocPhan}
				listDiem={sinhVienLhp?.diemHpSvHk ? [sinhVienLhp.diemHpSvHk] : []}
				lopHocPhanId={sinhVienLhp?.lopHocPhanId}
				maKhoaNganh={maKhoaNganh}
			/>
		</>
	);
};

export default TienTrinhThucTe;
