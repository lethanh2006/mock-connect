import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import FormGuiPhanHoi from './components/FormGuiPhanHoi';
import ModalDetailPhanhoi from './components/ModalDetail';

const PhanHoiPage = () => {
  const { setCondition, handleEdit, edit } = useModel('tienich.phanhoi');
  const [daTraLoi, setDaTraLoi] = useState<boolean>();

  const onCell = (rec: PhanHoi.IRecord) => ({
    onClick: () => handleEdit(rec),
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<PhanHoi.IRecord>[] = [
    {
      title: 'Nội dung phản hồi',
      dataIndex: 'noiDungPhanHoi',
      width: 250,
      render: (val) => <ExpandText>{val}</ExpandText>,
      sortable: true,
      filterType: 'string',
      onCell,
    },
    {
      title: 'Loại phản hồi',
      dataIndex: 'loaiPhanHoi',
      width: 100,
      filterType: 'select',
      filterData: Object.values(ELoaiPhanHoi),
      onCell,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
      width: 120,
      sortable: true,
      filterType: 'datetime',
      onCell,
    },
    {
      title: 'Đã trả lời',
      dataIndex: 'daTraLoiPhanHoi',
      align: 'center',
      hide: daTraLoi === false,
      render: (val) => <Checkbox checked={val} />,
      width: 80,
      onCell,
    },
    {
      title: 'Câu trả lời',
      dataIndex: 'noiDungTraLoiPhanHoi',
      hide: daTraLoi === false,
      width: 250,
      render: (val) => <ExpandText>{val}</ExpandText>,
      onCell,
    },
    {
      title: 'Người trả lời',
      dataIndex: 'maChuyenVien',
      hide: daTraLoi === false,
      width: 120,
      onCell,
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
      onCell,
    },
    {
      title: 'Thao tác',
      width: 60,
      align: 'center',
      fixed: 'right',
      render: (val, rec) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleEdit(rec)} />
          </Tooltip>
        </>
      ),
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
      Form={edit ? ModalDetailPhanhoi : FormGuiPhanHoi}
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
