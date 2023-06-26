import TinyEditor from '@/components/TinyEditor';
import Upload from '@/components/Upload/UploadFile';
import { getThongBaoLopHanhChinhById } from '@/services/LopHanhChinh/lophanhchinh';
import {
  addThongBao,
  addThongBaoLopHanhChinh,
  getThongBaoLopTinChiById,
} from '@/services/LopTinChi/loptinchi';
import rules from '@/utils/rules';
import { removeHtmlTags, uploadMultiFile } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Drawer, Form, Input, message, Modal, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const ThongBao = (props: { id: number; isNhanVien?: boolean; typeLop: string }) => {
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [recordTB, setRecordTB] = useState<ThongBao.Record>();
  const [state, setstate] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataThongBao, setdataThongBao] = useState<ThongBao.Record[]>([]);
  const [form] = Form.useForm();
  const { id: idLop, isNhanVien, typeLop } = props;

  const getData = async () => {
    const res =
      typeLop === 'LopTinChi'
        ? await getThongBaoLopTinChiById({
            page,
            limit,
            idLop,
            role: isNhanVien ? 'giang-vien' : 'sinh-vien',
          })
        : await getThongBaoLopHanhChinhById({
            idLop,
            role: isNhanVien ? 'can-bo' : 'sinh-vien',
            data: { page, limit },
          });
    setTotal(res?.data?.data?.total);
    setdataThongBao(res?.data?.data?.result);
  };

  useEffect(() => {
    getData();
    form.setFieldsValue({
      title: undefined,
      htmlContent: undefined,
    });
  }, [idLop, isNhanVien, state, page, limit]);

  const dsThongBao = dataThongBao?.map((value, index) => ({
    ...value,
    index: index + 1 + (page - 1) * limit,
  }));

  const viewThongBao = (rc: ThongBao.Record) => {
    setVisibleModal(true);
    setRecordTB(rc);
  };

  const onCell = (rc: ThongBao.Record) => ({
    onClick: () => viewThongBao(rc),
    style: { cursor: 'pointer' },
  });

  const columns: ProColumns<ThongBao.Record>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      align: 'center',
      width: 60,
      onCell,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      width: 150,
      render: (s) => (
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: false }} style={{ marginBottom: 0 }}>
          {s}
        </Typography.Paragraph>
      ),
      onCell,
    },
    {
      title: 'Nội dung',
      dataIndex: 'htmlContent',
      render: (val) => (
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: false }} style={{ marginBottom: 0 }}>
          <div dangerouslySetInnerHTML={{ __html: removeHtmlTags(val?.toString() ?? '') }} />
        </Typography.Paragraph>
      ),
      width: 200,
      onCell,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      width: 80,
      render: (_, rc: ThongBao.Record) => (
        <span title={moment(rc.createdAt).format('DD/MM/YYYY HH:mm:ss')}>
          {moment(rc.createdAt).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
    },
  ];

  return (
    <>
      {isNhanVien && (
        <Button
          style={{ marginBottom: 8 }}
          onClick={() => {
            setVisibleDrawer(true);
          }}
          type="primary"
        >
          <PlusOutlined />
          Thêm mới
        </Button>
      )}
      <h4 style={{ display: 'inline-block', margin: '0 0px 8px 50px', float: 'right' }}>
        Tổng số:
        <Input
          style={{ width: '90px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
          value={total}
          readOnly
        />
      </h4>

      <ProTable<ThongBao.Record, API.ApiResponse>
        pagination={{
          showTotal: () => <div />,
          pageSize: limit,
          onChange: (pageNumber: number, limitNumber?: number) => {
            setPage(pageNumber);
            setLimit(limitNumber || 10);
          },
          size: 'default',
          total,
        }}
        rowKey={(rec) => rec._id}
        dataSource={dsThongBao ?? []}
        search={false}
        toolBarRender={false}
        columns={columns}
        scroll={{ x: 600 }}
      />

      <Drawer
        maskClosable={false}
        onClose={() => setVisibleDrawer(false)}
        width={800}
        visible={visibleDrawer}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values: any) => {
            setLoading(true);
            const urlFileDinhKem = await uploadMultiFile(values?.urlFile?.fileList);
            const newValues = {
              ...values,
              // imageUrl: response?.data?.data?.url,
              htmlContent: values?.htmlContent?.text,
              urlFile: urlFileDinhKem,
            };
            try {
              const res =
                props.typeLop === 'LopTinChi'
                  ? await addThongBao({ idLop: props.id, newValues })
                  : await addThongBaoLopHanhChinh({ idLop: props.id, newValues });
              if (res?.data?.statusCode === 201) {
                message.success('Thêm mới thành công');
                setstate(state + 1);
                setVisibleDrawer(false);
                setLoading(false);
                form.setFieldsValue({ urlFile: { fileList: [] } });
                return true;
              }
            } catch (error) {
              setLoading(false);
              message.error('Đã xảy ra lỗi');
            }

            return false;
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          >
            <Input placeholder="Tiêu đề" />
          </Form.Item>

          <Form.Item
            name="htmlContent"
            label="Nội dung"
            rules={[...rules.required, ...rules.requiredHtml]}
          >
            <TinyEditor />
          </Form.Item>

          <Form.Item
            extra={<div>Tối đa 5 file, dung lượng mỗi file không quá 8Mb.</div>}
            name="urlFile"
            label="File đính kèm"
          >
            <Upload
              otherProps={{
                accept: '.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar, .txt, image/*',
                maxCount: 5,
                multiple: true,
                showUploadList: { showDownloadIcon: false },
              }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
              Gửi
            </Button>
            <Button onClick={() => setVisibleDrawer(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        onCancel={() => {
          setVisibleModal(false);
        }}
        width={800}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        footer={<Button onClick={() => setVisibleModal(false)}>Đóng</Button>}
        visible={visibleModal}
      >
        {/* <ViewThongBao record={recordTB} /> */}
        View thong bao
      </Modal>
    </>
  );
};

export default ThongBao;
