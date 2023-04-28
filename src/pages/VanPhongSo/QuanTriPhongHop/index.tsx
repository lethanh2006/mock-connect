import TableBase from '@/components/Table';
import { type VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import { type IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import FormTaoPhongHop from './components/FormTaoPhongHop';
import { Button, Divider, Popconfirm, Tooltip, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { deleteCsvc } from '@/services/VanPhongSo/vanphongso';

const QuanTriPhongHop = () => {
  const {
    loading,
    page,
    limit,
    condition,
    getPhongHopPageable,
    setEdit,
    setRecord,
    setVisibleForm,
    setLoading,
  } = useModel('quantriphonghop');

  const columns: IColumn<VanphongsoCsvc.PhongHopRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tòa nhà',
      dataIndex: ['info', 'toaNha'],
      align: 'center',
      search: 'search',
      width: 150,
    },
    {
      title: 'Tên phòng',
      dataIndex: ['info', 'tenPhong'],
      align: 'center',
      search: 'search',
      width: 150,
    },
    {
      title: 'Số phòng',
      dataIndex: ['info', 'soPhong'],
      align: 'center',
      search: 'search',
      width: 200,
    },

    {
      title: 'Số chỗ ngồi',
      dataIndex: ['info', 'soCho'],
      align: 'center',
      width: 100,
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
                title="Bạn có chắc muốn xóa phòng này không?"
                placement="topLeft"
                onConfirm={async () => {
                  await deleteCsvc(record?._id)
                    .then(() => {
                      message.success('Xóa thành công!');
                      getPhongHopPageable();
                    })
                    .catch(() => setLoading(false));
                }}
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
        getData={getPhongHopPageable}
        loading={loading}
        dependencies={[page, limit, condition]}
        modelName="quantriphonghop"
        title="Danh mục"
        hascreate
        formType="Modal"
        Form={FormTaoPhongHop}
      />
    </>
  );
};

export default QuanTriPhongHop;
