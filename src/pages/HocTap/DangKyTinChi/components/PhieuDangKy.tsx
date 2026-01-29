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
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { CalendarOutlined, DeleteOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons';
import { Col, Divider, Popconfirm, Row, Space, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ConfirmKetHuyLopDKTC from './ConfirmHuyLop';
import ModalDangKy from './ModalDangKy';
import ModalLichHoc from './ModalLichHoc';
import ModalLopDaHuy from './ModalLopDaHuy';
import RenderLichHoc from './RenderLichHoc';

/** Hiển thị danh sách các lớp đã đăng ký và đã chọn
 * Học phí dự kiến, số tín chỉ được phép đăng ký, lịch học dự kiến
 */
const PhieuDangKy = () => {
	const intl = useIntl();
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
	} = useModel('daotao.dotdangkytinchi');
	const { getMucThuHocPhiTheoNamModel, tinhHocPhi } = useModel('taichinh.mucthuhocphi');
	const [visibleHuyLop, setVisibleHuyLop] = useState<boolean>(false);
	const [visibleLopDaHuy, setVisibleLopDaHuy] = useState(false);
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
		dayjs().isAfter(dayjs(dotDangKyHienTai?.thoiGianBatDau).subtract(1, 'second')) &&
		dayjs().isBefore(dayjs(dotDangKyHienTai?.thoiGianKetThuc).add(1, 'second'));
	// Tổng học phí dự kiến
	const tongHocPhi = _.sumBy(danhSachLopHienThi, (lop) => tinhHocPhi(lop.soTinChi, lop.loai, lop.maNganh));
	// Số tín chỉ tối đa
	const soTinChiToiDa =
		khoaNganhMe?.khoaNganhPhu && phieuDangKy?.soTinChiToiDaSongNganh
			? phieuDangKy.soTinChiToiDaSongNganh
			: (phieuDangKy?.soTinChiToiDa ?? 0);
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;

	const getData = () => recHocKy?.ma && getLopDangKyModel(recHocKy.ma);

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
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.mahocphan' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 100,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.tenhocphan' }),
			dataIndex: ['hocPhan', 'ten'],
			width: 170,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.sothutulop' }),
			dataIndex: 'soThuTuLop',
			width: 80,
			align: 'center',
			render: (val, rec) => `${val}${rec.soThuTuNhom ? ` (nhóm TH ${rec.soThuTuNhom})` : ''}`,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 80,
			align: 'center',
			sortable: true,
			render: (val, rec) => (
				<>
					{val} {rec.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? <i>(không tính)</i> : null}
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.giangvien' }),
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
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.thongtinchitiet' }),
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
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.hocphi' }),
			align: 'right',
			width: 160,
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
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.trangthai' }),
			dataIndex: 'trangThai',
			width: 110,
			align: 'center',
			render: (val: ETrangThaiDangKyTinChi) => <Tag color={ColorTrangThaiDangKyTinChi[val]}>{val}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy' }),
			width: 60,
			fixed: 'right',
			align: 'center',
			render: (val, rec) =>
				dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
					<ButtonExtend
						icon={<DeleteOutlined />}
						danger
						type='link'
						tooltip={intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy.tooltip' })}
						onClick={() => {
							setRecLopDangKy(rec);
							setVisibleHuyLop(true);
						}}
					/>
				) : (
					<Popconfirm
						title={
							<>
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy.confirm' })}
								{tongTinChi - rec.soTinChi < soTinChiToiThieu ? (
									<>
										<br />
										<i className='text-error'>
											{intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy.luuy' })}
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
							tooltip={intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy.tooltip' })}
						/>
					</Popconfirm>
				),
			hide: !dangTrongThoiGian,
		},
	];

	return (
		<>
			<Divider style={{ marginTop: 24 }}>
				{intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}
			</Divider>
			<Row gutter={[8, 12]} style={{ margin: 16 }}>
				<Col span={24} md={10}>
					{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tongtinchi.title' })}:{' '}
					<b className={tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu ? 'text-error' : 'text-success'}>
						{tongTinChi} {intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}
					</b>
				</Col>
				<Col span={24} md={7}>
					{intl.formatMessage({ id: 'dangkytinchi.phieudangky.hocphidukien.title' })}:{' '}
					<b>{tongHocPhi ? inputFormat(tongHocPhi) : '--'} VND</b>
				</Col>
				{phieuDangKy ? (
					<Col span={24} md={7}>
						<div
							className={
								tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu ? 'fw500 text-error' : 'fw500 text-success'
							}
							style={{ textAlign: 'right' }}
						>
							{intl.formatMessage({ id: 'dangkytinchi.phieudangky.alert.khoangtinchi' })}:{' '}
							{[soTinChiToiThieu, soTinChiToiDa].join(' - ')}
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
				<Space wrap style={{ margin: '0 16px' }}>
					<ButtonExtend cooldownMs={10000} icon={<ReloadOutlined />} onClick={getData}>
						{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.tailai' })}
					</ButtonExtend>
					{danhSachLopDangKy.length ? (
						<ButtonExtend icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
							{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
						</ButtonExtend>
					) : null}

					{dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
						<>
							<ButtonExtend icon={<DeleteOutlined />} onClick={() => setVisibleLopDaHuy(true)}>
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.caclopdahuy' })}
							</ButtonExtend>

							<ModalLopDaHuy visible={visibleLopDaHuy} setVisible={setVisibleLopDaHuy} />
						</>
					) : null}

					{tongTinChiChuaDk &&
						dotDangKyHienTai?.tinhChatDangKy !== ETinhChatDangKyTC.XOA &&
						sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
						<ButtonExtend
							tooltip={
								tongTinChi > soTinChiToiDa
									? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkyquasotin' })
									: tongTinChi < soTinChiToiThieu
										? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.chuadangkydusotin' })
										: !dangTrongThoiGian
											? intl.formatMessage({
												id: 'dangkytinchi.phieudangky.table.tooltip.alert.ngoaithoigiandangkytinchi',
											})
											: intl.formatMessage({
												id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkytc',
											})
							}
							type='primary'
							icon={<SendOutlined />}
							onClick={() => setVisibleRegister(true)}
							disabled={tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu || !dangTrongThoiGian}
						>
							{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.dangky' })}
						</ButtonExtend>
					) : null}

					{tongTinChi < soTinChiToiThieu ? (
						<i className='text-error'>{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.alert.luuy' })}</i>
					) : null}
				</Space>
			</TableStaticData>

			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

			<ModalDangKy tongTinChi={tongTinChi} danhSachDangKy={danhSachLopHienThi} />

			<ConfirmKetHuyLopDKTC visible={visibleHuyLop} setVisible={setVisibleHuyLop} recLopDangKy={recLopDangKy} />
		</>
	);
};

export default PhieuDangKy;
