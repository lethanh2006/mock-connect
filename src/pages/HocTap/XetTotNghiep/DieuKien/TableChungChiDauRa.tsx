import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { useModel } from 'umi';

const TableChungChiDauRa = () => {
	const { record } = useModel('sinhvien.chungchictdt');

	const columns: IColumn<ChuongTrinhDaoTao.IChuanDauRa>[] = [
		{
			title: 'Tên chứng chỉ',
			dataIndex: 'maChungChi',
			width: 150,
			render: (val, rec) => rec.chungChi?.ten ?? val,
		},
		{
			title: 'Ngoại ngữ',
			width: 150,
			render: (val, rec) => rec.chungChi?.ngonNgu?.ten ?? rec.chungChi?.maNgonNgu,
			hide: record?.maLoaiChungChi !== 'NN',
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

	return (
		<>
			<div className='fw500'>Danh sách chứng chỉ đủ điều kiện </div>
			<TableStaticData columns={columns} data={record?.danhSachChungChiCtdtCdr ?? []} />
		</>
	);
};

export default TableChungChiDauRa;
