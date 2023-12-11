import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	ETransactionSourceType,
	ETransactionStatus,
	colorTransactionStatus,
	transactionPaymentLabel,
	transactionStatus,
	type ETransactionPaymentType,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { CloseOutlined, DollarOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const LichSuThanhToan = (props: {
	onPay: (rec: GiaoDich.IRecord) => void;
	onCancel: (rec: GiaoDich.IRecord) => void;
}) => {
	const { record } = useModel('taichinh.hoadon');
	const { getAllModel, danhSach, loading } = useModel('taichinh.giaodich');
	const { onPay, onCancel } = props;

	const getData = () =>
		record?.identityCode && getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode });

	useEffect(() => {
		getData();
	}, [record?.identityCode]);

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Loại giao dịch',
			align: 'center',
			width: 100,
			render: (val, rec) => {
				switch ((rec.fromAccount, rec.toAccount)) {
					case (ETransactionSourceType.EXTERNAL, ETransactionSourceType.WALLET):
						return <Tag color='green'>Nộp tiền</Tag>;
					case (ETransactionSourceType.WALLET, ETransactionSourceType.SYSTEM):
						return <Tag color='orange'>Thanh toán</Tag>;
					case (ETransactionSourceType.SYSTEM, ETransactionSourceType.WALLET):
						return <Tag color='purple'>Hoàn trả</Tag>;
					default:
						return null;
				}
			},
		},
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			align: 'right',
			width: 120,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{ title: 'Người thực hiện', dataIndex: 'payerFullname', width: 150, filterType: 'string' },
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
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 140,
			align: 'center',
			render: (val: ETransactionStatus) => (
				<Tag color={colorTransactionStatus[val]}>{transactionStatus[val] ?? ''}</Tag>
			),
		},
		{
			title: 'Thao tác',
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={rec.status !== ETransactionStatus.PENDING}
						icon={<DollarOutlined />}
						tooltip='Thanh toán'
						onClick={() => onPay && onPay(rec)}
						type='link'
					/>
					<Popconfirm
						title='Xác nhận hủy giao dịch này?'
						onConfirm={() => onCancel && onCancel(rec)}
						disabled={rec.status !== ETransactionStatus.PENDING}
					>
						<ButtonExtend
							disabled={rec.status !== ETransactionStatus.PENDING}
							icon={<CloseOutlined />}
							tooltip='Hủy'
							type='link'
							danger
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return <TableStaticData columns={columns} data={danhSach} addStt size='small' loading={loading} />;
};

export default LichSuThanhToan;
