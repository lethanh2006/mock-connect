import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/formatDate';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Empty, Tag } from 'antd';
import { useIntl, useModel } from 'umi';

const TableChungChiSinhVien = () => {
	const intl = useIntl();
	const { recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');

	const columns: IColumn<SinhVien.IChungChiSinhVien>[] = [
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.chungchi.columntable' }),
			dataIndex: 'maChungChi',
			width: 180,
			render: (val, rec) => `${rec.chungChi?.loaiChungChi?.ten ?? val} - ${rec.chungChi?.ten ?? val}`,
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.donvicap.columntable' }),
			dataIndex: 'donViCap',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.trinhdo.columntable' }),
			dataIndex: 'diem',
			width: 80,
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM) {
					return <span>{val}</span>;
				} else if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC) {
					const findBac = rec.chungChi.bac?.find((item) => item.order === val);
					return <span>{findBac?.ten}</span>;
				}
				return <CheckCircleOutlined style={{ color: 'green' }} />;
			},
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.ngaycap.columntable' }),
			dataIndex: 'ngayCap',
			width: 100,
			align: 'center',
			render: (val) => val && formatDate(val),
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.thoihan.columntable' }),
			width: 130,
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi && rec.ngayCap)
					if (rec.chungChi?.chungChiCoThoiHan) {
						const endDate = dayjs(rec.ngayCap).add(rec.chungChi.thoiHanChungChi ?? 0, 'year');
						return (
							<span style={dayjs().isAfter(endDate) ? { color: 'red' } : undefined}>
								{formatDate(endDate)}
							</span>
						);
					} else
						return (
							<Tag color='green'>
								{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.khongthoihan.tag' })}
							</Tag>
						);
				else return null;
			},
		},
	];

	return recordChungChi?.chungChiDuDk ? (
		<TableStaticData columns={columns} data={recordChungChi?.chungChiDuDk ?? []} size='small' addStt />
	) : (
		<Empty
			description={intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.empty' })}
			image={Empty.PRESENTED_IMAGE_SIMPLE}
		/>
	);
};

export default TableChungChiSinhVien;
