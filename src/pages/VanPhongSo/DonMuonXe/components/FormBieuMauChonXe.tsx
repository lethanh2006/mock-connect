import {
  Card,
  Typography,
  Table,
  Empty,
  Form,
  Row,
  Col,
  Input,
  Button,
  message,
  AutoComplete,
} from 'antd';
import moment from 'moment';
import { type IColumn } from '@/utils/interfaces';
import rules from '@/utils/rules';
import { useModel } from 'umi';

const FormBieuMauChonXe = (props: {
  propsRecord: any;
  dataXeKhacLoai: any;
  dataXeCungLoai: any;
  setVisibleChonXe: any;
  handleDuyetDon: () => void;
  handleCloseChonXe: () => void;
}) => {
  const { propsRecord, dataXeKhacLoai, dataXeCungLoai, setVisibleChonXe } = props;

  const [form] = Form.useForm();
  const { loading } = useModel('dichvumotcuav2');
  const { setLaiXe, xeChon, setXeChon } = useModel('quantrixecong');
  const { danhSach } = useModel('quanlylaixe');

  const columnsChonXe: IColumn<any>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên xe',
      dataIndex: 'tenXe',
      width: 100,
      align: 'center',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'bienSoXe',
      width: 80,
      align: 'center',
    },
    {
      title: 'Loại xe',
      dataIndex: 'loaiXe',
      width: 80,
      align: 'center',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      width: 120,
      align: 'center',
      render: (val) => (
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: <span>Xem tiếp</span> }}
        >
          {val}
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Card title="Chọn xe">
      <Typography>
        <Typography.Paragraph>
          <b>Thời gian mượn:</b>{' '}
          {moment(propsRecord?.thongTinDichVu?.cauHinhBieuMau[0]?.value as string).format(
            'HH:mm DD/MM/YYYY',
          )}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Thời gian trả:</b>{' '}
          {moment(propsRecord?.thongTinDichVu?.cauHinhBieuMau[1]?.value as string).format(
            'HH:mm DD/MM/YYYY',
          )}
        </Typography.Paragraph>
        <Typography.Paragraph>
          <b>Loại xe mượn:</b> {propsRecord?.thongTinDichVu?.cauHinhBieuMau[2]?.value as string}
        </Typography.Paragraph>
      </Typography>

      {dataXeCungLoai && dataXeKhacLoai && dataXeCungLoai.concat(dataXeKhacLoai)?.length ? (
        <Table
          pagination={false}
          size="small"
          scroll={{ x: 400, y: 400 }}
          columns={columnsChonXe}
          dataSource={dataXeCungLoai.concat(dataXeKhacLoai)?.map((values: any, i: number) => {
            return { ...values, index: i + 1, key: i };
          })}
          rowSelection={{
            type: 'radio',
            onChange: (selectedRowKey: any[], row: any[]) => {
              setXeChon(row[0] as any);
            },
          }}
        />
      ) : (
        <Empty description="Không có xe phù hợp!" />
      )}

      <Form
        form={form}
        layout={'vertical'}
        onFinish={async (values) => {
          if (!xeChon?.id) {
            message.error('Vui lòng chọn một xe bất kì!');
            return;
          }
          setLaiXe({ hoTen: values.hoTen, sdt: values.sdt });
          props?.handleDuyetDon();
          setVisibleChonXe(false);
        }}
      >
        <Row gutter={[12, 0]} style={{ marginBottom: 16, marginTop: 16 }}>
          <Col span={24}>
            <b>Thông tin lái xe</b>
          </Col>
          <Col md={12}>
            <Form.Item
              label="Họ và tên lái xe"
              rules={[...rules.required, ...rules.text, ...rules.length(100)]}
              name="hoTen"
            >
              <AutoComplete
                filterOption={(inputValue, option: any) =>
                  option!.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                options={danhSach.map((item: QuanLyLaiXe.Record) => ({
                  ...item,
                  value: item?.hoTen,
                  label: item?.hoTen + ' - ' + item?.soDienThoai,
                }))}
                onSelect={(val: any, option: any) =>
                  form.setFieldsValue({ sdt: option.soDienThoai })
                }
                placeholder="Họ và tên lái xe"
              />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              label="Số điện thoại"
              rules={[...rules.required, ...rules.soDienThoai]}
              name="sdt"
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
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
          >
            Lưu và duyệt đơn
          </Button>
          <Button onClick={() => props?.handleCloseChonXe()}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBieuMauChonXe;
