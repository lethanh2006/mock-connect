import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiHocPhanQuyDoi,
	colorTrangThaiSinhVienQuyDoiDiem,
	type ETrangThaiSinhVienQuyDoiDiem,
} from '@/services/HocTap/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
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
	} = useModel('daotao.quydoidiem.phieuquydoidiem');
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

	const onCell = (rec: QuyDoiDiem.IPhieuDangKyQuyDoiDiem) => ({
		onClick: () => handleViewQuyDoi(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IPhieuDangKyQuyDoiDiem>[] = [
		{
			title: 'Đợt quy đổi điểm',
			dataIndex: 'dotDangKyQuyDoiDiemId',
			width: 100,
			render: (val, rec) => rec?.DotQuyDoiDiem?.tenDot,
			onCell,
		},
		{
			title: 'Học phần quy đổi',
			width: 250,
			render: (val, rec) =>
				rec.danhSachHocPhan?.map((item) => (
					<>
						- {item.hocPhan?.ten} - {item.diemHe10 ?? 'Chưa có điểm'} -{' '}
						<i style={{ color: colorTrangThaiHocPhanQuyDoi[item.trangThai] }}>{item.trangThai}</i>
						<br />
					</>
				)),
			onCell,
		},
		{
			title: 'Số QĐ',
			dataIndex: 'soQuyetDinhId',
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
			title: 'Công nhận',
			dataIndex: 'trangThai',
			align: 'center',
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
				modelName='daotao.quydoidiem.phieuquydoidiem'
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
