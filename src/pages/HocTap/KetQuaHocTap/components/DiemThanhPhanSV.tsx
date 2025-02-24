import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { CheckOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

interface DataType extends LopHocPhan.IDiemHpSvHk {
	title?: string;
	tenHocPhan?: string;
	maHocPhanQuyDoi?: string;
	tichLuy?: boolean;
	trongChuongTrinh?: boolean;
}

const DiemThanhPhanSV = (props: { maKhoaNganh?: string }) => {
	const { maKhoaNganh } = props;
	const { getKetQuaHocKy } = useModel('daotao.ketquahocky');
	const { danhSach, getDiemSvHk, loading } = useModel('daotao.diemhpsvhk');
	const { danhSach: danhSachDauDiem, getModel: getDauDiem } = useModel('daotao.daudiemhocphan');
	const [loaiHocPhan, setLoaiHocPhan] = useState<string>('all');
	const [data, setData] = useState<DataType[]>([]);
	const danhSachKhongDat = danhSach
		.filter((i) => i.diemChu === ELoaiDiemChu.F)
		.map((i, ind) => ({ ...i, title: ind + 1, tenHocPhan: i.hocPhan?.ten }));

	const getData = () => {
		if (!maKhoaNganh) return;

		Promise.all([getKetQuaHocKy(maKhoaNganh), getDiemSvHk(maKhoaNganh)]).then(([kqhkList, diemSv]) => {
			const res: any[] = [];
			const gHocKy = _.groupBy(diemSv, (item) => item.maHocKy); // Nhóm theo học kỳ
			const aHocKy = Object.entries(gHocKy).sort(([a], [b]) => (a > b ? -1 : 1)); // Sắp xếp giảm dần học kỳ
			aHocKy.forEach(([mahk, diemHpHkList]) => {
				const kqhk = kqhkList.find((j) => j.maHocKy === mahk);
				let tenHocPhan = diemHpHkList[0]?.hocKy?.ten ?? `Học kỳ ${mahk}`;
				if (kqhk)
					tenHocPhan += ` (TB học kỳ: ${kqhk.trungBinhHocKy ?? '--'}, đạt: ${
						kqhk.tongSoTinChiHocKy ?? '--'
					} tín chỉ, tích lũy: ${kqhk.tongSoTinChiTichLuyToanKhoa ?? '--'} tín chỉ)`;
				// Thêm 1 hàng trống => Tên học kỳ
				res.push({ _id: '-1', tenHocPhan, maHocKy: mahk });
				// Thêm các hàng lớp trong kỳ, mỗi hàng có số thứ tự trong kỳ
				res.push(
					...diemHpHkList.map((diem, index) => ({
						...diem,
						title: `${index + 1}`,
						tenHocPhan: diem.hocPhan?.ten,
						maHocPhanQuyDoi:
							diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi !== diem.maHocPhan
								? diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi
								: '',
						trongChuongTrinh: diem.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt ?? false,
						tichLuy:
							diem.infoKhoaNganh?.[maKhoaNganh]?.trongCtdt &&
							diem.infoKhoaNganh?.[maKhoaNganh]?.maHocKyCaiThien === diem.maHocKy &&
							diem.hocPhan?.loaiHocPhan?.isTinhSoTinChiTichLuy !== false,
					})),
				);
			});

			setData(res);
		});
	};

	useEffect(() => {
		if (!danhSachDauDiem.length) getDauDiem();
	}, []);

	useEffect(() => {
		getData();
	}, [maKhoaNganh]);

	const onCell = (rec: LopHocPhan.IDiemHpSvHk) => ({
		style: {
			fontWeight: rec._id === '-1' ? 600 : undefined,
			backgroundColor: rec._id === '-1' ? '#e8fafdbf' : undefined,
		},
		colSpan: rec._id === '-1' ? 0 : 1,
	});

	const columns: IColumn<DataType>[] = [
		{
			title: 'TT',
			dataIndex: 'title',
			width: 40,
			align: 'center',
			onCell,
		},
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			width: 80,
			align: 'center',
			filterType: 'string',
			render: (val, rec) =>
				rec.trongChuongTrinh ? (
					val
				) : (
					<Tooltip title='Không trong chương trình đào tạo'>
						<u className='text-warning'>{val}</u>
					</Tooltip>
				),
			onCell,
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 220,
			onCell: (rec) => ({
				...onCell(rec),
				colSpan: rec._id === '-1' ? 8 + (danhSachDauDiem.length + 1) : 1,
			}),
		},
		{
			title: 'Số TC',
			width: 60,
			align: 'center',
			render: (val, rec) => rec?.hocPhan?.soTinChi,
			onCell,
		},
		{
			title: 'TL',
			dataIndex: 'tichLuy',
			width: 40,
			align: 'center',
			render: (val) => !!val && <CheckOutlined />,
			onCell,
		},
		{
			title: 'Điểm thi',
			width: 80,
			dataIndex: 'diemThi1',
			align: 'center',
			// sortable: true,
			onCell,
		},
		{
			title: 'Thi lần 2',
			width: 80,
			dataIndex: 'diemThi2',
			align: 'center',
			// sortable: true,
			onCell,
		},
		{
			title: 'Tổng kết (hệ 10)',
			dataIndex: 'diemTongKet',
			align: 'center',
			render: (val) => <b style={(val || val === 0) && val < 4 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			width: 80,
			// sortable: true,
			onCell,
		},
		{
			title: 'Tổng kết (hệ 4)',
			width: 80,
			dataIndex: 'diemThang4',
			align: 'center',
			render: (val) => <b style={val === 0 ? { color: 'red' } : {}}>{val ?? '--'}</b>,
			// sortable: true,
			onCell,
		},
		{
			title: 'Tổng kết (chữ)',
			width: 80,
			dataIndex: 'diemChu',
			align: 'center',
			fixed: 'right',
			// filterType: 'select',
			// filterData: Object.values(ELoaiDiemChu),
			render: (val, rec) => (
				<>
					<Tag color={ColorDiemChu?.[val as ELoaiDiemChu]}>{val === ELoaiDiemChu.CHUA_DU_DU_LIEU ? '--' : val}</Tag>{' '}
					{rec?.isCongNhanQuyDoiDiem && <Tooltip title='Điểm quy đổi'>(R)</Tooltip>}
				</>
			),
			onCell,
		},
	];

	const cols: IColumn<LopHocPhan.IDiemHpSvHk>[] = danhSachDauDiem.map((item) => ({
		title: item.ma ?? item.ten,
		width: 80,
		dataIndex: `diemThanhPhan${item.field}` as keyof LopHocPhan.IDiemHpSvHk,
		align: 'center',
		// sortable: true,
		onCell,
	}));
	columns.splice(5, 0, {
		title: 'Điểm thành phần',
		width: cols.length * 80,
		children: cols,
	});

	return (
		<>
			<div style={{ marginBottom: 12 }}>
				Danh sách kết quả học tập các học phần được tích lũy qua từng kỳ học (chỉ tính học phần có trong chương trình
				đào tạo của ngành).
				<br />
				Xem chi tiết tiến trình học tập{' '}
				<a
					href='./tien-trinh-hoc-tap'
					onClick={(e) => {
						e.preventDefault();
						history.push('./tien-trinh-hoc-tap');
					}}
				>
					tại đây
				</a>
				.
			</div>
			<TableStaticData
				loading={loading}
				otherProps={{
					loading: loading,
					pagination: false,
					scroll: { y: 660 },
				}}
				data={loaiHocPhan === 'all' ? data : danhSachKhongDat}
				columns={columns}
			>
				{/* <Segmented
					value={loaiHocPhan}
					onChange={(val) => setLoaiHocPhan(val.toString())}
					options={[
						{ value: 'all', label: 'Tất cả học phần' },
						// { value: 'fail', label: 'Học phần chưa đạt' },
					]}
				/> */}
			</TableStaticData>
		</>
	);
};

export default DiemThanhPhanSV;
