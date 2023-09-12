import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Segmented, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import MayTinhThongMinh from './MayTinhThongMinh';
import ModalChiTietDiem from './ModalChiTietDiem';

const DiemThanhPhanSV = () => {
	const { danhSach, sinhVienGetAllDiemLopHocPhanModel, loading, setSinhVienLopHocPhan, sinhVienLopHocPhan } =
		useModel('daotao.sinhvienlophocphan');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [modalVisible, setModalVisible] = useState(false);
	const [loaiHocPhan, setLoaiHocPhan] = useState<string>('all');

	useEffect(() => {
		sinhVienGetAllDiemLopHocPhanModel();
		getDauDiem();
	}, []);

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setSinhVienLopHocPhan(rec);
			setModalVisible(true);
		},
		style: {
			cursor: 'pointer',
			backgroundColor: rec.diemChu === ELoaiDiemChu.F ? '#f7dcdcbd' : undefined,
			color: rec.diemChu === ELoaiDiemChu.F ? 'red' : undefined,
		},
	});

	const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [
		{
			title: 'Mã HP',
			dataIndex: ['hocPhan', 'ma'],
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 220,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Số TC',
			dataIndex: 'soTinChi',
			width: 80,
			align: 'center',
			sortable: true,
			onCell,
		},
	];

	const cols1: IColumn<any>[] = [1, 2].map((item) => ({
		title: `Điểm thi lần ${item}`,
		width: 80,
		dataIndex: `diemThi${item}`,
		align: 'center',
		sortable: true,
		onCell,
	}));
	cols1.push(
		{
			title: 'Tổng tổng kết',
			dataIndex: 'diemTongKet',
			align: 'center',
			render: (val) => <b style={(val || val === 0) && val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			width: 80,
			onCell,
			sortable: true,
		},
		{
			title: 'Điểm thang 4',
			width: 80,
			dataIndex: 'diemThang4',
			align: 'center',
			render: (val) => <b style={val === 0 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			sortable: true,
			onCell,
		},
		{
			title: 'Điểm chữ',
			width: 80,
			dataIndex: 'diemChu',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			render: (val) => <Tag color={ColorDiemChu?.[val as ELoaiDiemChu]}>{val}</Tag>,
			onCell,
		},
	);
	columns.splice(3, 0, {
		title: 'Điểm KTHP',
		width: cols1.length * 80,
		children: cols1,
	});

	const cols: IColumn<any>[] = danhSachDauDiem.map((item) => ({
		title: item.ten,
		width: 80,
		dataIndex: `diemThanhPhan${item.field}`,
		align: 'center',
		sortable: true,
		onCell,
	}));
	columns.splice(3, 0, {
		title: 'Điểm thành phần',
		width: cols.length * 80,
		children: cols,
	});

	return (
		<>
			<Card bodyStyle={{ paddingTop: 8 }}>
				<Tabs>
					<Tabs.TabPane tab='Điểm tổng kết' key='1'>
						<TableStaticData
							loading={loading}
							otherProps={{
								loading: loading,
								pagination: false,
								scroll: { y: 660 },
							}}
							data={(danhSach ?? []).filter((item) => loaiHocPhan === 'all' || item.diemChu === ELoaiDiemChu.F)}
							columns={columns}
							addStt
							hasTotal
						>
							<Segmented
								value={loaiHocPhan}
								onChange={(val) => setLoaiHocPhan(val.toString())}
								options={[
									{ value: 'all', label: 'Tất cả học phần' },
									{ value: 'fail', label: 'Học phần chưa đạt' },
								]}
							/>
						</TableStaticData>
					</Tabs.TabPane>

					<Tabs.TabPane tab='Máy tính thông minh' key='3'>
						<MayTinhThongMinh />
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<ModalChiTietDiem visible={modalVisible} setVisible={setModalVisible} chuongTrinhKhung={sinhVienLopHocPhan} />
		</>
	);
};

export default DiemThanhPhanSV;
