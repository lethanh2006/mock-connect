import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { type ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Modal, Segmented, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalThanhToan from '../ThanhToan/Modal';
import ThongTinThanhToan from './ThongTinThanhToan';

type TLoai = 'Tất cả các khoản' | 'Còn nợ';

const TableChiTietThu = () => {
	const { setRecord, getModel, record, page, limit, filters, setFilters, selectedIds, setSelectedIds, danhSach } =
		useModel('taichinh.chitietthu');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleThanhToan, setVisibleThanhToan] = useState<boolean>(false);
	const [type, setType] = useState<TLoai>('Tất cả các khoản');
	const itemsRemaining = danhSach.filter((item) => selectedIds?.includes(item._id) && item.amountRemaining);

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'me');

	const handleDetail = (rec: ChiTietThu.Record) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	const onCell = (rec: ChiTietThu.Record) => ({
		onClick: () => handleDetail(rec),
		style: { cursor: 'pointer' },
	});

	const onChange = (val: TLoai) => {
		setType(val);
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'status');
		if (val === 'Còn nợ')
			temp.push({
				active: true,
				field: 'status',
				values: [EMaTrangThaiThanhToan.CHUA_THANH_TOAN, EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU],
				operator: EOperatorType.INCLUDE,
			});
		setFilters(temp);
	};

	const onOkThanhToan = () => {
		setSelectedIds([]);
		setVisibleThanhToan(false);
		getData();
	};

	const onCancelThanhToan = () => {
		setSelectedIds([]);
		setVisibleThanhToan(false);
	};

	const columns: IColumn<ChiTietThu.Record>[] = [
		{
			title: 'Mã TT',
			dataIndex: 'code',
			align: 'center',
			filterType: 'string',
			width: 100,
			onCell,
		},
		// {
		// 	title: 'Họ và tên',
		// 	width: 150,
		// 	dataIndex: ['customerInfo.name'],
		// 	filterType: 'string',
		// 	render: (val, rec) => rec.customerInfo?.name,
		// },
		// {
		// 	title: 'CCCD',
		// 	width: 150,
		// 	dataIndex: ['customerInfo.cmtCccd'],
		// 	filterType: 'string',
		// 	render: (val, rec) => rec.customerInfo?.cmtCccd,
		// },
		{
			title: 'Đợt thu',
			width: 150,
			render: (val, rec) => rec.dotThu?.tenDot,
			onCell,
		},
		{
			title: 'Khoản thu',
			width: 300,
			render: (val, rec) => (
				<ExpandText>
					{rec?.items?.map((item) => (
						<div key={item._id}>- {item.priceId?.name ?? item.productName}</div>
					))}
				</ExpandText>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			align: 'center',
			width: 150,
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				label: ETrangThaiThanhToan[item],
				value: item,
			})),
			hide: type === 'Còn nợ',
			onCell,
		},
		{
			title: 'Số tiền phải thu',
			dataIndex: 'amountDue',
			filterType: 'number',
			sortable: true,
			width: 140,
			render: (val) => `${inputFormat(val ?? 0)} VNĐ`,
			onCell,
		},
		{
			title: 'Số tiền đã thu',
			dataIndex: 'amountPaid',
			filterType: 'number',
			sortable: true,
			width: 140,
			render: (val) => `${inputFormat(val ?? 0)} VNĐ`,
			onCell,
		},
		{
			title: 'Số tiền còn lại',
			dataIndex: 'amountRemaining',
			filterType: 'number',
			sortable: true,
			width: 140,
			render: (val) => `${inputFormat(val ?? 0)} VNĐ`,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Thông tin thanh toán'
					onClick={() => handleDetail(rec)}
					type='link'
					icon={<UnorderedListOutlined />}
				/>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				getData={getData}
				buttons={{ create: false }}
				dependencies={[page, limit]}
				modelName='taichinh.chitietthu'
				widthDrawer={800}
				hideCard
				rowSelection
				emptyText={type === 'Còn nợ' ? 'Bạn đã thanh toán toàn bộ công nợ' : undefined}
				otherButtons={[
					<Segmented key='1' options={['Tất cả các khoản', 'Còn nợ']} onChange={(val) => onChange(val as TLoai)} />,
					<ButtonExtend
						key='2'
						type='primary'
						className='btn-success'
						disabled={!itemsRemaining?.length}
						onClick={() => setVisibleThanhToan(true)}
					>
						Thanh toán ({itemsRemaining?.length} mục)
					</ButtonExtend>,
				]}
			/>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
				destroyOnClose
			>
				{record?._id ? <ThongTinThanhToan setVisible={setVisibleModal} /> : null}
			</Modal>

			<ModalThanhToan
				visible={visibleThanhToan}
				onCancel={onCancelThanhToan}
				onOk={onOkThanhToan}
				items={itemsRemaining}
			/>
		</>
	);
};

export default TableChiTietThu;
