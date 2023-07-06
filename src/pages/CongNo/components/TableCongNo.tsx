import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type ThanhToan } from '@/services/CongNo/ThanhToan/typings';
import { currencyFormat } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Input, Modal, Tooltip } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ThanhToanPage from '../ThanhToan';

const TableCongNo = (props: { type?: 'chưa nộp' | 'đã nộp' }) => {
  const { page, limit, thongKeMyInvoiceModel, getModel, record, setRecord, recordThongKeInvoice } =
    useModel('dvmc.thanhtoan');
  const [visible, setVisible] = useState<boolean>(false);

  const getData = () => {
    // thongKeMyInvoiceModel();
    getModel();
  };

  const onCell = (rec: ThanhToan.Invoice) => ({
    onClick: () => {
      setRecord(rec);
      setVisible(true);
    },
    style: { cursor: 'pointer' },
  });

  const columns: IColumn<ThanhToan.Invoice>[] = [
    {
      title: 'Dịch vụ',
      dataIndex: ['metadata'],
      width: 200,
      render: (val, rec) =>
        val?.loai === 'DVMC' ? (
          <div>{rec?.items?.[rec?.items?.length - 1]?.productName ?? ''}</div>
        ) : (
          <div>
            {val?.loai || rec?.items?.[0]?.productName}
            {val?.mocThoiGian ? ` (${val?.mocThoiGian})` : ''}
          </div>
        ),
      onCell,
    },
    {
      title: 'Số tiền phải nộp',
      dataIndex: 'amountDue',
      width: 120,
      render: (val) => val && <div>{currencyFormat(val)}đ</div>,
      onCell,
    },
    {
      title: 'Số tiền đã nộp',
      dataIndex: 'amountPaid',
      width: 120,
      render: (val) => val && <div>{currencyFormat(val)}đ</div>,
      onCell,
    },
    {
      title: 'Số tiền còn lại phải nộp',
      dataIndex: 'amountRemaining',
      width: 120,
      render: (val) => val && <div>{currencyFormat(val)}đ</div>,
      onCell,
    },
    {
      title: 'Thao tác',
      width: 60,
      fixed: 'right',
      align: 'center',
      render: (val, rec) => (
        <>
          <Tooltip title="Chi tiết">
            <Button
              onClick={() => {
                setRecord(rec);
                setVisible(true);
              }}
              type="link"
            >
              <EyeOutlined />
            </Button>
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
        modelName="dvmc.thanhtoan"
        buttons={{ create: false }}
        hideCard
        otherButtons={[
          <h4 style={{ display: 'inline-block' }} key="1">
            {`Tổng ${props?.type ?? ''}:`}
            <Input
              style={{ width: '130px', fontWeight: 600, fontSize: 14, marginLeft: 10 }}
              value={`${currencyFormat(
                props?.type === 'chưa nộp'
                  ? recordThongKeInvoice?.totalRemaining ?? 0
                  : recordThongKeInvoice?.totalPaid ?? 0,
              )}đ`}
              readOnly
            />
          </h4>,
        ]}
      />

      <Modal
        width={800}
        visible={visible}
        bodyStyle={{ padding: 0 }}
        onCancel={() => setVisible(false)}
        cancelText="Đóng"
        okButtonProps={{ hidden: true }}
      >
        <Card title="Thông tin thanh toán">
          {record?.identityCode && <ThanhToanPage isCongNo identityCode={record?.identityCode} />}
        </Card>
      </Modal>
    </>
  );
};

export default TableCongNo;
