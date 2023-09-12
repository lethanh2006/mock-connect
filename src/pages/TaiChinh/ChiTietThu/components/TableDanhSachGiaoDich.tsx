import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { ChiTietThu } from '@/services/TaiChinh/ChiTietThu/typing';
import type { ELoaiThanhToan } from '@/services/TaiChinh/constant';
import { MapKeyLoaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import moment from 'moment';

const TableDanhSachGiaoDich = (props: any) => {
	const value: ChiTietThu.IThongTinGiaoDich[] = props.value;

	const columns: IColumn<ChiTietThu.IThongTinGiaoDich>[] = [
		{
			title: 'Số tiền',
			dataIndex: 'amountPaid',
			width: 80,
			align: 'center',
			render: (val) => `${inputFormat(val)} VNĐ`,
		},
		{
			title: 'Thời gian',
			dataIndex: 'transactionDate',
			width: 120,
			align: 'center',
			render: (val) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{ title: 'Người thực hiện', dataIndex: ['nguoiThucHien', 'hoTen'], width: 120, align: 'center' },
		{
			title: 'Hình thức',
			dataIndex: 'paymentType',
			width: 120,
			align: 'center',
			render: (val: ELoaiThanhToan) => MapKeyLoaiThanhToan?.[val] ?? '',
		},
	];

	return <TableStaticData columns={columns?.filter((item) => !item?.hide)} data={value} addStt size='small' />;
};

export default TableDanhSachGiaoDich;
