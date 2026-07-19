import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import {
	ColorTrangThaiDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
	mapTrangThaiDangKyTinChiI18n,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { CalendarOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons';
import { Popconfirm, Space, Tag } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { renderKhoangThoiGian } from '../utils';
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

const PhieuDangKy = ({ danhSachLopHienThi, tongTinChi, soTinChiToiThieu, onReload }: PhieuDangKyProps) => {
	const intl = useIntl();
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

	const onDeleteLop = async (rec: DangKyTinChi.ILopDangKy) => {
		try {
			// Nếu đã đăng ký rồi thì gọi API để xóa lớp
			if (rec.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY)
				await deleteDangKyTinChiModel(
					{
						phieuDktcId: phieuDangKy?._id ?? '',
						lopHocPhanId: rec._id ?? '',
					},
					intl.formatMessage({ id: 'global.message.xoathanhcong' }),
				);

			// Xóa lớp ở danh sách tại local
			const data = danhSachLopDangKy.filter((item) => item.maHocPhan !== rec.maHocPhan);
			tinhDataLichHoc(data); // Tính lại dữ liệu lịch học
			setDanhSachLopDangKy(data);
		} catch (er) {
			console.log(er);
		}
	};

	const handleXemDeCuong = (rec: DangKyTinChi.ILopDangKy) => {
		const deCuongId = rec.hocPhan?.ma ?? rec.maHocPhan;
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
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 50,
			align: 'center',
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
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.sotinchi' }),
			dataIndex: 'soTinChi',
			width: 100,
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
			width: 140,
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
			width: 220,
			render: (val, rec) => <RenderLichHoc lopHocPhan={{ ...rec, loai: ELoaiLopHocPhan.CHINH }} />, // Fake loại để ko lỗi
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.tgdangky' }),
			dataIndex: 'createdAt',
			width: 150,
			align: 'center',
			render: (val) => (val ? formatDateTime(val) : '--'),
		},
		// {
		// 	title: 'Mã khóa ngành',
		// 	dataIndex: 'maKhoaNganh',
		// 	align: 'center',
		// 	width: 110,
		// },
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.hocphi' }),
		// 	align: 'right',
		// 	width: 160,
		// 	render: (val, rec) => {
		// 		const due = tinhHocPhi(rec.soTinChi, rec.loai, rec.maKhoaNganh);
		// 		if (due) return `${inputFormat(due)} VND`;
		// 		return null;
		// 	},
		// 	// hide: !dangTrongThoiGian,
		// },
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
					<Tag color={ColorTrangThaiDangKyTinChi[val as ETrangThaiDangKyTinChi]}>
						{intl.formatMessage({
							id: mapTrangThaiDangKyTinChiI18n[val as ETrangThaiDangKyTinChi],
						})}
					</Tag>{' '}
					{rec?.isWaitlist && (
						<Tag color={'orange'}>{intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.hangcho' })}</Tag>
					)}
				</Space>
			),

			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy' }),
			width: 80,
			fixed: 'right',
			align: 'center',
			render: (val, rec) =>
				dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
					<ButtonExtend
						icon={<DeleteOutlined />}
						danger
						otherTooltipProps={{
							placement: 'bottom',
						}}
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
							otherTooltipProps={{
								placement: 'bottom',
							}}
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
			<TableStaticData
				columns={columns}
				data={danhSachLopHienThi}
				addStt
				loading={loading}
				hasTotal
				onReload={onReload}
				header={{
					total: {
						prefix: intl.formatMessage({ id: 'dangkytinchi.filter.lop.total.prefix' }),
					},
				}}
				otherButtons={[
					<Space wrap>
						<ButtonExtend
							icon={<HistoryOutlined />}
							onClick={() => setVisibleLopDaHuy(true)}
							tooltip={intl.formatMessage({ id: 'dangkytinchi.lichsuthaotac.title' })}
						/>
						{danhSachLopDangKy.length ? (
							<ButtonExtend icon={<CalendarOutlined />} onClick={() => setVisibleModal(true)}>
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
							</ButtonExtend>
						) : null}
					</Space>,
				]}
				otherExtra={[
					<span>
						{intl.formatMessage({ id: 'dangkytinchi.tcdangky' })}:{' '}
						<b style={{ color: '#c80f1f', fontSize: 15 }}>{tongTinChi ?? 0}</b>
					</span>,
				]}
			/>

			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />
			<ModalLopDaHuy visible={visibleLopDaHuy} setVisible={setVisibleLopDaHuy} />

			<ModalDangKy tongTinChi={tongTinChi} danhSachDangKy={danhSachLopHienThi} />

			<ConfirmKetHuyLopDKTC visible={visibleHuyLop} setVisible={setVisibleHuyLop} recLopDangKy={recLopDangKy} />
			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				deCuongId={deCuongModal?.deCuongId}
				title={deCuongModal?.title}
				isChiTiet
			/>
		</>
	);
};

export default PhieuDangKy;
