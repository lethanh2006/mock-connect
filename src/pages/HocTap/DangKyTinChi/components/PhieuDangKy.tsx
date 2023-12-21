import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import {
	ColorTrangThaiDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { inputFormat } from '@/utils/utils';
import { CalendarOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Popconfirm, Row, Space, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModalDangKy from './ModalDangKy';
import ModalLichHoc from './ModalLichHoc';

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
	} = useModel('daotao.dotdangkytinchi');
	const { getMucThuHocPhiTheoNamModel, tinhHocPhi } = useModel('taichinh.mucthuhocphi');
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
	const tongHocPhi = _.sumBy(danhSachLopHienThi, (lop) => tinhHocPhi(lop.soTinChi, lop.loai, lop.maKhoaNganh));

	useEffect(() => {
		if (dotDangKyHienTai?._id) getPhieuDangKyModel(dotDangKyHienTai._id);
	}, [dotDangKyHienTai?._id]);

	useEffect(() => {
		if (recHocKy?.ma) getLopDangKyModel(recHocKy.ma);
	}, [recHocKy?.ma]);

	useEffect(() => {
		// Get mức thu học phí của tôi theo năm học
		if (recHocKy?.namBatDau) getMucThuHocPhiTheoNamModel(recHocKy.namBatDau.toString());
	}, [recHocKy?.namBatDau]);

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
			title: 'Mã học phần',
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: 'Tên học phần',
			dataIndex: ['hocPhan', 'ten'],
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Thứ tự lớp',
			dataIndex: 'soThuTuLop',
			width: 80,
			align: 'center',
			render: (val, rec) => `${val}${rec.soThuTuNhom ? ` (nhóm ${rec.soThuTuNhom})` : ''}`,
		},
		{
			title: 'Số TC',
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
			title: 'Thông tin chi tiết',
			width: 350,
			render: (val, rec) =>
				rec.maHoaLichHoc?.length ? (
					<ul className='lich-hoc'>
						{rec.maHoaLichHoc
							?.sort((a, b) => a.thu - b.thu)
							?.map((item, index) => {
								const dsTuan = item.danhSachTuan
									.map((j) => j.tuan)
									.sort((a, b) => a - b)
									.join(',');
								return (
									// eslint-disable-next-line react/no-array-index-key
									<li key={index}>
										{item.thu < 7 ? `Thứ ${item.thu + 1}` : 'Chủ nhật'} (tiết {item.tietBatDau}-
										{item.tietBatDau + item.soTiet - 1}), tuần {dsTuan},{' '}
										{item.nhanSuSsoId ? (
											item.nhanSu?.hoDem ? (
												[item.nhanSu.hoDem, item.nhanSu.ten].join(' ')
											) : (
												<i style={{ color: '#999' }}>Không lấy được thông tin</i>
											)
										) : (
											<i style={{ color: '#999' }}>Không có thông tin giảng viên</i>
										)}
									</li>
								);
							})}
					</ul>
				) : (
					<i style={{ color: '#999' }}>Không có thông tin lịch học</i>
				),
		},
		{
			title: 'Mã khóa ngành',
			dataIndex: 'maKhoaNganh',
			align: 'center',
			width: 100,
		},
		{
			title: 'Học phí dự kiến',
			align: 'right',
			width: 120,
			render: (val, rec) => {
				const due = tinhHocPhi(rec.soTinChi, rec.loai, rec.maKhoaNganh);
				if (due) return `${inputFormat(due)} VND`;
				return null;
			},
			hide: !dangTrongThoiGian,
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
			width: 120,
			align: 'center',
			render: (val: ETrangThaiDangKyTinChi) => <Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>,
		},
		{
			title: 'Hủy',
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) => (
				<Popconfirm
					title='Bạn có chắc chắn muốn huỷ đăng ký lớp tín chỉ này?'
					placement='topRight'
					onConfirm={() => onDeleteLop(rec)}
					// Đợt chỉ cho đk mới thì ko cho xóa những lớp đã đăng ký
					disabled={
						rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
						dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY
					}
				>
					<Button
						icon={<DeleteOutlined />}
						danger
						type='link'
						disabled={
							rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
							dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY
						}
					/>
				</Popconfirm>
			),
			hide: !dangTrongThoiGian,
		},
	];

	return (
		<>
			<Divider style={{ marginTop: 24 }}>Danh sách lớp tín chỉ đã đăng ký / đã chọn</Divider>
			<Row gutter={[8, 12]} style={{ marginBottom: 18 }}>
				<Col span={24} md={8}>
					Tổng số tín chỉ (đã trừ các học phần không tính số tín chỉ):{' '}
					<b style={{ color: tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0) ? 'red' : undefined }}>{tongTinChi} tín</b>
				</Col>
				{dangTrongThoiGian ? (
					<>
						<Col span={24} md={8}>
							Học phí dự kiến: <b>{tongHocPhi ? inputFormat(tongHocPhi) : '--'} VND</b>
						</Col>
						<Col span={24} md={8}>
							<div className='fw500' style={{ color: 'red', textAlign: 'right' }}>
								Bạn được đăng ký trong khoảng tín chỉ:{' '}
								{[phieuDangKy?.soTinChiToiThieu, phieuDangKy?.soTinChiToiDa].join(' - ')}
							</div>
						</Col>
					</>
				) : null}
			</Row>

			<TableStaticData columns={columns} data={danhSachLopHienThi} addStt loading={loading} hasTotal>
				<Space wrap>
					{danhSachLopDangKy.length ? (
						<Button icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
							Xem trước lịch học
						</Button>
					) : null}

					{dangTrongThoiGian && tongTinChiChuaDk && dotDangKyHienTai.tinhChatDangKy !== ETinhChatDangKyTC.XOA ? (
						<Tooltip
							title={
								tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0)
									? 'Bạn đã đăng ký quá số tín chỉ tối đa'
									: tongTinChi < (phieuDangKy?.soTinChiToiThieu ?? 0)
									? 'Bạn chưa đăng ký đủ số tín chỉ tối thiểu'
									: undefined
							}
						>
							<Button
								type='primary'
								icon={<SendOutlined />}
								onClick={() => setVisibleRegister(true)}
								disabled={
									tongTinChi > (phieuDangKy?.soTinChiToiDa ?? 0) || tongTinChi < (phieuDangKy?.soTinChiToiThieu ?? 0)
								}
							>
								Đăng ký
							</Button>
						</Tooltip>
					) : null}
				</Space>
			</TableStaticData>

			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

			<ModalDangKy tongTinChi={tongTinChi} danhSachDangKy={danhSachLopHienThi} />
		</>
	);
};

export default PhieuDangKy;
