import TableBase from '@/components/Table';
import { type IColumn } from '@/utils/interfaces';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormTaoLaiXe from './components/FormTao';

const DanhMucLaiXe = () => {
  const {
    getLaiXePageableModel,
    page,
    limit,
    condition,
    loading,
    deleteLaiXeModel,
    setVisibleForm,
    setRecord,
    setEdit,
  } = useModel('quanlylaixe');

  const columns: IColumn<QuanLyLaiXe.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'hoTen',
      align: 'center',
      width: 120,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 120,
    },
    {
      title: 'Thông tin khác',
      dataIndex: 'khac',
      align: 'center',
      width: 200,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (val, rec) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord(rec);
                setEdit(true);
                setVisibleForm(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa lái xe này không?"
              placement="topLeft"
              onConfirm={() => deleteLaiXeModel(rec?._id ?? '')}
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Card title="Quản lý lái xe">
      <TableBase
        columns={columns}
        getData={getLaiXePageableModel}
        loading={loading}
        dependencies={[page, limit, condition]}
        modelName="quanlylaixe"
        hideCard
        hascreate
        formType="Modal"
        widthDrawer={600}
        Form={FormTaoLaiXe}
      />
    </Card>
  );
};

export default DanhMucLaiXe;
