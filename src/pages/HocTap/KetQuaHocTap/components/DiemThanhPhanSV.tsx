import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Segmented, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalChiTietDiem from './ModalChiTietDiem';

const DiemThanhPhanSV = (props: { maKhoaNganh?: string }) => {
	const { maKhoaNganh } = props;
	const { danhSach, sinhVienGetAllDiemLopHocPhanModel, loading, setSinhVienLopHocPhan, sinhVienLopHocPhan } = useModel(
		'lophocphan.sinhvienlophocphan',
	);
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [modalVisible, setModalVisible] = useState(false);
	const [loaiHocPhan, setLoaiHocPhan] = useState<string>('all');
	const [hocPhan, setHocPhan] = useState<HocPhan.IRecord>();

	const getData = () => sinhVienGetAllDiemLopHocPhanModel({ maKhoaNganh });

	useEffect(() => {
		getData();
		getDauDiem();
	}, [maKhoaNganh]);

	const onCell = (rec: LopHocPhan.IRecordSinhVienLopHP) => ({
		onClick: () => {
			setHocPhan(rec.hocPhan);
			setSinhVienLopHocPhan(rec);
			setModalVisible(true);
		},
		style: {
			cursor: 'pointer',
			backgroundColor: rec.diemHpSvHk?.diemChu === ELoaiDiemChu.F ? '#f7dcdcbd' : undefined,
			color: rec.diemHpSvHk?.diemChu === ELoaiDiemChu.F ? 'red' : undefined,
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

	const cols1: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = [1, 2].map((item) => ({
		title: `Thi lần ${item}`,
		width: 80,
		dataIndex: ['diemHpSvHk', `diemThi${item}`],
		align: 'center',
		sortable: true,
		onCell,
	}));
	cols1.push(
		{
			title: 'Tổng kết (hệ 10)',
			dataIndex: ['diemHpSvHk', 'diemTongKet'],
			align: 'center',
			render: (val) => <b style={(val || val === 0) && val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			width: 80,
			onCell,
			sortable: true,
		},
		{
			title: 'Tổng kết (hệ 4)',
			width: 80,
			dataIndex: ['diemHpSvHk', 'diemThang4'],
			align: 'center',
			render: (val) => <b style={val === 0 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			sortable: true,
			onCell,
		},
		{
			title: 'Tổng kết (dạng chữ)',
			width: 80,
			dataIndex: ['diemHpSvHk', 'diemChu'],
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

	const cols: IColumn<LopHocPhan.IRecordSinhVienLopHP>[] = danhSachDauDiem.map((item) => ({
		title: item.ma ?? item.ten,
		width: 80,
		dataIndex: ['diemHpSvHk', `diemThanhPhan${item.field}`],
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
			<TableStaticData
				loading={loading}
				otherProps={{
					loading: loading,
					pagination: false,
					scroll: { y: 660 },
				}}
				data={(danhSach ?? [])
					.filter((item) => loaiHocPhan === 'all' || item.diemHpSvHk?.diemChu === ELoaiDiemChu.F)
					.map((item) => ({ ...item, soTinChi: item.hocPhan?.soTinChi }))}
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

			<ModalChiTietDiem
				visible={modalVisible}
				setVisible={setModalVisible}
				hocPhan={hocPhan}
				lopHocPhanId={sinhVienLopHocPhan?.lopHocPhanId}
			/>
		</>
	);
};

export default DiemThanhPhanSV;
