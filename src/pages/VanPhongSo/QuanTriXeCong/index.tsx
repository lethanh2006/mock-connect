import TableBase from '@/components/Table';
import { type VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import { type IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import FormTaoXeCong from './components/FormTaoXeCong';
import { Button, Divider, Popconfirm, Tooltip, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const QuanTriXe = () => {
  const {
    loading,
    getXeCongPageable,
    page,
    limit,
    condition,
    setRecord,
    setEdit,
    setVisibleForm,
    deleteXeCongModel,
  } = useModel('quantrixecong');

  const columns: IColumn<VanphongsoCsvc.XeRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên xe',
      dataIndex: ['info', 'tenXe'],
      align: 'center',
      search: 'search',
      width: 150,
    },
    {
      title: 'Biển số xe',
      dataIndex: ['info', 'bienSoXe'],
      align: 'center',
      search: 'search',
      width: 120,
    },
    {
      title: 'Loại xe',
      dataIndex: ['info', 'loaiXe'],
      align: 'center',
      width: 120,
    },
    {
      title: 'Ghi chú',
      dataIndex: ['info', 'ghiChu'],
      align: 'center',
      width: 200,
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (val, record) => {
        return (
          <>
            <Tooltip title="Chỉnh sửa">
              <Button
                type={'primary'}
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  setRecord(record);
                  setEdit(true);
                  setVisibleForm(true);
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="Xóa">
              <Popconfirm
                title="Bạn có chắc muốn xóa danh mục xe này không?"
                onConfirm={() => deleteXeCongModel(record?._id)}
                placement="topLeft"
              >
                <Button danger shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </>
        );
      },
    },
  ];
  return (
    <>
      <TableBase
        columns={columns}
        getData={getXeCongPageable}
        loading={loading}
        dependencies={[page, limit, condition]}
        modelName="quantrixecong"
        title="Danh mục"
        hascreate
        formType="Modal"
        Form={FormTaoXeCong}
      />
    </>
  );
};

export default QuanTriXe;
