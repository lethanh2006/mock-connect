import { type LopHanhChinh } from '@/services/LopHanhChinh/typings';
import { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';

const LopHanhChinhPage = () => {
  const isNhanVien = localStorage.getItem('vaiTro') === 'nhan_vien';

  const {
    sinhVienGetLopHanhChinhPageableModel,
    danhSach,
    record: recLopHanhChinh,
    setRecord,
  } = useModel('hoctap.lophanhchinh');

  // useEffect(() => {
  //   sinhVienGetLopHanhChinhPageableModel();
  // }, []);

  const onCell = (lophanhchinh: LopHanhChinh.IRecord) => ({
    onClick: () => {
      setRecord(lophanhchinh);
      history.push(`/hoc-tap/lop-hanh-chinh/${lophanhchinh._id}`);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<LopHanhChinh.IRecord>[] = [
    {
      title: 'Tên lớp học',
      dataIndex: 'ten',
      width: 100,
      onCell,
      filterType: 'string',
      sortable: true,
    },
  ];

  return (
    <div>
      <TableBase
        columns={columns}
        modelName="hoctap.lophanhchinh"
        title="Lớp hành chính"
        buttons={{ create: false }}
        getData={() => sinhVienGetLopHanhChinhPageableModel()}
      />
    </div>
  );
};

export default LopHanhChinhPage;
