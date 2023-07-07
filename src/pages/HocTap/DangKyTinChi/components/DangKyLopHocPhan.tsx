import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useState } from 'react';
import { useModel } from 'umi';
import FilterHocPhan from './FilterHocPhan';

const DangKyLopHocPhan = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const { record: recHocPhan } = useModel('hocphan.hocphan');
  const { page, limit, sinhVienGetModel } = useModel('daotao.lophocphan');
  const [selectedLopHocPhan, setSelectedLopHocPhan] = useState<LopHocPhan.IRecord[]>();

  const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
    hideSelectAll: true,
    type: 'radio',
    selectedRowKeys: selectedLopHocPhan?.map((item) => item._id),

    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedLopHocPhan(selectedRows);
    },

    getCheckboxProps: (record) => ({
      disabled: !!record.children?.length,
    }),
  };

  const columns: IColumn<LopHocPhan.IRecord>[] = [
    {
      title: 'Lớp học phần',
      dataIndex: 'ten',
      width: 150,
    },
    {
      title: 'Lịch học',
      width: 150,
      render: (val, rec) => rec.maHoaLichHoc?.map((item) => item.thu).join(', '),
    },
    {
      title: 'Học phần',
      dataIndex: ['hocPhan', 'ten'],
      width: 170,
    },
    {
      title: 'Sĩ số',
      dataIndex: 'siSo',
      align: 'center',
      width: 60,
    },
    {
      title: 'Còn trống',
      align: 'center',
      width: 60,
      render: (val, rec) => rec.siSoToiDa - (rec.siSo ?? 0),
    },
    {
      title: 'Giảng viên',
      width: 150,
      render: (val, rec) => rec.nhanSuList?.map((item) => `${item.hoDem} ${item.ten}`).join(', '),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        dependencies={[page, limit, recHocKy?.ma, recHocPhan?.ma]}
        params={{ maHocKy: recHocKy?.ma, loai: ELoaiLopHocPhan.CHINH, maHocPhan: recHocPhan?.ma }}
        getData={sinhVienGetModel}
        modelName="daotao.lophocphan"
        hideCard
        buttons={{ create: false, reload: false, filter: false }}
        otherButtons={[<FilterHocPhan key="1" />]}
        rowSelection
        detailRow={rowSelection}
        otherProps={{ rowKey: '_id' }}
      />
    </>
  );
};

export default DangKyLopHocPhan;
