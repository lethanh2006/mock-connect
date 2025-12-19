import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { formatPhoneNumber } from '@/utils/utils';
import { useIntl, useModel } from 'umi';

const GiangVienDeCuongPage = () => {
	const intl = useIntl();
	const { page, limit } = useModel('hocphan.giangviendecuong');
	const { record: recDeCuong } = useModel('hocphan.decuonghocphan');

	const columns: IColumn<HocPhan.IGiangVienDeCuong>[] = [
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.gv.hoTen' }),
			width: 150,
			render: (val, rec) => rec.hoTen,
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.gv.chucdanh' }),
			width: 150,
			render: (val, rec) => [rec.chucDanh, rec.hocHam, rec.hocVi].filter((item) => !!item).join(', '),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.gv.sodienthoai' }),
			width: 120,
			render: (val, rec) => rec.soDienThoai && formatPhoneNumber(rec.soDienThoai),
		},
		{
			title: intl.formatMessage({ id: 'lophocphan.id.decuong.gv.diachi' }),
			width: 200,
			render: (val, rec) => rec.diaChi,
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				params={{ deCuongId: recDeCuong?._id }}
				modelName='hocphan.giangviendecuong'
				title={intl.formatMessage({ id: 'lophocphan.id.decuong.gv.title' })}
				hideCard
				buttons={{ create: false }}
			/>
		</>
	);
};

export default GiangVienDeCuongPage;
