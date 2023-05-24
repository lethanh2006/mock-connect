import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import { ELoaiNhuCauHocPhan } from '@/services/DaoTao/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import FormKhoaNganhDotDangKy from './Form';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';

const NhuCauHocPhanPage = (props: { getDataPhieu?: any }) => {
  const { getModel, page, limit, deleteModel } = useModel('daotao.nhucauhocphan');
  const { record: recNhuCau } = useModel('daotao.dangkynhucau');

  const getData = () => {
    getModel({ banDkNhuCauId: recNhuCau?._id });
    if (props.getDataPhieu) props.getDataPhieu();
  };

  const columns: IColumn<DangKyNhuCau.INhuCauHocPhan>[] = [
    {
      title: 'Mã học phần',
      width: 100,
      render: (val, rec) => rec.hocPhan?.ma,
    },
    {
      title: 'Tên học phần',
      width: 180,
      filterType: 'customselect',
      filterCustomSelect: <SelectHocPhan multiple />,
      render: (val, rec) => rec.hocPhan?.ten,
    },
    {
      title: 'Số tín chỉ',
      width: 80,
      render: (val, rec) => rec.hocPhan?.soTinChi,
      align: 'center',
    },
    {
      title: 'Loại nhu cầu',
      dataIndex: 'loaiNhuCauHocPhan',
      width: 150,
      filterType: 'select',
      filterData: Object.values(ELoaiNhuCauHocPhan),
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (record: DangKyNhuCau.INhuCauHocPhan) => (
        <>
          <Tooltip title="Loại bỏ">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getData)}
              title="Bạn có chắc chắn muốn bỏ học phần này khỏi phiếu đăng ký?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <TableBase
        columns={columns}
        getData={getData}
        dependencies={[page, limit]}
        modelName="hocky.nhucauhocphan"
        title="Đăng ký nhu cầu sinh viên"
        Form={FormKhoaNganhDotDangKy}
        formProps={{ getData }}
        hideCard
      />
    </>
  );
};

export default NhuCauHocPhanPage;
