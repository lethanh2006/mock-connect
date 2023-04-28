import Table from '@/components/OldTable/Table';
import type { APILopHanhChinh } from '@/services/LopHanhChinh/typings';
import { getDataLopHanhChinh } from '@/services/LopHanhChinh/lophanhchinh';
import type { IColumn } from '@/utils/interfaces';
import { Card, Select } from 'antd';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

const DanhSachLopHanhChinhGiangVien = () => {
  const {
    setRecord,
    getAllHinhThucDaoTaoModel,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    danhSachHinhThucDaoTao,
    loading,
    setLoading,
  } = useModel('lophanhchinh');
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data[]>([]);
  useEffect(() => {
    getAllHinhThucDaoTaoModel();
  }, []);
  const getData = async () => {
    setLoading(true);
    const res = await getDataLopHanhChinh('can-bo', hinhThucDaoTao);
    setLoading(false);
    setdataLopHanhChinh(res?.data?.data ?? []);
  };
  useEffect(() => {
    getData();
  }, [hinhThucDaoTao]);

  const onCell = (lophanhchinh: APILopHanhChinh.Data) => ({
    onClick: () => {
      setRecord(lophanhchinh);
      history.push(`/lophanhchinh/${lophanhchinh.id}`);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<APILopHanhChinh.Data>[] = [
    {
      title: 'STT',
      dataIndex: 'index',

      width: 80,
      onCell,
    },
    {
      title: 'Lớp',
      dataIndex: 'ten_lop_hanh_chinh',

      filterType: 'string',
      onCell,
    },
    {
      title: 'Ngành',

      dataIndex: 'nganh',
      render: (val: (number | string)[]) => <div>{val?.[1] ?? ''}</div>,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Sĩ số',

      dataIndex: 'si_so',
      width: 150,
      onCell,
    },
  ];

  return (
    <Card title="Lớp hành chính">
      <Table
        otherProps={{
          loading: loading,
        }}
        hasTotal
        columns={columns}
        data={dataLopHanhChinh?.map((item, index) => ({ ...item, index: index + 1 }))}
      >
        <Select
          allowClear
          placeholder="Lọc theo hình thức đào tạo"
          value={hinhThucDaoTao}
          onChange={(val: number) => {
            setHinhThucDaoTao(val);
          }}
          style={{ marginBottom: 8, width: 250, marginRight: 8 }}
        >
          {danhSachHinhThucDaoTao?.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.ten_hinh_thuc_dao_tao}
            </Select.Option>
          ))}
        </Select>
      </Table>
    </Card>
  );
};

export default DanhSachLopHanhChinhGiangVien;
