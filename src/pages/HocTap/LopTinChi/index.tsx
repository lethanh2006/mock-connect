import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type LopTinChi as ILopTinChi } from '@/services/HocTap/LopTinChi/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { history, useAccess, useModel } from 'umi';

const LopTinChi = () => {
  const access = useAccess();

  const {
    setRecord: setRecordLopTinChi,
    hinhThucDaoTao,
    setCondition,
    condition,
    getAllModel: getAllLopHocPhanModel,
  } = useModel('hoctap.loptinchi');
  const { getAllModel: getAllHocKySinhVien, danhSach: danhSachHocKy } = useModel('daotao.hocky');

  // useEffect(() => {
  //   if (access.nhanVien) getAllHinhThucDaoTaoModel(true);
  //   getAllLopHocPhanModel();
  // }, []);

  useEffect(() => {
    if (access.nhanVien) console.log();
    else {
      getAllHocKySinhVien();
    }
  }, [hinhThucDaoTao]);

  const onCell = (loptinchi: ILopTinChi.IRecord) => ({
    onClick: () => {
      setRecordLopTinChi(loptinchi);
      history.push(`/hoc-tap/lop-tin-chi/${loptinchi._id}`);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ILopTinChi.IRecord>[] = [
    {
      title: 'Tên lớp học',
      dataIndex: 'ten',
      width: 100,
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
  ];

  return (
    <TableBase
      columns={columns}
      modelName="hoctap.loptinchi"
      title="Lớp tín chỉ"
      buttons={{ create: false }}
      getData={() => getAllLopHocPhanModel()}
      otherButtons={[
        <>
          <Select
            placeholder="Chọn kỳ học"
            onChange={(val) => setCondition({ ...condition, hocKyId: val })}
            style={{ width: 300 }}
            allowClear
            options={danhSachHocKy.map((item) => ({
              key: item?._id,
              value: item?._id,
              label: `Kỳ ${item?.ten}`,
            }))}
          />
        </>,
      ]}
    />
  );
};

export default LopTinChi;
