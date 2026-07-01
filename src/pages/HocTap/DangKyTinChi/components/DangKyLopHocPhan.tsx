import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import ModalHocPhan from '@/pages/DaoTao/DeCuongHocPhan/ModalHocPhan';
import {
	EColorLopDangKy,
	ELoaiDangKyTheoLop,
	ELoaiHocPhanDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { formatTimeRange } from '@/utils/formatDate';
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Popconfirm, Popover, Select, Space, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
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
	const { record: recHocPhan, loaiDangKy, setLoaiDangKy } = useModel('hocphan.hocphan');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien'); // Đã get khóa ngành của tôi ở file Filter Học phần
	const { settings } = useModel('tienich.caidat');
	// const { danhSach: danhSachLopHanhChinh } = useModel('daotao.lophanhchinh');
	const [coDangKyMoi, setCoDangKyMoi] = useState<boolean>();
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);
	const [typeLop, setTypeLop] = useState<string>('Lớp gợi ý');
	const allLoaiDangKy = useMemo(() => {
		const all = Object.values(ELoaiDangKyTheoLop);
		if (!khoaNganhMe?.khoaNganhPhu?.ma) return all.filter((item) => item !== ELoaiDangKyTheoLop.KHOA_NGANH_2);
		return all;
	}, [khoaNganhMe?.khoaNganhPhu?.ma]);

	// Học phần đang chọn đã được đăng ký 1 lớp nào đó rồi
	const dangKyRoiMap: Partial<Record<ELoaiLopHocPhan, DangKyTinChi.ILopDangKy>> = {};
	danhSachLopDangKy.find((item) => {
		if (item.maHocPhan === recHocPhan?.ma && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY) {
			dangKyRoiMap[item.loaiLop!] = item;
		}
	});
	// const danhSachMaLopHc = danhSachLopHanhChinh.map((item) => item.ten);
	const [visibleDangKyNgay, setVisibleDangKyNgay] = useState<boolean>(false);
	const [visibleDeCuong, setVisibleDeCuong] = useState<boolean>(false);
	const [deCuongModal, setDeCuongModal] = useState<{ deCuongId: string; title: string } | null>(null);
	const dangKyNgay: boolean = !!settings?.SINH_VIEN?.dktcMultiple;
	const coDotDangKyTinChi = !!dotDangKyHienTai?._id && dotDangKyHienTai.maHocKy === recHocKy?.ma;

	const getData = () =>
		recHocKy?.ma &&
		dotDangKyHienTai?._id &&
		sinhVienGetLopDangKyTheoHocPhanModel(
			recHocKy.ma,
			dotDangKyHienTai?._id,
			loaiDangKy,
			{ tatCa: typeLop !== 'Lớp gợi ý' },
			filters,
			sort,
		).then((data) => setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)));

	/**
	 * Khi nào chuyển sang học phần khác
	 */
	useEffect(() => {
		if (recHocPhan?.ma) {
			const lopChonMoi = danhSachLopDangKy.find(
				(item) => item.maHocPhan === recHocPhan.ma && item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY,
			);
			// Học phần này có trong danh sách vừa mới chọn
			if (!!lopChonMoi) {
				const tempDanhSach = danhSachLopDangKy.filter((item) => item.maHocPhan !== recHocPhan.ma);
				tinhDataLichHoc(tempDanhSach); // Tính lại lịch học không bao gồm môn này
				setCoDangKyMoi(true); // Đánh dấu để khi sang học phần khác thì tính lại lịch học
			}
			// Hp trước đó có chọn lớp mới
			else if (coDangKyMoi) {
				tinhDataLichHoc(danhSachLopDangKy); // Tính lại dữ liệu lịch học bao gồm lớp vừa chọn kia
				setCoDangKyMoi(false);
			}
		}
	}, [recHocPhan?.ma]);

	const isDaChonLop = (rec: LopHocPhan.IRecord) =>
		!!danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);

	const isCungLopDangKy = (lopDangKy: DangKyTinChi.ILopDangKy, lopHocPhan: LopHocPhan.IRecord) =>
		lopDangKy._id === lopHocPhan._id ||
		lopDangKy.ten === lopHocPhan.ten ||
		lopDangKy.tenCha === lopHocPhan.ten ||
		lopDangKy.ten === lopHocPhan.tenCha;

	const isDaDangKyHocPhanKhacLop = (lopHocPhan: LopHocPhan.IRecord) =>
		!!lopHocPhan.maHocPhan &&
		danhSachLopDangKy.some((item) => item.maHocPhan === lopHocPhan.maHocPhan && !isCungLopDangKy(item, lopHocPhan));

	const getLopTrungLich = (rec: LopHocPhan.IRecord) => {
		const thoiKhoaBieuList = rec.thoiKhoaBieuList ?? [];
		if (!thoiKhoaBieuList.length) return [];

		return _.uniq(
			danhSachLopDangKy
				.filter((lopDangKy) =>
					thoiKhoaBieuList.some((tkb) =>
						(lopDangKy.thoiKhoaBieuList ?? []).some((tkbDangKy) => {
							const isSameDate = dayjs(tkbDangKy.ngay).isSame(dayjs(tkb.ngay), 'day');
							const isOverlap =
								(tkb.tietBatDau ?? 0) <= (tkbDangKy.tietKetThuc ?? 0) &&
								(tkb.tietKetThuc ?? 0) >= (tkbDangKy.tietBatDau ?? 0);
							return isSameDate && isOverlap;
						}),
					),
				)
				.map((lopDangKy) => lopDangKy.maLop ?? lopDangKy.ten ?? lopDangKy.maHocPhan)
				.filter(Boolean),
		);
	};

	const renderKhoangThoiGian = (rec: LopHocPhan.IRecord) => {
		const thoiKhoaBieuList = rec.thoiKhoaBieuList ?? [];
		if (!thoiKhoaBieuList.length) return null;

		const start = _.minBy(thoiKhoaBieuList, (item) => dayjs(item.ngay).valueOf())?.ngay;
		const end = _.maxBy(thoiKhoaBieuList, (item) => dayjs(item.ngay).valueOf())?.ngay;
		if (!start || !end) return null;

		return formatTimeRange(start, end, 'DD/MM');
	};

	const renderTrangThaiCanhBao = (rec: LopHocPhan.IRecord) => {
		if (isDaChonLop(rec)) return null;

		if (rec.siSoToiDa - (rec.siSo ?? 0) <= 0) {
			return (
				<Tag color={EColorLopDangKy.FULL_LOP}>
					{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.trangthai.lopday' })}
				</Tag>
			);
		}

		const lopTrungLich = getLopTrungLich(rec);
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

	const getLopChaContext = (record: LopHocPhan.IRecord) => {
		const lopCha = danhSachLopDktc.find((item) => item.ten === record.tenCha);
		const needCheckLopCha = !!(lopCha && dangKyRoiMap[lopCha.loai]?.soThuTuLop !== lopCha.soThuTuLop);
		return { lopCha, needCheckLopCha };
	};

	const isHetSiSo = (record: LopHocPhan.IRecord, lopCha?: LopHocPhan.IRecord, needCheckLopCha?: boolean) => {
		const hetCho = record.siSoToiDa - (record.siSo ?? 0) <= 0;
		if (!needCheckLopCha || !lopCha?._id) return hetCho;
		return hetCho || lopCha.siSoToiDa - (lopCha.siSo ?? 0) <= 0;
	};

	const getSoTinChiLop = (record: LopHocPhan.IRecord) => {
		const hocPhan = record.hocPhan ?? recHocPhan;
		if (hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy === false) return 0;

		let soTinChi = record.hocPhan?.soTinChi ?? recHocPhan?.soTinChi ?? 0;
		if (record.tenCha && !soTinChi) {
			const lopCha = danhSachLopDktc.find((item) => item.ten === record.tenCha);
			soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
		}
		return soTinChi;
	};

	const isVuotSoTinChiToiDa = (record: LopHocPhan.IRecord) => {
		if (!soTinChiToiDa) return false;

		const stcHienTaiCuaHp = _.sumBy(
			danhSachLopHienThi.filter(
				(item) => item.maHocPhan === record.maHocPhan && item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy !== false,
			),
			(item) => item.soTinChi ?? 0,
		);

		return tongTinChi - stcHienTaiCuaHp + getSoTinChiLop(record) > soTinChiToiDa;
	};

	const getDisabledDangKy = (record: LopHocPhan.IRecord) => {
		if (record.children?.length) return true;

		const { lopCha, needCheckLopCha } = getLopChaContext(record);

		if (isDaDangKyHocPhanKhacLop(record)) return true;
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

		return isVuotSoTinChiToiDa(record);
	};

	const buildLopDangKy = (lopVuaChon: LopHocPhan.IRecord, isWaitlist = false) => {
		const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác cùng học phần
		let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? recHocPhan?.soTinChi ?? 0;
		const khoaNganh =
			loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2 ? khoaNganhMe?.khoaNganhPhu : khoaNganhMe?.khoaNganhChinh;
		const lopDangKy = {
			hocPhan: lopVuaChon.hocPhan,
			maNganh: khoaNganh?.maNganh,
			maKhoaNganh: khoaNganh?.ma,
			// TODO: Update loại đăng ký
			loai: ELoaiHocPhanDangKyTinChi.TIEN_TRINH,
			trangThai: dangKyNgay ? ETrangThaiDangKyTinChi.DA_DANG_KY : ETrangThaiDangKyTinChi.CHUA_DANG_KY,
			isWaitlist,
		};

		const listDangKy: DangKyTinChi.ILopDangKy[] = [];

		// Nếu lớp vừa chọn là lớp thực hành thì lấy số tín chỉ của lớp cha nó
		if (lopVuaChon.tenCha) {
			const lopCha = danhSachLopDktc.find((item) => item.ten === lopVuaChon.tenCha);
			if (!soTinChi) soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
			// Thêm cả lớp cha vào để hiển thị lịch học ở lớp đăng ký
			if (lopCha) listDangKy.push({ ...lopCha, soTinChi, ...lopDangKy } as DangKyTinChi.ILopDangKy);
		}

		// Thêm lớp vừa chọn vào danh sách Lớp đăng ký
		// Loại đăng ký theo loại học phần đã chọn
		listDangKy.push({ ...lopVuaChon, soTinChi, ...lopDangKy } as DangKyTinChi.ILopDangKy);

		return {
			temp: [...listDangKy, ...temp],
			listDangKy,
		};
	};

	const handleDangKy = (lopVuaChon: LopHocPhan.IRecord, isWaitList = false) => {
		const isDungHocPhanDangChon = !recHocPhan?.ma || lopVuaChon.maHocPhan === recHocPhan.ma;
		if (
			!lopVuaChon.children?.length &&
			!isDaDangKyHocPhanKhacLop(lopVuaChon) &&
			!dangKyRoiMap[lopVuaChon.loai!] &&
			isDungHocPhanDangChon
		) {
			const { temp } = buildLopDangKy(lopVuaChon, isWaitList);

			if (dangKyNgay) {
				setRecord(lopVuaChon);
				setVisibleDangKyNgay(true);
				return;
			}

			setDanhSachLopDangKy(temp);
			setCoDangKyMoi(true);
			// Không tính lại lịch học ở đây vì sẽ trùng với các lớp trong môn hiện tại
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

		const temp = danhSachLopDangKy.filter(
			(item) =>
				item.maHocPhan !== rec.maHocPhan ||
				(item._id !== rec._id && item.ten !== rec.ten && item.tenCha !== rec.ten && item.ten !== rec.tenCha),
		);

		setDanhSachLopDangKy(temp);
		setCoDangKyMoi(true);
	};

	const handleXemDeCuong = (rec: LopHocPhan.IRecord) => {
		const deCuongId = rec.hocPhan?.deCuongHienTaiId ?? rec.deCuong?.deCuongId;
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
			width: 120,
			fixed: 'right',
			render: (val, rec) => {
				const daChon = isDaChonLop(rec);
				const lopDangKy = danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);
				const vuotSoTinChi = isVuotSoTinChiToiDa(rec);
				const disabled = getDisabledDangKy(rec) || !coDotDangKyTinChi;
				const canhBao = renderTrangThaiCanhBao(rec);
				const isChuaDangKy = lopDangKy?.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY;

				if (daChon && dangKyNgay) {
					const disabledDelete =
						(lopDangKy?.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
							dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
						!rec.dangKyTinChi ||
						!coDotDangKyTinChi;

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
								<Tooltip
									placement='bottom'
									title={intl.formatMessage({
										id: 'dangkytinchi.phieudangky.columntable.huy.tooltip',
									})}
								>
									<span
										style={{
											color: '#ff4d4f',
											cursor: disabledDelete ? 'not-allowed' : 'pointer',
											fontSize: 18,
											lineHeight: 1,
										}}
										onClick={(e) => {
											if (disabledDelete) e.preventDefault();
										}}
									>
										<DeleteOutlined />
									</span>
								</Tooltip>
							</Popconfirm>
						</Space>
					);
				}

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
						<Tag color='green'>
							{intl.formatMessage({
								id: 'dangkytinchi.dankylophocphan.action.dadangky',
							})}
						</Tag>
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
			{/* recHocPhan.trangThai === ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? ( */}
			<div className='table-dang-ky'>
				<TableBase
					columns={columns}
					dependencies={[page, limit, recHocKy?.ma, recHocPhan?.ma, typeLop, loaiDangKy]}
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
					// otherButtons={
					// 	loaiDangKy === ELoaiDangKyTheoLop.LOP_HANH_CHINH
					// 		? [
					// 				<Segmented
					// 					key='1'
					// 					options={[
					// 						intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.lopgoiy' }),
					// 						intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.luachonkhac' }),
					// 					]}
					// 					value={typeLop}
					// 					onChange={(val) => setTypeLop(val.toString())}
					// 				/>,
					// 			]
					// 		: undefined
					// }
					emptyText={intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.table.empty.khongcolop' })}
				/>
			</div>

			<ModalDangKyNgay visible={visibleDangKyNgay} setVisible={setVisibleDangKyNgay} />

			<ModalHocPhan
				visible={visibleDeCuong}
				setVisible={setVisibleDeCuong}
				deCuongId={deCuongModal?.deCuongId}
				title={deCuongModal?.title}
				// isChiTiet
			/>
		</>
	);
};

export default DangKyLopHocPhan;
