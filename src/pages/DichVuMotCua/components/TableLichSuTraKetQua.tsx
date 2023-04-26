import Table from '@/components/Table/Table';
import type { IColumn } from '@/utils/interfaces';
import moment from 'moment';

const TableLichSuTraKetQua = (props: { data: DichVuMotCua.LichSuChinhSua[] }) => {
  const columns: IColumn<DichVuMotCua.LichSuChinhSua>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: 'Người chỉnh sửa',
      dataIndex: 'tenNguoiSua',
      width: 200,
    },
    {
      title: 'Nội dung',
      dataIndex: ['editContent', 'ketQuaText'],
      width: 200,
    },
    {
      title: 'File đính kèm',
      dataIndex: ['editContent', 'ketQuaDinhKem'],
      width: 200,

      render: (val: string[]) => (
        <>
          {val?.map((item, index) => (
            <>
              <a href={item} target="_blank" rel="noreferrer">
                File {index + 1}
              </a>
              <br />
            </>
          ))}
        </>
      ),
    },
    {
      title: 'Thời gian chỉnh sửa',
      dataIndex: 'editDate',
      width: 200,

      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={props.data?.map((item, index) => ({ ...item, index: index + 1 }))}
    />
  );
};

export default TableLichSuTraKetQua;
