import TableBaseStatic from '@/components/Table/Table';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import FormDiemCong from './FormDiemCong';
import { type IColumn } from '@/components/Table/typing';

const DiemCong = (props: {
  data: LopTinChi.IDiemCong[];
  lop_tin_chi_id: number;
  ma_dinh_danh: string;
  name?: string;
  add?: boolean;
  getData?: any;
}) => {
  const { loading } = useModel('hoctap.loptinchi');
  const { data, lop_tin_chi_id, ma_dinh_danh, name, add, getData } = props;
  const [recordDiemCong, setRecordDiemCong] = useState<LopTinChi.IDiemCong>();
  const [showEdit, setShowEdit] = useState<boolean>();

  const columnsDiemCong: IColumn<LopTinChi.IDiemCong>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      align: 'center',
      width: 60,
    },
    // {
    //   dataIndex: 'ngay_bd',
    //   title: 'Ngày học',
    //   align: 'center',
    //   width: 80,
    //   render: (s) => s && moment(s, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    // },
    {
      dataIndex: 'thoiGian',
      title: 'Thời gian',
      align: 'center',
      width: 100,
      // render: (s, r) => (
      //   <>
      //     {r?.ngay_gio_hoc && moment(r.ngay_gio_hoc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} -{' '}
      //     {r?.ngay_gio_ket_thuc &&
      //       moment(r.ngay_gio_ket_thuc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
      //   </>
      // ),
    },
    {
      dataIndex: 'soDiemCong',
      title: 'Điểm cộng',
      align: 'center',
      render: (s) => <b>{s}</b>,
      width: 60,
    },
    {
      dataIndex: 'ghiChu',
      title: 'Ghi chú',
      width: 150,
    },
    {
      title: 'Thao tác',
      width: 60,
      fixed: 'right',
      align: 'center',
      hide: add === false,
      render: (s, r) => (
        <Button
          onClick={() => {
            setRecordDiemCong(r);
            setShowEdit(true);
          }}
          shape="circle"
          type="primary"
          title="Chỉnh sửa"
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  return (
    <>
      {name && (
        <Descriptions column={{ xs: 1, md: 2 }}>
          <Descriptions.Item label="Họ tên sinh viên">
            <b>{name}</b>
          </Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">
            <b>{ma_dinh_danh}</b>
          </Descriptions.Item>
        </Descriptions>
      )}

      <TableBaseStatic
        otherProps={{ size: 'small', loading, rowKey: (r: LopTinChi.IDiemCong) => r._id }}
        columns={columnsDiemCong}
        data={data.map((item, index) => ({ ...item, index: index + 1 }))}
        hascreate={add !== false}
        createSmall
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        Form={(p: { onCancel: any }) => (
          <FormDiemCong
            lop_tin_chi_id={lop_tin_chi_id}
            ma_dinh_danh={ma_dinh_danh}
            onCancel={p.onCancel}
            recordDiemCong={recordDiemCong}
            edit={showEdit}
            getData={() => {
              if (getData) getData();
            }}
          />
        )}
      />
    </>
  );
};

export default DiemCong;
