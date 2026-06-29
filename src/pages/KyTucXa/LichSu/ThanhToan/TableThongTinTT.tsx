import TableBase from "@/components/Table";
import { IColumn } from "@/components/Table/typing";
import { useIntl, useModel } from "umi";
import { Tag } from "antd";
import dayjs from '@/utils/dayjs';

const TableThongTinThanhToanKTX = () =>{
    const intl = useIntl();
    const { record: ktxRecord } = useModel('kytucxa.dangky');

    const columns: IColumn<any>[] = [
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.description' }),
                dataIndex: 'ten',
                width: 200,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.unitPrice' }),
                dataIndex: 'unitAmount',
                width: 150,
                render: (val) => val ? `${val.toLocaleString('vi-VN')} VND` : '---',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.multiplier' }),
                dataIndex: 'heSo',
                width: 120,
                align: 'center',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.qty' }),
                dataIndex: 'quantity',
                width: 100,
                align: 'center',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.amount' }),
                dataIndex: 'amountDue',
                width: 150,
                render: (val) => val ? `${val.toLocaleString('vi-VN')} VND` : '---',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.discount' }),
                dataIndex: 'amountDiscount',
                width: 120,
                render: (val) => val ? `${val.toLocaleString('vi-VN')} VND` : '0 VND',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.createdAt' }),
                dataIndex: 'createdAt',
                width: 150,
                render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '---',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.status' }),
                dataIndex: 'status',
                width: 120,
                align: 'center',
                render: (val) => (
                    <Tag color={val === 'PAID' ? 'success' : 'warning'}>
                        {val === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                ),
            },
        ];
    
    return (
        <>
            <TableBase
                columns={columns}
                modelName='taichinh.hoadonchitiet'
                dependencies={[ktxRecord?.identityCode]}
                externalConditions={ktxRecord?.identityCode ? [{ field: 'billIdentityCode', value: ktxRecord.identityCode }] : []}
                buttons={{ create: false, globalSearch: false, filter: false, columnSetting: false }}
            />
        </>
    );
};

export default TableThongTinThanhToanKTX;