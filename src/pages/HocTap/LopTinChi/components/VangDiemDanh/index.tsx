import TableBaseStatic from '@/components/Table/Table';
import type { BuoiHoc } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import moment from 'moment';

const VangDiemDanh = (props: { data: any[] }) => {
  const { data } = props;

  const columnsVang: IColumn<BuoiHoc.Record>[] = [
    {
      dataIndex: 'index',
      title: 'STT',
      align: 'center',
      width: 60,
    },
    {
      dataIndex: 'ngay_bd',
      title: 'Ngày học',
      align: 'center',
      width: 100,
      render: (s) => s && moment(s, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    },
    {
      dataIndex: 'ngay_gio_hoc',
      title: 'Thời gian',
      align: 'center',
      width: 100,
      render: (s, r) => (
        <>
          {r?.ngay_gio_hoc && moment(r.ngay_gio_hoc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')} -{' '}
          {r?.ngay_gio_ket_thuc &&
            moment(r.ngay_gio_ket_thuc, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')}
        </>
      ),
    },
    {
      dataIndex: 'trang_thai',
      title: 'Trạng thái',
      align: 'center',
      width: 100,
    },
  ];

  return (
    <TableBaseStatic
      otherProps={{ size: 'small' }}
      columns={columnsVang}
      data={data
        .sort((a, b) => moment(a?.ngay_gio_hoc).diff(b?.ngay_gio_hoc))
        .map((item, index) => ({ ...item, index: index + 1 }))}
    />
  );
};

export default VangDiemDanh;
