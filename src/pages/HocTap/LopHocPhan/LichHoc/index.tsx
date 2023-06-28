import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalThoiKhoaBieu from './Modal';
import ThongTinBuoiHoc from './ThongTinBuoiHoc';

const DanhSachBuoiHoc = () => {
  const { record: recLopHocPhan } = useModel('daotao.lophocphan');
  const {
    setRecord: setThoiKhoaBieu,
    setVisibleForm,
    getTheoLopHocPhan,
    danhSach,
    loading,
  } = useModel('daotao.thoikhoabieu');
  const [buoiHocGanNhat, setBuoiHocGanNhat] = useState<ThoiKhoaBieu.IRecord>();

  useEffect(() => {
    if (recLopHocPhan?.ten)
      getTheoLopHocPhan(recLopHocPhan.ten).then((data) => {
        data.every((item) => {
          if (moment().isSameOrBefore(item.ngay, 'day')) {
            setBuoiHocGanNhat(item);
            return false;
          }
          return true;
        });
      });
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
      title: 'TT',
      dataIndex: 'index',
      width: 60,
      align: 'center',
      onCell,
    },
    {
      title: 'Ngày học',
      dataIndex: 'ngay',
      width: 150,
      render: (val) =>
        val ? (
          <>
            Tuần {moment(val).week()}, {moment(val).format('dddd')}, ngày{' '}
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
      {buoiHocGanNhat?._id ? (
        <>
          <ThongTinBuoiHoc
            buoiHoc={buoiHocGanNhat}
            title={
              <>
                Buổi học gần nhất{' '}
                <a
                  onClick={() => {
                    setThoiKhoaBieu(buoiHocGanNhat);
                    setVisibleForm(true);
                  }}
                  style={{ fontSize: 14, fontWeight: 400 }}
                >
                  (xem chi tiết)
                </a>
              </>
            }
          />
          <br />
        </>
      ) : null}

      <span style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Tất cả buổi học</span>
      <TableStaticData
        hasTotal
        data={danhSach.map((item, index) => ({
          ...item,
          index: index + 1,
        }))}
        columns={columns}
        otherProps={{ pagination: false, loading, scroll: { y: 600 } }}
      />

      <ModalThoiKhoaBieu />
    </>
  );
};

export default DanhSachBuoiHoc;
