import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { useModel } from 'umi';

const GiangVienDeCuongPage = () => {
  const { page, limit } = useModel('hocphan.giangviendecuong');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

  const columns: IColumn<HocPhan.IGiangVienDeCuong>[] = [
    {
      title: 'Họ tên',
      width: 150,
      render: (val, rec) => rec.hoTen,
    },
    {
      title: 'Chức danh, học hàm, học vị',
      width: 150,
      render: (val, rec) =>
        [rec.chucDanh, rec.hocHam, rec.hocVi].filter((item) => !!item).join(', '),
    },
    {
      title: 'SĐT',
      width: 120,
      render: (val, rec) => rec.soDienThoai && formatPhoneNumber(rec.soDienThoai),
    },
    {
      title: 'Địa chỉ liên hệ',
      width: 200,
      render: (val, rec) => rec.diaChi,
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
        buttons={{ create: false }}
      />
    </>
  );
};

export default GiangVienDeCuongPage;
