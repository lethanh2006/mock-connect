import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { formatDate } from '@/utils/formatDate';
import { useIntl, useModel } from 'umi';

const TableUuDaiHienHanh = (props: { onCellClick?: (rec: UuDaiThanhToan.IRecord) => void }) => {
	const intl = useIntl();
	const { page, limit, getModel } = useModel('taichinh.uudai');
	const { onCellClick } = props;

	const getData = () =>
		getModel({ active: true }, [
			{ active: true, field: 'thoiGianBatDau', values: [dayjs().toISOString()], operator: EOperatorType.LESS_EQUAL },
			{ active: true, field: 'thoiGianKetThuc', values: [dayjs().toISOString()], operator: EOperatorType.GREAT_EQUAL },
		]);

	const onCell = (rec: UuDaiThanhToan.IRecord) => ({
		onClick: () => onCellClick && onCellClick(rec),
		style: !!onCellClick ? { cursor: 'pointer' } : undefined,
	});

	const columns: IColumn<UuDaiThanhToan.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.tenuudai' }),
			dataIndex: 'ten',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.tgapdung' }),
			align: 'center',
			width: 140,
			render: (val, rec) =>
				`${formatDate(rec.thoiGianBatDau)} - ${formatDate(rec.thoiGianKetThuc)}`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.loai' }),
			dataIndex: 'maKhoanThuApDung',
			width: 140,
			render: (val, rec) => rec.khoanThuApDung?.name ?? val,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.nguong' }),
			dataIndex: 'mucPhiApDung',
			align: 'right',
			width: 120,
			sortable: true,
			render: (val) => val && `${inputFormat(val)} VND`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.giatri' }),
			dataIndex: 'phanTramUuDai',
			align: 'center',
			width: 80,
			sortable: true,
			render: (val) => val && `${val}%`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'uudaithanhtoan.hienhanh.mota' }),
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
