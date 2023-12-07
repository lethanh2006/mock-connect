import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import rules from '@/utils/rules';
import { inputFormat, inputParse } from '@/utils/utils';
import { EditOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Form, InputNumber, Popconfirm, Radio, Row, Table } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './style.less';

const FormThanhToan = (props: { getData: () => void }) => {
	// const { getData } = props;
	const { loading, danhSach, selectedIds, visibleThanhToan, setVisibleThanhToan } = useModel('taichinh.hoadonchitiet');
	const { getSoDuViSinhVienModel, soDuVi } = useModel('taichinh.giaodich');
	const { record: recHoaDon } = useModel('taichinh.hoadon');
	const [form] = Form.useForm();
	const payList: Record<string, number> = Form.useWatch('payList', form);
	const totalPhaiNop = _.sum(Object.values(payList ?? {})) ?? 0;
	const dataHienThi = danhSach.filter((item) => selectedIds?.includes(item._id)) ?? [];

	// const getBillItems = () =>
	// 	recHoaDon?._id && getAllModel(undefined, undefined, { billIdentityCode: recHoaDon?.identityCode });

	useEffect(() => {
		getSoDuViSinhVienModel();
	}, []);

	useEffect(() => {
		const pay: any = {};
		dataHienThi.forEach((item) => {
			const payItem = item.amountDue - item.amountPaid;
			pay[item._id] = payItem;
		});
		form.setFieldsValue({ payList: pay });
	}, [visibleThanhToan]);

	const onFinish = (values: any) => {
		const billItems = Object.entries(values?.payList).map(([billItemId, amount]) => ({ billItemId, amount }));
		const data = {
			...values,
			billIdentityCode: recHoaDon?.identityCode,
			billItems,
		};
		console.log('🚀 ~ file: FormThanhToan.tsx:70 ~ onFinish ~ data:', data);

		// chuyenVienThanhToanModel(data)
		// 	.then(() => {
		// 		setSelectedIds([]);
		// 		getData();
		// 		getBillItems();
		// 		 (false);
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
			title: 'Số tiền phải nộp',
			dataIndex: 'amountDue',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Số tiền đã nộp',
			dataIndex: 'amountPaid',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val)} VND`,
		},
		{
			title: 'Số tiền còn lại',
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
				<Form.Item noStyle rules={[...rules.required]} name={['payList', rec?._id]}>
					<InputNumber
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
	];

	return (
		<>
			<Form layout='vertical' form={form} onFinish={onFinish}>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Col md={8}>
							<Form.Item label='Số dư hiện tại'>
								<InputNumber
									value={soDuVi}
									disabled
									addonAfter='VND'
									formatter={inputFormat}
									style={{ width: '100%' }}
								/>
							</Form.Item>
						</Col>
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
										<>
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
											</Table.Summary.Row>
										</>
									);
								},
							}}
						/>
					</Col>

					<Col span={24}>
						<div className='fw500'>Hình thức thanh toán</div>
					</Col>
					<Col span={24} md={8}>
						<Radio.Group
							className='radio-thanh-toan'
							// disabled={!payable}
							// value={paymentType}
							// onChange={(val) => onChangeType(val.target.value)}
						>
							<Radio value='atm'>
								<img src='/images/vietqr.png' alt='vietqr' />
								Thẻ nội địa
							</Radio>
							<Radio value='momo'>
								<img src='/images/momo.svg' alt='momo' />
								Ví MOMO
							</Radio>
						</Radio.Group>
					</Col>
					<Col span={24} md={16}>
						<Descriptions column={1} bordered labelStyle={{ width: '50%' }}>
							<Descriptions.Item label='Số tiền thanh toán'>{inputFormat(totalPhaiNop ?? 0)} VNĐ</Descriptions.Item>
							<Descriptions.Item label='Tổng ưu đãi'>
								0{/* {inputFormat(record?.amountPaid ?? 0)} VNĐ */}
							</Descriptions.Item>
							<Descriptions.Item label='Số tiền cần nộp thêm'>
								{inputFormat(
									_.sumBy(dataHienThi, (item) => item.amountDue) - _.sumBy(dataHienThi, (item) => item.amountPaid) ?? 0,
								)}{' '}
								VNĐ
							</Descriptions.Item>
						</Descriptions>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button icon={<PrinterOutlined />} onClick={() => {}}>
						Xem trước biên lai
					</Button>
					<Popconfirm
						title={
							<>
								{/* Số dư ví trước giao dịch: <b>{inputFormat(soDuVi)} VND</b>
								<br />
								Số tiền thanh toán: <b className='text-error'>{inputFormat(totalPhaiNop)} VND</b>
								<br />
								Số dư còn lại: <b>{inputFormat(totalSauThanhToan)} VND</b>
								<br /> */}
								Xác nhận thanh toán?
							</>
						}
						onConfirm={() => form.submit()}
					>
						<Button loading={loading} icon={<EditOutlined />} type='primary'>
							Lưu lại
						</Button>
					</Popconfirm>

					<Button onClick={() => setVisibleThanhToan(false)}>Hủy</Button>
				</div>
			</Form>

			{/* <Modal
				destroyOnClose
				visible={visibleModalPrint}
				onCancel={() => setVisibleModalPrint(false)}
				footer={null}
				title='In biên lai'
				width={'80%'}
				bodyStyle={{ paddingTop: 12 }}
			>
				<ReactToPrint
					trigger={() => {
						return (
							<Button icon={<PrinterOutlined />} type={'primary'}>
								In biên lai
							</Button>
						);
					}}
					content={() => printRef?.current}
				/>
				<PrintWithUrl isPdfViewer={true} fileType={'pdf'} file={dataFilePreview} ref={printRef} />
			</Modal> */}
		</>
	);
};

export default FormThanhToan;
