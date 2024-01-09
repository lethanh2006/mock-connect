import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import { inputFormat } from '@/utils/utils';
import moment from 'moment';
import { useModel } from 'umi';

const TableUuDaiHienHanh = (props: { onCellClick?: (rec: UuDaiThanhToan.IRecord) => void }) => {
	const { page, limit, getModel } = useModel('taichinh.uudai');
	const { onCellClick } = props;

	const getData = () =>
		getModel({ active: true }, [
			{ active: true, field: 'thoiGianBatDau', values: [moment().toISOString()], operator: EOperatorType.LESS_EQUAL },
			{ active: true, field: 'thoiGianKetThuc', values: [moment().toISOString()], operator: EOperatorType.GREAT_EQUAL },
		]);

	const onCell = (rec: UuDaiThanhToan.IRecord) => ({
		onClick: () => onCellClick && onCellClick(rec),
		style: !!onCellClick ? { cursor: 'pointer' } : undefined,
	});

	const columns: IColumn<UuDaiThanhToan.IRecord>[] = [
		{
			title: 'Tên ưu đãi',
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian áp dụng',
			align: 'center',
			width: 140,
			render: (val, rec) =>
				`${rec.thoiGianBatDau ? moment(rec.thoiGianBatDau).format('DD/MM/YYYY') : ''} - ${
					rec.thoiGianKetThuc ? moment(rec.thoiGianKetThuc).format('DD/MM/YYYY') : ''
				}`,
			onCell,
		},
		{
			title: 'Loại khoản thu áp dụng',
			dataIndex: 'maKhoanThuApDung',
			width: 140,
			render: (val, rec) => rec.khoanThuApDung?.name ?? val,
			onCell,
		},
		{
			title: 'Ngưỡng hưởng ưu đãi',
			dataIndex: 'mucPhiApDung',
			align: 'right',
			width: 120,
			sortable: true,
			render: (val) => val && `${inputFormat(val)} VND`,
			onCell,
		},
		{
			title: 'Giá trị ưu đãi',
			dataIndex: 'phanTramUuDai',
			align: 'center',
			width: 80,
			sortable: true,
			render: (val) => val && `${val}%`,
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 220,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
			onCell,
		},
	];

	return (
		<TableBase
			buttons={{ create: false, filter: false }}
			columns={columns}
			getData={getData}
			dependencies={[page, limit]}
			modelName='taichinh.uudai'
			hideCard
			otherProps={{ size: 'small' }}
		/>
	);
};

export default TableUuDaiHienHanh;
