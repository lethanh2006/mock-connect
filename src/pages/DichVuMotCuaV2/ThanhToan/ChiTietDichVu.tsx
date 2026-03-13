import { Table } from 'antd';

const ChiTietDichVu = (props: { thongTinChiTiet: any[] }) => {
  const columns: any[] =
    props?.thongTinChiTiet?.length > 0
      ? Object?.keys(props?.thongTinChiTiet?.[0])?.map((item) => ({
          title: item,
          dataIndex: item,
          align: 'center',
          width: 200,
        }))
      : [];

  return <Table columns={columns} dataSource={props?.thongTinChiTiet ?? []} />;
};

export default ChiTietDichVu;
