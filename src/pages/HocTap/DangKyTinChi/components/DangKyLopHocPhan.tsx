import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import {
	EColorLopDangKy,
	ELoaiHocPhanDangKyTinChi,
	ETinhChatDangKyTC,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { DeleteOutlined } from '@ant-design/icons';
import { Empty, Modal, Popconfirm, Segmented, Select, Space, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import ModalDangKyNgay from './ModalDangKyNgay';
import RenderLichHoc from './RenderLichHoc';

const DangKyLopHocPhan = () => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { page, limit, danhSachLopDktc, sinhVienGetLopDangKyModel, setRecord } = useModel('lophocphan.lophocphan');
	const {
		dotDangKyHienTai,
		danhSachLopDangKy,
		setDanhSachLopDangKy,
		tinhDataLichHoc,
		checkTrungLich,
		phieuDangKy,
		deleteDangKyTinChiModel,
	} = useModel('daotao.dotdangkytinchi');
	const { record: recHocPhan, loaiDangKy } = useModel('hocphan.hocphan');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien'); // Đã get khóa ngành của tôi ở file Filter Học phần
	const { settings } = useModel('tienich.caidat');
	// const { danhSach: danhSachLopHanhChinh } = useModel('daotao.lophanhchinh');
	const [coDangKyMoi, setCoDangKyMoi] = useState<boolean>();
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);
	const [typeLop, setTypeLop] = useState<string>('Lớp gợi ý');
	// Học phần đang chọn đã được đăng ký 1 lớp nào đó rồi
	const dangKyRoiMap: Partial<Record<ELoaiLopHocPhan, DangKyTinChi.ILopDangKy>> = {};
	danhSachLopDangKy.find((item) => {
		if (item.maHocPhan === recHocPhan?.ma && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY) {
			dangKyRoiMap[item.loaiLop!] = item;
		}
	});
	// const danhSachMaLopHc = danhSachLopHanhChinh.map((item) => item.ten);
	const [visibleDangKyNgay, setVisibleDangKyNgay] = useState<boolean>(false);
	const dangKyNgay: boolean = true;
	const [thuFilter, setThuFilter] = useState<number>();
	const [trangThaiLopFilter, setTrangThaiLopFilter] = useState<'lopcontrong' | 'tatca'>('lopcontrong');

	const otherQuery = {
		lichHoc: thuFilter ? String(thuFilter) : undefined,
		siSo: trangThaiLopFilter === 'lopcontrong',
	};

	const getData = () =>
		recHocKy?.ma &&
		recHocPhan?.ma &&
		sinhVienGetLopDangKyModel(recHocKy.ma, loaiDangKy, recHocPhan.ma, typeLop !== 'Lớp gợi ý', otherQuery).then(
			(data) => setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)),
		);

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

	const onCell = (rec: LopHocPhan.IRecord) => ({
		style: {
			background: !!danhSachLopDangKy.find((item) => item._id === rec._id)
				? undefined
				: rec.siSoToiDa - (rec.siSo ?? 0) <= 0
					? EColorLopDangKy.FULL_LOP
					: checkTrungLich(rec.thoiKhoaBieuList ?? [])
						? EColorLopDangKy.TRUNG_LICH
						: undefined,
			// fontWeight: rec.lopHpHcList?.some((item) => danhSachMaLopHc?.includes(item.maLopHc ?? '')) ? 600 : undefined,
		},
	});

	const isDaChonLop = (rec: LopHocPhan.IRecord) =>
		!!danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);

	const getDisabledDangKy = (record: LopHocPhan.IRecord) => {
		const lopCha = danhSachLopDktc.find((item) => item.ten === record.tenCha);
		const needCheckLopCha = lopCha && dangKyRoiMap[lopCha.loai]?.soThuTuLop !== lopCha.soThuTuLop;
		// Check trùng cả thời khóa biểu của lớp cha
		let allThoiKhoaBieu = [...(record.thoiKhoaBieuList ?? [])];
		if (needCheckLopCha) {
			allThoiKhoaBieu.push(...(lopCha?.thoiKhoaBieuList ?? []));
		}
		// Check sĩ số còn trống ở cả lớp cha nữa
		let siSo = record.siSoToiDa - (record.siSo ?? 0) <= 0;
		if (needCheckLopCha) {
			siSo ||= !!lopCha?._id && lopCha.siSoToiDa - (lopCha.siSo ?? 0) <= 0;
		}
		const failed1 = !!dangKyRoiMap[record.loai] || (!!dangKyRoiMap[lopCha?.loai!] && needCheckLopCha);
		const failed2 = checkTrungLich(allThoiKhoaBieu);
		const failed3 = !!record.children?.length;
		const failed4 = cctFilter?.()
			? siSo && (record.waitlistCount ?? 0) >= (settings?.SINH_VIEN?.extraSlots ?? 0)
			: siSo;

		return failed1 || failed2 || failed3 || failed4;
	};

	const buildLopDangKy = (lopVuaChon: LopHocPhan.IRecord, isWaitlist = false) => {
		const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác cùng học phần
		let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? recHocPhan?.soTinChi ?? 0;
		const khoaNganh = khoaNganhMe?.khoaNganhChinh;
		// loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2 ? khoaNganhMe?.khoaNganhPhu :
		const lopDangKy = {
			hocPhan: recHocPhan,
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
		if (!lopVuaChon.children?.length && !dangKyRoiMap[lopVuaChon.loai!] && lopVuaChon.maHocPhan === recHocPhan?.ma) {
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
				title: 'Lớp đã đầy',
				content:
					'Lớp này hiện đã đủ sĩ số. Bạn có muốn đăng ký vào danh sách chờ không? Bạn sẽ được tự động chuyển vào lớp khi có chỗ trống hoặc khi giảng viên phê duyệt.',
				okText: 'Vào danh sách chờ',
				cancelText: 'Hủy',
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
			onCell,
			hide: true,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.malop' }),
			dataIndex: 'maLop',
			width: 140,
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
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.giangvien' }),
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
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.thongtinchitiet' }),
			width: 250,
			render: (val, rec) => <RenderLichHoc lopHocPhan={rec} />,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.sisotoida' }),
			dataIndex: 'siSoToiDa',
			align: 'center',
			width: 100,
			onCell,
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.controng' }),
			align: 'center',
			width: 100,
			render: (val, rec) => (rec.siSo !== undefined && rec.siSoToiDa >= rec.siSo ? rec.siSoToiDa - rec.siSo : 0),
			onCell,
			sortable: true,
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
				const disabled = getDisabledDangKy(rec);

				const lopDangKy = danhSachLopDangKy.find((item) => item._id === rec._id || item.ten === rec.ten);

				if (daChon && dangKyNgay) {
					return (
						<Space>
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
								disabled={
									(lopDangKy?.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
										dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
									!rec.dangKyTinChi
								}
							>
								<ButtonExtend
									icon={<DeleteOutlined />}
									danger
									type='link'
									tooltip={intl.formatMessage({
										id: 'dangkytinchi.phieudangky.columntable.huy.tooltip',
									})}
									disabled={
										(lopDangKy?.trangThai === ETrangThaiDangKyTinChi.DA_DANG_KY &&
											dotDangKyHienTai?.tinhChatDangKy === ETinhChatDangKyTC.DANG_KY) ||
										!rec.dangKyTinChi
									}
								/>
							</Popconfirm>
						</Space>
					);
				}

				if (daChon) {
					return (
						<div>
							<ButtonExtend
								type='primary'
								onClick={(e) => {
									e.stopPropagation();
									onClickBoChon(rec);
								}}
							>
								{intl.formatMessage({
									id: 'dangkytinchi.dankylophocphan.action.dachon',
								})}
							</ButtonExtend>
						</div>
					);
				}

				return (
					<div>
						<ButtonExtend
							type='primary'
							disabled={disabled}
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
			onCell,
		},
	];

	return (
		<>
			{recHocPhan?.ma ? (
				// recHocPhan.trangThai === ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? (
				<div className='table-dang-ky'>
					<TableBase
						columns={columns}
						dependencies={[page, limit, recHocKy?.ma, recHocPhan?.ma, typeLop, thuFilter, trangThaiLopFilter]}
						getData={getData}
						dataState='danhSachLopDktc'
						modelName='lophocphan.lophocphan'
						hideCard
						buttons={{ create: false }}
						hideFilterColumn={false}
						otherProps={{
							rowKey: 'ten',
							expandable: {
								expandRowByClick: true,
								indentSize: 0,
								expandedRowKeys: expandedLopHocPhan,
								onExpand,
							},
						}}
						otherButtons={
							[
								<Segmented
									key='lop-filter'
									value={trangThaiLopFilter}
									options={[
										{
											label: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filter.lopcontrong' }),
											value: 'lopcontrong',
										},
										{
											label: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.filter.tatca' }),
											value: 'tatca',
										},
									]}
									onChange={(val) => setTrangThaiLopFilter(val as 'lopcontrong' | 'tatca')}
								/>,
								<Select
									key='thu-filter'
									placeholder={intl.formatMessage({
										id: 'dangkytinchi.dankylophocphan.filter.loctheothu',
									})}
									allowClear
									style={{ width: 140 }}
									value={thuFilter}
									onChange={(val) => setThuFilter(val)}
									options={[
										{ value: 2, label: intl.formatMessage({ id: 'dangkytinchi.thu.2' }) },
										{ value: 3, label: intl.formatMessage({ id: 'dangkytinchi.thu.3' }) },
										{ value: 4, label: intl.formatMessage({ id: 'dangkytinchi.thu.4' }) },
										{ value: 5, label: intl.formatMessage({ id: 'dangkytinchi.thu.5' }) },
										{ value: 6, label: intl.formatMessage({ id: 'dangkytinchi.thu.6' }) },
										{ value: 7, label: intl.formatMessage({ id: 'dangkytinchi.thu.7' }) },
										{ value: 8, label: intl.formatMessage({ id: 'dangkytinchi.thu.cn' }) },
									]}
								/>,
							]

							// loaiDangKy === ELoaiDangKyTheoLop.LOP_HANH_CHINH
							// 	? [
							// 			<Segmented
							// 				key='1'
							// 				options={[
							// 					intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.lopgoiy' }),
							// 					intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.luachonkhac' }),
							// 				]}
							// 				value={typeLop}
							// 				onChange={(val) => setTypeLop(val.toString())}
							// 			/>,
							// 		]
							// 	: undefined
						}
						emptyText={intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.table.empty.khongcolop' })}
					/>
				</div>
			) : (
				// ) : (
				// 	<Empty
				// 		description={
				// 			<>
				// 				<i style={{ color: '#999' }}>Bạn không đủ điều kiện để đăng ký tín chỉ này !</i>
				// 				<br />
				// 				{recHocPhan.trangThai === ETrangThaiHocPhanDangKyTinChi.MIEN
				// 					? 'Học phần được miễn'
				// 					: recHocPhan.trangThai}
				// 				{recHocPhan.hpTienQuyet ? (
				// 					<div>
				// 						Học phần tiên quyết: {recHocPhan.hpTienQuyet?.ten ?? ''} - {recHocPhan.hpTienQuyet?.ma ?? ''}
				// 					</div>
				// 				) : null}
				// 				{recHocPhan.hpHocTruoc ? (
				// 					<div>
				// 						Học phần trước: {recHocPhan.hpHocTruoc?.ten ?? ''} - {recHocPhan.hpHocTruoc?.ma ?? ''}
				// 					</div>
				// 				) : null}
				// 			</>
				// 		}
				// 		style={{ marginTop: 30, marginBottom: 30 }}
				// 	/>
				// )
				<Empty
					description={
						<i style={{ color: '#999' }}>
							{intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.table.empty.chonhocphanmuondangky' })}
						</i>
					}
					style={{ marginTop: 30, marginBottom: 30 }}
				/>
			)}

			<ModalDangKyNgay visible={visibleDangKyNgay} setVisible={setVisibleDangKyNgay} />
		</>
	);
};

export default DangKyLopHocPhan;
