import TableBase from "@/components/Table";
import { IColumn } from "@/components/Table/typing";
import { useIntl } from "umi";

const TableThongTinThanhToanKTX = () =>{
    const intl = useIntl();

    const columns: IColumn<any>[] = [
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.description' }),
                width: 200,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.unitPrice' }),
                width: 150,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.multiplier' }),
                width: 120,
                align: 'center',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.qty' }),
                width: 100,
                align: 'center',
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.amount' }),
                width: 150,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.discount' }),
                width: 120,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.createdAt' }),
                width: 150,
            },
            {
                title: intl.formatMessage({ id: 'kytucxa.payment.table.status' }),
                width: 120,
                align: 'center',
            },
        ];
    
    return (
        <>
            <TableBase
                columns={columns}
                modelName='kytucxa.dangky'
                dataState='dummyList'
                dependencies={[]}
                buttons={{ create: false, globalSearch: false, filter: false, columnSetting: false }}
            />
        </>
    );
};

export default TableThongTinThanhToanKTX;