import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import {
	ColorTrangThaiDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { CalendarOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Col, Popconfirm, Row, Space, Tag } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { renderKhoangThoiGian } from '../utils';
import BtnDangKyTinChi from './BtnDangKyTinChi';
import ConfirmKetHuyLopDKTC from './ConfirmHuyLop';
import ModalDangKy from './ModalDangKy';
import ModalLichHoc from './ModalLichHoc';
import ModalLopDaHuy from './ModalLopDaHuy';
import RenderLichHoc from './RenderLichHoc';

/** Hiển thị danh sách các lớp đã đăng ký và đã chọn
 * Học phí dự kiến, số tín chỉ được phép đăng ký, lịch học dự kiến
 */
type PhieuDangKyProps = {
	danhSachLopHienThi: DangKyTinChi.ILopDangKy[];
	tongTinChi: number;
	soTinChiToiDa: number;
	soTinChiToiThieu: number;
	onReload: () => void | Promise<unknown>;
};

const PhieuDangKy = ({
	danhSachLopHienThi,
	tongTinChi,
	soTinChiToiDa,
	soTinChiToiThieu,
	onReload,
}: PhieuDangKyProps) => {
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
	} = useModel('daotao.dotdangkytinchi');
	const { getMucThuHocPhiTheoNamModel, tinhHocPhi } = useModel('taichinh.mucthuhocphi');
	const [visibleHuyLop, setVisibleHuyLop] = useState<boolean>(false);
	const [visibleLopDaHuy, setVisibleLopDaHuy] = useState(false);
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);
	const [recLopDangKy, setRecLopDangKy] = useState<DangKyTinChi.ILopDangKy>();

	// Đang trong thời gian đăng ký tín chỉ => Được phép đăng ký, xóa đăng ký
	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		dayjs().isAfter(dayjs(dotDangKyHienTai?.thoiGianBatDau).subtract(1, 'second')) &&
		dayjs().isBefore(dayjs(dotDangKyHienTai?.thoiGianKetThuc).add(1, 'second'));
	// Tổng học phí dự kiến
	const tongHocPhi = _.sumBy(danhSachLopHienThi, (lop) => tinhHocPhi(lop.soTinChi, lop.loai, lop.maNganh));

	useEffect(() => {
		// Get mức thu học phí của tôi theo năm học
		if (recHocKy?.namBatDau) getMucThuHocPhiTheoNamModel(recHocKy.namBatDau.toString(), true);
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

	const handleXemDeCuong = (rec: DangKyTinChi.ILopDangKy) => {
		const deCuongId = rec.hocPhan?.deCuongHienTaiId ?? rec.deCuong?.deCuongId;
		if (!deCuongId) return;

		setDeCuongModal({
			deCuongId,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${rec.hocPhan?.ten || rec.maHocPhan || ''}`,
		});
		setVisibleDeCuong(true);
	};

	const columns: IColumn<DangKyTinChi.ILopDangKy>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.mahocphan' }),
			dataIndex: 'maHocPhan',
			align: 'center',
			width: 140,
			render: (val, rec) => (
				<a
					onClick={(e) => {
						e.stopPropagation();
						handleXemDeCuong(rec);
					}}
				>
					{val ?? rec.hocPhan?.ma}
				</a>
			),
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.tenhocphan' }),
			dataIndex: ['hocPhan', 'ten'],
			width: 280,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 70,
			align: 'center',
			sortable: true,
			render: (val, rec) => (
				<>
					{val} {rec.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false ? <i>(không tính)</i> : null}
				</>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.malop' }),
			dataIndex: 'maLop',
			width: 150,
			align: 'center',
			render: (val, rec) => `${val ?? rec?.ten}${rec.soThuTuNhom ? ` (nhóm TH ${rec.soThuTuNhom})` : ''}`,
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
			title: intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.columntable.date' }),
			width: 110,
			align: 'center',
			render: (val, rec) => renderKhoangThoiGian(rec),
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
			width: 120,
			align: 'center',
			render: (val, rec) => (
				<Space wrap size={'small'}>
					<Tag color={ColorTrangThaiDangKyTinChi[val as ETrangThaiDangKyTinChi]}>{val}</Tag>
					{rec?.isWaitlist && (
						<Tag color={'orange'}>{intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.hangcho' })}</Tag>
					)}
				</Space>
			),

			fixed: 'right',
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
						disabled={rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY && !rec.dangKyTinChi}
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
							(rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
								dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
							!rec.dangKyTinChi
						}
					>
						<ButtonExtend
							icon={<DeleteOutlined />}
							danger
							type='link'
							disabled={
								(rec.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
									dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
								!rec.dangKyTinChi
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
			<Row gutter={[8, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={17}>
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
							{[soTinChiToiThieu, soTinChiToiDa].join(' - ')}{' '}
							{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}
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
				onReload={onReload}
				otherButtons={[
					<BtnDangKyTinChi
						key='dang-ky'
						danhSachLopHienThi={danhSachLopHienThi}
						tongTinChi={tongTinChi}
						soTinChiToiDa={soTinChiToiDa}
						soTinChiToiThieu={soTinChiToiThieu}
					/>,
					<ButtonExtend
						key='lich-su'
						icon={<HistoryOutlined />}
						onClick={() => setVisibleLopDaHuy(true)}
						tooltip={intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.title' })}
					>
						{intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.title' })}
					</ButtonExtend>,
					...(danhSachLopDangKy.length
						? [
								<ButtonExtend key='lich-hoc' icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
									{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
								</ButtonExtend>,
							]
						: []),
					...(tongTinChi < soTinChiToiThieu
						? [
								<i key='luu-y' className='text-error'>
									{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.alert.luuy' })}
								</i>,
							]
						: []),
				]}
				otherExtra={[
					<span>
						{intl.formatMessage({ id: 'dangkytinchi.tcdangky' })}:{' '}
						<b style={{ color: '#c80f1f', fontSize: 15 }}>{tongTinChi ?? 0}</b>
					</span>,
				]}
			></TableStaticData>

			<ModalLopDaHuy visible={visibleLopDaHuy} setVisible={setVisibleLopDaHuy} />

			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

			<ModalDangKy tongTinChi={tongTinChi} danhSachDangKy={danhSachLopHienThi} />

			<ConfirmKetHuyLopDKTC visible={visibleHuyLop} setVisible={setVisibleHuyLop} recLopDangKy={recLopDangKy} />

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				deCuongId={deCuongModal?.deCuongId}
				title={deCuongModal?.title}
			/>
		</>
	);
};

export default PhieuDangKy;
