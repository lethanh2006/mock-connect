import studentIcon from '@/assets/student.png';
import TableBaseStatic from '@/components/Table/Table';
import { Avatar } from 'antd';
import { useState } from 'react';
import { type IColumn } from '@/components/Table/typing';
import ModalViewSinhVien from './ModalViewSinhVien';

const DanhSachSinhVien = (props: {
  sinhVienList: LopHanhChinh.ISinhVien[];
  isGiangVien: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<LopHanhChinh.ISinhVien>();
  const { sinhVienList, isGiangVien } = props;

  const onCell = (rec: LopHanhChinh.ISinhVien) => ({
    onClick: () => {
      setRecord(rec);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopHanhChinh.ISinhVien>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      width: 60,

      onCell,
    },
    {
      dataIndex: 'avatar_path',
      title: 'Ảnh',
      width: 60,

      render: (path) => <Avatar src={path || studentIcon} />,
      onCell,
    },
    {
      dataIndex: 'ma',
      title: 'Mã sinh viên',
      width: 80,
      onCell,
      filterType: 'string',
    },
    {
      dataIndex: 'ten',
      title: 'Họ tên',
      width: 120,
      onCell,
      filterType: 'string',
    },
  ];

  // if (isGiangVien)
  //   columns = columns.concat([
  //     {
  //       dataIndex: ['diemTongKet', 'diem_tich_luy_thang_4'],
  //       title: 'Điểm TB tích lũy (hệ 4)',
  //
  //       width: 60,
  //       render: (val) => val ?? '--',
  //       onCell,
  //     },
  //     {
  //       dataIndex: ['diemTongKet', 'tong_so_tin_chi_tich_luy'],
  //       title: 'Tổng số tín chỉ tích lũy',
  //
  //       width: 60,
  //       onCell,
  //     },
  //     {
  //       dataIndex: 'tong_so_tin_chi_truot',
  //       title: 'Tổng số tín chỉ trượt',
  //
  //       width: 60,
  //       onCell,
  //     },
  //   ]);

  return (
    <>
      <TableBaseStatic
        data={sinhVienList.map((item, index) => ({
          ...item,
          index: index + 1,
          // tong_so_tin_chi_truot:
          //   item.diemTongKet?.tong_so_tin_chi_da_hoc - item.diemTongKet?.tong_so_tin_chi_tich_luy,
        }))}
        columns={columns}
      />

      <ModalViewSinhVien visible={modalVisible} setVisible={setModalVisible} record={record} />
    </>
  );
};

export default DanhSachSinhVien;
