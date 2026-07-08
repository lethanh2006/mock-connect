import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import {
	EColorLopDangKy,
	ELoaiDangKyTheoLop,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Popover, Select, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import {
	buildLopDangKy,
	filterBoChonLop,
	getDangKyRoiMap,
	getLopChaContext,
	getLopTrungLich,
	isDaChonLop,
	isDaDangKyHocPhanKhacLop,
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
};

const DangKyLopHocPhan = ({ tongTinChi, soTinChiToiDa, danhSachLopHienThi }: DangKyLopHocPhanProps) => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { page, limit, filters, sort, danhSachLopDktc, sinhVienGetLopDangKyTheoHocPhanModel, setRecord } =
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
		const all = Object.values(ELoaiDangKyTheoLop);
		if (!khoaNganhMe?.khoaNganhPhu?.ma) return all.filter((item) => item !== ELoaiDangKyTheoLop.KHOA_NGANH_2);
		return all;
	}, [khoaNganhMe?.khoaNganhPhu?.ma]);

	const [visibleDangKyNgay, setVisibleDangKyNgay] = useState<boolean>(false);
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);
	const dangKyNgay: boolean = true;
	const coDotDangKyTinChi = !!dotDangKyHienTai?._id && dotDangKyHienTai.maHocKy === recHocKy?.ma;

	const getData = () =>
		recHocKy?.ma &&
		dotDangKyHienTai?._id &&
		sinhVienGetLopDangKyTheoHocPhanModel(recHocKy.ma, dotDangKyHienTai?._id, loaiDangKy, undefined, filters, sort).then(
			(data) => setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)),
		);

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
							<InfoCircleOutlined style={{ color: '#1677ff', fontSize: 12 }} />
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

		return isVuotSoTinChiToiDa(record, danhSachLopHienThi, danhSachLopDktc, tongTinChi, soTinChiToiDa);
	};

	const handleDangKy = (lopVuaChon: LopHocPhan.IRecord, isWaitList = false) => {
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
				setVisibleDangKyNgay(true);
				return;
			}

			setDanhSachLopDangKy(temp);
			tinhDataLichHoc(temp);
		}
	};

	const onClickDangKy = (lopVuaChon: LopHocPhan.IRecord) => {
		const isHetCho = lopVuaChon.siSoToiDa - (lopVuaChon.siSo ?? 0) <= 0;

		if (isHetCho && cctFilter?.()) {
			Modal.confirm({
				title: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.title' }),
				content: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.content' }),
				okText: intl.formatMessage({ id: 'dangkytinchi.waitlist.confirm.ok' }),
				cancelText: intl.formatMessage({ id: 'global.button.huy' }),
				onOk: () => handleDangKy(lopVuaChon, true),
			});
			return;
		}

		handleDangKy(lopVuaChon, false);
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
			render: (val, rec) => val ?? rec?.ten,
			// 	{
			// 	return (
			// 		<a
			// 		// onClick={(e) => {
			// 		// 	e.stopPropagation();
			// 		// 	handleXemDeCuong(val, rec?.ten);
			// 		// }}
			// 		>
			// 			{val ?? rec?.ten}
			// 		</a>
			// 	);
			// },
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
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filterhocphan.columntable.thaotac' }),
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (val, rec) => {
				const daChon = isDaChonLop(rec, danhSachLopDangKy);
				const lopDangKy = danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);
				const vuotSoTinChi = isVuotSoTinChiToiDa(rec, danhSachLopHienThi, danhSachLopDktc, tongTinChi, soTinChiToiDa);
				const disabled = getDisabledDangKy(rec) || !coDotDangKyTinChi;
				const canhBao = renderTrangThaiCanhBao(rec);
				const isChuaDangKy = lopDangKy?.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY;
				const disabledDelete =
					(lopDangKy?.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
						dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
					!rec.dangKyTinChi ||
					!coDotDangKyTinChi;

				if (daChon && isChuaDangKy) {
					return (
						<div>
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
						</div>
					);
				}

				if (daChon) {
					return (
						<Space size={6} wrap={false}>
							<Tag color='green'>
								{intl.formatMessage({
									id: 'dangkytinchi.dankylophocphan.action.dadangky',
								})}
							</Tag>

							<Popconfirm
								title={intl.formatMessage({
									id: 'dangkytinchi.phieudangky.columntable.huy.confirm',
								})}
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
						</Space>
					);
				}

				if (canhBao && disabled) return canhBao;

				return (
					<div>
						<ButtonExtend
							type='primary'
							disabled={disabled}
							tooltip={
								vuotSoTinChi
									? intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.tooltip.alert.dangkyquasotin' })
									: undefined
							}
							onClick={(e) => {
								e.stopPropagation();

								if (!disabled) {
									onClickDangKy(rec);
								}
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
					dependencies={[page, limit, recHocKy?.ma, dotDangKyHienTai?._id, loaiDangKy]}
					getData={getData}
					dataState='danhSachLopDktc'
					modelName='lophocphan.lophocphan'
					hideCard
					buttons={{ create: false }}
					scroll={{ y: 600 }}
					otherProps={{
						rowKey: 'ten',
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
				/>
			</div>

			<ModalDangKyNgay visible={visibleDangKyNgay} setVisible={setVisibleDangKyNgay} />

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
