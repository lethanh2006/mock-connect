import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ColorDiemChu, type ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Divider, Tag, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

/** Phiên bản rút gọn của `TableDiemHocPhan` trong KetQuaHocTap */
const TableDiemHocKyHocBa = (props: { maKhoaNganh: string }) => {
	const { getModel: getDauDiem, danhSach: danhSachDauDiem } = useModel('daotao.daudiemhocphan');
	const { record, loading } = useModel('sinhvien.hocba.hocba');
	const [data, setData] = useState<LopHocPhan.TViewDiemHocKy[]>([]);
	const { maKhoaNganh } = props;

	const getDiemSvHk = () => {
		if (record?._id) {
			const res =
				record?.diemHocPhanKy?.map((diem) => ({
					...diem,
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
				})) ?? [];
			setData(res);
		}
	};

	useEffect(() => {
		if (!danhSachDauDiem.length) getDauDiem(); // Max 10 đầu điểm
	}, []);

	useEffect(() => {
		getDiemSvHk();
	}, [record?._id]);

	const columns: IColumn<LopHocPhan.TViewDiemHocKy>[] = [
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
		},
		{
			title: 'Quy đổi',
			dataIndex: 'maHocPhanQuyDoi',
			width: 80,
			align: 'center',
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			dataIndex: 'tenHocPhan',
			width: 200,
			filterType: 'string',
		},
		{
			title: 'TC',
			width: 40,
			align: 'center',
			render: (val, rec) => rec?.hocPhan?.soTinChi,
		},
		// {
		// 	title: 'TL',
		// 	dataIndex: 'tichLuy',
		// 	width: 40,
		// 	align: 'center',
		// 	render: (val) => !!val && <CheckOutlined />,
		// },
		{
			title: 'KTHP',
			dataIndex: 'diemKthp',
			width: 60,
			align: 'center',
		},
		{
			title: 'Điểm tổng kết',
			width: 180,
			children: [
				{
					title: 'Hệ 10',
					dataIndex: 'diemTongKet',
					width: 60,
					align: 'center',
				},
				{
					title: 'Hệ 4',
					dataIndex: 'diemThang4',
					width: 60,
					align: 'center',
				},
				{
					title: 'Chữ',
					dataIndex: 'diemChu',
					width: 60,
					align: 'center',
					render: (val, rec) => (
						<>
							<Tag color={ColorDiemChu[val as ELoaiDiemChu]}>{val}</Tag>{' '}
							{rec?.isCongNhanQuyDoiDiem && <Tooltip title='Điểm quy đổi'>(R)</Tooltip>}
						</>
					),
				},
			],
		},
	];
	const cols: IColumn<LopHocPhan.IDiemHpSvHk & Record<string, any>>[] = danhSachDauDiem.map((item) => ({
		title: item.ma ?? item.ten,
		width: 60,
		dataIndex: `diemThanhPhan${item.field}`,
		align: 'center',
		render: (val, rec) =>
			val && (
				<>
					{val}
					{rec[`trongSo${item.field}`] ? (
						<div>
							<i>
								<small>({rec[`trongSo${item.field}`] ?? 0}%)</small>
							</i>
						</div>
					) : null}
				</>
			),
	}));
	if (cols.length)
		columns.splice(4, 0, {
			title: 'Điểm thành phần',
			width: cols.length * 60,
			children: cols,
		});

	return (
		<>
			<Divider>Kết quả học tập chi tiết</Divider>

			<TableStaticData
				columns={columns}
				addStt
				// hasTotal
				data={data}
				size='small'
				loading={loading}
				otherProps={{ pagination: false, scroll: { y: 500 } }}
			/>
		</>
	);
};

export default TableDiemHocKyHocBa;
