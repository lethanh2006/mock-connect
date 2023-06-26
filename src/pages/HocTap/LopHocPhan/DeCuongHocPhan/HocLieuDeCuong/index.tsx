import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { EyeOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import { useModel } from 'umi';

const HocLieuDeCuongPage = () => {
  const { page, limit } = useModel('hocphan.hoclieudecuong');

  const columns: IColumn<HocPhan.IHocLieuDeCuong>[] = [
    {
      title: 'Tên học liệu',
      width: 150,
      render: (val, rec) => rec.hocLieu?.ten,
    },
    {
      title: 'Loại học liệu',
      width: 120,
      render: (val, rec) => rec.hocLieu?.loaiHocLieu,
    },
    {
      title: 'Bắt buộc',
      width: 100,
      dataIndex: 'batBuoc',
      align: 'center',
      render: (val, rec) => <Switch checked={val} />,
    },
    {
      title: 'Học liệu',
      width: 120,
      align: 'center',
      dataIndex: 'hocLieuId',
      render: (val, rec) =>
        rec.hocLieu?.url ? (
          <a>
            <EyeOutlined /> Xem chi tiết
          </a>
        ) : (
          'Chưa cập nhật'
        ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit]}
        modelName="hocphan.hoclieudecuong"
        title="Đề cương học liệu"
        hideCard
        buttons={{ create: false }}
      />
    </>
  );
};

export default HocLieuDeCuongPage;
