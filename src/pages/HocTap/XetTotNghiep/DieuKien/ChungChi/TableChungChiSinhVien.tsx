import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Empty, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const TableChungChiSinhVien = () => {
	const { recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');

	const columns: IColumn<SinhVien.IChungChiSinhVien>[] = [
		{
			title: 'Chứng chỉ',
			dataIndex: 'maChungChi',
			width: 180,
			render: (val, rec) => `${rec.chungChi?.loaiChungChi?.ten ?? val} - ${rec.chungChi?.ten ?? val}`,
		},
		{
			title: 'Đơn vị cấp',
			dataIndex: 'donViCap',
			width: 200,
		},
		{
			title: 'Trình độ',
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
			title: 'Ngày cấp',
			dataIndex: 'ngayCap',
			width: 100,
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
		{
			title: 'Thời hạn',
			width: 130,
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi && rec.ngayCap)
					if (rec.chungChi?.chungChiCoThoiHan) {
						const endDate = moment(rec.ngayCap).add(rec.chungChi.thoiHanChungChi, 'y');
						return (
							<span style={moment().isAfter(endDate) ? { color: 'red' } : undefined}>
								{endDate.format('DD/MM/YYYY')}
							</span>
						);
					} else return <Tag color='green'>Không thời hạn</Tag>;
				else return null;
			},
		},
	];

	return recordChungChi?.chungChiDuDk ? (
		<TableStaticData columns={columns} data={recordChungChi?.chungChiDuDk ?? []} size='small' addStt />
	) : (
		<Empty
			description='Bạn chưa có chứng chỉ nào hoặc chứng chỉ không đủ điều kiện'
			image={Empty.PRESENTED_IMAGE_SIMPLE}
		/>
	);
};

export default TableChungChiSinhVien;
