import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { EDangSanPham, ELoaiDeTaiCaNhan } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import type { QuyetDinhGiao } from '@/services/KhoaHoc/QuyetDinhGiao/typings';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useModel } from 'umi';

// import FormThanhVien from './FormThanhVien';

const TableDeTaiQuyetDinh = (props: { mode: 'view' | 'edit' | 'duyet'; data: DeTaiKHCN.IRecord[] }) => {
	const { setVisibleViewDetail, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');
	const { record: recQuyetDinh, setRecord: setRecQuyetDinh } = useModel('khoahoc.quyetdinhgiao');
	const onCell = (recordDeTai: DeTaiKHCN.IRecord) => ({
		onClick: () => {
			setVisibleViewDetail(true);
			setRecDeTai({
				...recordDeTai,
				deCuongKhcn: {
					...(recordDeTai?.deCuongKhcn ?? {}),
					sanPhamDeCuongDangI: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
						(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
					),
					sanPhamDeCuongDangII: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
						(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
					),
					sanPhamDeCuongDangIII: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
						(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
					),
				},
				nghiemThuKhcn: {
					...(recordDeTai?.nghiemThuKhcn ?? {}),
					sanPhamDeCuongDangI: recordDeTai?.nghiemThuKhcn?.baoCaoUrl?.length
						? recordDeTai.nghiemThuKhcn.sanPhamChinh.filter((item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I)
						: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
								(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
						  ),
					sanPhamDeCuongDangII: recordDeTai?.nghiemThuKhcn?.baoCaoUrl?.length
						? recordDeTai.nghiemThuKhcn.sanPhamChinh.filter(
								(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
						  )
						: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
								(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
						  ),
					sanPhamDeCuongDangIII: recordDeTai?.nghiemThuKhcn?.baoCaoUrl?.length
						? recordDeTai.nghiemThuKhcn.sanPhamChinh.filter(
								(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
						  )
						: recordDeTai.deCuongKhcn.sanPhamDeCuong.filter(
								(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
						  ),
				},
			});
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Tên đề tài',
			dataIndex: ['dangKyKhcn', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Sinh viên thực hiện đề tài',
			dataIndex: 'dangKyKhcn.chuTriDeTai.ten' as any,
			width: 200,
			align: 'center',
			filterType: 'string',
			// align: 'center',
			render: (val, rec) => (
				<div>
					<div>
						<b>{rec.dangKyKhcn.chuTriDeTai.ten}</b>
					</div>
					{rec.dangKyKhcn.danhSachCTV.map((item) => (
						<div key={item.userId || item.ten}>{item.ten}</div>
					))}
				</div>
			),
			onCell,
		},
		{
			title: 'Thể loại',
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},
		// {
		// 	title: 'Tổng điểm',
		// 	width: 100,
		// 	align: 'center',
		// 	onCell,
		// 	render: (rec) => (
		// 		<div>
		// 			{rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.tongDiem || rec.deCuongKhcn?.tongDiem || 'Chưa có'} điểm
		// 		</div>
		// 	),
		// },

		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			hide: props.mode === 'view',
			render: (rec: DeTaiKHCN.IRecord) => {
				return (
					<>
						{props.mode === 'edit' && (
							<Tooltip title='Xóa'>
								<Button
									danger
									type='link'
									onClick={() => {
										setRecQuyetDinh({
											...recQuyetDinh,
											danhSachDeTai: recQuyetDinh?.danhSachDeTai?.filter((item) => item._id !== rec._id) ?? [],
											deTaiIds: recQuyetDinh?.deTaiIds?.filter((item) => item !== rec._id) ?? [],
										} as QuyetDinhGiao.IRecord);
									}}
									icon={<DeleteOutlined />}
								/>
							</Tooltip>
						)}
					</>
				);
			},
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				data={props?.data ?? []}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={columns?.filter((item) => item.hide !== true)}
			/>
		</>
	);
};

export default TableDeTaiQuyetDinh;
