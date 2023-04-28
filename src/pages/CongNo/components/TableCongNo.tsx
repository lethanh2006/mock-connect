/* eslint-disable no-underscore-dangle */
import TableBase from '@/components/Table';
import ThanhToan from '@/components/ThanhToan';
import data from '@/utils/data';
import { currencyFormat, useCheckAccess } from '@/utils/utils';
import { EyeOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, Input, Menu, Modal, Select, Tabs, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useModel } from 'umi';
import Form from './Form';
import TableKetQuaImport from './TableKetQuaImport';
import { PhamVi } from '@/services/CongNo/constant';
import { type IColumn } from '@/components/Table/typing';
import RenderFilter from './RenderFilter';

const TableCongNo = (props: { type?: 'chưa nộp' | 'đã nộp' }) => {
  const access = useAccess();
  const {
    loading,
    page,
    limit,
    condition,
    getMyInvoiceModel,
    getInvoiceModel,
    setInvoice,
    invoice,
    setPostTypeCongNo,
    setVisibleForm,
    thongKeMyInvoiceModel,
    setRecordThongKeInvoice,
    recordThongKeInvoice,
    setCondition,
    setImportType,
    setEdit,
    visibleResponseImport,
    responseImportInvoice,
    setVisibleResponseImport,
    setPage,
    setPhamVi,
    phamVi,
  } = useModel('thanhtoan');

  const canCreate = useCheckAccess('hoa-don:create');

  const { getAllHinhThucDaoTaoModel, danhSachHinhThucDaoTao } = useModel('hoctap.lophanhchinh');

  const { getUserModel, condition: condUser } = useModel('user');

  const { getLoaiThanhToanModel, setDanhSach, danhSach } = useModel('loaithanhtoan');

  const { danhSach: danhSachNamHoc } = useModel('namhoc');
  const { danhSach: danhSachHocKy } = useModel('HocKy');

  const [visible, setVisible] = useState<boolean>(false);

  const [dinhKy, setDinhKy] = useState<string>('');

  useEffect(() => {
    if (!access.sinhVien) {
      getLoaiThanhToanModel(1, 1000);
      getAllHinhThucDaoTaoModel();
    }

    return () => {
      setDanhSach([]);
      setRecordThongKeInvoice({} as ThanhToan.ThongKeInvoice);
    };
  }, []);

  useEffect(() => {
    if (!access.sinhVien) getUserModel({ pageParam: 1, limitParam: 100 });
  }, [condUser]);

  const onChangeLoaiThanhToan = (val: string) => {
    const arrLoaiThanhToan = val?.split('||');
    setCondition({ ...condition, 'metadata.loai': arrLoaiThanhToan?.[0] });
    setDinhKy(arrLoaiThanhToan?.[1]);
  };

  const onClickMenuImportData = (item: { key: string }) => {
    setEdit(true);
    setPostTypeCongNo('import');
    setVisibleForm(true);
    setImportType(item.key === '1' ? 'các khoản chưa thu' : 'các khoản đã thu');
  };

  const columns: IColumn<ThanhToan.Invoice>[] = [
    {
      title: 'STT',
      dataIndex: 'index',

      width: 80,
    },
    {
      title: 'Thông tin sinh viên',
      dataIndex: 'customerInfo',
      hide: access?.sinhVien || false,

      width: 200,
      render: (val) => (
        <div>
          {val?.name ?? ''} {val?.customerId ? ` (${val?.customerId})` : ''}
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['metadata'],

      width: 200,
      render: (val, record: ThanhToan.Invoice) =>
        val?.loai === 'Dịch vụ một cửa' ? (
          <div>{record?.items?.[record?.items?.length - 1]?.productName ?? ''}</div>
        ) : (
          <div>
            {val?.loai || record?.items?.[0]?.productName}
            {val?.mocThoiGian ? ` (${val?.mocThoiGian})` : ''}
          </div>
        ),
    },
    {
      title: 'Trạng thái',
      dataIndex: ['status'],

      width: 140,
      hide: access.sinhVien || false,
      filterType: 'string',
      key: 'status',
      render: (val) => (
        <Tag color={val === 'open' ? '#dc3545' : '#28a745'}>
          {data?.status?.find((item: { value: string }) => item.value === val)?.text ??
            'Đã thanh toán'}
        </Tag>
      ),
    },

    {
      title: 'Số tiền phải nộp',
      dataIndex: 'amountDue',

      width: access.sinhVien ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
    },
    {
      title: 'Số tiền đã nộp',
      dataIndex: 'amountPaid',

      width: access.sinhVien ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
    },
    {
      title: 'Số tiền còn lại phải nộp',
      dataIndex: 'amountRemaining',

      width: access.sinhVien ? 140 : 120,
      render: (val) => <div>{currencyFormat(val)}đ</div>,
    },

    {
      title: 'Thao tác',

      width: 100,
      fixed: 'right',
      render: (record: ThanhToan.Invoice) => (
        <>
          <Tooltip title="Chi tiết">
            <Button
              onClick={() => {
                setInvoice(record);
                setVisible(true);
              }}
              type="primary"
              shape="circle"
            >
              <EyeOutlined />
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      scroll={{ x: access.sinhVien ? 800 : 1000 }}
      columns={columns}
      getData={
        access.sinhVien
          ? () => {
              thongKeMyInvoiceModel();
              getMyInvoiceModel();
            }
          : getInvoiceModel
      }
      loading={loading}
      dependencies={[page, limit, condition]}
      modelName="thanhtoan"
      Form={Form}
    >
      {access.sinhVien && (
        <h4 style={{ display: 'inline-block' }}>
          {`Tổng ${props?.type ?? ''}:`}
          <Input
            style={{ width: '130px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
            value={`${currencyFormat(
              props?.type === 'chưa nộp'
                ? recordThongKeInvoice?.totalRemaining ?? 0
                : recordThongKeInvoice?.totalPaid ?? 0,
            )}đ`}
            readOnly
            // ref={this.setTableBaseRef}
          />
        </h4>
      )}

      {access.nhanVien && (
        <>
          <Select
            onChange={(val) => {
              setCondition({ ...condition, metadata: { hinhThucDaoTaoId: undefined } });
              setPhamVi(val);
              setPage(1);
            }}
            style={{ width: 150, marginRight: 8 }}
            value={phamVi}
          >
            {PhamVi.map((item) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
          <Select
            disabled={phamVi === 'Tất cả'}
            allowClear
            placeholder="Lọc theo hình thức đào tạo"
            value={condition?.metadata?.hinhThucDaoTaoId}
            onChange={(val: number) => {
              setCondition({ ...condition, metadata: { hinhThucDaoTaoId: val } });
            }}
            style={{ marginBottom: 8, width: 150, marginRight: 8 }}
          >
            {danhSachHinhThucDaoTao?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.ten_hinh_thuc_dao_tao}
              </Select.Option>
            ))}
          </Select>
          <Select
            allowClear
            onChange={onChangeLoaiThanhToan}
            style={{ width: 150, marginRight: 8 }}
            placeholder="Lọc theo dịch vụ"
            showSearch
          >
            {danhSach
              ?.filter((item) =>
                condition?.metadata?.hinhThucDaoTaoId
                  ? item.hinhThucDaoTaoId === condition?.metadata?.hinhThucDaoTaoId
                  : item,
              )
              ?.map((item) => (
                <Select.Option
                  key={item?.loaiThanhToan}
                  value={`${item?.loaiThanhToan}||${item?.dinhKy}`}
                >
                  {item?.loaiThanhToan}
                </Select.Option>
              ))}
          </Select>
          {/* render từ hàm filter */}
          <RenderFilter dinhKy={dinhKy} danhSachHocKy={danhSachHocKy} />
        </>
      )}
      <Modal
        destroyOnClose
        width="850px"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            Đóng
          </Button>
        }
        visible={visible}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Tabs>
          {/* {invoice?.metadata?.loai === 'Dịch vụ một cửa' && (
            <Tabs.TabPane tab="Biểu mẫu" key={1}>
              <Form
               hideCamKet
               infoNguoiTaoDon={recordView?.thongTinNguoiTao}
               type={type}
               record={recordView}
             />
            </Tabs.TabPane>
          )} */}

          {invoice?.identityCode && (
            <Tabs.TabPane tab="Thông tin thanh toán" key={2}>
              <ThanhToan isCongNo identityCode={invoice?.identityCode} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>
      <Modal
        destroyOnClose
        width="850px"
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisibleResponseImport(false);
            }}
          >
            Đóng
          </Button>
        }
        visible={visibleResponseImport}
        bodyStyle={{ padding: 18 }}
        onCancel={() => {
          setVisibleResponseImport(false);
        }}
      >
        <Tabs>
          <Tabs.TabPane tab="Hợp lệ" key={1}>
            <TableKetQuaImport data={responseImportInvoice?.listHopLe ?? []} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Không hợp lệ" key={2}>
            <TableKetQuaImport data={responseImportInvoice?.listKhongHopLe ?? []} />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </TableBase>
  );
};

export default TableCongNo;
