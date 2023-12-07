import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType, ETransactionSourceType, transactionPaymentLabel } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import Form from './components/Form';

const GiaoDichPage = () => {
	const { getModel, page, limit, setRecord, setVisibleForm } = useModel('taichinh.giaodich');
	// const { record: recDot, setRecord: setRecDot, danhSach: danhSachDot } = useModel('taichinh.dotthu');
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

		return getModel({
			...condition,
			//  idDotThu: recDot?._id
		});
	};

	const columns: IColumn<GiaoDich.IRecord>[] = [
		{
			title: 'Mã TT',
			dataIndex: 'identityCode',
			width: 120,
			align: 'center',
			filterType: 'string',
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
			title: 'Lịch sửa giao dịch',
			width: 120,
			render: (val, rec) => {
				switch ((rec.fromAccount, rec.toAccount)) {
					case (ETransactionSourceType.EXTERNAL, ETransactionSourceType.WALLET):
						return <>Nộp tiền</>;
					case (ETransactionSourceType.WALLET, ETransactionSourceType.SYSTEM):
						return <>Thanh toán dịch vụ</>;
					case (ETransactionSourceType.SYSTEM, ETransactionSourceType.WALLET):
						return <>Hoàn trả</>;
					default:
						return null;
				}
			},
		},
		{
			title: 'Thời gian',
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
				getData={getData}
				Form={Form}
				widthDrawer={1000}
				dependencies={[
					page,
					limit,
					kieuThanhToan,
					// recDot?._id
				]}
				modelName='taichinh.giaodich'
				title='Lịch sử thanh toán'
				otherButtons={[
					<>
						<ButtonExtend
							onClick={() => {
								setRecord(undefined);
								// setEdit(false);
								// setIsView(false);
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
								{ value: 3, label: 'Thanh toán dịch vụ' },
								{ value: 4, label: 'Hoàn trả' },
							]}
							placeholder='Chọn giao dịch'
							style={{ width: 250 }}
							key='select'
						/>
						,
					</>,
				]}
			/>
			{/* <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
					<SelectDotThu
						value={recDot?._id}
						onChange={(val) => setRecDot(danhSachDot.find((item) => item._id === val))}
						style={{ width: 200 }}
						isSetRecord
					/>
					<Select
						value={kieuThanhToan}
						onChange={(val) => setKieuThanhToan(val)}
						options={[
							{ value: 1, label: 'Tất cả giao dịch' },
							{ value: 2, label: 'Sinh viên nộp tiền' },
							{ value: 3, label: 'Thanh toán dịch vụ' },
							{ value: 4, label: 'Hoàn trả' },
						]}
						placeholder='Chọn giao dịch'
						style={{ width: 250 }}
						key='select'
					/>
				</div>
			</TableBase> */}
		</>
	);
};

export default GiaoDichPage;
