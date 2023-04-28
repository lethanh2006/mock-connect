import Table from '@/components/Table/Table';
import { type IColumn } from '@/components/Table/typing';

const ChiTietDichVu = (props: { thongTinChiTiet: any[] }) => {
  const columns: IColumn<any>[] =
    props?.thongTinChiTiet?.length > 0
      ? Object?.keys(props?.thongTinChiTiet?.[0])?.map((item) => ({
          title: item,
          dataIndex: item,

          width: 200,
        }))
      : [];

  return (
    <Table
      otherProps={{
        pagination: false,
      }}
      columns={columns}
      data={props?.thongTinChiTiet ?? []}
    />
  );
};

export default ChiTietDichVu;
