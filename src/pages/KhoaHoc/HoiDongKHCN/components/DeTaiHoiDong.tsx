import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { EDangSanPham, ELoaiDeTaiCaNhan } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { ELoaiHoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/constants';
import type { HoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tag, message } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import DeTaiNgoaiHoiDong from './DeTaiNgoaiHoiDong';
// import FormThanhVien from './FormThanhVien';

const TableDeTaiHoiDong = (props: {
	mode: 'view' | 'edit' | 'duyet';
	data: DeTaiKHCN.IRecord[];
	showTenHoiDong?: boolean;
	type: ELoaiHoiDongKHCN;
}) => {
	const {
		setVisibleViewDetail,
		setRecord: setRecDeTai,
		selectedIds,
		danhSach: danhSachDeTai,
		setSelectedIds,
	} = useModel('khoahoc.detaikhcn');
	const { record: recHoiDong, setRecord: setRecHoiDong } = useModel('khoahoc.hoidongkhcn');

	const [visibleForm, setVisibleForm] = useState<boolean>(false);

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

	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	const columnsHoiDongXetChonDeXuat: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			dataIndex: 'tenHoiDong',
			width: 200,
			hide: !props.showTenHoiDong,
		},
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
					{rec.dangKyKhcn?.danhSachCTV?.map((item) => (
						<div key={item.maDinhDanh}>{item.ten}</div>
					))}
				</div>
			),
			onCell,
		},
		{
			title: 'Lớp',
			dataIndex: 'dangKyKhcn.chuTriDeTai.ten' as any,
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val, rec) => (
				<div>
					<div>{rec.dangKyKhcn.chuTriDeTai.tenLopHanhChinh}</div>
					{rec.dangKyKhcn?.danhSachCTV?.map((item) => (
						<div key={item.maDinhDanh}>{item.tenLopHanhChinh}</div>
					))}
				</div>
			),
			onCell,
		},
		{
			title: 'Khoa',
			dataIndex: 'dangKyKhcn.chuTriDeTai.tenDonVi' as any,
			width: 150,
			align: 'center',
			render: (val, rec) => rec.dangKyKhcn.chuTriDeTai.tenDonVi,
			onCell,
		},
		{
			title: 'Loại đề tài',
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},
	];

	const columnsHoiDongXetDuyetThuyetMinh: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			dataIndex: 'tenHoiDong',
			width: 200,
			hide: !props.showTenHoiDong,
		},
		{
			title: 'Tên đề tài',
			dataIndex: ['dangKyKhcn', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Sinh viên chịu trách nhiệm thực hiện chính/Thành viên tham gia',
			dataIndex: 'dangKyKhcn.chuTriDeTai.ten' as any,
			width: 200,
			// filterType: 'string',
			// align: 'center',
			render: (val, rec) => (
				<div>
					<div>- {rec.dangKyKhcn.chuTriDeTai.ten} (Sinh viên chịu trách nhiệm thực hiện chính)</div>
					{rec.dangKyKhcn.danhSachCTV.map((item) => (
						<div key={item.userId || item.ten}>
							- {item.ten} ({item.danhSachVaiTroDeTai.join(', ')})
						</div>
					))}
				</div>
			),
			onCell,
		},
		{
			title: 'Thể loại',
			dataIndex: ['dangKyKhcn', 'thuocLinhVuc'],
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Tổng điểm',
			width: 100,
			align: 'center',
			onCell,
			render: (rec) => (
				<div>
					{rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.tongDiem || rec.deCuongKhcn?.tongDiem || 'Chưa có'} điểm
				</div>
			),
		},
	];
	const columnsHoiDongNghiemThu: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			dataIndex: 'tenHoiDong',
			width: 200,
			hide: !props.showTenHoiDong,
		},
		{
			title: 'Tên đề tài',
			dataIndex: ['dangKyKhcn', 'ten'],
			width: 200,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Sinh viên chịu trách nhiệm thực hiện chính/Thành viên tham gia',
			dataIndex: 'dangKyKhcn.chuTriDeTai.ten' as any,
			width: 200,
			render: (val, rec) => (
				<div>
					<div>- {rec.dangKyKhcn.chuTriDeTai.ten} (Sinh viên chịu trách nhiệm thực hiện chính)</div>
					{rec.dangKyKhcn.danhSachCTV.map((item) => (
						<div key={item.userId || item.ten}>
							- {item.ten} ({item.danhSachVaiTroDeTai.join(', ')})
						</div>
					))}
				</div>
			),
			onCell,
		},
		{
			title: 'Báo cáo tổng hợp kết quả nghiên cứu đề tài',
			dataIndex: ['nghiemThuKhcn', 'baoCaoUrl'],
			width: 120,
			align: 'center',
			render: (val: string[]) => (
				<div>
					{val?.map((item, index) => (
						<a key={item} href={item} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin {index + 1}</Tag>
						</a>
					))}
				</div>
			),
			// onCell,
		},
		{
			title: 'Sản phẩm của đề tài được công bố hoặc minh chứng ứng dụng trong thực tiễn (nếu có)',
			dataIndex: ['nghiemThuKhcn', 'sanPham'],
			width: 250,
			render: (val: DeTaiKHCN.SanPhamNghiemThu[]) => (
				<div>
					{val
						?.filter((item) => item?.url?.length > 0)
						?.map((item, index) => (
							<div key={item.loai}>
								{index + 1}. {item.loai}:{' '}
								{item.url?.map((ele, indexEle) => (
									<a key={ele} href={ele} target='_blank' rel='noreferrer'>
										<Tag color={primaryColor}>Xem tập tin {indexEle + 1}</Tag>
									</a>
								))}
							</div>
						))}
				</div>
			),
			// onCell,
		},
	];

	const finalColumn =
		props.type === ELoaiHoiDongKHCN.XET_DUYET
			? columnsHoiDongXetChonDeXuat
			: props.type === ELoaiHoiDongKHCN.DE_CUONG
			? columnsHoiDongXetDuyetThuyetMinh
			: columnsHoiDongNghiemThu;

	return (
		<>
			<TableStaticData
				addStt
				data={props?.data ?? []}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={finalColumn?.filter((item) => item.hide !== true)}
			>
				{props.mode === 'edit' && (
					<Space wrap>
						<Button
							size='small'
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setVisibleForm(true);
							}}
						>
							Thêm mới
						</Button>
					</Space>
				)}
			</TableStaticData>
			<Modal
				width={1000}
				zIndex={1002}
				destroyOnClose
				visible={visibleForm}
				onCancel={onCancelForm}
				footer={[
					<Button
						onClick={() => {
							if (!selectedIds?.length) {
								message.error('Vui lòng chọn ít nhất 1 đề tài', 5);
								return;
							}
							setRecHoiDong({
								...recHoiDong,
								danhSachDeTai: [
									...(recHoiDong?.danhSachDeTai ?? []),
									...danhSachDeTai?.filter((item) => selectedIds.includes(item._id)),
								],
							} as HoiDongKHCN.IRecord);
							setSelectedIds([]);
							onCancelForm();
							// message.success('Lưu thành công');
						}}
						type='primary'
						key={'ok'}
					>
						OK
					</Button>,
					<Button key={'cancel'} onClick={onCancelForm}>
						Hủy
					</Button>,
				]}
				title='Danh sách đề tài'
			>
				<DeTaiNgoaiHoiDong />
			</Modal>
		</>
	);
};

export default TableDeTaiHoiDong;
