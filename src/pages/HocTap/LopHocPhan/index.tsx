import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { history, useModel } from 'umi';

const LopHocPhanPage = () => {
  const { page, limit, sinhVienGetModel } = useModel('daotao.lophocphan');
  const { record: recHocKy } = useModel('daotao.hocky');

  const onCell = (loptinchi: LopHocPhan.IRecord) => ({
    onClick: () =>
      loptinchi.loai === ELoaiLopHocPhan.CHINH
        ? history.push(`/hoc-tap/lop-hoc-phan/${loptinchi._id}`)
        : undefined,
    style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
  });

  const columns: IColumn<LopHocPhan.IRecord>[] = [
    {
      title: 'Tên lớp học',
      dataIndex: 'ten',
      width: 150,
      onCell,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Mã học phần',
      dataIndex: ['hocPhan', 'ma'],
      width: 100,
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: ['hocPhan', 'ten'],
      filterType: 'customselect',
      filterCustomSelect: <SelectHocPhan multiple />,
      width: 150,
      onCell,
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, recHocKy?._id]}
      params={{ maHocKy: recHocKy?.ma, loai: ELoaiLopHocPhan.CHINH }}
      getData={sinhVienGetModel}
      modelName="daotao.lophocphan"
      title="Lớp tín chỉ"
      buttons={{ create: false }}
      otherButtons={[<FilterHocKy isSetHocKy key="1" />]}
      hideChildrenRows
    />
  );
};

export default LopHocPhanPage;
