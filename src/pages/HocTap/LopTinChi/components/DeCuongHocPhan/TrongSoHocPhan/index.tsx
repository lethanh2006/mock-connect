import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const TrongSoHocPhanPage = () => {
  const { page, limit } = useModel('hocphan.trongsohocphan');
  const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

  const columns: IColumn<HocPhan.ITrongSoHocPhan>[] = [
    {
      title: 'Đầu điểm',
      width: 150,
      render: (val, rec) => rec.hinhThucDanhGia?.ten,
    },
    {
      title: 'Hình thức đánh giá',
      width: 150,
      render: (val, rec) => rec.hinhThucThi?.ten,
    },
    {
      title: 'Tỷ lệ đánh giá',
      dataIndex: 'tyLeDanhGia',
      width: 100,
      align: 'center',
    },
    {
      title: 'Đặc điểm đánh giá',
      dataIndex: 'dacDiemDanhGia',
      width: 120,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      params={{ deCuongId: recDeCuong?._id }}
      modelName="hocphan.trongsohocphan"
      title="Trọng số"
      getData={() => console.log()}
      hideCard
      buttons={{ reload: false, create: false }}
    />
  );
};

export default TrongSoHocPhanPage;
