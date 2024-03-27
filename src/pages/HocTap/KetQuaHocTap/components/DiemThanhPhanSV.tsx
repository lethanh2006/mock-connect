import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Segmented, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const DiemThanhPhanSV = (props: { maKhoaNganh?: string }) => {
	const { maKhoaNganh } = props;
	const { danhSach, getAllModel, loading } = useModel('daotao.diemhpsvhk');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [loaiHocPhan, setLoaiHocPhan] = useState<string>('all');

	const getData = () => maKhoaNganh && getAllModel(undefined, undefined, { maKhoaNganh }, undefined, 'sinh-vien/me');

	useEffect(() => {
		getDauDiem();
	}, []);

	useEffect(() => {
		getData();
	}, [maKhoaNganh]);

	const columns: IColumn<LopHocPhan.IDiemHpSvHk>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			width: 220,
			render: (val, rec) => rec?.hocPhan?.ten,
		},
		{
			title: 'Số TC',
			width: 80,
			align: 'center',
			render: (val, rec) => rec?.hocPhan?.soTinChi,
		},
	];

	const cols1: IColumn<LopHocPhan.IDiemHpSvHk>[] = [1, 2].map((item) => ({
		title: `Thi lần ${item}`,
		width: 80,
		dataIndex: `diemThi${item}` as keyof LopHocPhan.IDiemHpSvHk,
		align: 'center',
		sortable: true,
	}));
	cols1.push(
		{
			title: 'Tổng kết (hệ 10)',
			dataIndex: 'diemTongKet',
			align: 'center',
			render: (val) => <b style={(val || val === 0) && val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			width: 80,
			sortable: true,
		},
		{
			title: 'Tổng kết (hệ 4)',
			width: 80,
			dataIndex: 'diemThang4',
			align: 'center',
			render: (val) => <b style={val === 0 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			sortable: true,
		},
		{
			title: 'Tổng kết (dạng chữ)',
			width: 80,
			dataIndex: 'diemChu',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDiemChu),
			render: (val, rec) => (
				<>
					<Tag color={ColorDiemChu?.[val as ELoaiDiemChu]}>{val}</Tag>{' '}
					{rec?.isCongNhanQuyDoiDiem && <Tooltip title='Điểm quy đổi'>(R)</Tooltip>}
				</>
			),
		},
	);
	columns.splice(3, 0, {
		title: 'Điểm KTHP',
		width: cols1.length * 80,
		children: cols1,
	});

	const cols: IColumn<LopHocPhan.IDiemHpSvHk>[] = danhSachDauDiem.map((item) => ({
		title: item.ma ?? item.ten,
		width: 80,
		dataIndex: `diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk,
		align: 'center',
		sortable: true,
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
					.filter((item) => loaiHocPhan === 'all' || item?.diemChu === ELoaiDiemChu.F)
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
		</>
	);
};

export default DiemThanhPhanSV;
