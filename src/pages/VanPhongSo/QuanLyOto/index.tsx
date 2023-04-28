import TableBase from '@/components/Table';
import type { IColumn } from '@/utils/interfaces';
import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  Popconfirm,
  Tooltip,
  Button,
  Divider,
  Modal,
  Form,
  Table,
  Typography,
  Dropdown,
  Menu,
} from 'antd';
import { useModel } from 'umi';
import { useEffect, useState } from 'react';
import FormOto from './components/FormOto';
import UploadOne from './components/UploadFileOne';
import rules from '@/utils/rules';
import './style.less';
import type { QuanLyOto } from '@/services/QuanLyOto/typings';
import { ELoaiXe } from '@/utils/constants';

const QuanLyOTo = () => {
  const [form] = Form.useForm();
  const {
    getQuanLyOtoPageableModel,
    loading,
    limit,
    condition,
    page,
    deleteQuanLyOtoModel,
    setRecord,
    setEdit,
    setVisibleForm,
    exportListXeModel,
    importListXeModel,
    dataImportResponse,
    visiblePreview,
    setVisiblePreview,
    record,
  } = useModel('quanlyoto');
  const [selectedRows, setSelectedRows] = useState<{ keys: any[]; rows: any[] }>();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const listIdOto: string[] = [];
  selectedRows?.rows.map((item: QuanLyOto.Record) => {
    listIdOto.push(item._id);
  });

  useEffect(() => {
    setSelectedRows(undefined);
  }, [page]);

  const onFinishHandle = async (values: any) => {
    values.file = values?.file?.fileList?.[0]?.originFileObj;
    await importListXeModel(values).then(() => {
      setVisible(false);
    });
    form.resetFields();
  };

  const columns: IColumn<QuanLyOto.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: 'Tên cán bộ',
      dataIndex: 'hoTen',
      align: 'center',
      search: 'search',
      width: 120,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      align: 'center',
      width: 150,
    },
    {
      title: 'Biển số xe',
      dataIndex: 'bienSoXe',
      align: 'center',
      width: 120,
      search: 'search',
    },
    {
      title: 'Hãng xe',
      dataIndex: 'hangXe',
      align: 'center',
      width: 120,
      search: 'search',
    },
    {
      title: 'Tên xe',
      dataIndex: 'tenXe',
      align: 'center',
      width: 120,
      search: 'search',
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      align: 'center',
      width: 120,
      search: 'search',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      search: 'search',
      width: 150,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right',
      render: (recordTemp: QuanLyOto.Record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              shape="circle"
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setRecord(recordTemp);
                setVisibleDetail(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />

          <Tooltip title="Chỉnh sửa">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord(recordTemp);
                setEdit(true);
                setVisibleForm(true);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa thông tin này không?"
              onConfirm={() => deleteQuanLyOtoModel([recordTemp?._id])}
            >
              <Button shape="circle" type="primary" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const columnsData: any[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 80,
    },
    {
      title: 'Tên cán bộ',
      dataIndex: 'Họ và tên*',
      align: 'center',
      width: 250,
    },
    {
      title: 'Đơn vị',
      dataIndex: 'Đơn vị*',
      align: 'center',
      width: 200,
    },
    {
      title: 'Biển số xe',
      dataIndex: 'Biển số xe*',
      align: 'center',
      width: 200,
    },
    {
      title: 'Hãng xe',
      dataIndex: 'Hãng xe*',
      align: 'center',
      width: 200,
    },
    {
      title: 'Tên xe',
      dataIndex: 'Tên xe',
      align: 'center',
      width: 200,
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'Số điện thoại',
      align: 'center',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      align: 'center',
    },
  ];

  const deleteConfirm = () => {
    Modal.confirm({
      title: 'Bạn có chắc muốn xóa tất cả danh sách xe không?',
      icon: <DeleteOutlined />,
      okText: 'Xác nhận xóa tất cả',
      cancelText: 'Đóng',
      content:
        'Danh sách sẽ bị xóa và không thể lấy lại được dữ liệu, bạn nên cân nhắc trước khi xóa!',
      onOk() {
        deleteQuanLyOtoModel([]);
      },
    });
  };

  return (
    <>
      <TableBase
        columns={columns}
        formType="Drawer"
        widthDrawer={700}
        getData={getQuanLyOtoPageableModel}
        loading={loading}
        dependencies={[page, limit, condition]}
        modelName="quanlyoto"
        title="Quản lý ô-tô cá nhân"
        otherProps={{
          scroll: { x: 1100 },
          rowSelection: {
            selectedRowKeys: selectedRows?.keys,
            onChange: (selectedRowKeys, rows) => setSelectedRows({ keys: selectedRowKeys, rows }),
          },
        }}
        hascreate
        Form={FormOto}
        maskCloseableForm
        otherButtons={
          <>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={() =>
                      window.open(
                        'https://dhs.aisenote.com/odoo-user-service/file/6361ede436f29de9284bf3c3/template-oto.xlsx',
                      )
                    }
                  >
                    Tải mẫu
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => setVisible(true)}>
                    Import danh sách
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
            >
              <Button icon={<ImportOutlined />} type="primary">
                Import dữ liệu
              </Button>
            </Dropdown>
            <Popconfirm
              title={'Bạn có chắc muốn export tất cả danh sách xe không?'}
              onConfirm={() => exportListXeModel([])}
            >
              <Button icon={<ExportOutlined />} style={{ marginLeft: '10px' }}>
                Export tất cả
              </Button>
            </Popconfirm>
            {selectedRows && selectedRows?.keys?.length > 0 && (
              <Popconfirm
                title={'Bạn có chắc muốn export danh sách xe này không?'}
                onConfirm={() =>
                  exportListXeModel(listIdOto).then(() => setSelectedRows({ keys: [], rows: [] }))
                }
              >
                <Button type="primary" style={{ marginLeft: '10px' }}>
                  Export {`${selectedRows?.keys?.length}`} mục đã chọn
                </Button>
              </Popconfirm>
            )}
            <Divider type="vertical" />
            <Button danger type="link" style={{ padding: '0' }} onClick={() => deleteConfirm()}>
              Xóa tất cả
            </Button>
            {selectedRows && selectedRows?.keys?.length > 0 && (
              <Popconfirm
                title={'Bạn có chắc muốn xóa danh sách xe này không?'}
                onConfirm={() =>
                  deleteQuanLyOtoModel(listIdOto).then(() =>
                    setSelectedRows({ keys: [], rows: [] }),
                  )
                }
              >
                <Button danger type="link" style={{ margin: '0 5px 5px' }}>
                  Xóa {`${selectedRows?.keys?.length}`} mục đã chọn
                </Button>
              </Popconfirm>
            )}
          </>
        }
      />
      <Modal
        title="Import danh sách xe"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        onOk={() => form.validateFields().then(onFinishHandle)}
        okText="Import"
        okButtonProps={{ loading, icon: <ImportOutlined /> }}
        destroyOnClose
      >
        <Form form={form}>
          <Form.Item name="file" rules={[...rules.fileRequired]}>
            <UploadOne />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Preview import danh sách xe"
        visible={visiblePreview}
        onCancel={() => {
          setVisiblePreview(false);
        }}
        destroyOnClose
        width={1100}
        bodyStyle={{ paddingTop: '0' }}
        footer={[
          <Button
            key={'ok'}
            type="primary"
            onClick={() => {
              setVisiblePreview(false);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        {dataImportResponse && dataImportResponse?.dataHopLe?.length > 0 && (
          <>
            <h3 style={{ marginTop: '0' }}>Danh sách hợp lệ</h3>
            <Table
              dataSource={dataImportResponse?.dataHopLe?.map((values, index) => {
                return {
                  ...values,
                  index: index + 1,
                };
              })}
              columns={columnsData}
              pagination={false}
            />
          </>
        )}
        {dataImportResponse && dataImportResponse?.dataKhongHopLe?.length > 0 && (
          <>
            <h3 style={{ marginTop: '25px' }}>Danh sách không hợp lệ</h3>
            <Table
              dataSource={dataImportResponse?.dataKhongHopLe?.map((values, index) => {
                return {
                  ...values,
                  index: index + 1,
                };
              })}
              columns={columnsData}
              pagination={false}
            />
          </>
        )}
        {dataImportResponse && dataImportResponse?.dataTrung?.length > 0 && (
          <>
            <h3 style={{ marginTop: '25px' }}>Danh sách trùng</h3>

            <Table
              dataSource={dataImportResponse?.dataTrung?.map((values, index) => {
                return {
                  ...values,
                  index: index + 1,
                };
              })}
              columns={columnsData}
              pagination={false}
            />
          </>
        )}
      </Modal>
      <Modal
        title="Chi tiết"
        visible={visibleDetail}
        onCancel={() => {
          setVisibleDetail(false);
        }}
        destroyOnClose
        width={500}
        footer={[
          <Button
            key={'ok'}
            type="primary"
            onClick={() => {
              setVisibleDetail(false);
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        <Typography.Paragraph>Họ và tên: {record?.hoTen}</Typography.Paragraph>
        <Typography.Paragraph>Đơn vị: {record?.donVi}</Typography.Paragraph>
        <Typography.Paragraph>Biển số xe: {record?.bienSoXe}</Typography.Paragraph>
        <Typography.Paragraph>Hãng xe: {record?.hangXe}</Typography.Paragraph>
        <Typography.Paragraph>Tên xe: {record?.tenXe}</Typography.Paragraph>
        <Typography.Paragraph>Số điện thoại: {record?.soDienThoai}</Typography.Paragraph>
        <Typography.Paragraph>Email: {record?.email}</Typography.Paragraph>
        <Typography.Paragraph>
          Loại xe: {ELoaiXe[record?.loaiXe ?? ''] ?? record?.loaiXe}
        </Typography.Paragraph>
      </Modal>
    </>
  );
};

export default QuanLyOTo;
