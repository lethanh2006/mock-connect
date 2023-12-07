import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat, inputParse } from '@/utils/utils';
import { Alert, Button, Col, Form, InputNumber, Popconfirm, Row, Table } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';
import HuongDanThanhToan from './HuongDanThanhToan';

const FormThanhToan = (props: { getData: () => void }) => {
	const { getData } = props;
	const { formSubmiting, danhSach, selectedIds, visibleThanhToan, setVisibleThanhToan, getAllModel } =
		useModel('taichinh.hoadonchitiet');
	const { getSoDuViSinhVienModel, soDuVi } = useModel('taichinh.giaodich');
	const { record: recHoaDon, paymentType, setVisibleHuongDan, setSelectedIds, infoMomo } = useModel('taichinh.hoadon');
	const { record: recUuDai, getUuDaiByBillModel } = useModel('taichinh.uudaiuser');
	const [form] = Form.useForm();
	const dataHienThi = danhSach.filter((item) => selectedIds?.includes(item._id)) ?? [];
	const payList: Record<string, number> = Form.useWatch('payList', form);
	const totalPhaiNop = _.sum(Object.values(payList ?? {})) ?? 0;
	const totalUuDai = _.sumBy(
		dataHienThi.filter((item) => item.maKhoanThu === recUuDai?.uuDai?.maKhoanThuApDung),
		(item) => Math.round(((payList?.[item._id] ?? 0) * (recUuDai?.uuDai?.phanTramUuDai ?? 0)) / 100),
	);
	const amount = totalPhaiNop - totalUuDai > (soDuVi ?? 0) ? totalPhaiNop - totalUuDai - (soDuVi ?? 0) : 0;
	const totalSauThanhToan = (soDuVi ?? 0) + amount - totalPhaiNop + totalUuDai;

	const getBillItems = () =>
		recHoaDon?.identityCode && getAllModel(undefined, undefined, { billIdentityCode: recHoaDon?.identityCode });

	useEffect(() => {
		if (visibleThanhToan) {
			const pay: any = {};
			dataHienThi.forEach((item) => {
				const payItem = item.amountDue - item.amountPaid;
				pay[item._id] = payItem;
			});
			form.setFieldsValue({ payList: pay });

			getSoDuViSinhVienModel();
			if (recHoaDon?.identityCode) getUuDaiByBillModel(recHoaDon.identityCode);
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
		getData();
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
			title: 'Phải nộp',
			dataIndex: 'amountDue',
			width: 120,
			align: 'right',
			render: (val) => `${inputFormat(val)} VND`,
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
			render: (val, rec) => `${inputFormat(rec.amountDue - rec.amountPaid)} VND`,
		},
		{
			title: 'Thanh toán',
			width: 180,
			align: 'right',
			render: (val, rec) => (
				<Form.Item noStyle name={['payList', rec?._id]}>
					<InputNumber
						// onChange={(value) => onChangePayList({ billItemId: rec._id, amount: value ?? 0 })}
						step={1000}
						min={0}
						max={rec.amountDue - rec.amountPaid}
						formatter={inputFormat}
						parser={inputParse}
						style={{ width: '100%' }}
						placeholder='Nhập số tiền'
						addonAfter='VND'
					/>
				</Form.Item>
			),
		},
		{
			title: 'Ưu đãi',
			width: 120,
			align: 'right',
			render: (val, rec) =>
				rec.maKhoanThu === recUuDai?.uuDai?.maKhoanThuApDung
					? `${inputFormat(Math.round((recUuDai.uuDai.phanTramUuDai * (payList?.[rec._id] ?? 0)) / 100))} VND`
					: '',
		},
	];

	return (
		<>
			<Form layout='vertical' form={form} onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					{recUuDai?.uuDai?._id ? (
						<Col span={24}>
							<Alert
								description={
									<>
										Bạn có ưu đãi cho các khoản thu{' '}
										<b>{recUuDai?.uuDai?.khoanThuApDung?.name ?? recUuDai?.uuDai?.maKhoanThuApDung}</b>, giá trị ưu đãi:{' '}
										<b>{recUuDai?.uuDai?.phanTramUuDai}%</b>
									</>
								}
								banner
								type='success'
							/>
						</Col>
					) : null}
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
									const totalRemain = totalDue - totalPaid;

									return (
										<Table.Summary.Row>
											<Table.Summary.Cell index={0} colSpan={2}>
												<b>Tổng</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={1}>
												<b> {inputFormat(totalDue ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={2}>
												<b>{inputFormat(totalPaid ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={3}>
												<b>{inputFormat(totalRemain ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={4}>
												<b>{inputFormat(totalPhaiNop ?? 0)} VND</b>
											</Table.Summary.Cell>
											<Table.Summary.Cell align={'right'} index={5}>
												<b>{inputFormat(Math.round(totalUuDai))} VND</b>
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
							thanhToan={totalPhaiNop}
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
