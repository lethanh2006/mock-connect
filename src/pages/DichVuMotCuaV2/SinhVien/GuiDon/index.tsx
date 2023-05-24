import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/OldTable';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { IColumn } from '@/utils/interfaces';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const GuiDon = () => {
  const {
    getAllBieuMauModel,
    setDanhSach,
    setRecord,
    setVisibleFormBieuMau,
    loading,
    setPage,
    condition,
  } = useModel('dichvumotcuav2');
  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;
  const [total, setTotal] = useState();

  useEffect(() => {
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setPage(1);
    };
  }, []);

  const columns: IColumn<DichVuMotCuaV2.BieuMau>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'ten',
      search: 'search',
      width: 250,
    },
    {
      title: 'Loại dịch vụ',
      dataIndex: ['thongTinThuTuc', 'yeuCauTraPhi'],
      width: 100,
      align: 'center',
      render: (val) => (val ? 'Dịch vụ trả phí' : 'Dịch vụ không tính phí'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      search: 'search',
      width: 250,
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
              if (isDVMC) history.push(`/dichvumotcuasv/taodon/${recordBieuMau?._id}`);
              else {
                setRecord(recordBieuMau);
                setVisibleFormBieuMau(true);
              }
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
    <Card title="Gửi đơn Dịch vụ một cửa">
      <TableBase
        modelName={'dichvumotcuav2'}
        columns={columns}
        pageable={false}
        getData={() => {
          getAllBieuMauModel().then((res) => setTotal(res.length));
        }}
        total={total}
        hideCard
        loading={loading}
        dependencies={[condition]}
      >
        {isDVMC ? (
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/dichvumotcuasv')}>
            Lịch sử gửi đơn
          </Button>
        ) : null}
      </TableBase>
    </Card>
  );
};

export default GuiDon;
