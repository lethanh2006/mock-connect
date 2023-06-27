import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import moment from 'moment';
import { useModel } from 'umi';
import ModalThoiKhoaBieu from './Modal';
import { useEffect } from 'react';

const DanhSachBuoiHoc = () => {
  const { record: recLopHocPhan } = useModel('daotao.lophocphan');
  const {
    setRecord: setThoiKhoaBieu,
    setVisibleForm,
    getTheoLopHocPhan,
    danhSach,
    loading,
  } = useModel('daotao.thoikhoabieu');

  useEffect(() => {
    if (recLopHocPhan?.ten) getTheoLopHocPhan(recLopHocPhan.ten);
  }, [recLopHocPhan?._id]);

  const onCell = (rec: ThoiKhoaBieu.IRecord) => ({
    onClick: () => {
      setThoiKhoaBieu(rec);
      setVisibleForm(true);
    },
    style: {
      cursor: 'pointer',
      backgroundColor: moment().format('YYYY-MM-DD') === rec.ngay ? '#005fcc1f' : undefined,
    },
  });

  const columns: IColumn<ThoiKhoaBieu.IRecord>[] = [
    {
      title: 'Ngày học',
      dataIndex: 'ngay',
      width: 150,
      render: (val) =>
        val ? (
          <>
            Tuần {moment(val).week()}, thứ {moment(val).day()}, ngày{' '}
            {moment(val).format('DD/MM/YYYY')}
          </>
        ) : null,
      onCell,
    },
    {
      title: 'Tiết học',
      width: 80,
      align: 'center',
      render: (val, rec) => `${rec.tietBatDau} - ${rec.tietKetThuc}`,
      onCell,
    },
    {
      title: 'Phòng học',
      dataIndex: 'phongHoc',
      width: 120,
      onCell,
      render: (val) => (val ? val : <i>Chưa cập nhật</i>),
    },
    {
      title: 'Loại hình',
      dataIndex: 'loaiHinhHocTap',
      width: 100,
      onCell,
    },
    // {
    //   dataIndex: ['nhom_lop_tin_chi_id', 1],
    //   title: 'Nhóm lớp',
    //   width: 130,
    //   onCell,
    //   hide: listBuoiHocCoNhom.length === 0,
    // },
    // {
    //   dataIndex: 'tong_so_sinh_vien',
    //   title: 'Trạng thái điểm danh',
    //   width: 80,
    //   render: (s, r) =>
    //     r.giang_vien_da_diem_danh ? (
    //       <>
    //         {r.diem_danh_buoi_hoc_ids.length - r.so_luong_vang} / {r.diem_danh_buoi_hoc_ids.length}
    //       </>
    //     ) : (
    //       <i style={{ color: '#a0a0a0' }}>Chưa điểm danh</i> //r.tong_so_sinh_vien
    //     ),
    //   onCell,
    //   hide: !isGiangVien,
    // },
    // {
    //   dataIndex: 'giang_vien_da_diem_danh',
    //   title: 'Đã điểm danh',

    //   width: 60,
    //   render: (check) => <Checkbox checked={check} />,
    //   onCell,
    // },
  ];

  return (
    <>
      {/* {recordBuoiHocGanNhat !== undefined ? (
        <>
          <ThongTinBuoiHoc buoiHoc={recordBuoiHocGanNhat} title="Buổi học gần nhất" />
          <Button
            onClick={() => {
              setRecord(recordBuoiHocGanNhat);
              if (isGiangVien) khoiTaoDiemDanhByIdBuoiHocModel(recordBuoiHocGanNhat.id);
              setVisibleDiemDanh(true);
            }}
            style={{ marginBottom: 24 }}
          >
            Chi tiết
          </Button>
          <br />
        </>
      ) : null} */}

      <span style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Tất cả buổi học</span>
      <TableStaticData
        hasTotal
        data={danhSach}
        columns={columns}
        otherProps={{ pagination: false, loading }}
        addStt
      />

      <ModalThoiKhoaBieu />
    </>
  );
};

export default DanhSachBuoiHoc;
