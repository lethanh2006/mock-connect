import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat, inputParse } from '@/utils/utils';
import { Button, Col, Form, InputNumber, Popconfirm, Row, Table } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';
import HuongDanThanhToan from './HuongDanThanhToan';

const FormThanhToan = (props: { getData?: () => void }) => {
	const { getData } = props;
	const { formSubmiting, danhSach, selectedIds, visibleThanhToan, setVisibleThanhToan, getAllModel } =
		useModel('taichinh.hoadonchitiet');
	const { getSoDuViSinhVienModel, soDuVi } = useModel('taichinh.giaodich');
	const { record: recHoaDon, paymentType, setVisibleHuongDan, setSelectedIds, infoMomo } = useModel('taichinh.hoadon');
	const [form] = Form.useForm();
	const dataHienThi = danhSach.filter((item) => selectedIds?.includes(item._id)) ?? [];
	const totalUuDai = _.sumBy(dataHienThi, (item) => item.amountDiscount);
	const payList: Record<string, number> = Form.useWatch('payList', form);
	const totalPay = _.sum(Object.values(payList ?? {})) ?? 0;
	const amount = totalPay > (soDuVi ?? 0) ? totalPay - (soDuVi ?? 0) : 0;
	const totalSauThanhToan = (soDuVi ?? 0) + amount - totalPay;

	const getBillItems = () =>
		recHoaDon?.identityCode && getAllModel(undefined, undefined, { billIdentityCode: recHoaDon?.identityCode });

	useEffect(() => {
		if (visibleThanhToan) {
			const pay: any = {};
			dataHienThi.forEach((item) => {
				const payItem = item.amountRemaining;
				pay[item._id] = payItem;
			});
			form.setFieldsValue({ payList: pay });

			getSoDuViSinhVienModel();
		}
	}, [visibleThanhToan]);

	const onFinish = (values: any) => {
		const billItems = Object.entries(values?.payList).map(([billItemId, amount1]) => ({ billItemId, amount: amount1 }));
		const data = {
			...values,
			billIdentityCode: recHoaDon?.identityCode,
			billItems,
		};

		setSelectedIds([]);
		if (getData) getData();
		getBillItems();
		setVisibleThanhToan(false);
		if (paymentType === ETransactionPaymentType.BANK) setVisibleHuongDan(true);
		else if (paymentType === ETransactionPaymentType.MOMO_WALLET && !!infoMomo?.payUrl)
			window.location.href = infoMomo.payUrl;

		// chuyenVienThanhToanModel(data)
		// 	.then(() => {
		// 		setSelectedIds([]);
		// 		getData();
		// 		getBillItems();
		// 		setVisibleThanhToan(false);
		// 	})
		// 	.catch((err) => console.log(err));
	};

	const columns: IColumn<HoaDon.IBillItem & { index: number }>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'tenKhoanThu',
			width: 200,
		},
		{
			title: 'Thành tiền',
			dataIndex: 'amountDue',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Ưu đãi',
			dataIndex: 'amountDiscount',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val ?? 0)} VND`,
		},
		{
			title: 'Đã nộp',
			dataIndex: 'amountPaid',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Còn lại',
			dataIndex: 'amountRemaining',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Thanh toán',
			width: 180,
			align: 'right',
			render: (val, rec) => (
				<Form.Item noStyle name={['payList', rec?._id]}>
					<InputNumber
						step={1000}
						min={0}
						max={rec.amountRemaining}
						formatter={inputFormat}
						parser={inputParse}
						style={{ width: '100%' }}
						placeholder='Nhập số tiền'
						addonAfter='VND'
						disabled
					/>
				</Form.Item>
			),
		},
	];

	return (
		<>
			<Form layout='vertical' form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col md={8}>
						<Form.Item label='Số dư hiện tại'>
							<InputNumber value={soDuVi} disabled addonAfter='VND' formatter={inputFormat} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={[12, 12]}>
					<Col span={24}>
						<div className='fw500'>Danh sách khoản phí</div>
						<TableStaticData
							data={dataHienThi}
							addStt
							columns={columns}
							size='small'
							otherProps={{
								pagination: false,
								summary: (pageData: HoaDon.IBillItem[]) => {
									const totalDue = _.sumBy(pageData, (item) => item.amountDue);
									const totalPaid = _.sumBy(pageData, (item) => item.amountPaid);
									const totalRemain = _.sumBy(pageData, (item) => item.amountRemaining);

									return (
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={2}>
												<b>Tổng</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={1}>
												<b> {inputFormat(totalDue ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={2}>
												<b>{inputFormat(totalUuDai ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={3}>
												<b>{inputFormat(totalPaid ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={4}>
												<b>{inputFormat(totalRemain ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={5}>
												<b>{inputFormat(totalPay ?? 0)} VND</b>
											</Table.Summary.Cell>
										</Table.Summary.Row>
									);
								},
							}}
						/>
					</Col>

					<Col span={24}>
						<div className='fw500' style={{ marginTop: 18 }}>
							Hình thức thanh toán
						</div>
					</Col>
					<Col span={24}>
						<HuongDanThanhToan
							thanhToan={totalPay + totalUuDai}
							tongUuDai={totalUuDai}
							amount={amount}
							duNo={totalSauThanhToan}
						/>
					</Col>
				</Row>

				<div className='form-footer' style={{ marginTop: 18 }}>
					<Popconfirm title='Xác nhận thanh toán?' onConfirm={() => form.submit()}>
						<Button loading={formSubmiting} type='primary' htmlType='submit'>
							Thanh toán
						</Button>
					</Popconfirm>

					<Button onClick={() => setVisibleThanhToan(false)}>Hủy</Button>
				</div>
			</Form>
		</>
	);
};

export default FormThanhToan;
