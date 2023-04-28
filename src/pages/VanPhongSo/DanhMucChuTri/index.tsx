import TableBaseStatic from '@/components/OldTable/Table';
import type { IColumn } from '@/utils/interfaces';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormChuTri from './components/Form';

const DanhMucChuTriPage = () => {
  const { danhSachChuTri, getAllChuTriModel, delChuTriModel } = useModel('lichtuan');
  const [visibleForm, setVisibleForm] = useState<boolean>(false);

  useEffect(() => {
    getAllChuTriModel();
  }, []);

  const onRemove = (rec: { id: number }) => {
    delChuTriModel({ listIds: [rec.id] }).then(() => {
      getAllChuTriModel();
    });
  };

  const columns: IColumn<Login.Profile>[] = [
    {
      title: 'Mã định danh',
      dataIndex: 'ma_dinh_danh',
      width: 100,
      align: 'center',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      width: 150,
      align: 'center',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'ten_don_vi',
      width: 200,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      render: (val, rec) => (
        <Popconfirm
          title="Xác nhận xóa cán bộ chủ trì này?"
          onConfirm={() => onRemove(rec)}
          placement="topLeft"
        >
          <Button icon={<DeleteOutlined />} danger shape="circle" />
        </Popconfirm>
      ),
      width: 60,
      fixed: 'right',
    },
  ];

  return (
    <Card title="Cán bộ chủ trì">
      <TableBaseStatic
        addStt
        columns={columns}
        data={danhSachChuTri}
        showEdit={visibleForm}
        setShowEdit={setVisibleForm}
        hascreate
        Form={FormChuTri}
      />
      {/* <Modal
        visible={visibleForm}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisibleForm(false)}
        footer={null}
      >
        <FormChuTri setVisible={setVisibleForm} />
      </Modal> */}
    </Card>
  );
};

export default DanhMucChuTriPage;
