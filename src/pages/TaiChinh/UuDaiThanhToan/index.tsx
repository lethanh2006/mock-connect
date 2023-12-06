import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType, transactionPaymentLabel } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';

const UuDaiThanhToanPage = () => {
	const { page, limit } = useModel('taichinh.giaodich');

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Mã ưu đãi',
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tổng phần trăm',
			dataIndex: 'amount',
			width: 120,
			filterType: 'number',
			align: 'right',
			sortable: true,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Thời gian hết hạn',
			dataIndex: 'transactionDate',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Hình thức',
			dataIndex: 'paymentType',
			width: 120,
			filterType: 'select',
			filterData: Object.values(ETransactionPaymentType)?.map((val) => ({
				label: transactionPaymentLabel[val],
				value: val,
			})),
			render: (val: ETransactionPaymentType) => transactionPaymentLabel[val] ?? '',
		},
	];

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				columns={columns}
				dependencies={[page, limit]}
				modelName='taichinh.giaodich'
				title='Ưu đãi thanh toán'
			/>
		</>
	);
};

export default UuDaiThanhToanPage;
