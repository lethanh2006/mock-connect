import Table from '@/components/OldTable/Table';
import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { IColumn } from '@/utils/interfaces';
import moment from 'moment';

const TableLichSuTraKetQua = (props: { data: DichVuMotCuaV2.LichSuChinhSua[] }) => {
  const columns: IColumn<DichVuMotCuaV2.LichSuChinhSua>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 80,
      align: 'center',
    },
    {
      title: 'Người chỉnh sửa',
      dataIndex: 'tenNguoiSua',
      width: 200,
      align: 'center',
    },
    {
      title: 'Nội dung',
      dataIndex: ['editContent', 'ketQuaText'],
      width: 200,
      align: 'center',
    },
    {
      title: 'File đính kèm',
      dataIndex: ['editContent', 'ketQuaDinhKem'],
      width: 200,
      align: 'center',
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
      align: 'center',
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
