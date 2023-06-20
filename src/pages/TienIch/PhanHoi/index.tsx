import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { PaperClipOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';
import { useState } from 'react';

const PhanHoiPage = () => {
  const { setCondition } = useModel('tienich.phanhoi');
  const [daTraLoi, setDaTraLoi] = useState<boolean>();

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      width: 200,
      render: (val) => <ExpandText>{val}</ExpandText>,
      sortable: true,
      filterType: 'string',
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlPhanAnh',
      render: (val) =>
        val ? (
          <>
            <PaperClipOutlined />{' '}
            <a href={val} target="_blank" rel="noreferrer">
              File đính kèm
            </a>
          </>
        ) : null,
      width: 120,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
      width: 120,
      sortable: true,
      filterType: 'datetime',
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'noiDungTraLoiPhanHoi',
      hide: daTraLoi === false,
      width: 200,
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Thời gian trả lời',
      dataIndex: 'thoiGianTraLoi',
      align: 'center',
      render: (val, rec) => rec.daTraLoiPhanHoi && val && moment(val).format('HH:mm DD/MM/YYYY'),
      width: 120,
      hide: daTraLoi === false,
      sortable: true,
      filterType: 'datetime',
    },
  ];

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setCondition({ daTraLoiPhanHoi: value ? isAnswer : undefined });
    setDaTraLoi(value ? isAnswer : undefined);
  };

  return (
    <TableBase
      columns={columns}
      modelName="tienich.phanhoi"
      title="Phản hồi"
      Form={FormGuiPhanHoi}
      otherButtons={[
        <Select
          key="1"
          placeholder="Lọc theo trạng thái"
          onChange={onChangeTrangThai}
          allowClear
          value={daTraLoi === undefined ? undefined : daTraLoi ? 'Đã trả lời' : 'Chưa trả lời'}
          style={{ width: 200, marginBottom: 12, marginRight: 8 }}
          options={['Chưa trả lời', 'Đã trả lời']?.map((item) => ({
            key: item,
            value: item,
            label: item,
          }))}
        />,
      ]}
    />
  );
};

export default PhanHoiPage;
