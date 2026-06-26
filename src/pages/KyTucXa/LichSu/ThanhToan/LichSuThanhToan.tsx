import TableBase from "@/components/Table";
import { IColumn } from "@/components/Table/typing";
import { useIntl } from "umi";
import { Space } from "antd";

const LichSuThanhToanKTX = () => {
    const intl = useIntl();

    const columns: IColumn<any>[] = [
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.transactionId' }),
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.category' }),
            width: 120,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.amount' }),
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.paymentMethod' }),
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.status' }),
            width: 120,
            align: 'center',
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.payer' }),
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.date' }),
            width: 150,
        },
        {
            title: intl.formatMessage({ id: 'kytucxa.payment.history.table.action' }),
            width: 100,
            align: 'center',
        },
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <TableBase
                columns={columns}
                modelName='kytucxa.toanha'
                dataState='dummyList'
                dependencies={[]}
                buttons={{ create: false, globalSearch: false, filter: false, reload: true, columnSetting: false }}
            />
        </Space>
    );
};

export default LichSuThanhToanKTX;
