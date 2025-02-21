import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiDuyeMuonSach, ETrangThaiDuyetMuonSach } from '@/services/QuanLyThuVien/constant';
import type { PhieuMuonTra } from '@/services/QuanLyThuVien/PhieuMuonTra/typing';
import { Card, Tabs, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import LichSuMuonTraPage from '.';
import StatMuonTraSach from '../components/Stat';

const PhieuMuonPage = () => {
	const { getModel, page, limit, handleView } = useModel('thuvien.phieumuonsach');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me');
	};

	const [tabActive, setTabActive] = useState<string>('1');

	const onCell = (rec: PhieuMuonTra.IRecord) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<PhieuMuonTra.IRecord>[] = [
		{
			title: 'Vai trò',
			dataIndex: 'vaiTro',
			align: 'center',
			width: 90,
			onCell,
		},
		{
			title: 'Mã định danh',
			dataIndex: 'maDinhDanhNguoiMuon',
			align: 'center',
			width: 120,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTenNguoiMuon',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian đăng ký',
			dataIndex: 'thoiGianDangKy',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDuyet',
			align: 'center',
			width: 120,
			render: (val, rec) => <Tag color={colorTrangThaiDuyeMuonSach[val as ETrangThaiDuyetMuonSach]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetMuonSach),
			onCell,
		},
	];

	return (
		<Card title='Danh sách phiếu mượn'>
			<div style={{ marginBottom: 12 }}>
				{/* <div style={{ marginBottom: 8 }}>
					<i>
						<b>Hạn ngạch mượn:</b> {settingMuonTra?.soLuongMuonToiDa}
					</i>
					<br />
					<i>
						<b>Còn mượn được:</b>{' '}
						{Math.max(0, (settingMuonTra?.soLuongMuonToiDa ?? 0) - (dataThongKe?.dangThueMuon ?? 0))}
					</i>
				</div> */}
				<StatMuonTraSach />
			</div>
			{/* <div>
				<i>
					Khi chuyên viên xác nhận cho mượn sẽ có thông báo sinh viên lưu ý chú ý thông báo để lên thư viện nhận sách
				</i>
			</div> */}

			<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
				<Tabs.TabPane tab='Phiếu mượn' key='1' />
				<Tabs.TabPane tab='Tất cả lịch sử' key='2' />
			</Tabs>

			{tabActive === '1' ? (
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit]}
					modelName='thuvien.phieumuonsach'
					widthDrawer={1100}
					Form={LichSuMuonTraPage}
					hideCard
					buttons={{ create: false }}
				/>
			) : (
				<LichSuMuonTraPage tatCaLichSu />
			)}
		</Card>
	);
};

export default PhieuMuonPage;
