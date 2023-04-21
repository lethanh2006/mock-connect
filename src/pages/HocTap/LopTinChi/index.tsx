import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopTinChi as ILopTinChi } from '@/services/LopTinChi/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { history, useAccess, useModel } from 'umi';

const LopTinChi = () => {
  const access = useAccess();

  const { loading, setDanhSach, setRecord: setRecordLopTinChi } = useModel('hoctap.loptinchi');

  const onCell = (loptinchi: ILopTinChi.Record) => ({
    onClick: () => {
      setRecordLopTinChi(loptinchi);
      // history.push(
      //   `/${access.sinhVien ? 'hoctap/loptinchi' : 'loptinchi/danhsachlop'}/${loptinchi.id}`,
      // );
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ILopTinChi.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      title: 'Mã lớp học',
      dataIndex: 'ma_lop',
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'Mã học phần',
      dataIndex: 'mon_hoc_ids',
      render: (val) => <div>{val?.[1] ?? ''}</div>,
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: 'ten_hoc_phan',
      align: 'center',
      width: 200,
      onCell,
    },
  ];

  // useEffect(() => {
  //   if (access.nhanVien) getAllHinhThucDaoTaoModel(true);
  // }, []);

  // useEffect(() => {
  //   if (access.nhanVien) getAllKyHocByHinhThucDaoTaoGiangVienModel(hinhThucDaoTao);
  //   else {
  //     getAllKyHocSinhVienModel();
  //   }
  // }, [hinhThucDaoTao]);

  // const onChangeKyHoc = (value: number) => {
  //   const kyHoc: KyHoc.Record | undefined = danhSach.find(
  //     (item: KyHoc.Record) => item.id === value,
  //   );
  //   setRecord(kyHoc);
  // };

  // const onChangeHeDaoTao = (value: number) => {
  //   setHinhThucDaoTao(value);
  //   setDanhSach([]);
  //   setRecord({} as KyHoc.Record);
  // };

  return (
    <TableBase
      columns={columns}
      // params={{ idHocKy: record?.id }}
      // dependencies={[record?.id, hinhThucDaoTao]}
      modelName="hoctap.loptinchi"
      title="Lớp tín chỉ"
      otherProps={{ scroll: { x: 500 } }}
      pageable={false}
      // children={
      // <>
      // {access.nhanVien && (
      //      <Select
      //        placeholder="Chọn hệ đào tạo"
      //        onChange={onChangeHeDaoTao}
      //        value={hinhThucDaoTao === -1 ? undefined : hinhThucDaoTao}
      //        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      //      >
      //        {danhSachHinhThucDaoTao?.map((item) => (
      //          <Select.Option key={item.id} value={item.id}>
      //            {item?.display_name ?? ''}
      //          </Select.Option>
      //        ))}
      //      </Select>
      //    )}
      //    <Select
      //      placeholder="Chọn kỳ học"
      //      onChange={onChangeKyHoc}
      //      value={record?.id}
      //      style={{ width: 220, marginBottom: 8 }}
      //    >
      //      {danhSach?.map((item) => (
      //        <Select.Option key={item.id} value={item.id}>
      //          Kỳ {item.ten_ky_nam_hoc} năm học {item.nam_hoc_id[1]}
      //        </Select.Option>
      //      ))}
      //    </Select>
      //    }
      // </>
      // }
    />
  );
};

export default LopTinChi;
