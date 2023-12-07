import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	transactionPaymentLabel,
	type ETransactionPaymentType,
	ETransactionSourceType,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const LichSuThanhToan = () => {
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, danhSach } = useModel('taichinh.giaodich');

	const getData = () => record?._id && getAllModel(undefined, undefined, { identityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?._id]);

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			align: 'right',
			width: 120,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{ title: 'Người thực hiện', dataIndex: 'payerFullname', width: 150, filterType: 'string' },
		{
			title: 'Loại giao dịch',
			width: 120,
			render: (val, rec) => {
				switch ((rec.fromAccount, rec.toAccount)) {
					case (ETransactionSourceType.EXTERNAL, ETransactionSourceType.WALLET):
						return <>Nộp tiền</>;
					case (ETransactionSourceType.WALLET, ETransactionSourceType.SYSTEM):
						return <>Thanh toán</>;
					case (ETransactionSourceType.SYSTEM, ETransactionSourceType.WALLET):
						return <>Hoàn trả</>;
					default:
						return null;
				}
			},
		},
		{
			title: 'Thời gian',
			align: 'center',
			dataIndex: 'transactionDate',
			width: 120,
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Hình thức',
			dataIndex: 'paymentType',
			width: 120,
			render: (val: ETransactionPaymentType, rec) => transactionPaymentLabel?.[val as ETransactionPaymentType] ?? '',
		},
	];

	return <TableStaticData columns={columns} data={danhSach} addStt size='small' />;
};

export default LichSuThanhToan;
