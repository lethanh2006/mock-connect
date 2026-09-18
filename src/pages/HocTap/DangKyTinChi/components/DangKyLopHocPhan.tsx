import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import {
	ColorTrangThaiDangKyTinChi,
	EColorLopDangKy,
	ELoaiDangKyTheoLop,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
	mapTrangThaiDangKyTinChiI18n,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import {
	loaiDangKyDuThinhI18n,
	TrangThaiDonDangKyHocDuThinh,
	trangThaiDonDangKyHocDuThinhColor,
	trangThaiDonDangKyHocDuThinhText,
} from '@/services/DaoTao/DkDuThinh/constant';
import {
	loaiDangKyVuotTinI18n,
	TrangThaiDonDangKyHocVuot,
	trangThaiDonDangKyHocVuotColor,
	trangThaiDonDangKyHocVuotText,
} from '@/services/DaoTao/DkVuotTinChi/constant';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Descriptions, Modal, Popconfirm, Popover, Space, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { IconShieldInfo } from '@/components/Icons';
import Select from '@/components/MySelect';
import { useAccess, useIntl, useModel } from 'umi';
import {
	buildLopDangKy,
	filterBoChonLop,
	getDangKyRoiMap,
	getLopChaContext,
	getLopTrungLich,
	isDaChonLop,
	isDaDangKyHocPhanKhacLop,
	isDuThinhDaDuyet,
	isHetSiSo,
	isVuotSoTinChiToiDa,
	renderKhoangThoiGian,
} from '../utils';
import ModalDangKyNgay from './ModalDangKyNgay';
import RenderLichHoc from './RenderLichHoc';

type DangKyLopHocPhanProps = {
	tongTinChi: number;
	soTinChiToiDa: number;
	danhSachLopHienThi: DangKyTinChi.ILopDangKy[];
	onReload?: () => void | Promise<unknown>;
};

const isLopThucHanhCon = (rec: LopHocPhan.IRecord) =>
	!!rec.tenCha || rec.loai === ELoaiLopHocPhan.THUC_HANH || !!rec.soThuTuNhom;

const DangKyLopHocPhan = ({ tongTinChi, soTinChiToiDa, danhSachLopHienThi, onReload }: DangKyLopHocPhanProps) => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { filters, sort, danhSachLopDktc, sinhVienGetLopDangKyTheoHocPhanModel, setRecord } =
		useModel('lophocphan.lophocphan');
	const {
		dotDangKyHienTai,
		danhSachLopDangKy,
		setDanhSachLopDangKy,
		tinhDataLichHoc,
		checkTrungLich,
		phieuDangKy,
		deleteDangKyTinChiModel,
	} = useModel('daotao.dotdangkytinchi');
	const { loaiDangKy, setLoaiDangKy } = useModel('hocphan.hocphan');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const { settings } = useModel('tienich.caidat');
	// const { danhSach: danhSachLopHanhChinh } = useModel('daotao.lophanhchinh');
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);

	const allLoaiDangKy = useMemo(() => {
		const { boLocTatCa, boLocKhoaNganh, boLocLopHanhChinh } = dotDangKyHienTai ?? {};
		const hasBoLoc = [boLocTatCa, boLocKhoaNganh, boLocLopHanhChinh].some(Boolean);
		const byFlag: Partial<Record<ELoaiDangKyTheoLop, boolean | undefined>> = {
			[ELoaiDangKyTheoLop.TAT_CA]: boLocTatCa,
			[ELoaiDangKyTheoLop.KHOA_NGANH]: boLocKhoaNganh,
			[ELoaiDangKyTheoLop.KHOA_NGANH_2]: boLocKhoaNganh,
			[ELoaiDangKyTheoLop.LOP_HANH_CHINH]: boLocLopHanhChinh,
		};

		return Object.values(ELoaiDangKyTheoLop).filter((item) => {
			if (item === ELoaiDangKyTheoLop.KHOA_NGANH_2 && !khoaNganhMe?.khoaNganhPhu?.ma) return false;
			return !hasBoLoc || !!byFlag[item];
		});
	}, [khoaNganhMe?.khoaNganhPhu?.ma, dotDangKyHienTai]);

	useEffect(() => {
		if (!allLoaiDangKy.length) return;
		if (!loaiDangKy || !allLoaiDangKy.includes(loaiDangKy)) setLoaiDangKy(allLoaiDangKy[0]);
	}, [allLoaiDangKy, loaiDangKy, setLoaiDangKy]);

	const [visibleDangKyNgay, setVisibleDangKyNgay] = useState<boolean>(false);
	const [isVuotTin, setIsVuotTin] = useState<boolean>(false);
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);
	const dangKyNgay: boolean = true;
	const coDotDangKyTinChi = !!dotDangKyHienTai?._id && dotDangKyHienTai.maHocKy === recHocKy?.ma;
	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		dayjs().isAfter(dayjs(dotDangKyHienTai.thoiGianBatDau).subtract(1, 'second')) &&
		dayjs().isBefore(dayjs(dotDangKyHienTai.thoiGianKetThuc).add(1, 'second'));
	const tableDependencies = useMemo(
		() => [coDotDangKyTinChi ? dotDangKyHienTai?._id : null, loaiDangKy],
		[coDotDangKyTinChi, dotDangKyHienTai?._id, loaiDangKy],
	);

	const getData = () => {
		if (!coDotDangKyTinChi || !recHocKy?.ma || !dotDangKyHienTai?._id) return;
		if (!loaiDangKy || !allLoaiDangKy.includes(loaiDangKy)) return;

		return sinhVienGetLopDangKyTheoHocPhanModel(
			recHocKy.ma,
			dotDangKyHienTai._id,
			loaiDangKy,
			undefined,
			filters,
			sort,
		).then((data) => setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)));
	};

	const renderTrangThaiDangKy = (rec?: DangKyTinChi.ILopDangKy) => {
		if (!rec) return null;

		const val = rec.trangThai;
		const trangThaiVuotTin = rec?.dkVuotTinChiLop?.trangThai;
		const trangThaiDuThinh = rec?.dangKyHocDuThinh?.trangThai;
		const isVuotTin = !!trangThaiVuotTin;
		const isDuThinh = !!trangThaiDuThinh;
		const trangThaiDacBiet = trangThaiVuotTin ?? trangThaiDuThinh;

		const isApproved =
			trangThaiDacBiet === TrangThaiDonDangKyHocVuot.DA_DUYET ||
			trangThaiDacBiet === TrangThaiDonDangKyHocDuThinh.DA_DUYET;
		const thongTinDuyet = rec?.dkVuotTinChiLop ?? rec?.dangKyHocDuThinh;
		const hasThongTinDuyet = !!(
			thongTinDuyet?.nguoiDuyet ||
			thongTinDuyet?.thoiGianDuyet ||
			thongTinDuyet?.ghiChuDuyet
		);

		const statusI18nId = isVuotTin
			? trangThaiDonDangKyHocVuotText[trangThaiVuotTin as TrangThaiDonDangKyHocVuot]
			: isDuThinh
				? trangThaiDonDangKyHocDuThinhText[trangThaiDuThinh as TrangThaiDonDangKyHocDuThinh]
				: undefined;
		const statusColor = isVuotTin
			? trangThaiDonDangKyHocVuotColor[trangThaiVuotTin as TrangThaiDonDangKyHocVuot]
			: isDuThinh
				? trangThaiDonDangKyHocDuThinhColor[trangThaiDuThinh as TrangThaiDonDangKyHocDuThinh]
				: 'gold';
		const loaiI18nId = isVuotTin ? loaiDangKyVuotTinI18n : isDuThinh ? loaiDangKyDuThinhI18n : undefined;
		const trangThaiThuongI18nId = mapTrangThaiDangKyTinChiI18n[val as ETrangThaiDangKyTinChi];

		return (
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
				{trangThaiDacBiet && (isVuotTin || isDuThinh) ? (
					<>
						<Space size={4} align='center'>
							<Tag color={isApproved ? 'green' : (statusColor ?? 'gold')} style={{ marginInlineEnd: 0 }}>
								{statusI18nId
									? intl.formatMessage({ id: statusI18nId, defaultMessage: String(trangThaiDacBiet) })
									: trangThaiDacBiet}
							</Tag>
							{hasThongTinDuyet ? (
								<Popover
									trigger='hover'
									placement='top'
									content={
										<Descriptions column={1} size='small' style={{ maxWidth: 280 }}>
											<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.duyet.nguoi' })}>
												{thongTinDuyet?.nguoiDuyet ?? '--'}
											</Descriptions.Item>
											<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.duyet.thoigian' })}>
												{thongTinDuyet?.thoiGianDuyet ? formatDateTime(thongTinDuyet.thoiGianDuyet) : '--'}
											</Descriptions.Item>
											<Descriptions.Item label={intl.formatMessage({ id: 'dangkytinchi.phieudangky.duyet.ghichu' })}>
												<ExpandText style={{ marginBottom: 0 }} ellipsis={{ rows: 2 }}>
													{thongTinDuyet?.ghiChuDuyet ?? '--'}
												</ExpandText>
											</Descriptions.Item>
										</Descriptions>
									}
								>
									<InfoCircleOutlined style={{ color: '#1677ff', cursor: 'pointer' }} />
								</Popover>
							) : null}
						</Space>
						{!(isApproved && isDuThinh) && loaiI18nId ? (
							<span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
								{intl.formatMessage({ id: loaiI18nId })}
							</span>
						) : null}
					</>
				) : (
					<Tag color={ColorTrangThaiDangKyTinChi[val as ETrangThaiDangKyTinChi]}>
						{trangThaiThuongI18nId ? intl.formatMessage({ id: trangThaiThuongI18nId }) : (val ?? '--')}
					</Tag>
				)}
				{rec?.isWaitlist && (
					<Tag color='orange'>{intl.formatMessage({ id: 'dangkytinchi.modaldangky.columntable.hangcho' })}</Tag>
				)}
			</div>
		);
	};

	const canHuyLop = (rec?: DangKyTinChi.ILopDangKy) =>
		!!(rec?.dangKyTinChi || rec?.dkVuotTinChiLop?._id || rec?.dangKyHocDuThinh?._id);

	const renderTrangThaiCanhBao = (rec: LopHocPhan.IRecord) => {
		if (isDaChonLop(rec, danhSachLopDangKy)) return null;

		if (rec.siSoToiDa - (rec.siSo ?? 0) <= 0) {
			return (
				<Tag color={EColorLopDangKy.FULL_LOP}>
					{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.trangthai.lopday' })}
				</Tag>
			);
		}

		const lopTrungLich = getLopTrungLich(rec, danhSachLopDangKy);
		if (lopTrungLich.length || checkTrungLich(rec.thoiKhoaBieuList ?? [])) {
			return (
				<Space size={4}>
					<Tag color={EColorLopDangKy.TRUNG_LICH} style={{ marginInlineEnd: 0 }}>
						{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.trangthai.trunglich' })}
					</Tag>
					{!!lopTrungLich.length && (
						<Popover
							content={
								<span>
									{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.tooltip.trunglichvoilop' })}{' '}
									<b>{lopTrungLich.join(', ')}</b>
								</span>
							}
						>
							<IconShieldInfo style={{ color: '#1677ff', fontSize: 12 }} />
						</Popover>
					)}
				</Space>
			);
		}

		return null;
	};

	const getDisabledDangKy = (record: LopHocPhan.IRecord) => {
		if (record.children?.length) return true;

		const { lopCha, needCheckLopCha, dangKyRoiMap } = getLopChaContext(record, danhSachLopDktc, danhSachLopDangKy);

		if (isDaDangKyHocPhanKhacLop(record, danhSachLopDangKy)) return true;
		if (dangKyRoiMap[record.loai]) return true;
		if (needCheckLopCha && lopCha?.loai && dangKyRoiMap[lopCha.loai]) return true;

		if (isHetSiSo(record, lopCha, needCheckLopCha)) {
			if (!cctFilter?.()) return true;
			if ((record.waitlistCount ?? 0) >= (settings?.SINH_VIEN?.extraSlots ?? 0)) return true;
		}

		const allThoiKhoaBieu = needCheckLopCha
			? [...(record.thoiKhoaBieuList ?? []), ...(lopCha?.thoiKhoaBieuList ?? [])]
			: (record.thoiKhoaBieuList ?? []);

		if (checkTrungLich(allThoiKhoaBieu)) return true;

		return false;
	};

	const handleDangKy = (lopVuaChon: LopHocPhan.IRecord, isWaitList = false, vuotTin = false) => {
		if (!loaiDangKy) return;

		const dangKyRoiMap = getDangKyRoiMap(lopVuaChon.maHocPhan, danhSachLopDangKy);
		if (
			!lopVuaChon.children?.length &&
			!isDaDangKyHocPhanKhacLop(lopVuaChon, danhSachLopDangKy) &&
			!dangKyRoiMap[lopVuaChon.loai!]
		) {
			const { temp } = buildLopDangKy({
				lopVuaChon,
				danhSachLopDangKy,
				danhSachLopDktc,
				loaiDangKy,
				khoaNganhMe,
				dangKyNgay,
				isWaitlist: isWaitList,
			});

			if (dangKyNgay) {
				setRecord(lopVuaChon);
				setIsVuotTin(vuotTin);
				setVisibleDangKyNgay(true);
				return;
			}

			setDanhSachLopDangKy(temp);
			tinhDataLichHoc(temp);
		}
	};

	const onClickDangKy = (lopVuaChon: LopHocPhan.IRecord, vuotTin = false) => {
		const isHetCho = lopVuaChon.siSoToiDa - (lopVuaChon.siSo ?? 0) <= 0;

		if (isHetCho && cctFilter?.() && !vuotTin) {
			Modal.confirm({
				title: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.title' }),
				content: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.content' }),
				okText: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.ok' }),
				cancelText: intl.formatMessage({ id: 'global.button.huy' }),
				onOk: () => handleDangKy(lopVuaChon, true, false),
			});
			return;
		}

		handleDangKy(lopVuaChon, false, vuotTin);
	};

	const onClickBoChon = (rec: LopHocPhan.IRecord) => {
		if (dangKyNgay) return;

		const temp = filterBoChonLop(danhSachLopDangKy, rec);

		setDanhSachLopDangKy(temp);
		tinhDataLichHoc(temp);
	};

	const handleXemDeCuong = (rec: LopHocPhan.IRecord) => {
		const deCuongId = rec.hocPhan?.ma ?? rec.maHocPhan;
		if (!deCuongId) return;

		setDeCuongModal({
			deCuongId,
			title: `${intl.formatMessage({ id: 'lophocphan.id.decuong.title' })} - ${rec.hocPhan?.ten || rec.maHocPhan || ''}`,
		});
		setVisibleDeCuong(true);
	};

	/**
	 * Expand or Collapse Lớp thực hành
	 * @param expanded
	 * @param rec
	 */
	const onExpand = (expanded: boolean, rec: LopHocPhan.IRecord) => {
		setExpandedLopHocPhan(
			expanded ? [...expandedLopHocPhan, rec.ten] : expandedLopHocPhan.filter((i) => i !== rec.ten),
		);
	};

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

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.thutulop' }),
			dataIndex: 'soThuTuLop',
			width: 100,
			align: 'center',
			render: (val, rec) => (rec.soThuTuNhom ? `Nhóm TH ${rec.soThuTuNhom}` : val),
			hide: true,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.mahp' }),
			dataIndex: 'maHocPhan',
			width: 120,
			align: 'center',
			filterType: 'string',
			sortable: true,
			render: (val, rec) => (
				<a
					onClick={(e) => {
						e.stopPropagation();
						handleXemDeCuong(rec);
					}}
				>
					{val ?? rec.maHocPhan}
				</a>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.tenhocphan' }),
			dataIndex: ['hocPhan', 'ten'],
			width: 220,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.sotinchi' }),
			dataIndex: ['hocPhan', 'soTinChi'],
			width: 50,
			align: 'center',
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.malop' }),
			dataIndex: 'ten',
			width: 150,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => (
				<Space size={4}>
					<span>{val ?? rec?.ten}</span>
					{isLopThucHanhCon(rec) ? <Tag className='tag-lop-lab'>Lab</Tag> : null}
				</Space>
			),
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.giangvien' }),
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
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.thongtinchitiet' }),
			width: 220,
			render: (val, rec) => <RenderLichHoc lopHocPhan={rec} />,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.sisotoida' }),
			dataIndex: 'siSoToiDa',
			align: 'center',
			width: 60,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.controng' }),
			align: 'center',
			width: 60,
			render: (val, rec) => (rec.siSo !== undefined && rec.siSoToiDa >= rec.siSo ? rec.siSoToiDa - rec.siSo : 0),
		},
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.dlphong' }),
		// 	dataIndex: 'phongCapacity',
		// 	align: 'center',
		// 	width: 120,
		// 	onCell,
		// 	sortable: true,
		// 	hide: !cctFilter?.(),
		// },
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.hangcho' }),
		// 	dataIndex: 'waitlistCount',
		// 	align: 'center',
		// 	width: 80,
		// 	render: (val, rec) => `${val ?? 0}/${settings?.SINH_VIEN?.extraSlots ?? 0}`,
		// 	onCell,
		// 	sortable: true,
		// 	hide: !cctFilter?.(),
		// },
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.hinhthucdt' }),
		// 	dataIndex: 'maHinhThuc',
		// 	width: 80,
		// 	render: (val, rec) => rec.hinhThuc?.ten ?? val,
		// 	onCell,
		// },
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.csdt' }),
		// 	dataIndex: 'maCSDT',
		// 	align: 'center',
		// 	width: 60,
		// 	onCell,
		// },
		// {
		// 	title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.tinhchat' }),
		// 	dataIndex: 'maTinhChat',
		// 	align: 'center',
		// 	width: 60,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.trangthai' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => {
				const daChon = isDaChonLop(rec, danhSachLopDangKy);
				const lopDangKy = danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);

				if (daChon) {
					return renderTrangThaiDangKy(lopDangKy);
				}

				return renderTrangThaiCanhBao(rec);
			},
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.thaotac' }),
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (val, rec) => {
				const daChon = isDaChonLop(rec, danhSachLopDangKy);
				const lopDangKy = danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);
				// Lớp đã full thì đi theo luồng hàng chờ/dự thính (không tính tín chỉ) => bỏ qua check vượt tín
				const hetCho = rec.siSoToiDa - (rec.siSo ?? 0) <= 0;
				const vuotSoTinChi =
					!hetCho && isVuotSoTinChiToiDa(rec, danhSachLopHienThi, danhSachLopDktc, tongTinChi, soTinChiToiDa);
				const khongChoDangKyDacBiet =
					dotDangKyHienTai?.choPhepDangKyDuThinh !== true && dotDangKyHienTai?.choPhepDangKyVuotTinChi !== true;
				const disabled =
					getDisabledDangKy(rec) || !coDotDangKyTinChi || !dangTrongThoiGian || (vuotSoTinChi && khongChoDangKyDacBiet);
				const isChuaDangKy = lopDangKy?.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY;
				const disabledDelete =
					(lopDangKy?.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
						dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY &&
						!lopDangKy?.dkVuotTinChiLop?._id &&
						!lopDangKy?.dangKyHocDuThinh?._id) ||
					!canHuyLop(lopDangKy) ||
					!coDotDangKyTinChi;

				if (daChon && isChuaDangKy) {
					return (
						<ButtonExtend
							type='default'
							danger
							size='small'
							onClick={(e) => {
								e.stopPropagation();
								onClickBoChon(rec);
							}}
							disabled={!coDotDangKyTinChi}
						>
							{intl.formatMessage({
								id: 'dangkytinchi.dankylophocphan.action.bochon',
							})}
						</ButtonExtend>
					);
				}

				if (daChon) {
					return (
						<Popconfirm
							title={
								<>
									{intl.formatMessage({ id: 'dangkytinchi.phieudangky.columntable.huy.confirm' })}
									{isDuThinhDaDuyet(lopDangKy) ? (
										<>
											<br />
											<i className='text-error'>
												{intl.formatMessage({ id: 'dangkytinchi.phieudangky.huy.duthinh.daduyet.luuy' })}
											</i>
										</>
									) : null}
								</>
							}
							overlayStyle={{ maxWidth: 400 }}
							placement='topRight'
							onConfirm={() => lopDangKy?._id && onDeleteLop(lopDangKy)}
							disabled={disabledDelete}
						>
							<ButtonExtend
								icon={<DeleteOutlined />}
								danger
								otherTooltipProps={{
									placement: 'bottom',
								}}
								type='link'
								disabled={disabledDelete}
								tooltip={intl.formatMessage({
									id: 'dangkytinchi.phieudangky.columntable.huy.tooltip',
								})}
								onClick={(e) => e.stopPropagation()}
							/>
						</Popconfirm>
					);
				}

				return (
					<div>
						<ButtonExtend
							type='primary'
							disabled={disabled}
							tooltip={
								!dangTrongThoiGian
									? intl.formatMessage({
											id: 'dangkytinchi.phieudangky.table.tooltip.alert.ngoaithoigiandangkytinchi',
										})
									: vuotSoTinChi
										? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkyquasotin' })
										: undefined
							}
							onClick={(e) => {
								e.stopPropagation();
								if (!disabled) onClickDangKy(rec, vuotSoTinChi);
							}}
						>
							{intl.formatMessage({
								id: dangKyNgay
									? 'dangkytinchi.dankylophocphan.action.dangky'
									: 'dangkytinchi.dankylophocphan.action.chon',
							})}
						</ButtonExtend>
					</div>
				);
			},
		},
	];

	return (
		<>
			{/* {recHocPhan?.ma ? ( */}
			{/* recHocPhan.trangThai === ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? ( */}
			<div className='table-dang-ky'>
				<TableBase
					columns={columns}
					dependencies={tableDependencies}
					getData={getData}
					dataState='danhSachLopDktc'
					modelName='lophocphan.lophocphan'
					hideCard
					buttons={{ create: false }}
					scroll={{ y: 600 }}
					otherProps={{
						rowKey: 'ten',
						rowClassName: (rec: LopHocPhan.IRecord) => (isLopThucHanhCon(rec) ? 'row-lop-lab' : ''),
						expandable: {
							expandRowByClick: true,
							indentSize: 0,
							expandedRowKeys: expandedLopHocPhan,
							onExpand,
						},
					}}
					otherButtons={[
						<Select
							key='loai-dang-ky'
							options={allLoaiDangKy.map((item) => ({
								key: item,
								value: item,
								label: intl.formatMessage({
									id: `dangkytinchi.loaidangky.${item}`,
								}),
							}))}
							value={loaiDangKy}
							onChange={(val) => setLoaiDangKy(val)}
							style={{ width: 260 }}
						/>,
					]}
					emptyText={intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.table.empty.khongcolop' })}
					tableFooterExtra={
						<div className='lop-legend'>
							<span className='lop-legend__item'>
								<span className='lop-legend__box' />
								{intl.formatMessage({ id: 'lophocphan.loaihinhhoctap.lythuyet' })}
							</span>
							<span className='lop-legend__item'>
								<Tag className='tag-lop-lab'>Lab</Tag>
								{intl.formatMessage({ id: 'lophocphan.loaihinhhoctap.thuchanh' })}
							</span>
						</div>
					}
				/>
			</div>

			<ModalDangKyNgay
				visible={visibleDangKyNgay}
				setVisible={(val) => {
					setVisibleDangKyNgay(val);
					if (!val) setIsVuotTin(false);
				}}
				isVuotTin={isVuotTin}
			/>

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

export default DangKyLopHocPhan;
