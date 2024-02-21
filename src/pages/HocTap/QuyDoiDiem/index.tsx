import TableBase from '@/components/Table';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiHocPhanQuyDoi,
	colorTrangThaiSinhVienQuyDoiDiem,
	type ETrangThaiSinhVienQuyDoiDiem,
} from '@/services/HocTap/constant';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ModalQuyDoiDiem from './components/Modal';

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
			width: 130,
			render: (val, rec) => rec?.dotDangKyQuyDoiDiem?.tenDot,
			onCell,
		},
		{
			title: 'Học phần quy đổi',
			width: 250,
			render: (val, rec) =>
				rec.danhSachHocPhan?.map((item) => (
					<>
						- {item.hocPhan?.ten} - {item.diemHe4 ?? 'Chưa có điểm'} -{' '}
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
			render: (val, rec) => rec.quyetDinh?.soQuyetDinh,
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
			align: 'center',
			width: 100,
			render: (val, rec) => {
				const tiLeCongNhan =
					((rec?.soTinChiDaCongNhan + rec?.soTinChiCongNhanDot) / rec?.soTinChiChuongTrinhDaoTao) * 100;
				return (
					<div>
						( <Tooltip title='Tổng số tín đã được công nhận trước đó'>{rec?.soTinChiDaCongNhan ?? 0}</Tooltip> +{' '}
						<Tooltip title='Tổng số tín chỉ đã được công nhận đợt này'>{rec?.soTinChiCongNhanDot}</Tooltip>) /{' '}
						<Tooltip title='Tổng số tín chỉ trong chương trình đào tạo'>{rec?.soTinChiChuongTrinhDaoTao}</Tooltip>{' '}
						<br />
						<span style={{ color: tiLeCongNhan > 50 ? 'green' : 'red' }}>{Math.ceil(tiLeCongNhan * 100) / 100} %</span>
					</div>
				);
			},
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
