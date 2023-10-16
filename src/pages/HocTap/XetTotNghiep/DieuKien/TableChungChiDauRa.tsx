import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { useModel } from 'umi';

const TableChungChiDauRa = () => {
	const { record } = useModel('sinhvien.chungchictdt');

	const columns: IColumn<ChuongTrinhDaoTao.IChuanDauRa>[] = [
		{
			title: 'Mã chứng chỉ',
			dataIndex: 'maChungChi',
			width: 100,
			render: (val, rec) => val,
		},
		{
			title: 'Tên chứng chỉ',
			dataIndex: 'maChungChi',
			width: 150,
			render: (val, rec) => rec.chungChi?.ten ?? val,
		},
		{
			title: 'Loại chứng chỉ',
			width: 150,
			render: (val, rec) =>
				`${record?.loaiChungChi?.ten ?? val}${
					record?.loaiChungChi?.isNgoaiNgu && rec?.chungChi?.ngonNgu?.ten ? ` - ${rec?.chungChi?.ngonNgu?.ten}` : ''
				}`,
		},
		{
			title: 'Phương thức tính điểm',
			width: 200,
			render: (val, rec) =>
				rec?.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM
					? `${rec?.chungChi?.phuongThucTinhDiem}: ${rec?.chungChi?.min} - ${rec?.chungChi?.max}`
					: rec?.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC
					? `${rec?.chungChi?.phuongThucTinhDiem}: ${rec?.chungChi?.bac?.map((item) => item.ten).join(', ')}`
					: rec?.chungChi?.phuongThucTinhDiem,
		},
		{
			title: 'ĐK đạt tối thiểu',
			width: 120,
			align: 'center',
			render: (val, rec) => {
				if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM) {
					return rec.chuanDauRa;
				} else if (rec.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC) {
					return rec.chungChi?.bac?.find((item) => item.order === rec.chuanDauRa)?.ten;
				}
				return null;
			},
		},
	];

	return <TableStaticData columns={columns} data={record?.danhSachChungChiCtdtCdr ?? []} />;
};

export default TableChungChiDauRa;
