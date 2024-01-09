import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import moment from 'moment';
import { useModel } from 'umi';

const TableLichHocLopHP = () => {
	const { setRecord, setVisibleForm, danhSach, loading } = useModel('daotao.thoikhoabieu');

	const onCell = (rec: ThoiKhoaBieu.IRecord) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleForm(true);
		},
		style: {
			cursor: 'pointer',
			backgroundColor: moment().isSame(rec.ngay, 'D') ? '#005fcc1f' : undefined,
		},
	});

	const columns: IColumn<ThoiKhoaBieu.IRecord>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			title: 'Ngày học',
			dataIndex: 'ngay',
			width: 150,
			render: (val) =>
				val
					? `${moment(val).format('dddd').charAt(0).toUpperCase()}${moment(val).format('dddd').slice(1)}, ngày ${moment(
							val,
					  ).format('DD/MM/YYYY')}`
					: null,
			onCell,
		},
		{
			title: 'Tiết học',
			width: 60,
			align: 'center',
			render: (val, rec) => `${rec.tietBatDau} - ${rec.tietKetThuc}`,
			onCell,
		},
		{
			title: 'Giảng viên',
			dataIndex: 'nhanSuSsoId',
			width: 120,
			render: (val, rec) =>
				rec.nhanSu?.ten ? [rec.nhanSu?.hoDem, rec.nhanSu?.ten].join(' ') : rec.tenNhanSu ?? <i>Chưa cập nhật</i>,
			onCell,
		},
		{
			title: 'Phòng học',
			dataIndex: 'phongHoc',
			width: 120,
			render: (val) => (val ? val : <i>Chưa cập nhật</i>),
			onCell,
		},
		{
			title: 'Loại hình',
			dataIndex: 'loaiHinhHocTap',
			width: 80,
			render: (val) => (val ? val : <i>Chưa cập nhật</i>),
			onCell,
		},
		{
			title: 'Nhóm lớp',
			align: 'center',
			width: 80,
			render: (val, rec) => !!rec.lopHocPhan?.tenCha && `Nhóm ${rec.lopHocPhan?.loai} ${rec.lopHocPhan?.soThuTuNhom}`,
			onCell,
		},
	];

	return (
		<>
			<TableStaticData
				hasTotal
				data={danhSach.map((item, index) => ({
					...item,
					index: index + 1,
				}))}
				columns={columns}
				otherProps={{ pagination: false, loading, scroll: { y: 600 } }}
			/>
		</>
	);
};

export default TableLichHocLopHP;
