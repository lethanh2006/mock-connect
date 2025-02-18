import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
	ETrangThaiSinhVienDKTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { inputFormat } from '@/utils/utils';
import { CalendarOutlined, DeleteOutlined, ReloadOutlined, RetweetOutlined, SendOutlined } from '@ant-design/icons';
import { Col, Divider, Popconfirm, Row, Space, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ConfirmKetHuyLopDKTC from './ConfirmHuyLop';
import ModalDangKy from './ModalDangKy';
import ModalLichHoc from './ModalLichHoc';
import RenderLichHoc from './RenderLichHoc';

/** Hiển thị danh sách các lớp đã đăng ký và đã chọn
 * Học phí dự kiến, số tín chỉ được phép đăng ký, lịch học dự kiến
 */
const PhieuDangKy = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		dotDangKyHienTai,
		phieuDangKy,
		danhSachLopDangKy,
		setDanhSachLopDangKy,
		loading,
		deleteDangKyTinChiModel,
		tinhDataLichHoc,
		setVisibleModal,
		setVisibleRegister,
		getPhieuDangKyModel,
		getLopDangKyModel,
		sinhVienDot,
		getLopDaHuyDangKyTinChiModel,
		danhSachLopDaHuy,
		revertLopDangKyTinDaHuyModel,
	} = useModel('daotao.dotdangkytinchi');
	const { getMucThuHocPhiTheoNamModel, tinhHocPhi } = useModel('taichinh.mucthuhocphi');
	const [visibleHuyLop, setVisibleHuyLop] = useState<boolean>(false);
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const [recLopDangKy, setRecLopDangKy] = useState<DangKyTinChi.ILopDangKy>();
	// Danh sách học phần có cả lớp Chính và lớp thực hành
	const hocPhanCoLopThucHanh = danhSachLopDangKy.filter((item) => !!item.tenCha).map((item) => item.maHocPhan);
	// Nếu có cả lớp chính và lớp thực hành thì chỉ hiện lớp thực hành
	const danhSachLopHienThi = danhSachLopDangKy
		.filter((item) => !hocPhanCoLopThucHanh.includes(item.maHocPhan) || !!item.tenCha)
		.map((item) =>
			hocPhanCoLopThucHanh.includes(item.maHocPhan)
				? {
						...item,
						// Gộp lịch học lớp Chính với lớp hiển thị
						maHoaLichHoc:
							danhSachLopDangKy
								?.filter((j) => j.maHocPhan === item.maHocPhan)
								?.map((j) => j.maHoaLichHoc ?? [])
								?.flat() ?? [],
				  }
				: item,
		);
	const tongTinChi = _.sumBy(
		danhSachLopHienThi.filter((item) => item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy !== false),
		(item) => item.soTinChi,
	);
	const tongTinChiChuaDk = _.sumBy(
		danhSachLopDangKy.filter((item) => item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY),
		(item) => item.soTinChi,
	);
	// Đang trong thời gian đăng ký tín chỉ => Được phép đăng ký, xóa đăng ký
	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		moment().isSameOrAfter(dotDangKyHienTai?.thoiGianBatDau) &&
		moment().isSameOrBefore(dotDangKyHienTai?.thoiGianKetThuc);
	// Tổng học phí dự kiến
	const tongHocPhi = _.sumBy(danhSachLopHienThi, (lop) => tinhHocPhi(lop.soTinChi, lop.loai, lop.maNganh));
	// Số tín chỉ tối đa
	const soTinChiToiDa =
		khoaNganhMe?.khoaNganhPhu && phieuDangKy?.soTinChiToiDaSongNganh
			? phieuDangKy.soTinChiToiDaSongNganh
			: phieuDangKy?.soTinChiToiDa ?? 0;
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;

	const getData = () => recHocKy?.ma && getLopDangKyModel(recHocKy.ma);

	const getDataLopHuy = () => phieuDangKy?._id && getLopDaHuyDangKyTinChiModel(phieuDangKy?._id);

	useEffect(() => {
		if (dotDangKyHienTai?._id && sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK)
			getPhieuDangKyModel(dotDangKyHienTai._id);
	}, [sinhVienDot?._id]);

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	useEffect(() => {
		// Get mức thu học phí của tôi theo năm học
		if (recHocKy?.namBatDau) getMucThuHocPhiTheoNamModel(recHocKy.namBatDau.toString());
	}, [recHocKy?.namBatDau]);

	useEffect(() => {
		getDataLopHuy();
	}, [phieuDangKy?._id]);

	const onDeleteLop = async (rec: DangKyTinChi.ILopDangKy) => {
		try {
			// Nếu đã đăng ký rồi thì gọi API để xóa lớp
			if (rec.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY)
				await deleteDangKyTinChiModel({
					phieuDktcId: phieuDangKy?._id ?? '',
					lopHocPhanId: rec._id ?? '',
				});

			// Xóa lớp ở danh sách tại local
			const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== rec.maHocPhan);
			tinhDataLichHoc(data); // Tính lại dữ liệu lịch học
			setDanhSachLopDangKy(data);
		} catch (er) {
			console.log(er);
		}
	};

	const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
		{
			title: 'Mã HP',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 170,
			filterType: 'string',
		},
		{
			title: 'TT lớp',
			dataIndex: 'soThuTuLop',
			width: 80,
			align: 'center',
			render: (val, rec) => `${val}${rec.soThuTuNhom ? ` (nhóm TH ${rec.soThuTuNhom})` : ''}`,
		},
		{
			title: 'STC',
			dataIndex: 'soTinChi',
			width: 60,
			align: 'center',
			sortable: true,
			render: (val, rec) => (
				<>
					{val} {rec.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? <i>(không tính)</i> : null}
				</>
			),
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<ExpandText>
					{rec.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Thông tin chi tiết',
			width: 250,
			render: (val, rec) => <RenderLichHoc lopHocPhan={{ ...rec, loai: ELoaiLopHocPhan.CHINH }} />, // Fake loại để ko lỗi
		},
		// {
		// 	title: 'Mã khóa ngành',
		// 	dataIndex: 'maKhoaNganh',
		// 	align: 'center',
		// 	width: 110,
		// },
		{
			title: 'Học phí (dự kiến)',
			align: 'right',
			width: 120,
			render: (val, rec) => {
				const due = tinhHocPhi(rec.soTinChi, rec.loai, rec.maKhoaNganh);
				if (due) return `${inputFormat(due)} VND`;
				return null;
			},
			// hide: !dangTrongThoiGian,
		},
		// {
		// 	title: 'Loại ĐK',
		// 	dataIndex: 'loai',
		// 	width: 120,
		// 	filterType: 'select',
		// 	filterData: Object.values(ELoaiHocPhanDangKyTinChi).map((item) => ({
		// 		label: LoaiHocPhanDangKyTinChi[item],
		// 		value: item,
		// 	})),
		// 	render: (val: ELoaiHocPhanDangKyTinChi) => LoaiHocPhanDangKyTinChi[val],
		// },
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 110,
			align: 'center',
			render: (val: ETrangThaiDangKyTinChi) => <Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>,
		},
		{
			title: 'Hủy',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) =>
				dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
					<ButtonExtend
						icon={<DeleteOutlined />}
						danger
						type='link'
						tooltip='Hủy lớp'
						onClick={() => {
							setRecLopDangKy(rec);
							setVisibleHuyLop(true);
						}}
					/>
				) : (
					<Popconfirm
						title={
							<>
								Bạn có chắc chắn muốn huỷ đăng ký lớp tín chỉ này?
								{tongTinChi - rec.soTinChi < soTinChiToiThieu ? (
									<>
										<br />
										<i className='text-error'>
											Lưu ý: Sau khi hủy lớp, tổng số tín chỉ còn lại không thỏa mãn điều kiện số tín chỉ tối thiểu
										</i>
									</>
								) : null}
							</>
						}
						overlayStyle={{ maxWidth: 400 }}
						placement='topRight'
						onConfirm={() => onDeleteLop(rec)}
						// Đợt chỉ cho đk mới thì ko cho xóa những lớp đã đăng ký
						disabled={
							rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
							dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY
						}
					>
						<ButtonExtend
							icon={<DeleteOutlined />}
							danger
							type='link'
							disabled={
								rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
								dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY
							}
							tooltip='Hủy lớp'
						/>
					</Popconfirm>
				),
			hide: !dangTrongThoiGian,
		},
	];

	const columnsLopHuy: IColumn<DangKyTinChi.AuditLog>[] = [
		{
			title: 'Mã HP',
			align: 'center',
			width: 80,
			render: (val, rec) => rec?.lopHpSv?.lopHocPhan?.maHocPhan,
		},
		{
			title: 'Tên học phần',
			width: 170,
			render: (val, rec) => rec?.lopHpSv?.lopHocPhan?.hocPhan?.ten,
		},
		{
			title: 'TT lớp',
			width: 80,
			align: 'center',
			render: (val, rec) =>
				`${rec?.lopHpSv?.lopHocPhan?.soThuTuLop}${
					rec.lopHpSv?.lopHocPhan?.soThuTuNhom ? ` (nhóm TH ${rec.lopHpSv?.lopHocPhan?.soThuTuNhom})` : ''
				}`,
		},
		{
			title: 'STC',
			width: 60,
			align: 'center',
			sortable: true,
			render: (val, rec) => (
				<>
					{rec?.lopHpSv?.lopHocPhan?.hocPhan?.soTinChi}{' '}
					{rec.lopHpSv?.lopHocPhan?.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? <i>(không tính)</i> : null}
				</>
			),
		},
		{
			title: 'Giảng viên',
			width: 160,
			render: (val, rec) => (
				<ExpandText>
					{rec.lopHpSv?.lopHocPhan?.nhanSuList
						?.map((item) =>
							item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu,
						)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Thông tin chi tiết',
			width: 250,
			render: (val, rec) => (
				<RenderLichHoc lopHocPhan={{ ...rec?.lopHpSv?.lopHocPhan, loai: ELoaiLopHocPhan.CHINH } as any} />
			),
		},

		{
			title: 'Học phí (dự kiến)',
			align: 'right',
			width: 120,
			render: (val, rec) => {
				const due = tinhHocPhi(rec.lopHpSv?.lopHocPhan?.hocPhan?.soTinChi, rec.lopHpSv?.loai, '');
				if (due) return `${inputFormat(due)} VND`;
				return null;
			},
		},
		{
			title: 'Hủy',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn hoàn lại đăng ký lớp tín chỉ này?'
					placement='topRight'
					onConfirm={() =>
						revertLopDangKyTinDaHuyModel(rec?._id, () => {
							getData();
							getDataLopHuy();
						})
					}
				>
					<ButtonExtend icon={<RetweetOutlined />} danger type='link' tooltip='Hoàn tác' />
				</Popconfirm>
			),
		},
	];

	return (
		<>
			<Divider style={{ marginTop: 24 }}>Danh sách lớp tín chỉ đã đăng ký / đã chọn</Divider>
			<Row gutter={[8, 12]} style={{ marginBottom: 18 }}>
				<Col span={24} md={8}>
					Tổng số tín chỉ (đã trừ các học phần không tính số tín chỉ):{' '}
					<b className={tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu ? 'text-error' : 'text-success'}>
						{tongTinChi} tín chỉ
					</b>
				</Col>
				<Col span={24} md={8}>
					Học phí dự kiến: <b>{tongHocPhi ? inputFormat(tongHocPhi) : '--'} VND</b>
				</Col>
				{phieuDangKy ? (
					<Col span={24} md={8}>
						<div
							className={
								tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu ? 'fw500 text-error' : 'fw500 text-success'
							}
							style={{ textAlign: 'right' }}
						>
							Bạn được đăng ký trong khoảng tín chỉ: {[soTinChiToiThieu, soTinChiToiDa].join(' - ')}
						</div>
					</Col>
				) : null}
			</Row>

			<TableStaticData
				columns={columns}
				data={danhSachLopHienThi}
				addStt
				loading={loading}
				hasTotal
				otherProps={{ pagination: false, scroll: { y: 600 } }}
			>
				<Space wrap>
					<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
						Tải lại
					</ButtonExtend>
					{danhSachLopDangKy.length ? (
						<ButtonExtend icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
							Xem trước lịch học
						</ButtonExtend>
					) : null}

					{tongTinChiChuaDk &&
					dotDangKyHienTai?.tinhChatDangKy !== ETinhChatDangKyTC.XOA &&
					sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
						<ButtonExtend
							tooltip={
								tongTinChi > soTinChiToiDa
									? 'Bạn đã đăng ký quá số tín chỉ tối đa'
									: tongTinChi < soTinChiToiThieu
									? 'Bạn chưa đăng ký đủ số tín chỉ tối thiểu'
									: !dangTrongThoiGian
									? 'Ngoài thời gian đăng ký tín chỉ'
									: 'Đăng ký tín chỉ'
							}
							type='primary'
							icon={<SendOutlined />}
							onClick={() => setVisibleRegister(true)}
							disabled={tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu || !dangTrongThoiGian}
						>
							Đăng ký
						</ButtonExtend>
					) : null}

					{tongTinChi < soTinChiToiThieu ? (
						<i className='text-error'>Lưu ý: Bạn chưa đăng ký đủ số tín chỉ tối thiểu</i>
					) : null}
				</Space>
			</TableStaticData>

			{dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
				<>
					<div style={{ marginTop: 12, marginBottom: 12 }} className='fw500'>
						Danh sách lớp đã hủy
					</div>
					<TableStaticData
						columns={columnsLopHuy}
						data={danhSachLopDaHuy ?? []}
						addStt
						loading={loading}
						hasTotal
						otherProps={{ pagination: false, scroll: { y: 600 } }}
					>
						<Space wrap>
							<ButtonExtend icon={<ReloadOutlined />} onClick={getDataLopHuy}>
								Tải lại
							</ButtonExtend>
						</Space>
					</TableStaticData>
				</>
			) : null}

			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

			<ModalDangKy tongTinChi={tongTinChi} danhSachDangKy={danhSachLopHienThi} />

			<ConfirmKetHuyLopDKTC visible={visibleHuyLop} setVisible={setVisibleHuyLop} recLopDangKy={recLopDangKy} />
		</>
	);
};

export default PhieuDangKy;
