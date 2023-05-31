/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import type { BieuMau } from '@/services/BieuMau/typings';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';
import { ELoaiBieuMau } from '@/services/BieuMau/constants';
import { type DotKhaoSat } from '@/services/KhaoSat/DotKhaoSat/typings';
import { EThoiGianDot, MapKeyThoiGianDot } from '@/services/KhaoSat/DotKhaoSat/constants';
import { type IColumn } from '@/components/Table/typing';

const QuanLyDot = () => {
  const {
    loading,
    setEdit,
    setVisibleForm,
    setRecord,
    getDotMeModel,
    page,
    limit,
    condition,
    setThoiGian,
    thoiGian,
    sort,
  } = useModel('khaosat.dotkhaosat');

  const { getBieuMauByIdModel, initBieuMauTracNghiemModel } = useModel('bieumau');

  const handleEdit = async (record: DotKhaoSat.Record) => {
    setRecord(record);
    setEdit(true);
    const bieuMau: BieuMau.Record = await getBieuMauByIdModel(record?.idKhaoSat);
    if (bieuMau.loai === ELoaiBieuMau.TRAC_NGHIEM) {
      await initBieuMauTracNghiemModel(record._id, record?.idKhaoSat ?? '');
    }
    setVisibleForm(true);
  };

  const textThucHienKhaoSat = {
    [EThoiGianDot.CHUA_DIEN_RA]: 'Khảo sát chưa bắt đầu',
    [EThoiGianDot.DANG_DIEN_RA]: 'Thực hiện khảo sát',
    [EThoiGianDot.DA_DIEN_RA]: 'Khảo sát đã kết thúc',
  };

  const columns: IColumn<DotKhaoSat.Record>[] = [
    {
      title: 'Tên đợt',
      dataIndex: 'ten',
      width: 200,
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 200,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      // columnKey: 'thoiGianBatDau',
      width: 120,
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      // columnKey: 'thoiGianKetThuc',
      width: 200,
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
    },

    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: DotKhaoSat.Record) => (
        <Tooltip
          title={record?.daLam ? 'Bạn đã thực hiện khảo sát này' : textThucHienKhaoSat[thoiGian]}
        >
          <Button
            loading={loading}
            disabled={record?.daLam || thoiGian !== EThoiGianDot.DANG_DIEN_RA}
            onClick={() => handleEdit(record)}
            type="link"
            icon={<EditOutlined />}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      getData={getDotMeModel}
      dependencies={[page, limit, condition, thoiGian, sort]}
      modelName="khaosat.dotkhaosat"
      title="Đợt khảo sát"
      Form={Form}
      formType="Drawer"
      widthDrawer={900}
      otherButtons={[
        <Select
          key="1"
          onChange={(val) => setThoiGian(val)}
          style={{ width: 200 }}
          options={Object.values(EThoiGianDot).map((item) => ({
            value: item,
            label: MapKeyThoiGianDot[item],
          }))}
          value={thoiGian}
        />,
      ]}
    />
  );
};

export default QuanLyDot;
