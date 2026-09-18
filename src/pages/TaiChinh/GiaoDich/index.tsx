import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
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
import { IconXmark, IconFileMoney, Icon3SquarePlusmark } from '@/components/Icons';
import Segmented from '@/components/MySegmented';
import { Popconfirm, Tag, notification } from 'antd';

import { formatDateTime } from '@/utils/formatDate';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalThanhToanNganHang from '../HoaDon/ThanhToan/ModalThanhToanNganHang';
import CanhBaoGiaoDich from './components/CanhBao';
import Form from './components/Form';
import ModalNopTruocHocPhi from './components/NopTruocHocPhi';
import StatGiaoDich from './components/Stat';

const GiaoDichPage = () => {
	const intl = useIntl();
	const { hasPermission } = usePermissionCheck();
	const canPay = hasPermission('tc.transaction:pay');
	const {
		getModel,
		page,
		limit,
		setRecord,
		// setVisibleForm,
		thanhToanMomoModel,
		visibleHuongDan,
		setVisibleHuongDan,
		huyThanhToanModel,
	} = useModel('taichinh.giaodich');
	const { getModel: getModelDotThu, setRecord: setRecDotThu, loading } = useModel('taichinh.dotthutruochocphi');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const [kieuThanhToan, setKieuThanhToan] = useState<ETransactionType | undefined>(ETransactionType.DEPOSIT);
	const [visibleHocPhi, setVisibleHocPhi] = useState<boolean>(false);

	// Callback from MOMO
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('orderType') !== 'momo_wallet') return;

		if (params.get('resultCode') === '0') {
			notification.success({
				message: intl.formatMessage({ id: 'lichsugiaodich.notify.success.title' }),
				description: intl.formatMessage({ id: 'lichsugiaodich.notify.success.desc' }),
			});
		} else {
			notification.warning({
				message: intl.formatMessage({ id: 'lichsugiaodich.notify.fail.title' }),
				description: intl.formatMessage({ id: 'lichsugiaodich.notify.fail.desc' }),
			});
		}
	}, []);

	const getData = () => getModel({ type: kieuThanhToan }, undefined, undefined, undefined, undefined, 'me/page');

	const handleShowModalThanhToan = async (tran: GiaoDich.IRecord) => {
		// Get đợt thu trước khi hiển thị modal để lấy thông tin kênh thanh toán
		const idDotThu = tran.idDotThu || tran.idDotThuTruocHocPhi;
		if (recDotThu?._id !== idDotThu || (!!recDotThu?.kenhThanhToanId && !recDotThu?.kenhThanhToan?._id)) {
			await getDotThu(idDotThu!);
		}

		// Set record để hiển thị thông tin thanh toán
		setRecord(tran);
		setVisibleHuongDan(true);
	};

	const onPay = (rec: GiaoDich.IRecord) => {
		if (rec?.paymentType === ETransactionPaymentType.BANK) {
			handleShowModalThanhToan(rec);
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
			title: intl.formatMessage({ id: 'lichsugiaodich.column.magd' }),
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.noidung' }),
			dataIndex: 'name',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.phanloai' }),
			dataIndex: 'type',
			align: 'center',
			width: 100,
			render: (val: ETransactionType) => val && <Tag color={colorTransactionType[val]}>{transactionType[val]}</Tag>,
			hide: !!kieuThanhToan,
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.sotien' }),
			dataIndex: 'amount',
			width: 120,
			filterType: 'number',
			align: 'right',
			sortable: true,
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.hinhthuc' }),
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
			title: intl.formatMessage({ id: 'lichsugiaodich.column.trangthai' }),
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
			title: intl.formatMessage({ id: 'lichsugiaodich.column.nguoithuchien' }),
			dataIndex: 'manualUserFullname',
			width: 150,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.thuchien' }),
			dataIndex: 'createdAt',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.hoanthanh' }),
			dataIndex: 'transactionDate',
			width: 120,
			align: 'center',
			filterType: 'datetime',
			sortable: true,
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'lichsugiaodich.column.thaotac' }),
			width: 90,
			align: 'center',
			fixed: 'right',
			hide: !canPay,
			render: (val, rec) => (
				<>
					<ButtonExtend
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
						icon={<IconFileMoney />}
						tooltip={intl.formatMessage({ id: 'lichsugiaodich.column.thanhtoan' })}
						onClick={() => onPay && onPay(rec)}
						type='link'
					/>
					<Popconfirm
						title={intl.formatMessage({ id: 'lichsugiaodich.confirm.huy' })}
						placement='topRight'
						onConfirm={() => onCancel && onCancel(rec)}
						disabled={rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL}
					>
						<ButtonExtend
							disabled={
								rec.status !== ETransactionStatus.PENDING || rec.fromAccount !== ETransactionSourceType.EXTERNAL
							}
							icon={<IconXmark />}
							tooltip={intl.formatMessage({ id: 'global.button.huy' })}
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
				title={intl.formatMessage({ id: 'lichsugiaodich.title' })}
				otherButtons={[
					<Segmented
						value={kieuThanhToan || '1'}
						onChange={(val) => setKieuThanhToan(val === '1' ? undefined : (val as ETransactionType))}
						options={[
							...[ETransactionType.DEPOSIT, ETransactionType.INTERNAL, ETransactionType.REFUND].map((item) => ({
								value: item,
								label: transactionType[item],
							})),
							{ value: '1', label: intl.formatMessage({ id: 'lichsugiaodich.button.tatca' }) },
						]}
						key='select'
					/>,

					...(canPay
						? [
								<ButtonExtend
									loading={loading}
									onClick={() => {
										getModelDotThu(undefined, undefined, { _id: -1 })
											.then((res) => {
												setRecDotThu(res?.[0]);
											})
											.then(() => setVisibleHocPhi(true));
									}}
									icon={<Icon3SquarePlusmark />}
									type='primary'
									className='btn-success'
									key='topup'
								>
									{intl.formatMessage({ id: 'lichsugiaodich.button.noptruoc' })}
								</ButtonExtend>,
							]
						: []),
				]}
			>
				<StatGiaoDich />

				<div style={{ marginBottom: 8 }}>
					<CanhBaoGiaoDich />
				</div>
			</TableBase>

			<ModalThanhToanNganHang
				visible={visibleHuongDan}
				onOk={() => {
					getData();
					setVisibleHuongDan(false);
				}}
			/>

			<ModalNopTruocHocPhi visibleForm={visibleHocPhi} setVisibleForm={setVisibleHocPhi} getData={getData} />
		</>
	);
};

export default GiaoDichPage;
