import studentIcon from '@/assets/student.png';
import TableBaseStatic from '@/components/Table/Table';
import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { Avatar } from 'antd';
import { useState } from 'react';
import { type IColumn } from '@/components/Table/typing';
import ModalViewSinhVien from './ModalViewSinhVien';

const DanhSachSinhVien = (props: {
  data: APILopHanhChinh.ISinhVienDiemHanhChinh[];
  isGiangVien: boolean;
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<APILopHanhChinh.ISinhVienDiemHanhChinh>();
  const { data, isGiangVien } = props;

  const onCell = (rec: APILopHanhChinh.ISinhVienDiemHanhChinh) => ({
    onClick: () => {
      setRecord(rec);
      setModalVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  let columns: IColumn<APILopHanhChinh.ISinhVienDiemHanhChinh>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      width: 60,
      align: 'center',
      onCell,
    },
    {
      dataIndex: 'avatar_path',
      title: 'Ảnh',
      width: 60,
      align: 'center',
      render: (path) => <Avatar src={path || studentIcon} />,
      onCell,
    },
    {
      dataIndex: 'name',
      title: 'Họ tên',
      width: 120,
      onCell,
      filterType: 'string',
    },
    {
      dataIndex: 'ma_dinh_danh',
      title: 'Mã sinh viên',
      width: 80,
      align: 'center',
      onCell,
      filterType: 'string',
    },
  ];

  if (isGiangVien)
    columns = columns.concat([
      {
        dataIndex: ['diemTongKet', 'diem_tich_luy_thang_4'],
        title: 'Điểm TB tích lũy (hệ 4)',
        align: 'center',
        width: 60,
        render: (val) => val ?? '--',
        onCell,
      },
      {
        dataIndex: ['diemTongKet', 'tong_so_tin_chi_tich_luy'],
        title: 'Tổng số tín chỉ tích lũy',
        align: 'center',
        width: 60,
        onCell,
      },
      {
        dataIndex: 'tong_so_tin_chi_truot',
        title: 'Tổng số tín chỉ trượt',
        align: 'center',
        width: 60,
        onCell,
      },
    ]);

  return (
    <>
      <TableBaseStatic
        data={data.map((item, index) => ({
          ...item,
          index: index + 1,
          tong_so_tin_chi_truot:
            item.diemTongKet?.tong_so_tin_chi_da_hoc - item.diemTongKet?.tong_so_tin_chi_tich_luy,
        }))}
        columns={columns}
      />

      <ModalViewSinhVien visible={modalVisible} setVisible={setModalVisible} record={record} />
    </>
  );
};

export default DanhSachSinhVien;
