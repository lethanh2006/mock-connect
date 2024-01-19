import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import SelectHocPhan from '@/pages/DaoTao/HocPhan/SelectHocPhan';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { type ETrangThaiSinhVienQuyDoiDiem, colorTrangThaiSinhVienQuyDoiDiem } from '@/services/HocTap/constant';
import { Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ModalQuyDoiDiem from './ModalQuyDoiDiem';

const LichSuQuyDoiDiemPage = () => {
	const {
		page,
		limit,
		getModel,
		handleView: handleViewQuyDoi,
		visibleForm,
		setVisibleForm,
	} = useModel('daotao.quydoidiem.sinhvienquydoidiem');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	const getData = () =>
		getModel(undefined, [
			{
				active: true,
				field: 'sinhVienSsoId',
				operator: EOperatorType.INCLUDE,
				values: [recSinhVien?.ssoId ?? ''],
			},
		]);

	const onCell = (rec: QuyDoiDiem.IQuyDoiDiemSinhVien) => ({
		onClick: () => handleViewQuyDoi(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IQuyDoiDiemSinhVien>[] = [
		{
			title: 'HP xin công nhận',
			width: 250,
			children: [
				{
					title: 'Tên học phần',
					dataIndex: 'maHocPhan',
					width: 170,
					filterType: 'customselect',
					filterCustomSelect: <SelectHocPhan multiple />,
					render: (val, rec) => `${rec.maHocPhan} - ${rec.hocPhan?.ten}`,
					onCell,
				},
				{
					title: 'Số tín chỉ',
					dataIndex: 'maHocPhan',
					align: 'center',
					width: 80,
					render: (val, rec) => rec.hocPhan?.soTinChi,
					onCell,
				},
			],
		},
		{
			title: 'Kết quả quy đổi',
			width: 240,
			children: [
				{
					title: 'Điểm thang 10',
					dataIndex: 'diemHe10',
					align: 'center',
					width: 80,
					filterType: 'number',
					sortable: true,
					onCell,
				},
				{
					title: 'Điểm thang 4',
					dataIndex: 'diemHe4',
					align: 'center',
					width: 80,
					filterType: 'number',
					sortable: true,
					onCell,
				},
				{
					title: 'Điểm chữ',
					dataIndex: 'diemChu',
					align: 'center',
					width: 80,
					onCell,
				},
			],
		},
		{
			title: 'Trạng thái',
			width: 100,
			render: (val, rec) =>
				rec.diemHe10 || rec.diemHe4 || rec.diemChu ? (
					<Tag color='green'>Đã có KQ</Tag>
				) : (
					<Tag color='blue'>Chưa có KQ</Tag>
				),
			onCell,
		},
		{
			title: 'Khuyến nghị',
			width: 100,
			// hide: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Tỷ lệ công nhận',
			width: 100,
			// hide: trangThaiQuyDoiDiem === ETrangThaiSinhVienDot.DA_RA_QUYET_DINH,
			onCell,
		},
		{
			title: 'Số QĐ',
			dataIndex: 'soQuyetDinh',
			width: 100,
			align: 'center',
			filterType: 'string',
			sortable: true,
			onCell,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'thoiGianBanHanh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Công nhận',
			dataIndex: 'trangThai',
			width: 100,
			render: (val, rec) => (
				<Tag color={colorTrangThaiSinhVienQuyDoiDiem[val as ETrangThaiSinhVienQuyDoiDiem]}>{val}</Tag>
			),
			onCell,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit]}
				modelName='daotao.quydoidiem.sinhvienquydoidiem'
				title='Lịch sử công nhận kết quả'
				buttons={{
					create: false,
				}}
				hideCard
			/>
			<ModalQuyDoiDiem visible={visibleForm} setVisible={setVisibleForm} />
		</>
	);
};

export default LichSuQuyDoiDiemPage;
