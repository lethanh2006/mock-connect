import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
	colorTransactionStatus,
	transactionPaymentLabel,
	transactionStatus,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { CloseOutlined, DollarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Select, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalThanhToanNganHang from '../HoaDon/ThanhToan/ModalThanhToanNganHang';
import Form from './components/Form';
import StatGiaoDich from './components/Stat';

const GiaoDichPage = () => {
	const { getModel, page, limit, setRecord, setVisibleForm } = useModel('taichinh.giaodich');
	const { visibleHuongDan, setVisibleHuongDan, getInfoMomoModel } = useModel('taichinh.hoadon');
	const [kieuThanhToan, setKieuThanhToan] = useState<number>(1);

	const getData = () => {
		let condition: any = undefined;
		switch (kieuThanhToan) {
			case 2:
				condition = { fromAccount: ETransactionSourceType.EXTERNAL, toAccount: ETransactionSourceType.WALLET };
				break;
			case 3:
				condition = { fromAccount: ETransactionSourceType.WALLET, toAccount: ETransactionSourceType.SYSTEM };
				break;
			case 4:
				condition = { fromAccount: ETransactionSourceType.SYSTEM, toAccount: ETransactionSourceType.WALLET };
				break;
		}

		return getModel(condition);
	};

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) setVisibleHuongDan(true);
		else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET)
			getInfoMomoModel(rec.billIdentityCode).then((info) => {
				window.location.href = info.payUrl;
			});
	};

	const onCancel = (rec: GiaoDich.IRecord) => {};

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Mã TT',
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
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
			width: 120,
			filterType: 'number',
			align: 'right',
			sortable: true,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{ title: 'Người thực hiện', dataIndex: 'payerFullname', width: 150, filterType: 'string' },
		{
			title: 'Thời gian',
			dataIndex: 'transactionDate',
			width: 140,
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
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 140,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETransactionStatus)?.map((val) => ({
				label: transactionStatus[val],
				value: val,
			})),
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

	return (
		<>
			<TableBase
				buttons={{ create: false }}
				columns={columns}
				Form={Form}
				getData={getData}
				widthDrawer={1000}
				dependencies={[page, limit, kieuThanhToan]}
				formProps={{ getData }}
				modelName='taichinh.giaodich'
				title='Lịch sử thanh toán'
				otherButtons={[
					<>
						<ButtonExtend
							onClick={() => {
								setRecord(undefined);
								setVisibleForm(true);
							}}
							icon={<PlusCircleOutlined />}
							type='primary'
							tooltip='Đóng trước học phí'
						>
							Đóng trước học phí
						</ButtonExtend>
						<Select
							value={kieuThanhToan}
							onChange={(val) => setKieuThanhToan(val)}
							options={[
								{ value: 1, label: 'Tất cả giao dịch' },
								{ value: 2, label: 'Nộp tiền' },
								{ value: 3, label: 'Thanh toán' },
								{ value: 4, label: 'Hoàn trả' },
							]}
							placeholder='Chọn giao dịch'
							style={{ width: 200 }}
							key='select'
						/>
					</>,
				]}
			>
				<StatGiaoDich />
			</TableBase>

			<ModalThanhToanNganHang visibleHuongDan={visibleHuongDan} setVisibleHuongDan={setVisibleHuongDan} />
		</>
	);
};

export default GiaoDichPage;
