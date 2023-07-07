import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useModel } from 'umi';
import FilterHocPhanDKTC from './FilterHocPhan';

const DangKyLopHocPhan = () => {
  const { record: recHocKy } = useModel('daotao.hocky');
  const { page, limit, sinhVienGetModel } = useModel('daotao.lophocphan');
  const { danhSachLopDangKy, hocPhanDangKy } = useModel('daotao.dotdangkytinchi');

  const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
    hideSelectAll: true,
    type: 'radio',
    selectedRowKeys: danhSachLopDangKy?.map((item) => item._id ?? ''),

    onChange: (selectedRowKeys, selectedRows) => {
      // setSelectedLopHocPhan(selectedRows);
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
      <FilterHocPhanDKTC key="1" />

      {hocPhanDangKy?.maMonHoc ? (
        <TableBase
          columns={columns}
          dependencies={[page, limit, recHocKy?.ma, hocPhanDangKy?.maMonHoc]}
          params={{
            maHocKy: recHocKy?.ma,
            loai: ELoaiLopHocPhan.CHINH,
            maHocPhan: hocPhanDangKy?.maMonHoc,
          }}
          getData={sinhVienGetModel}
          modelName="daotao.lophocphan"
          hideCard
          buttons={{ create: false, reload: false, filter: false }}
          hideTotal
          rowSelection
          detailRow={rowSelection}
          otherProps={{ rowKey: '_id' }}
        />
      ) : (
        <Empty
          description={<i style={{ color: '#999' }}>Vui lòng chọn học phần muốn đăng ký</i>}
          style={{ marginTop: 18, marginBottom: 24 }}
        />
      )}
    </>
  );
};

export default DangKyLopHocPhan;
