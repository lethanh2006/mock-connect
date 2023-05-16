/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import { Select, Typography } from 'antd';
import moment from 'moment';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';
import { type IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';

const PhanHoi = () => {
  const { setCondition, daTraLoi, setDaTraLoi } = useModel('phanhoi');

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'Câu hỏi',
      dataIndex: 'noiDungPhanHoi',
      align: 'left',
      width: 200,
      render: (val) => (
        <Typography.Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 2, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'File đính kèm',
      dataIndex: 'urlPhanAnh',
      align: 'center',
      render: (val) =>
        val ? (
          <a href={val} target="_blank" rel="noreferrer">
            File đính kèm
          </a>
        ) : (
          ''
        ),
      width: 200,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => <div>{moment(val).format('HH:mm DD/MM/YYYY')}</div>,
      width: 150,
    },
  ];

  const onChangeTrangThai = (value: string) => {
    const isAnswer = value === 'Đã trả lời';
    setCondition({ daTraLoiPhanHoi: isAnswer });
    setDaTraLoi(isAnswer);
  };

  return (
    <TableBase
      scroll={{ x: 900 }}
      columns={columns}
      modelName="phanhoi"
      title="Phản hồi"
      Form={FormGuiPhanHoi}
    >
      <Select
        placeholder="Lọc theo trạng thái"
        onChange={onChangeTrangThai}
        value={daTraLoi ? 'Đã trả lời' : 'Chưa trả lời'}
        style={{ width: 220, marginBottom: 8, marginRight: 8 }}
      >
        {['Đã trả lời', 'Chưa trả lời']?.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
      ,
    </TableBase>
  );
};

export default PhanHoi;
