// import LineChart from '@/components/Chart/Line';
// import { Spin } from 'antd';
import { useEffect } from 'react';
// import { useModel } from 'umi';

const KetQuaHocTapSinhVien = (props: { sinhVien?: Login.Profile }) => {
  const { sinhVien } = props;
  // const {
  //   giangVienGetDiemTongKetSinhVienByIdSinhVienModel,
  //   danhSachDiemTongKet,
  //   setDanhSachDiemTongKet,
  //   loading,
  // } = useModel('hoctap.loptinchi');

  useEffect(() => {
    // giangVienGetDiemTongKetSinhVienByIdSinhVienModel(sinhVien?.id ?? -1);
    // return () => {
    //   setDanhSachDiemTongKet([]);
    // };
  }, [sinhVien?.id]);

  return (
    <>
      {/* <LineChart
        xLabel="Kỳ"
        yLabel="GPA"
        height={200}
        data={danhSachDiemTongKet?.map((item) => ({
          x: `Kỳ ${item?.ky_hoc?.ten_ky_nam_hoc} (${item?.ky_hoc?.nam_hoc_id?.[1]})`,
          y: item?.diem_tb_tich_luy_hoc_ky_thang_4,
        }))}
      />
      <DiemThanhPhanGV sinhVien={sinhVien} /> */}
      Kết quả học tập
    </>
  );
};

export default KetQuaHocTapSinhVien;
