import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { history, useModel } from 'umi';

const LopHanhChinhPage = () => {
  const { page, limit, sinhVienGetModel } = useModel('hoctap.lophanhchinh');

  const onCell = (lophanhchinh: LopHanhChinh.IRecord) => ({
    onClick: () => history.push(`/hoc-tap/lop-hanh-chinh/${lophanhchinh._id}`),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopHanhChinh.IRecord>[] = [
    {
      title: 'Tên lớp học',
      dataIndex: 'ten',
      width: 200,
      onCell,
      filterType: 'string',
      sortable: true,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      getData={sinhVienGetModel}
      modelName="hoctap.lophanhchinh"
      title="Lớp hành chính"
      buttons={{ create: false }}
    />
  );
};

export default LopHanhChinhPage;
