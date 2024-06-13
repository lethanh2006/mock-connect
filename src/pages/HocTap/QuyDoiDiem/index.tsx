import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { QuyDoiDiem } from '@/services/HocTap/QuyDoiDiem/typing';
import {
	colorTrangThaiHocPhanQuyDoi,
	colorTrangThaiSinhVienQuyDoiDiem,
	type ETrangThaiPhieuQuyDoiDiem,
} from '@/services/HocTap/constant';
import { Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ModalQuyDoiDiem from './components/Modal';
import ViewPhieuQuyDoiDiem from './components/View';

const LichSuQuyDoiDiemPage = () => {
	const { page, limit, getModel, visibleForm, setVisibleForm, setRecord } = useModel(
		'daotao.quydoidiem.phieuquydoidiem',
	);
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');
	const [visibleView, setVisibleView] = useState<boolean>(false);

	const handleViewQuyDoi = (rec: QuyDoiDiem.IPhieuDangKyQuyDoiDiem) => {
		setRecord(rec);
		setVisibleView(true);
	};
	const getData = () => getModel({ maKhoaNganh }, undefined, undefined, undefined, undefined, 'me');

	const onCell = (rec: QuyDoiDiem.IPhieuDangKyQuyDoiDiem) => ({
		onClick: () => handleViewQuyDoi(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuyDoiDiem.IPhieuDangKyQuyDoiDiem>[] = [
		{
			title: 'Đợt quy đổi điểm',
			dataIndex: 'dotDangKyQuyDoiDiemId',
			width: 150,
			render: (val, rec) => rec?.dotDangKyQuyDoiDiem?.tenDot,
			onCell,
		},
		{
			title: 'Học phần xin công nhận',
			width: 320,
			render: (val, rec) => (
				<ExpandText>
					{rec.danhSachHocPhan?.map((item) => (
						<>
							- {item.hocPhan?.ten} - {item.diemHe4 ? `${item.diemHe4} điểm` : 'Chưa có điểm'} -{' '}
							<i style={{ color: colorTrangThaiHocPhanQuyDoi[item.trangThai] }}>{item.trangThai}</i>
							{item?.khuyenNghi?.length ? (
								<>
									{' '}
									-{' '}
									<small
										dangerouslySetInnerHTML={{
											__html: `(${item?.khuyenNghi?.map((items) => items).join(', ')})`,
										}}
									/>
								</>
							) : null}
							<br />
						</>
					))}
				</ExpandText>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 140,
			render: (val, rec) => <Tag color={colorTrangThaiSinhVienQuyDoiDiem[val as ETrangThaiPhieuQuyDoiDiem]}>{val}</Tag>,
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
			title: 'Ngày BH',
			dataIndex: 'thoiGianBanHanh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
	];

	return (
		<>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, maKhoaNganh]}
				modelName='daotao.quydoidiem.phieuquydoidiem'
				title='Lịch sử công nhận kết quả'
				buttons={{
					create: false,
				}}
				hideCard
			/>
			<ModalQuyDoiDiem visible={visibleForm} setVisible={setVisibleForm} />
			<ViewPhieuQuyDoiDiem visible={visibleView} setVisible={setVisibleView} />
		</>
	);
};

export default LichSuQuyDoiDiemPage;
