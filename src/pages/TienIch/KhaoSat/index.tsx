import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import {
  EThoiGianDot,
  MapKeyThoiGianDot,
  textThucHienKhaoSat,
} from '@/services/TienIch/KhaoSat/constants';
import { EditOutlined } from '@ant-design/icons';
import { Button, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const DotKhaoSatPage = () => {
  const {
    page,
    limit,
    getDotMeModel,
    handleEdit: handleDot,
    thoiGian,
    setThoiGian,
  } = useModel('tienich.dotkhaosat');
  const { getByIdModel: getBieuMau } = useModel('tienich.bieumau');

  const handleEdit = async (record: DotKhaoSat.IRecord) => {
    await getBieuMau(record?.idKhaoSat).then((bm) => handleDot(record));
    // if (bieuMau.loai === ELoaiBieuMau.TRAC_NGHIEM) {
    //   await initBieuMauTracNghiemModel(record._id, record?.idBieuMau ?? '');
    // }
  };

  const columns: IColumn<DotKhaoSat.IRecord>[] = [
    {
      title: 'Tên đợt',
      dataIndex: 'ten',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Mô tả',
      dataIndex: 'moTa',
      width: 200,
      filterType: 'string',
      render: (val) => <ExpandText>{val}</ExpandText>,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'thoiGianBatDau',
      width: 120,
      align: 'center',
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
      filterType: 'datetime',
      sortable: true,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'thoiGianKetThuc',
      width: 120,
      align: 'center',
      render: (val) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : ''),
      filterType: 'datetime',
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (record: DotKhaoSat.IRecord) => (
        <Tooltip
          title={record?.daLam ? 'Bạn đã thực hiện khảo sát này' : textThucHienKhaoSat[thoiGian]}
        >
          <Button
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
      dependencies={[page, limit, thoiGian]}
      modelName="tienich.dotkhaosat"
      title="Đợt khảo sát"
      Form={Form}
      widthDrawer={800}
      buttons={{ create: false }}
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

export default DotKhaoSatPage;
