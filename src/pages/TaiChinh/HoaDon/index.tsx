import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';

import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Modal, Tag } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
import SelectDotThu from '../DotThu/Select';
import ThongTinThanhToan from './ThanhToan/ThongTinThanhToan';

const HoaDonPage = (props: { idDotThu?: string }) => {
	const { getModel, page, limit, setRecord } = useModel('taichinh.hoadon');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const { idDotThu: dotThuCoDinh } = props;

	const getData = () => getModel({ idDotThu: dotThuCoDinh });

	const handleDetail = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	const columns: IColumn<HoaDon.IRecord>[] = [
		{
			title: 'Mã TT',
			dataIndex: 'identityCode',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: 'Đợt thu',
			dataIndex: 'idDotThu',
			width: 180,
			render: (val, rec) => rec.dotThu?.tenDot,
			hide: !!dotThuCoDinh,
			filterType: 'customselect',
			filterCustomSelect: <SelectDotThu multiple />,
		},
		{
			title: 'Khoản thu',
			width: 300,
			render: (val, rec) => (
				<ExpandText>
					{rec?.billItems?.map((item) => (
						<div key={item._id}>- {item?.tenKhoanThu}</div>
					))}
				</ExpandText>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			align: 'center',
			width: 150,
			render: (val: EMaTrangThaiThanhToan) =>
				val && <Tag color={EMauTrangThaiThanhToanTable?.[val]}>{ETrangThaiThanhToan?.[val] ?? ''}</Tag>,
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				label: ETrangThaiThanhToan[item],
				value: item,
			})),
		},
		{
			title: 'Số tiền phải thu',
			width: 150,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.billItems
					?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
					?.reduce((acc, item) => acc + (item.amountDue || 0), 0);
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: 'Số tiền đã thu',
			width: 150,
			align: 'right',
			render: (val, rec) => {
				const totalAmountDue = rec?.billItems
					?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
					?.reduce((acc, item) => acc + (item.amountPaid || 0), 0);
				return `${inputFormat(totalAmountDue ?? 0)} VND`;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Thông tin thanh toán'
					onClick={() => handleDetail(rec)}
					type='link'
					className='text-success'
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
				hideCard={!!dotThuCoDinh}
				dependencies={[page, limit, dotThuCoDinh]}
				modelName='taichinh.hoadon'
				title='Công nợ'
				widthDrawer={1000}
			/>

			<Modal
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				bodyStyle={{ padding: 0 }}
				width={1000}
			>
				<ThongTinThanhToan setVisible={setVisibleModal} getData={getData} />
			</Modal>
		</>
	);
};

export default HoaDonPage;
