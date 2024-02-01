import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Spin, Select } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import CardHocPhan from '../components/CardHocPhan';

const TienTrinhThucTe = () => {
	const { loading, sinhVienGetTienTrinhThucTeModel } = useModel('daotao.chuongtrinhdaotao');
	// const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	// const [modalHocKy, setModalHocKy] = useState(false);
	const [danhSachHocKy, setDanhSachHocKy] = useState<LopHocPhan.IRecordSinhVienLopHP[][]>();
	// const [value, setValue] = useState(khoaNganhMe?.khoaNganhChinh.ma ?? '');

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
		<>
			{/* <div>
				<Select
					value={khoaNganhMe?.khoaNganhChinh.ma}
					style={{ width: 250 }}
					options={
						khoaNganhMe?.khoaNganhPhu
							? [
									{ value: khoaNganhMe?.khoaNganhChinh?.ma, label: khoaNganhMe?.khoaNganhChinh?.ten },
									{ value: khoaNganhMe?.khoaNganhPhu?.ma, label: khoaNganhMe?.khoaNganhPhu?.ten },
							  ]
							: [{ value: khoaNganhMe?.khoaNganhChinh?.ma, label: khoaNganhMe?.khoaNganhChinh?.ten }]
					}
					onChange={(val) => setValue(val.toString())}
				/>
			</div> */}

			<Spin spinning={loading}>
				{danhSachHocKy?.map((data, index) => (
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
				))}

				{/* <Modal
        title="Tích lũy học kỳ"
        visible={modalHocKy}
        onCancel={() => setModalHocKy(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Đóng"
        // bodyStyle={{ padding: 0 }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Học kỳ">
            {convertHocKy(recordHocKy?.hocKy ?? '')}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số tín chỉ đã đăng ký">
            {recordHocKy?.diemTichLuyKy?.tong_so_tin_chi_da_dang_ky ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số tín chỉ trong học kỳ">
            {recordHocKy?.diemTichLuyKy?.tong_so_tin_chi_trong_hoc_ky ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số tín chỉ tích lũy sau học kỳ">
            {recordHocKy?.diemTichLuyKy?.tong_so_tin_chi_tich_luy_sau_hoc_ky ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Số tín chỉ trượt trong học kỳ">
            {recordHocKy?.diemTichLuyKy?.so_tin_chi_truot_trong_hoc_ky ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng số tín chỉ trượt">
            {recordHocKy?.diemTichLuyKy?.tong_so_tin_chi_truot ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm TB học kỳ (hệ 4)">
            {recordHocKy?.diemTichLuyKy?.diem_tb_chung_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm CPA (hệ 4)">
            {recordHocKy?.diemTichLuyKy?.diem_tb_tich_luy_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
          </Descriptions.Item>
        </Descriptions>
      </Modal> */}
			</Spin>
		</>
	);
};

export default TienTrinhThucTe;
