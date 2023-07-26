import ExpandText from '@/components/ExpandText';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import TableBase from "@/components/Table";
import { IColumn } from '@/components/Table/typing';

const GuiDon = () => {
  const { getAllBieuMauModel, setDanhSach, setRecord, loading, setPage, condition } =
    useModel('dvmc.dichvumotcuav2');
  const [total, setTotal] = useState();

  useEffect(() => {
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setPage(1);
    };
  }, []);
  const onCell = (recordBieuMau: DichVuMotCuaV2.BieuMau) => ({
    onClick: () => {
      history.push(`/dich-vu-hanh-chinh/tao-don/${recordBieuMau?._id}`);
    },
    style: { cursor: 'pointer' },
  });
  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [

    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
      width: 250,
      onCell
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: ['thongTinThuTuc', 'yeuCauTraPhi'],
      width: 100,
      align: 'center',
      onCell,
      render: (val) => (val ? 'Dịch vụ trả phí' : 'Dịch vụ không tính phí'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      onCell,
      render: (val) => (
        <ExpandText
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </ExpandText>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (recordBieuMau: DichVuMotCuaV2.BieuMau) => (
        <Tooltip title="Sử dụng dịch vụ">
          <Button
            onClick={() => {
              history.push(`/dich-vu-hanh-chinh/tao-don/${recordBieuMau?._id}`);
            }}
            shape="circle"
            type="primary"
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card title="Gửi đơn Dịch vụ hành chính">
      <TableBase
        modelName={'dvmc.dichvumotcuav2'}
        columns={columns}
        pageable={false}
        getData={() => {
          getAllBieuMauModel();
        }}
        buttons={{create:false}}
        hideCard
        dependencies={[condition]}
        otherButtons={[
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => history.push('/dich-vu-hanh-chinh')}
            key={1}
          >
            Lịch sử gửi đơn
          </Button>,
        ]}
      />
    </Card>
  );
};

export default GuiDon;
