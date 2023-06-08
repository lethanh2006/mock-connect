import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import { type LopTinChi as ILopTinChi } from '@/services/HocTap/LopTinChi/typings';
import { history, useModel } from 'umi';
import { useState } from 'react';

const LopTinChi = () => {
  const { page, limit, sinhVienGetModel } = useModel('hoctap.loptinchi');
  const [maHocKy, setMaHocKy] = useState<string>();

  const onCell = (loptinchi: ILopTinChi.IRecord) => ({
    onClick: () => history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ILopTinChi.IRecord>[] = [
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
      dependencies={[page, limit, maHocKy]}
      params={{ maHocKy }}
      getData={sinhVienGetModel}
      modelName="hoctap.loptinchi"
      title="Lớp tín chỉ"
      buttons={{ create: false }}
      otherButtons={[
        <SelectHocKy
          onChange={(val) => setMaHocKy(val)}
          selectMa
          style={{ width: 300 }}
          key="1"
          allowClear
        />,
      ]}
    />
  );
};

export default LopTinChi;
