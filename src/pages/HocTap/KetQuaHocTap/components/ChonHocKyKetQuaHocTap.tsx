import {
  giangVienGetDiemTongKetHienTaiSinhVien,
  sinhVienGetDiemTongKetHienTai,
} from '@/services/LopTinChi/ketquahoctap';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { Descriptions, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ChonHocKyKetQuaHocTap = (props: { isGiangVien?: boolean; sinhVienId?: number }) => {
  const {
    recordDiemTongKet,
    sinhVienGetDiemTongKetModel,
    giangVienGetDiemTongKetSinhVienByIdSinhVienModel,
  } = useModel('hoctap.loptinchi');
  const {
    getAllHocKySinhVienModel,
    giangVienGetAllHocKySinhVienByIdSinhVienModel,
    danhSach,
    record,
    setRecord,
  } = useModel('HocKy');
  const [diemTongKetGanNhat, setDiemTongKetGanNhat] = useState<
    LopTinChi.IKetQuaHienTai | undefined
  >();
  const { isGiangVien, sinhVienId } = props;

  useEffect(() => {
    setRecord(undefined);
  }, []);

  useEffect(() => {
    if (isGiangVien) {
      giangVienGetAllHocKySinhVienByIdSinhVienModel(sinhVienId ?? -1, false);
      giangVienGetDiemTongKetSinhVienByIdSinhVienModel(sinhVienId ?? -1);
      giangVienGetDiemTongKetHienTaiSinhVien(sinhVienId ?? -1)
        .then((response) => {
          setDiemTongKetGanNhat(response.data?.data);
        })
        .catch((error) => console.log(error));
    } else {
      getAllHocKySinhVienModel(false);
      sinhVienGetDiemTongKetModel();
      sinhVienGetDiemTongKetHienTai()
        .then((response) => {
          setDiemTongKetGanNhat(response.data?.data);
        })
        .catch((error) => console.log(error));
    }
  }, [isGiangVien, sinhVienId]);

  useEffect(() => {
    return () => {
      setRecord(undefined);
      setDiemTongKetGanNhat(undefined);
    };
  }, []);

  const onChangeHocKy = (value: number) => {
    const HocKy: HocKy.IRecord | undefined = danhSach.find((item) => item.id === value);
    setRecord(HocKy);
  };

  return (
    <Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}>
      <Descriptions.Item>
        {/* <b style={{ marginRight: 8, fontSize: 14 }}>Kỳ: </b> */}
        <Select
          placeholder="Hiển thị toàn bộ điểm của các kỳ học"
          allowClear
          onChange={onChangeHocKy}
          value={record?.id}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          {danhSach?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}
            </Select.Option>
          ))}
        </Select>
      </Descriptions.Item>

      {record !== undefined ? (
        <>
          {/* <Descriptions.Item>
            <b style={{ marginRight: 8 }}>Điểm tích lũy (hệ 4): </b>
            {recordDiemTongKet?.diem_tb_tich_luy_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
          </Descriptions.Item> */}
          <Descriptions.Item>
            <b style={{ marginRight: 8 }}>Điểm trung bình học kỳ (hệ 4): </b>
            {recordDiemTongKet?.diem_tb_chung_hoc_ky_thang_4 ?? 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item>
            <b style={{ marginRight: 8 }}>Số tín chỉ đạt: </b>
            {recordDiemTongKet &&
            recordDiemTongKet.tong_so_tin_chi_trong_hoc_ky &&
            recordDiemTongKet.so_tin_chi_truot_trong_hoc_ky >= 0
              ? `${
                  recordDiemTongKet?.tong_so_tin_chi_trong_hoc_ky -
                  recordDiemTongKet?.so_tin_chi_truot_trong_hoc_ky
                }/${recordDiemTongKet?.tong_so_tin_chi_trong_hoc_ky}`
              : 'Chưa cập nhật'}
          </Descriptions.Item>
        </>
      ) : (
        <>
          <Descriptions.Item>
            <b style={{ marginRight: 8 }}>Điểm trung bình tích lũy (hệ 4): </b>
            {diemTongKetGanNhat?.diem_tich_luy_thang_4
              ? Math.round(diemTongKetGanNhat?.diem_tich_luy_thang_4 * 100) / 100
              : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item>
            <b style={{ marginRight: 8 }}>Số tín chỉ tích lũy (tính đến hiện tại): </b>
            {diemTongKetGanNhat?.tong_so_tin_chi_tich_luy ?? 'Chưa cập nhật'}
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};

export default ChonHocKyKetQuaHocTap;
