import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';
import { PaperClipOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const FileList = () => {
  const { record } = useModel('tienich.vanbanhuongdan');

  const columns: IColumn<VanBanHuongDan.IFile>[] = [
    {
      title: 'Tên văn bản',
      dataIndex: 'ten',
      filterType: 'string',
      width: 150,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 250,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'url',
      render: (val) =>
        val ? (
          <>
            <PaperClipOutlined />{' '}
            <a href={val} target="_blank" rel="noreferrer">
              Tệp đính kèm
            </a>
          </>
        ) : null,
      width: 120,
    },
  ];

  return (
    <>
      <TableStaticData columns={columns} data={record?.danhSachTep ?? []} hasTotal addStt />
    </>
  );
};

export default FileList;
