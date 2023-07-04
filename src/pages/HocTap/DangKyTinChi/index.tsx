import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useState } from 'react';
import { history, useModel } from 'umi';

const DangKyTinChiPage = () => {
  const { page, limit, sinhVienGetModel } = useModel('daotao.lophocphan');
  const { record: recHocKy } = useModel('daotao.hocky');
  const [selectedLopHocPhan, setSelectedLopHocPhan] = useState<LopHocPhan.IRecord[]>();

  const onCell = (loptinchi: LopHocPhan.IRecord) => ({
    onClick: () =>
      loptinchi.loai === ELoaiLopHocPhan.CHINH
        ? history.push(`/hoc-tap/lop-hoc-phan/${loptinchi._id}`)
        : undefined,
    style: { cursor: loptinchi.loai === ELoaiLopHocPhan.CHINH ? 'pointer' : undefined },
  });

  const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
    hideSelectAll: true,
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
      width: 150,
      onCell,
    },
    {
      title: 'Lịch học',
      width: 150,
      render: (val, rec) => rec.maHoaLichHoc?.map((item) => item.thu).join(', '),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit, recHocKy?._id]}
      params={{ maHocKy: recHocKy?.ma, loai: ELoaiLopHocPhan.CHINH }}
      getData={sinhVienGetModel}
      modelName="daotao.lophocphan"
      title="Đăng ký tín chỉ"
      buttons={{ create: false }}
      otherButtons={[<FilterHocKy isSetHocKy key="1" />]}
      rowSelection
      detailRow={rowSelection}
      otherProps={{ rowKey: '_id' }}
    />
  );
};

export default DangKyTinChiPage;
