import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import {
	ETransactionPaymentType,
	ETransactionSourceType,
	ETransactionStatus,
	ETransactionType,
	colorTransactionStatus,
	colorTransactionType,
	transactionPaymentLabel,
	transactionStatus,
	transactionType,
} from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { CloseOutlined, DollarOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Segmented, Tag, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalThanhToanNganHang from '../HoaDon/ThanhToan/ModalThanhToanNganHang';
import Form from './components/Form';
import StatGiaoDich from './components/Stat';

const GiaoDichPage = () => {
	const {
		getModel,
		page,
		limit,
		setRecord,
		setVisibleForm,
		thanhToanMomoModel,
		visibleHuongDan,
		setVisibleHuongDan,
		huyThanhToanModel,
	} = useModel('taichinh.giaodich');
	const [kieuThanhToan, setKieuThanhToan] = useState<ETransactionType | undefined>(ETransactionType.DEPOSIT);

	// Callback from MOMO
	useEffect(() => {
		if (window.location.href.includes('orderType=momo_wallet'))
			if (window.location.href.includes('resultCode=0'))
				notification.success({ message: 'Thành công', description: 'Thanh toán công nợ thành công' });
			else notification.warn({ message: 'Thất bại', description: 'Thanh toán thất bại' });
	}, []);

	const getData = () => getModel({ type: kieuThanhToan }, undefined, undefined, undefined, undefined, 'me/page');

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) {
			setRecord(rec);
			setVisibleHuongDan(true);
		} else if (rec?.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
			thanhToanMomoModel(rec.identityCode);
	};

	const onCancel = (rec: GiaoDich.IRecord) => {
		if (rec._id)
			huyThanhToanModel(rec._id)
				.then(() => {
					getData();
				})
				.catch((er) => console.log(er));
	};

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Mã GD',
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Nội dung',
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Phân loại',
			dataIndex: 'type',
			align: 'center',
			width: 100,
			render: (val: ETransactionType) => val && <Tag color={colorTransactionType[val]}>{transactionType[val]}</Tag>,
			hide: !!kieuThanhToan,
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
		{
			title: 'Hình thức',
			dataIndex: 'paymentType',
			width: 140,
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
		{ title: 'Người thực hiện', dataIndex: 'manualUserFullname', width: 150, filterType: 'string' },
		{
			title: 'Thực hiện',
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Hoàn thành',
			dataIndex: 'transactionDate',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			width: 90,
			align: 'center',
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
						icon={<DollarOutlined />}
						tooltip='Thanh toán'
						onClick={() => onPay && onPay(rec)}
						type='link'
					/>
					<Popconfirm
						title='Xác nhận hủy giao dịch này?'
						placement='topRight'
						onConfirm={() => onCancel && onCancel(rec)}
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
					>
						<ButtonExtend
							disabled={
								rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL
							}
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
					<Segmented
						value={kieuThanhToan || '1'}
						onChange={(val) => setKieuThanhToan(val === '1' ? undefined : (val as ETransactionType))}
						options={[
							...[ETransactionType.DEPOSIT, ETransactionType.INTERNAL, ETransactionType.REFUND].map((item) => ({
								value: item,
								label: transactionType[item],
							})),
							{ value: '1', label: 'Tất cả giao dịch' },
						]}
						key='select'
					/>,
					<ButtonExtend
						onClick={() => {
							setRecord(undefined);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
						type='primary'
						className='btn-success'
						key='topup'
					>
						Nộp trước học phí
					</ButtonExtend>,
				]}
			>
				<StatGiaoDich />
			</TableBase>

			<ModalThanhToanNganHang
				visible={visibleHuongDan}
				onOk={() => {
					getData();
					setVisibleHuongDan(false);
				}}
			/>
		</>
	);
};

export default GiaoDichPage;
