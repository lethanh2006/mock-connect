import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	ETransactionStatus,
	colorTransactionStatus,
	transactionPaymentLabel,
	transactionStatus,
	type ETransactionPaymentType,
} from '@/services/TaiChinh/constant';
import { formatDateTime } from '@/utils/formatDate';
import { inputFormat } from '@/utils/utils';
import { Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const LichSuThanhToan = (props: {
	onPay: (rec: GiaoDich.IRecord) => void;
	onCancel: (rec: GiaoDich.IRecord) => Promise<unknown>;
	ngoaiThoiGianThanhToan?: boolean;
}) => {
	const intl = useIntl();
	const { record } = useModel('taichinh.hoadon');
	const { getModel, page, limit } = useModel('taichinh.giaodich');
	const { onPay, onCancel, ngoaiThoiGianThanhToan } = props;

	const getData = () => {
		record?.identityCode &&
			getModel(
				{
					billIdentityCode: record?.identityCode,
				},
				undefined,
				undefined,
				undefined,
				undefined,
				'me/page',
			);
	};

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.magd' }),
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.phanloai' }),
		// 	dataIndex: 'type',
		// 	align: 'center',
		// 	width: 100,
		// 	render: (val: ETransactionType) => val && <Tag color={colorTransactionType[val]}>{transactionType[val]}</Tag>,
		// },
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.sotien' }),
			dataIndex: 'amount',
			align: 'right',
			width: 120,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.hinhthuc' }),
			dataIndex: 'paymentType',
			width: 110,
			render: (val: ETransactionPaymentType, rec) => transactionPaymentLabel?.[val as ETransactionPaymentType] ?? '',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.trangthai' }),
			dataIndex: 'status',
			width: 120,
			align: 'center',
			render: (val: ETransactionStatus) => (
				<Tag color={colorTransactionStatus[val]}>{transactionStatus[val] ?? ''}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.nguoithuchien' }),
			dataIndex: 'manualUserFullname',
			width: 140,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.thuchien' }),
			align: 'center',
			dataIndex: 'createdAt',
			width: 120,
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.hoanthanh' }),
			align: 'center',
			dataIndex: 'transactionDate',
			width: 120,
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.thaotac' }),
		// 	width: 90,
		// 	align: 'center',
		// 	fixed: 'right',
		// 	render: (val, rec) => (
		// 		<>
		// 			<ButtonExtend
		// 				disabled={
		// 					rec.status !== ETransactionStatus.PENDING ||
		// 					rec.fromAccount !== ETransactionSourceType.EXTERNAL ||
		// 					ngoaiThoiGianThanhToan
		// 				}
		// 				icon={<DollarOutlined />}
		// 				tooltip={intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.thanhtoan' })}
		// 				onClick={() => onPay && onPay(rec)}
		// 				type='link'
		// 			/>
		// 			<Popconfirm
		// 				title={intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.huy.xacnhan' })}
		// 				onConfirm={() => {
		// 					if (onCancel)
		// 						onCancel(rec).then(() => {
		// 							getData();
		// 						});
		// 				}}
		// 				disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
		// 				placement='topRight'
		// 			>
		// 				<ButtonExtend
		// 					disabled={
		// 						rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL
		// 					}
		// 					icon={<CloseOutlined />}
		// 					tooltip={intl.formatMessage({ id: 'taichinh.thanhtoan.lichsu.huy' })}
		// 					type='link'
		// 					danger
		// 				/>
		// 			</Popconfirm>
		// 		</>
		// 	),
		// },
	];

	return (
		<TableBase
			columns={columns}
			getData={getData}
			modelName='taichinh.giaodich'
			dependencies={[page, limit, record?.identityCode]}
			hideCard
			buttons={{ create: false }}
			otherProps={{ size: 'small' }}
		/>
	);
};

export default LichSuThanhToan;
