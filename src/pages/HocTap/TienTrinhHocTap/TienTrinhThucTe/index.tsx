import { Descriptions, Modal, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import CardHocPhan from '../components/CardHocPhan';
import { useModel } from 'umi';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';

const TienTrinhThucTe = () => {
  const { loading, sinhVienGetTienTrinhThucTeModel, record, setRecord } = useModel(
    'daotao.chuongtrinhdaotao',
  );
  const [modalHocKy, setModalHocKy] = useState(false);
  const [danhSachHocKy, setDanhSachHocKy] = useState<
    Record<string, ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>
  >({});

  const fetch = async () => {
    await sinhVienGetTienTrinhThucTeModel().then((data) => {
      const gHocKy = _.groupBy(data, (item) => item.soThuTuKy);
      setDanhSachHocKy(gHocKy);
    });
  };

  const convertHocKy = (hk: string) => {
    if (hk.length !== 5) return '';
    const nam = +hk.slice(0, 4);
    return `Kỳ ${hk.slice(4)} năm học ${nam}-${nam + 1}`;
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Spin spinning={loading}>
      {Object.entries(danhSachHocKy)?.map(([hocKy, data]) => (
        <div className="row-hoc-ky" key={hocKy}>
          <div className="col-hoc-ky">
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
            <h4>Học kỳ {hocKy}</h4>
            <span className="tin-chi">({_.sumBy(data, (i) => i.soTinChi)} TC)</span>
            {/* </Tooltip> */}
          </div>
          <div className="col-chi-tiet">
            {data.map((ctk) => (
              <CardHocPhan chuongTrinhKhung={ctk} key={ctk._id} />
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
  );
};

export default TienTrinhThucTe;
