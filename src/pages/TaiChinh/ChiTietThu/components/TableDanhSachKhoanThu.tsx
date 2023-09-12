import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ChiTietThu } from '@/services/TaiChinh/Thu/ChiTietThu/typings';
import { type KhoanThu } from '@/services/TaiChinh/Thu/KhoanThu/typings';
import rules from '@/utils/rules';
import { inputFormat, inputParse, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, InputNumber, Modal, Popconfirm, Row, Table, Input } from 'antd';
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import SelectKhoanThu from '../../KhoanThu/components/SelectKhoanThu';
import SelectMucThu from '../../MucThu/components/Select';
import SelectNguonThu from '../../TaiChinhNguonThu/components/SelectnguonThu';

const TableDanhSachKhoanThu = (props: any) => {
	const value: ChiTietThu.IThongTinSanPham[] = props.value ?? [];
	const onChange: (data: ChiTietThu.IThongTinSanPham[]) => any | undefined = props.onChange;
	const { danhSach: danhSachNguonThu, record: recNguonThu, setRecord: setNguonThu } = useModel('nguonthu');
	const { danhSach: danhSachKhoanThu, record: recordKhoanThu, setRecord: setKhoanThu } = useModel('khoanthu');
	const { danhSach: danhSachMucThu, record: recordMucThu, setRecord: setMucThu } = useModel('mucthu');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [form] = Form.useForm<ChiTietThu.IThongTinSanPham>();

	useEffect(() => {
		if (!visibleModal) resetFieldsForm(form);
	}, [visibleModal]);

	const onFinish = (val: ChiTietThu.IThongTinSanPham) => {
		onChange([
			...value,
			{
				nguonThu: recNguonThu ?? ({} as NguonThu.Record),
				product: recordKhoanThu ?? ({} as KhoanThu.Record),
				productId: recordKhoanThu?._id ?? '',
				price: recordMucThu,
				priceId: recordMucThu?._id ?? '',
				unitAmount: val.unitAmount ?? 0,
				quantity: val.quantity,
				layTuMucThu: !!recordMucThu?._id,
				productName: val.productName,
			},
		]);
		setVisibleModal(false);
	};

	const onDelete = (rec: any) => {
		const data = [...value];
		data.splice(rec.stt - 1, 1);
		onChange(data);
	};

	const onChangeNguonThu = (val: string) => {
		setNguonThu(danhSachNguonThu?.find((i) => i._id === val));
		form.setFieldsValue({ productId: undefined, priceId: undefined, unitAmount: undefined });
	};

	const onChangeKhoanThu = (val: string) => {
		setKhoanThu(danhSachKhoanThu?.find((i) => i._id === val));
		form.setFieldsValue({ priceId: undefined, unitAmount: undefined });
	};

	const onChangeMucThu = (val: string) => {
		const mt = danhSachMucThu?.find((i) => i._id === val);
		setMucThu(mt);
		form.setFieldsValue({ unitAmount: mt?.unitAmount });
	};

	const columns: IColumn<ChiTietThu.IThongTinSanPham>[] = [
		{
			title: 'Nội dung',
			dataIndex: 'productName',
			width: 200,
			render: (val, rec: any) => rec.priceId?.name ?? rec.productName,
		},
		// { title: 'Nguồn thu', dataIndex: ['nguonThu', 'name'], width: 100, align: 'center' },
		// { title: 'Khoản thu', dataIndex: ['product', 'name'], width: 120, align: 'center' },
		// { title: 'Mức thu', dataIndex: ['price', 'name'], width: 120, align: 'center' },
		{
			title: 'Đơn giá',
			dataIndex: 'unitAmount',
			width: 80,
			align: 'center',
			render: (val) => inputFormat(val),
		},
		{ title: 'Số lượng', dataIndex: 'quantity', width: 60, align: 'center' },
		{
			title: 'Thành tiền',
			width: 60,
			align: 'center',
			render: (val, rec) => inputFormat(rec.quantity * rec.unitAmount),
		},
		{
			title: 'Thao tác',
			width: 60,
			align: 'center',
			hide: !onChange,
			render: (val, rec) => (
				<>
					<Popconfirm title='Xác nhận xóa mục chi tiết này?' onConfirm={() => onDelete(rec)}>
						<Button icon={<DeleteOutlined />} danger type='link' />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<Row gutter={[12, 0]}>
			{!!onChange ? (
				<Col span={24}>
					<Button size='small' type='link' icon={<PlusOutlined />} onClick={() => setVisibleModal(true)}>
						Thêm mới
					</Button>
				</Col>
			) : null}

			<Col span={24}>
				<TableStaticData
					columns={columns.filter((item) => !item.hide)}
					data={value}
					addStt
					size='small'
					otherProps={{
						summary: (data: ChiTietThu.IThongTinSanPham[]) => {
							let sum = 0;
							data.forEach(({ unitAmount, quantity }) => (sum += unitAmount * quantity));
							return (
								<Table.Summary fixed>
									<Table.Summary.Row>
										<Table.Summary.Cell index={0} colSpan={4} align='center'>
											<b>Tổng cộng</b>
										</Table.Summary.Cell>
										<Table.Summary.Cell index={1} align='center'>
											<b>{inputFormat(sum)}</b>
										</Table.Summary.Cell>
										{!!onChange ? <Table.Summary.Cell index={2} /> : null}
									</Table.Summary.Row>
								</Table.Summary>
							);
						},
					}}
				/>
			</Col>

			<Modal
				destroyOnClose
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				title='Thêm mới'
				width={500}
				bodyStyle={{ paddingTop: 12 }}
			>
				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Form.Item name={'nguonThuId'} label='Nguồn thu' rules={[...rules.required]}>
						<SelectNguonThu onChange={onChangeNguonThu} />
					</Form.Item>

					<Form.Item name={'productId'} label='Khoản thu' rules={[...rules.required]}>
						<SelectKhoanThu onChange={onChangeKhoanThu} condition={{ nguonThu: recNguonThu?._id }} />
					</Form.Item>

					<Form.Item name={'productName'} label='Nội dung' rules={[...rules.required]}>
						<Input placeholder='Nhập nội dung' />
					</Form.Item>

					{danhSachMucThu?.length ? (
						<Form.Item name={'priceId'} label='Mức thu' rules={[...rules.required]}>
							<SelectMucThu onChange={onChangeMucThu} condition={{ productId: recordKhoanThu?._id }} />
						</Form.Item>
					) : null}

					<Form.Item name='unitAmount' label='Số tiền phải thu' rules={[...rules.required]}>
						<InputNumber
							placeholder='Số tiền phải thu'
							min={0}
							// addonAfter={selectAfter}
							style={{ width: '100%' }}
							formatter={inputFormat}
							parser={inputParse}
							disabled={!!recordMucThu}
						/>
					</Form.Item>

					<Form.Item name='quantity' label='Số lượng' rules={[...rules.required]}>
						<InputNumber placeholder='Số lượng' min={1} style={{ width: '100%' }} />
					</Form.Item>

					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							Thêm mới
						</Button>
						<Button onClick={() => setVisibleModal(false)}>Hủy</Button>
					</div>
				</Form>
			</Modal>
		</Row>
	);
};

export default TableDanhSachKhoanThu;
