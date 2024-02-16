import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from '../components/CardHocPhan';

const TienTrinhThucTe = () => {
	const { loading, sinhVienGetTienTrinhThucTeModel } = useModel('daotao.chuongtrinhdaotao');
	const [danhSachHocKy, setDanhSachHocKy] = useState<LopHocPhan.IRecordSinhVienLopHP[][]>();

	const fetch = async () => {
		await sinhVienGetTienTrinhThucTeModel().then((data) => {
			const gHocKy = Object.entries(_.groupBy(data, (item) => item.kyHoc?.ma));
			const dataHocKy = _.sortBy(gHocKy, ([ma, ds]) => ma);
			setDanhSachHocKy(dataHocKy.map(([ma, ds]) => ds));
		});
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
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
								<CardHocPhan sinhVienLopHocPhan={sv} key={sv._id} />
							))}
						</div>
					</div>
				))
			) : (
				<Empty description='Không có dữ liệu' style={{ marginTop: 50, marginBottom: 32 }} />
			)}
		</Spin>
	);
};

export default TienTrinhThucTe;
