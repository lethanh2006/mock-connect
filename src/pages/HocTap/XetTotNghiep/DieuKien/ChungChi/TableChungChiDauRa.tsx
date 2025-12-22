import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import { useIntl, useModel } from 'umi';

const TableChungChiDauRa = () => {
	const intl = useIntl();
	const { recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');

	const columns: IColumn<ChuongTrinhDaoTao.IChuanDauRa>[] = [
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.tenchungchi.columntable' }),
			dataIndex: 'maChungChi',
			width: 160,
			render: (val, rec) => rec.chungChi?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.ngongu.columntable' }),
			width: 120,
			render: (val, rec) => rec.chungChi?.ngonNgu?.ten ?? rec.chungChi?.maNgonNgu,
			hide: !recordChungChi?.loaiChungChi?.isNgoaiNgu,
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.phuongthuctinhdiem.columntable' }),
			width: 200,
			render: (val, rec) =>
				rec?.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM
					? `${rec?.chungChi?.phuongThucTinhDiem}: ${rec?.chungChi?.min} - ${rec?.chungChi?.max}`
					: rec?.chungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC
						? `${rec?.chungChi?.phuongThucTinhDiem}: ${rec?.chungChi?.bac?.map((item) => item.ten).join(', ')}`
						: rec?.chungChi?.phuongThucTinhDiem,
		},
		{
			title: intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.dieukiendat.columntable' }),
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
			<div>{intl.formatMessage({ id: 'dieukienxettotnghiep.chungchi.modal.table.danhsachchungchi.title' })}</div>
			<TableStaticData columns={columns} data={recordChungChi?.danhSachChungChiCtdtCdr ?? []} size='small' addStt />
		</>
	);
};

export default TableChungChiDauRa;
