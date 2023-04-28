import TableBaseStatic from '@/components/OldTable/Table';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { convertNumberScoreToAlphabet } from '@/utils/utils';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ChonHocKyKetQuaHocTap from './ChonHocKyKetQuaHocTap';
import { type IColumn } from '@/components/Table/typing';

const DiemThanhPhanGV = (props: { sinhVien?: Login.Profile }) => {
  const {
    danhSachDiemThanhPhanTheoKy,
    loading,
    setRecordDiemTongKet,
    danhSachDiemTongKet,
    giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel,
  } = useModel('hoctap.loptinchi');
  const { record } = useModel('HocKy');
  const { sinhVien } = props;

  useEffect(() => {
    giangVienGetDiemThanhPhanSinhVienByIdSinhVienIdHocKyModel(sinhVien?.id ?? -1, record?.id);
    if (record?.id) {
      setRecordDiemTongKet(
        danhSachDiemTongKet?.find((item) => item?.ky_nam_hoc_id?.[0] === record?.id),
      );
    }
  }, [record?.id, sinhVien?.id]);

  const columns: IColumn<LopTinChi.DiemThanhPhan>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên học phần',
      dataIndex: 'ten_hoc_phan',
      width: 140,
    },
    {
      title: 'Lớp tín chỉ',
      dataIndex: 'ma_lop',
      width: 140,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'so_tin_chi',
      align: 'center',
      width: 60,
    },
    // {
    //   title: 'Chuyên cần',
    //   dataIndex: 'diem_attendance',
    //   align: 'center',
    //   width: 80,
    // },
    // {
    //   title: 'Bài tập',
    //   dataIndex: 'diem_bai_tap',
    //   align: 'center',
    //   width: 80,
    // },
    // {
    //   title: 'Thực hành',
    //   dataIndex: 'diem_thi_nghiem',
    //   align: 'center',
    //   width: 80,
    // },
    // {
    //   title: 'Kiểm tra',
    //   dataIndex: 'diem_trung_binh_kiem_tra_tren_lop',
    //   align: 'center',
    //   width: 80,
    // },
    {
      title: 'Tổng kết (hệ 10)',
      dataIndex: 'diem_tong_ket',
      align: 'center',
      render: (val) => <b>{val}</b>,
      width: 80,
    },
    {
      title: 'Tổng kết (hệ 4)',
      dataIndex: 'diem_tong_ket_thang_4',
      align: 'center',
      render: (val) => <b>{val}</b>,
      width: 80,
    },
    {
      title: 'Tổng kết (dạng chữ)',
      dataIndex: 'diem_tong_ket_dang_chu',
      align: 'center',
      render: (val, recordDiem) => (
        <b>{val ? val : convertNumberScoreToAlphabet(recordDiem?.diem_tong_ket ?? '')[0]}</b>
      ),
      width: 80,
    },
  ];

  return (
    <>
      <ChonHocKyKetQuaHocTap isGiangVien sinhVienId={sinhVien?.id} />

      <TableBaseStatic
        otherProps={{
          loading: loading,
          scroll: { x: 600 },
          size: 'small',
        }}
        data={danhSachDiemThanhPhanTheoKy?.map((item, index) => ({ ...item, index: index + 1 }))}
        columns={columns}
      />
    </>
  );
};

export default DiemThanhPhanGV;
