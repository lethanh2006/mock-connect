import { Button, Card, Form, Table, Typography, message } from 'antd';
import { type IColumn } from '@/utils/interfaces';
import { useModel } from 'umi';
import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import moment from 'moment';

const FormBieuMauChonPhong = (props: {
  propsRecord: any;
  setSelectedRow: any;
  selectedRow: any;
  setVisibleChonPhong: any;
  handleDuyetDon: () => void;
}) => {
  const { loading } = useModel('dichvumotcuav2');
  const { danhSach: danhSachPhongHop } = useModel('quantriphonghop');

  const columnsPhong: IColumn<VanphongsoCsvc.PhongHopRecord>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Tòa nhà',
      dataIndex: ['info', 'toaNha'],
      align: 'center',
      width: 120,
    },
    {
      title: 'Tên phòng',
      dataIndex: ['info', 'tenPhong'],
      align: 'center',
      width: 150,
    },
    {
      title: 'Số phòng',
      dataIndex: ['info', 'soPhong'],
      align: 'center',
      width: 120,
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: ['info', 'soCho'],
      align: 'center',
      width: 120,
    },
  ];

  return (
    <Card title="Chọn phòng">
      <Typography>
        <Typography.Paragraph>
          <b>Thời gian mượn:</b>{' '}
          {moment(props?.propsRecord?.thongTinDichVu?.cauHinhBieuMau[0]?.value as string).format(
            'HH:mm DD/MM/YYYY',
          )}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Thời gian trả:</b>{' '}
          {moment(props?.propsRecord?.thongTinDichVu?.cauHinhBieuMau[1]?.value as string).format(
            'HH:mm DD/MM/YYYY',
          )}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Số người tham gia:</b>{' '}
          {props?.propsRecord?.thongTinDichVu?.cauHinhBieuMau[2]?.value as string}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Vui lòng chọn một phòng cho mượn:</b>
        </Typography.Paragraph>
      </Typography>

      <Table
        dataSource={danhSachPhongHop?.map((value: any, index: number) => {
          return { ...value, index: index + 1, key: value?._id };
        })}
        scroll={{ y: 400 }}
        columns={columnsPhong}
        size="small"
        pagination={false}
        loading={loading}
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKey: any[], row: any[]) => {
            props?.setSelectedRow(row[0] as VanphongsoCsvc.PhongHopRecord);
          },
        }}
      />
      <Form.Item style={{ textAlign: 'center', margin: '25px 0 0' }}>
        <Button
          loading={loading}
          style={{
            marginRight: 8,
            backgroundColor: '#007F3E',
            border: '1px solid #007F3E',
            color: 'white',
          }}
          htmlType="submit"
          type="primary"
          onClick={() => {
            if (!props?.selectedRow?._id) {
              message.error('Vui lòng chọn phòng họp trước khi duyệt đơn!');
              return;
            }
            props?.handleDuyetDon();
            props?.setVisibleChonPhong(false);
          }}
        >
          Lưu và duyệt đơn
        </Button>
        <Button onClick={() => props?.setVisibleChonPhong(false)}>Đóng</Button>
      </Form.Item>
    </Card>
  );
};

export default FormBieuMauChonPhong;
