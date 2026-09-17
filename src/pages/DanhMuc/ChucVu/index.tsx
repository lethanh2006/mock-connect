import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { IconButton, IconPen, IconTrash } from '@/components/Icons';
import { Popconfirm } from 'antd';
import { formatDateTime } from '@/utils/formatDate';
import { useModel } from 'umi';
import Form from './components/Form';

const ChucVuPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('danhmuc.chucvu');

  const columns: IColumn<ChucVu.IRecord>[] = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      width: 80,
      filterType: 'select',
      filterData: ['M01', 'M02', 'M03'],
      sortable: true,
      resizable: true,
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'ten',
      width: 250,
      minWidth: 150,
      maxWidth: 600,
      filterType: 'string',
      sortable: true,
      resizable: true,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 120,
      filterType: 'datetime',
      sortable: true,
      render: (val) => formatDateTime(val),
      resizable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: ChucVu.IRecord) => (
        <>
          <IconButton label="Chỉnh sửa" variant="ghost" onClick={() => handleEdit(record)}>
            <IconPen />
          </IconButton>
          <Popconfirm
            onConfirm={() => deleteModel(record._id, getModel)}
            title="Bạn có chắc chắn muốn xóa chức vụ này?"
            placement="topLeft"
          >
            <IconButton label="Xóa" variant="destructive">
              <IconTrash />
            </IconButton>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="danhmuc.chucvu"
      title="Chức vụ"
      Form={Form}
      buttons={{ import: true, filter: true, export: true }}
      rowSelection
      deleteMany
      cardProps={{ stickyHeader: true }}
    />
  );
};

export default ChucVuPage;
