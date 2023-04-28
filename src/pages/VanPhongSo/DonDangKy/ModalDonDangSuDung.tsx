import { type DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { type IColumn } from '@/utils/interfaces';
import { Card, Modal, Table } from 'antd';
import moment from 'moment';

const ModalDonDangSuDung = (props: {
  visible: boolean;
  setVisible: any;
  isXeCong: boolean;
  isPhongHop: boolean;
  dataDon: DichVuMotCuaV2.Don[];
}) => {
  const { visible, setVisible, dataDon, isPhongHop, isXeCong } = props;

  const columnsDon: IColumn<DichVuMotCuaV2.Don>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Thông tin xe',
      render: (val, rec) =>
        rec.thongTinMuonXe ? (
          <>
            Biển số: {rec.thongTinMuonXe.bienSoXe}
            <br />
            Lái xe: {rec.thongTinMuonXe.thongTinlaiXe?.[0]?.hoTen} -{' '}
            {rec.thongTinMuonXe.thongTinlaiXe?.[0]?.sdt}
          </>
        ) : null,
      width: 150,
      hide: isPhongHop,
    },
    {
      title: 'Phòng họp',
      render: (val, rec) =>
        rec.thongTinMuonPhong ? (
          <>
            Phòng: {rec.thongTinMuonPhong.soPhong}
            <br />
            Tòa nhà: {rec.thongTinMuonPhong.toaNha ?? '--'}
          </>
        ) : null,
      width: 150,
      hide: isXeCong,
    },
    {
      title: 'Cán bộ đăng ký sử dụng',
      render: (val, rec) => (
        <>
          {rec.thongTinNguoiTao?.hoTen} ({rec.thongTinNguoiTao?.maSinhVien} -{' '}
          {rec.thongTinNguoiTao?.maDonVi})
        </>
      ),
      width: 150,
    },
    {
      title: 'Thời gian đăng ký',
      dataIndex: 'createdAt',
      align: 'center',
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      width: 100,
    },
    {
      title: 'Thời gian mượn',
      dataIndex: ['thongTinMuonXe', 'thoiGianBd'],
      align: 'center',
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      width: 100,
      hide: isPhongHop,
    },
    {
      title: 'Thời gian trả',
      dataIndex: ['thongTinMuonXe', 'thoiGianKt'],
      align: 'center',
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      width: 100,
      hide: isPhongHop,
    },
    {
      title: 'Thời gian mượn',
      dataIndex: ['thongTinMuonPhong', 'thoiGianBd'],
      align: 'center',
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      width: 100,
      hide: isXeCong,
    },
    {
      title: 'Thời gian trả',
      dataIndex: ['thongTinMuonPhong', 'thoiGianKt'],
      align: 'center',
      render: (val) => <>{moment(val).format('HH:mm DD/MM/YYYY')}</>,
      width: 100,
      hide: isXeCong,
    },
  ];

  return (
    <Modal
      width={1000}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      onCancel={() => setVisible(false)}
      visible={visible}
      okButtonProps={{ hidden: true }}
      cancelText="Đóng"
    >
      <Card title="Các đơn đang sử dụng">
        <Table
          size="small"
          dataSource={dataDon.map((values, i) => ({ ...values, index: i + 1 }))}
          scroll={{ x: 600 }}
          columns={columnsDon.filter((item) => !item.hide)}
          pagination={false}
        />
      </Card>
    </Modal>
  );
};

export default ModalDonDangSuDung;
