import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { ETrangThaiTienDo } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import {
	EDangSanPham,
	ELoaiDeTaiCaNhan,
	EPhaseDeTaiKHCN,
	ETrangThaiDeTaiQuanLyKhoaHoc,
	ETypeTableDeTai,
	MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
	MapKeyColorTrangThaiTienDo,
	MapKeyNamePhaseDeTaiKHCN,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { currencyFormat } from '@/utils/utils';
import {
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	InfoOutlined,
	LockOutlined,
	UnlockOutlined,
} from '@ant-design/icons';
import { Button, Modal, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';
import { useModel } from 'umi';
import ViewHoiDong from '../HoiDongKHCN/components/ViewHoiDong';
import SelectKeHoachDeTai from '../KeHoachDeTai/components/SelectKeHoachDeTai';
import ViewMocThoiGianDot from '../KeHoachDeTai/components/ViewMocThoiGianDot';
import ViewQuyetDinh from '../QuyetDinhGiao/ViewQuyetDinh';
import FormDangKyDeXuat from './components/FormDangKyDeXuat';
import FormNopHoSoNghiemThu from './components/FormNopHoSoNghiemThu';
import FormNopHoSoSauNghiemThu from './components/FormNopHoSoSauNghiemThu';
import FormNopThuyetMinh from './components/FormNopThuyetMinh';
import FormThucHienDeTai from './components/FormThucHienDeTai';
import ViewDeTai from './components/ViewDeTai';

const DeTaiKHCNPage = (props: { type: ETypeTableDeTai; paramCondition?: any; title?: string }) => {
	const {
		getModel,
		handleEdit,
		deleteModel,
		giangVienKhoaOrMoKhoaDeTaiModel,
		record: recDeTai,
		setRecord,
		setVisibleViewDetail,
		exportDeXuatUngDungModel,
	} = useModel('khoahoc.detaikhcn');

	const {
		loading: loadingQuyetDinh,
		getByIdModel: getByIdQuyetDinhGiaoModel,
		setVisibleViewDetail: setVisibleViewDetailQuyetDinhGiao,
	} = useModel('khoahoc.quyetdinhgiao');

	const { record: recKeHoach, setRecord: setRecKeHoach, danhSach: danhSachKeHoach } = useModel('khoahoc.kehoachdetai');
	const {
		record: recHoiDong,
		setVisibleViewDetail: setVisibleViewDetailHoiDong,
		getByIdModel,
	} = useModel('khoahoc.hoidongkhcn');
	const getData = () => {
		getModel(
			{ dotDangKyId: recKeHoach?._id, ...(props?.paramCondition ?? {}) },
			undefined,
			undefined,
			undefined,
			undefined,
			'me/pageable',
		);
	};

	// const { getAllModel, setDanhSachAllSinhVien, danhSachAllSinhVien } = useModel('sinhvien.sinhvien');

	// const getAllSinhVien = async () => {
	// 	const res = await getAllModel(false);
	// 	setDanhSachAllSinhVien(res);
	// };

	// useEffect(() => {
	// 	if (!danhSachAllSinhVien.length) getAllSinhVien();
	// }, []);

	const onCell = (recordDeTai: DeTaiKHCN.IRecord) => ({
		onClick: () => {
			setVisibleViewDetail(true);
			setRecord({
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

	const columnsDangKyDeXuat: IColumn<DeTaiKHCN.IRecord>[] = [
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
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val, rec) => (
				<div>
					<div>{rec.dangKyKhcn.chuTriDeTai.ten}</div>
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
		// {
		// 	title: 'Thời gian thực hiện',
		// 	width: 150,
		// 	align: 'center',
		// 	render: (val: DeTaiKHCN.IRecord) => (
		// 		<div>
		// 			{moment(val.dangKyKhcn.thoiGianThucHienBatDau).format('MM/YYYY')} -{' '}
		// 			{moment(val.dangKyKhcn.thoiGianThucHienKetThuc).format('MM/YYYY')}
		// 		</div>
		// 	),
		// 	onCell,
		// },
		// {
		// 	title: 'Kinh phí đề xuất',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: ['dangKyKhcn', 'kinhPhi', 'kinhPhi'] as any,
		// 	sortable: true,
		// 	render: (val, rec) => (
		// 		<div>
		// 			{currencyFormat(rec?.dangKyKhcn?.kinhPhi?.kinhPhi)} {rec?.dangKyKhcn?.kinhPhi?.menhGia}
		// 		</div>
		// 	),
		// },
		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lock',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiDangKy',
			width: 120,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lock;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp đề xuất' : 'Nộp đề xuất'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.DANG_KY,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa'>
							<Button disabled={isLock} onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
						</Tooltip>

						<Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip>
					</>
				);
			},
		},
	];

	const columnsHoiDongXetChonDeXuat: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			width: 200,
			render: (rec: DeTaiKHCN.IRecord) => (
				<div>
					{rec?.xetDuyetKhcn?.hoiDongId?.length ? (
						<>
							{rec.xetDuyetKhcn.hoiDong.map((item) => (
								<a
									key={item._id}
									onClick={async () => {
										await getByIdModel(item._id);
										setVisibleViewDetailHoiDong(true);
									}}
								>
									{item?.ten}
								</a>
							))}
						</>
					) : (
						'Chưa có hội đồng'
					)}
				</div>
			),
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
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val, rec) => (
				<div>
					<div>{rec.dangKyKhcn.chuTriDeTai.ten}</div>
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
		// {
		// 	title: 'Thời gian thực hiện',
		// 	width: 150,
		// 	align: 'center',
		// 	render: (val: DeTaiKHCN.IRecord) => (
		// 		<div>
		// 			{moment(val.dangKyKhcn.thoiGianThucHienBatDau).format('MM/YYYY')} -{' '}
		// 			{moment(val.dangKyKhcn.thoiGianThucHienKetThuc).format('MM/YYYY')}
		// 		</div>
		// 	),
		// 	onCell,
		// },
		// {
		// 	title: 'Kinh phí đề xuất',
		// 	width: 120,
		// 	align: 'center',
		// 	dataIndex: ['dangKyKhcn', 'kinhPhi', 'kinhPhi'] as any,
		// 	sortable: true,
		// 	render: (val, rec) => (
		// 		<div>
		// 			{currencyFormat(rec?.dangKyKhcn?.kinhPhi?.kinhPhi)} {rec?.dangKyKhcn?.kinhPhi?.menhGia}
		// 		</div>
		// 	),
		// },
		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockXetDuyet',
			width: 120,
			fixed: 'right',
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiXetDuyetDangKy',
			width: 150,
			fixed: 'right',
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockXetDuyet;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp đề xuất' : 'Nộp đề xuất'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.XET_DUYET_DANG_KY,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa'>
							<Button disabled={isLock} onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];

	const columnsNopThuyetMinh: IColumn<DeTaiKHCN.IRecord>[] = [
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
			filterType: 'string',
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
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockNopDeCuong',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiNopDeCuong',
			width: 130,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockNopDeCuong;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp hồ sơ thuyết minh' : 'Nộp hồ sơ thuyết minh'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.NOP_DE_CUONG,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa hồ sơ thuyết minh'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
										deCuongKhcn: {
											...(record?.deCuongKhcn ?? {}),
											sanPhamDeCuongDangI: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
											),
											sanPhamDeCuongDangII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
											),
											sanPhamDeCuongDangIII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
											),
										},
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];

	const columnsHoiDongXetDuyetThuyetMinh: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			width: 200,
			render: (rec: DeTaiKHCN.IRecord) => (
				<div>
					{rec?.deCuongKhcn?.hoiDongId?.length ? (
						<>
							{rec.deCuongKhcn.hoiDong.map((item) => (
								<a
									key={item._id}
									onClick={async () => {
										await getByIdModel(item._id);
										setVisibleViewDetailHoiDong(true);
									}}
								>
									{item?.ten}
								</a>
							))}
						</>
					) : (
						'Chưa có hội đồng'
					)}
				</div>
			),
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
			filterType: 'string',
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
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},

		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockDeCuong',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiXetDuyetDeCuong',
			width: 150,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockDeCuong;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp thuyết minh' : 'Nộp thuyết minh'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
										deCuongKhcn: {
											...(record?.deCuongKhcn ?? {}),
											sanPhamDeCuongDangI: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
											),
											sanPhamDeCuongDangII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
											),
											sanPhamDeCuongDangIII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
											),
										},
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];
	const columnsQuyetDinhGiao: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Quyết định giao đề tài NCKH',
			width: 120,
			align: 'center',
			render: (rec: DeTaiKHCN.IRecord) => (
				<div>
					{rec?.quyetDinhGiaoId ? (
						<Button
							loading={loadingQuyetDinh}
							type='link'
							onClick={async () => {
								await getByIdQuyetDinhGiaoModel(rec.quyetDinhGiaoId);
								setVisibleViewDetailQuyetDinhGiao(true);
							}}
						>
							Xem chi tiết
						</Button>
					) : (
						'Chưa có quyết định'
					)}
				</div>
			),
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
			filterType: 'string',
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
			dataIndex: ['dangKyKhcn', 'loaiCaNhan'],
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item })),
			onCell,
		},
	];
	const columnsThucHienDeTai: IColumn<DeTaiKHCN.IRecord>[] = [
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
			filterType: 'string',
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
			title: 'Đã thực hiện tạm ứng',
			dataIndex: ['deCuongKhcn', 'daThucHienTamUng'],
			width: 120,
			align: 'center',
			filterType: 'select',
			render: (val) => (val ? 'Đã tạm ứng' : 'Chưa tạm ứng'),
			onCell,
		},
		{
			title: 'Kết luận',
			dataIndex: ['deCuongKhcn', 'ketLuanTienDo'],
			width: 200,
			align: 'center',
			filterType: 'select',
			render: (val: ETrangThaiTienDo) => (val ? <Tag color={MapKeyColorTrangThaiTienDo[val]}>{val}</Tag> : ''),
			onCell,
		},
		{
			title: 'Dự kiến lịch bảo vệ',
			dataIndex: ['deCuongKhcn', 'duKienLichBaoVe'],
			width: 150,
			align: 'center',
			sortable: true,
			render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : 'Chưa có'),
			onCell,
		},

		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockThucHien',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiThucHien',
			width: 150,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockThucHien;
				return (
					<>
						<Tooltip
							title={isLock ? 'Hủy nộp báo cáo tiến độ thực hiện đề tài' : 'Nộp báo cáo tiến độ thực hiện đề tài'}
						>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.THUC_HIEN,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Cập nhật tiến độ'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
										deCuongKhcn: {
											...(record?.deCuongKhcn ?? {}),
											sanPhamDeCuongDangI: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
											),
											sanPhamDeCuongDangII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
											),
											sanPhamDeCuongDangIII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
											),
										},
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];
	const columnsNopHoSoNghiemThu: IColumn<DeTaiKHCN.IRecord>[] = [
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
			filterType: 'string',
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

		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockNopNghiemThu',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiNopNghiemThu',
			width: 150,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 130,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockNopNghiemThu;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp hồ sơ nghiệm thu' : 'Nộp hồ sơ nghiệm thu'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.NOP_NGHIEM_THU,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa hồ sơ nghiệm thu'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
										deCuongKhcn: {
											...(record?.deCuongKhcn ?? {}),
											sanPhamDeCuongDangI: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
											),
											sanPhamDeCuongDangII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
											),
											sanPhamDeCuongDangIII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
											),
										},
										nghiemThuKhcn: {
											...(record?.nghiemThuKhcn ?? {}),
											sanPhamDeCuongDangI: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
												  ),
											sanPhamDeCuongDangII: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
												  ),
											sanPhamDeCuongDangIII: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
												  ),
										},
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						<Tooltip title={'Xuất Bản đề xuất ứng dụng kết quả và hoạt động KHCN'}>
							<Button
								onClick={() => exportDeXuatUngDungModel(record._id, 'word')}
								type='link'
								icon={<ExportOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];
	const columnsHoiDongNghiemThu: IColumn<DeTaiKHCN.IRecord>[] = [
		{
			title: 'Hội đồng',
			width: 200,
			render: (rec: DeTaiKHCN.IRecord) => (
				<div>
					{rec?.nghiemThuKhcn?.hoiDongId?.length ? (
						<>
							{rec.nghiemThuKhcn.hoiDong.map((item, index) => (
								<div key={item._id}>
									<a
										onClick={async () => {
											await getByIdModel(item._id);
											setVisibleViewDetailHoiDong(true);
										}}
									>
										{index + 1}. {item?.ten}
									</a>
								</div>
							))}
						</>
					) : (
						'Chưa có hội đồng'
					)}
				</div>
			),
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
			filterType: 'string',
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

		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockNghiemThu',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'trangThaiNghiemThu',
			width: 150,
			align: 'center',
			render: (val) => (
				<div>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[val]}>{val}</Tag>
				</div>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiDeTaiQuanLyKhoaHoc).map((item) => ({ value: item, label: item })),
			onCell,
		},
		{
			title: 'Thao tác',
			width: 130,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockNghiemThu;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp hồ sơ nghiệm thu' : 'Nộp hồ sơ nghiệm thu'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.NGHIEM_THU,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa hồ sơ nghiệm thu'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
										deCuongKhcn: {
											...(record?.deCuongKhcn ?? {}),
											sanPhamDeCuongDangI: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
											),
											sanPhamDeCuongDangII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
											),
											sanPhamDeCuongDangIII: record.deCuongKhcn.sanPhamDeCuong.filter(
												(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
											),
										},
										nghiemThuKhcn: {
											...(record?.nghiemThuKhcn ?? {}),
											sanPhamDeCuongDangI: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_I,
												  ),
											sanPhamDeCuongDangII: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_II,
												  ),
											sanPhamDeCuongDangIII: record?.nghiemThuKhcn?.baoCaoUrl?.length
												? record.nghiemThuKhcn.sanPhamChinh.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
												  )
												: record.deCuongKhcn.sanPhamDeCuong.filter(
														(item) => item.dangSanPham === EDangSanPham.DANG_SAN_PHAM_III,
												  ),
										},
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						<Tooltip title={'Xuất Bản đề xuất ứng dụng kết quả và hoạt động KHCN'}>
							<Button
								onClick={() => exportDeXuatUngDungModel(record._id, 'word')}
								type='link'
								icon={<ExportOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];

	const columnsNopHoSoSauNghiemThu: IColumn<DeTaiKHCN.IRecord>[] = [
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
			filterType: 'string',
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
			title: 'Hồ sơ sau nghiệm thu',
			dataIndex: 'taiLieuSauNghiemThu',
			width: 250,
			render: (val: DeTaiKHCN.TaiLieu[]) => (
				<div>
					{val
						?.filter((item) => item?.url?.length > 0)
						?.map((item, index) => (
							<div key={item.ten}>
								{index + 1}. {item.ten}:{' '}
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

		{
			title: 'Bước',
			dataIndex: 'phaseDeTaiKhcn',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(EPhaseDeTaiKHCN).map((item) => ({
				value: item,
				label: MapKeyNamePhaseDeTaiKHCN[item],
			})),
			render: (val: EPhaseDeTaiKHCN) => MapKeyNamePhaseDeTaiKHCN[val],
			onCell,
		},
		{
			title: 'Trạng thái nộp',
			dataIndex: 'lockSauNghiemThu',
			width: 120,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#dc3545'}>{val ? 'Đã nộp' : 'Chưa nộp'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã nộp' },
				{ value: 0, label: 'Chưa nộp' },
			],
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'hoanThanh',
			width: 150,
			align: 'center',
			render: (val) => <Tag color={val ? '#28a745' : '#007bff'}>{val ? 'Đã tiếp nhận' : 'Chưa tiếp nhận'}</Tag>,
			filterType: 'select',
			filterData: [
				{ value: 1, label: 'Đã tiếp nhận' },
				{ value: 0, label: 'Chưa tiếp nhận' },
			],
			onCell,
		},
		{
			title: 'Thao tác',
			width: 130,
			align: 'center',
			fixed: 'right',
			render: (record: DeTaiKHCN.IRecord) => {
				const isLock = record.lockSauNghiemThu;
				return (
					<>
						<Tooltip title={isLock ? 'Hủy nộp hồ sơ sau nghiệm thu' : 'Nộp hồ sơ sau nghiệm thu'}>
							<Button
								// disabled={isLock}
								onClick={() =>
									giangVienKhoaOrMoKhoaDeTaiModel(
										isLock ? 'unlock' : 'lock',
										record._id,
										EPhaseDeTaiKHCN.SAU_NGHIEM_THU,
										getData,
									)
								}
								type='link'
								icon={isLock ? <UnlockOutlined /> : <LockOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Chỉnh sửa hồ sơ sau nghiệm thu'>
							<Button
								disabled={isLock}
								onClick={() => {
									handleEdit({
										...record,
									});
								}}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>

						<Tooltip title={'Xuất Bản đề xuất ứng dụng kết quả và hoạt động KHCN'}>
							<Button
								onClick={() => exportDeXuatUngDungModel(record._id, 'word')}
								type='link'
								icon={<ExportOutlined />}
							/>
						</Tooltip>

						{/* <Tooltip title='Xóa'>
							<Popconfirm
								onConfirm={() => deleteModel(record._id, getData, `me/${record._id}`)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button disabled={isLock} danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</Tooltip> */}
					</>
				);
			},
		},
	];

	const Form = useCallback(() => {
		if (props.type === ETypeTableDeTai.DangKyDeXuat || props.type === ETypeTableDeTai.HoiDongXetChonDeXuat)
			return <FormDangKyDeXuat type={props.type} getData={getData} />;
		if (props.type === ETypeTableDeTai.NopThuyetMinh || props.type === ETypeTableDeTai.HoiDongXetDuyetThuyetMinh)
			return <FormNopThuyetMinh getData={getData} />;
		if (props.type === ETypeTableDeTai.ThucHienDeTai) return <FormThucHienDeTai getData={getData} />;
		if (props.type === ETypeTableDeTai.NopHoSoNghiemThu || props.type === ETypeTableDeTai.HoiDongNghiemThu)
			return <FormNopHoSoNghiemThu getData={getData} />;
		if (props.type === ETypeTableDeTai.NopHoSoSauNghiemThu) return <FormNopHoSoSauNghiemThu getData={getData} />;

		return null;
	}, [props.type]);

	return (
		<TableBase
			dependencies={[recKeHoach?._id]}
			buttons={{ create: props.type === 'DangKyDeXuat' ? true : false }}
			Form={Form}
			otherButtons={[
				<SelectKeHoachDeTai
					onChange={(val: string) => setRecKeHoach(danhSachKeHoach.find((item) => item._id === val))}
					loaiDeTai={props?.paramCondition?.['dangKyKhcn.loaiDeTai']}
					value={recKeHoach?._id}
					isSetRecord
					style={{ width: 300 }}
					placeholder='Lọc theo đợt khai báo'
					key={'filterkehoach'}
				/>,
				<Button
					onClick={() =>
						Modal.info({
							title: 'Mốc thời gian đợt',
							content: <div style={{ marginTop: 20 }}>{recKeHoach && <ViewMocThoiGianDot rec={recKeHoach} />}</div>,
						})
					}
					icon={<InfoOutlined />}
					key={'detailDot'}
				/>,
			]}
			widthDrawer={1000}
			columns={
				props.type === ETypeTableDeTai.DangKyDeXuat
					? columnsDangKyDeXuat
					: props.type === ETypeTableDeTai.HoiDongXetChonDeXuat
					? columnsHoiDongXetChonDeXuat
					: props.type === ETypeTableDeTai.NopThuyetMinh
					? columnsNopThuyetMinh
					: props.type === ETypeTableDeTai.HoiDongXetDuyetThuyetMinh
					? columnsHoiDongXetDuyetThuyetMinh
					: props.type === ETypeTableDeTai.QuyetDinhGiao
					? columnsQuyetDinhGiao
					: props.type === ETypeTableDeTai.ThucHienDeTai
					? columnsThucHienDeTai
					: props.type === ETypeTableDeTai.NopHoSoNghiemThu
					? columnsNopHoSoNghiemThu
					: props.type === ETypeTableDeTai.HoiDongNghiemThu
					? columnsHoiDongNghiemThu
					: columnsNopHoSoSauNghiemThu
			}
			modelName={'khoahoc.detaikhcn'}
			getData={getData}
			title={props?.title ?? 'Đề tài KHCN'}
		>
			{recDeTai && (
				<ViewDeTai
					phaseDeTai={
						props.type === ETypeTableDeTai.DangKyDeXuat
							? EPhaseDeTaiKHCN.DANG_KY
							: props.type === ETypeTableDeTai.HoiDongXetChonDeXuat
							? EPhaseDeTaiKHCN.XET_DUYET_DANG_KY
							: props.type === ETypeTableDeTai.NopThuyetMinh
							? EPhaseDeTaiKHCN.NOP_DE_CUONG
							: props.type === ETypeTableDeTai.HoiDongXetDuyetThuyetMinh
							? EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG
							: props.type === ETypeTableDeTai.ThucHienDeTai
							? EPhaseDeTaiKHCN.THUC_HIEN
							: props.type === ETypeTableDeTai.NopHoSoNghiemThu
							? EPhaseDeTaiKHCN.NOP_NGHIEM_THU
							: props.title === ETypeTableDeTai.HoiDongNghiemThu
							? EPhaseDeTaiKHCN.NGHIEM_THU
							: EPhaseDeTaiKHCN.SAU_NGHIEM_THU
					}
				/>
			)}
			{recHoiDong && <ViewHoiDong zIndex={1005} rec={recHoiDong} />}
			<ViewQuyetDinh />
		</TableBase>
	);
};

export default DeTaiKHCNPage;
