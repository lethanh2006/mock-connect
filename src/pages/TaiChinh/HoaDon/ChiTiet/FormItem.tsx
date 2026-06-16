import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { inputFormat } from '@/utils/utils';
import { Col, Row, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const FormItemHoaDonChiTiet = () => {
	const intl = useIntl();
	const { record } = useModel('taichinh.hoadon');

	const { getAllModel, loading, danhSach, xemRutGonChiTiet } = useModel('taichinh.hoadonchitiet');
	// const [result, setResult] = useState<HoaDon.IBillItem[]>([]);
	const [result, setResult] = useState<HoaDon.ITransaction[]>([]);

	// const setBillItemResult = (list: HoaDon.IBillItem[]) => {
	// 	setResult(list.filter((item) => !xemRutGonChiTiet || item.status !== EMaTrangThaiThanhToan.DONG));
	// };

	// const getData = () =>
	// 	record?._id &&
	// 	getAllModel(undefined, undefined, { billIdentityCode: record?.identityCode }).then((list) =>
	// 		setBillItemResult(list),
	// 	);

	// useEffect(() => {
	// 	getData();
	// }, [record?._id]);

	// useEffect(() => setBillItemResult(danhSach), [xemRutGonChiTiet]);

	useEffect(() => {
		setResult(record?.transactions ?? []);
	}, [record]);

	const columns: IColumn<HoaDon.ITransaction & { index: number }>[] = [
		{
			title: 'Mã định danh',
			dataIndex: 'identityCode',
			width: 130,
			render: (val) => val || '-',
		},
		{
			title: 'Khoản thu',
			dataIndex: 'tenKhoanThu',
			width: 160,
			render: (val, rec) => val || rec?.maKhoanThu || '-',
		},
		{
			title: 'Mức thu',
			dataIndex: 'maMucThu',
			width: 120,
			render: (val) => val || '-',
		},
		{
			title: 'Kỳ học',
			dataIndex: 'tenKyHoc',
			width: 130,
			render: (val, rec) => val || rec?.maKyHoc || '-',
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 120,
			align: 'right',
			render: (val) => val ?? 0,
		},
		{
			title: 'SL',
			dataIndex: 'soLuong',
			width: 70,
			align: 'center',
			render: (val) => val ?? '-',
		},
		{
			title: 'Số tiền',
			dataIndex: 'amount',
			width: 120,
			align: 'right',
			render: (val) => inputFormat(val ?? 0),
		},
		{
			title: 'Loại GD',
			dataIndex: 'type',
			width: 100,
			align: 'center',
			render: (val) => <Tag color={val === 'CHARGE' ? 'blue' : 'green'}>{val || '--'}</Tag>,
		},
		// {
		// 	title: 'Trạng thái',
		// 	dataIndex: 'status',
		// 	width: 100,
		// 	align: 'center',
		// 	render: (val) => <Tag color={val === 'success' ? 'green' : 'default'}>{val || '--'}</Tag>,
		// },
		// {
		// 	title: 'Thanh toán',
		// 	dataIndex: 'paid',
		// 	width: 140,
		// 	align: 'center',
		// 	render: (val) => <Tag color={val ? 'green' : 'orange'}>{val ? 'Đã thanh toán' : 'Chưa thanh toán'}</Tag>,
		// },
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 220,
			render: (val) => val || '-',
		},
	];

	return (
		<Row gutter={[12, 0]}>
			<Col span={24}>
				<TableStaticData columns={columns} data={result} loading={loading} addStt size='small' />
			</Col>
		</Row>
	);
};

export default FormItemHoaDonChiTiet;
