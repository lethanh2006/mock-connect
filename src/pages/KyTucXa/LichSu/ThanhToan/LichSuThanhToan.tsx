import TableBase from "@/components/Table";
import { IColumn } from "@/components/Table/typing";
import { useIntl, useModel } from "umi";
import { Space, Tag } from "antd";
import dayjs from '@/utils/dayjs';

const LichSuThanhToanKTX = () => {
    const intl = useIntl();
    const { record: ktxRecord } = useModel('kytucxa.dangky');

    const columns: IColumn<any>[] = [
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.transactionId' }),
            dataIndex: 'transactionId',
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.category' }),
            dataIndex: 'name',
            width: 120,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.amount' }),
            dataIndex: 'amount',
            width: 150,
            render: (val) => val ? `${val.toLocaleString('vi-VN')} VND` : '0 VND',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.paymentMethod' }),
            dataIndex: 'paymentType',
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.status' }),
            dataIndex: 'status',
            width: 120,
            align: 'center',
            render: (val) => {
                let color = 'default';
                if (val === 'SUCCESS') color = 'success';
                else if (val === 'PENDING') color = 'warning';
                else if (val === 'FAILED' || val === 'CANCELLED') color = 'error';
                return <Tag color={color}>{val}</Tag>;
            }
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.payer' }),
            dataIndex: 'userFullname',
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.date' }),
            dataIndex: 'createdAt',
            width: 150,
            render: (val) => val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '---',
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <TableBase
                columns={columns}
                modelName='taichinh.giaodich'
                dependencies={[ktxRecord?.identityCode]}
                externalConditions={ktxRecord?.identityCode ? [{ field: 'billIdentityCode', value: ktxRecord.identityCode }] : []}
                buttons={{ create: false, globalSearch: false, filter: false, reload: true, columnSetting: false }}
            />
        </Space>
    );
};

export default LichSuThanhToanKTX;
