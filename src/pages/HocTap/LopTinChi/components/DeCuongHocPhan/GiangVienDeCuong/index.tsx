import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';

const GiangVienDeCuongPage = () => {
  const { setEdit, setVisibleForm, setRecord, getModel, page, limit, deleteModel } = useModel(
    'hocphan.giangviendecuong',
  );
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

  const handleEdit = (record: HocPhan.IGiangVienDeCuong) => {
    setRecord(record);
    setVisibleForm(true);
    setEdit(true);
  };

  const columns: IColumn<HocPhan.IGiangVienDeCuong>[] = [
    {
      title: 'Họ tên',
      width: 150,
      render: (val, rec) => rec.hoTen,
    },
    {
      title: 'Chức danh, học hàm, học vị',
      width: 150,
      render: (val, rec) => [rec.chucDanh, rec.hocHam, rec.hocVi].join(' - '),
    },
    {
      title: 'SĐT',
      width: 120,
      // render: (val, rec) => rec.soDienThoai && formatPhoneNumber(rec.soDienThoai),
    },
    {
      title: 'Địa chỉ liên hệ',
      width: 200,
      render: (val, rec) => rec.diaChi,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: HocPhan.IGiangVienDeCuong) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => handleEdit(record)}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() =>
                deleteModel(record._id, () => getModel({ deCuongId: recDeCuong?._id }))
              }
              title="Bạn có chắc chắn muốn xóa giảng viên này khỏi đề cương?"
              placement="topLeft"
            >
              <Button danger shape="circle" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        params={{ deCuongId: recDeCuong?._id }}
        modelName="hocphan.giangviendecuong"
        title="Giảng viên đề cương"
        hideCard
        buttons={{ reload: false, create: false }}
      />
    </>
  );
};

export default GiangVienDeCuongPage;
