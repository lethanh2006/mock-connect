import TableBaseStatic from '@/components/Table/Table';
import type { BuoiHoc } from '@/services/LopTinChi/typings';
import type { IColumn } from '@/utils/interfaces';
import { Radio } from 'antd';
import { useModel } from 'umi';

const DanhSachSinhVienDiemDanh = (props: { data: BuoiHoc.SinhVienDiemDanh[]; setData: any }) => {
  const { loading } = useModel('diemdanh');

  const columns: IColumn<BuoiHoc.SinhVienDiemDanh & { index: number }>[] = [
    {
      title: 'Họ và tên',
      dataIndex: 'ten_sinh_vien',
      filterType: 'string',
      width: 100,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: ['sinh_vien_id', 1],
      align: 'center',
      filterType: 'string',
      width: 90,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      align: 'center',
      render: (val, record) => (
        <Radio.Group
          onChange={(e) => {
            const dataTemp = [...props.data];
            dataTemp?.splice(record?.index - 1, 1, {
              ...props.data[record.index - 1],
              trang_thai: e.target.value,
            });
            props.setData(dataTemp);
          }}
          value={val}
        >
          <Radio value="Có mặt">Có mặt</Radio>
          <Radio value="Vắng có phép">Vắng có phép</Radio>
          <Radio value="Vắng không phép">Vắng không phép</Radio>
        </Radio.Group>
      ),
      width: 280,
    },
  ];

  return (
    <TableBaseStatic
      otherProps={{
        loading,
        size: 'small',
        scroll: { x: 500 },
        pagination: { showSizeChanger: true },
      }}
      columns={columns}
      data={props.data?.map((item, index) => ({ ...item, index: index + 1 }))}
      addStt
    />
  );
};

export default DanhSachSinhVienDiemDanh;
