import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { LopTinChi as ILopTinChi } from '@/services/LopTinChi/typings';
import { Select } from 'antd';
import { useEffect } from 'react';
import { history, useAccess, useModel } from 'umi';

const LopTinChi = () => {
  const access = useAccess();

  const {
    loading,
    setDanhSach,
    setRecord: setRecordLopTinChi,
    record,
    hinhThucDaoTao,
    setHinhThucDaoTao,
  } = useModel('hoctap.loptinchi');
  // const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  const { getAllModel: getAllHocKySinhVien, setRecord, danhSach } = useModel('hocky');

  //   useEffect(() => {
  //   if (access.nhanVien) getAllHinhThucDaoTaoModel(true);
  // }, []);

  useEffect(() => {
    // if (access.nhanVien) getAllHocKyByHinhThucDaoTaoGiangVienModel(hinhThucDaoTao);
    // else {
    getAllHocKySinhVien();
    // }
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
      title: 'Mã lớp học',
      dataIndex: 'ten',
      align: 'center',
      width: 200,
      onCell,
    },
    {
      title: 'Mã học phần',
      dataIndex: ['hocPhan', 'ma'],
      align: 'center',
      width: 120,
      onCell,
    },
    {
      title: 'Tên học phần',
      dataIndex: ['hocPhan', 'ten'],
      align: 'center',
      width: 120,
      onCell,
    },
  ];

  const onChangeKyHoc = (value: string) => {
    const HocKy: HocKy.IRecord | undefined = danhSach.find(
      (item: HocKy.IRecord) => item._id === value,
    );
    setRecord(HocKy);
  };

  const onChangeHeDaoTao = (value: number) => {
    setHinhThucDaoTao(value);
    setDanhSach([]);
    setRecord({} as HocKy.IRecord);
  };

  console.log(record, 'record');

  return (
    <TableBase
      columns={columns}
      params={{ idHocKy: record?._id }}
      // dependencies={[record?.id, hinhThucDaoTao]}
      modelName="hoctap.loptinchi"
      title="Lớp tín chỉ"
      otherProps={{ scroll: { x: 500 } }}
      pageable={false}
      buttons={{ create: false }}
      otherButtons={[
        <>
          {/* {access.nhanVien && (
            <Select
              placeholder="Chọn hệ đào tạo"
              onChange={onChangeHeDaoTao}
              value={hinhThucDaoTao === -1 ? undefined : hinhThucDaoTao}
              style={{ width: 220, marginBottom: 8, marginRight: 8 }}
            >
              {danhSachHinhThucDaoTao?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item?.display_name ?? ''}
                </Select.Option>
              ))}
            </Select>
          )} */}
          <Select
            placeholder="Chọn kỳ học"
            onChange={onChangeKyHoc}
            value={record?._id}
            style={{ width: 220, marginBottom: 8 }}
          >
            {danhSach?.map((item) => (
              <Select.Option key={item._id} value={item._id}>
                Kỳ {item.ten}
              </Select.Option>
            ))}
          </Select>
        </>,
      ]}
    />
  );
};

export default LopTinChi;
