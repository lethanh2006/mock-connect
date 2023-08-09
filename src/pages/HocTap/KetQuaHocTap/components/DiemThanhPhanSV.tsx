import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Card, Tabs, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from './ModalChiTietDiem';
import MayTinhThongMinh from './MayTinhThongMinh';

const DiemThanhPhanSV = () => {
	const { danhSach, sinhVienGetAllDiemLopHocPhanModel, loading, setSinhVienLopHocPhan, sinhVienLopHocPhan } =
		useModel('daotao.sinhvienlophocphan');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		sinhVienGetAllDiemLopHocPhanModel();
		getDauDiem();
	}, []);

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setSinhVienLopHocPhan(rec);
			setModalVisible(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [
		{
			title: 'Tên học phần',
			width: 150,
			render: (val, rec) => rec.hocPhan?.ten ?? '--',
			onCell,
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			width: 100,
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
	cols1.push({
		title: 'Tổng tổng kết',
		dataIndex: 'diemTongKet',
		align: 'center',
		render: (val, r) => <b style={val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
		width: 80,
		onCell,
		sortable: true,
	});
	cols1.push({
		title: 'Điểm thang 4',
		width: 80,
		dataIndex: 'diemThang4',
		align: 'center',
		sortable: true,
		onCell,
	});
	cols1.push({
		title: 'Điểm chữ',
		width: 80,
		dataIndex: 'diemChu',
		align: 'center',
		filterType: 'select',
		filterData: Object.values(ELoaiDiemChu),
		render: (val, recordDiem) => <Tag color={ColorDiemChu?.[val as ELoaiDiemChu]}>{val}</Tag>,
		onCell,
	});
	columns.splice(2, 0, {
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

	columns.splice(2, 0, {
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
							}}
							data={danhSach ?? []}
							columns={columns}
							addStt
							hasTotal
						/>
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
