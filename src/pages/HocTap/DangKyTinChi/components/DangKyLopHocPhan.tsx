import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
	EColorLopDangKy,
	ELoaiDangKyTheoLop,
	ELoaiHocPhanDangKyTinChi,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ELoaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty, Modal, Segmented } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FilterHocPhanDKTC from './FilterHocPhan';
import RenderLichHoc from './RenderLichHoc';

const DangKyLopHocPhan = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { page, limit, danhSachLopDktc, sinhVienGetLopDangKyModel } = useModel('lophocphan.lophocphan');
	const { danhSachLopDangKy, setDanhSachLopDangKy, tinhDataLichHoc, checkTrungLich } =
		useModel('daotao.dotdangkytinchi');
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

	const getData = () =>
		recHocKy?.ma &&
		recHocPhan?.ma &&
		sinhVienGetLopDangKyModel(recHocKy.ma, loaiDangKy, recHocPhan.ma, typeLop !== 'Lớp gợi ý').then((data) =>
			setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)),
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

	const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
		columnWidth: 40,
		hideSelectAll: true,
		preserveSelectedRowKeys: true,
		fixed: true,
		// type: 'radio',     // Dùng radio không được
		selectedRowKeys: danhSachLopDangKy?.map((item) => item.ten),

		onChange: (selectedRowKeys, selectedRows) => {
			const lopVuaChon = selectedRows?.at(-1);
			// Nếu chọn ít nhất 1 lớp và chưa đăng ký
			if (!lopVuaChon) return;

			const isHetCho = lopVuaChon.siSoToiDa - (lopVuaChon.siSo ?? 0) <= 0;

			const handleDangKy = (isWaitList = false) => {
				if (
					!lopVuaChon.children?.length &&
					!dangKyRoiMap[lopVuaChon.loai!] &&
					lopVuaChon.maHocPhan === recHocPhan?.ma
				) {
					const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác cùng học phần
					let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? recHocPhan?.soTinChi ?? 0;
					const khoaNganh =
						loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2 ? khoaNganhMe?.khoaNganhPhu : khoaNganhMe?.khoaNganhChinh;
					const lopDangKy = {
						hocPhan: recHocPhan,
						maNganh: khoaNganh?.maNganh,
						maKhoaNganh: khoaNganh?.ma,
						// TODO: Update loại đăng ký
						loai: ELoaiHocPhanDangKyTinChi.TIEN_TRINH,
						trangThai: ETrangThaiDangKyTinChi.CHUA_DANG_KY,
						isWaitlist: isWaitList,
					};
					// Nếu lớp vừa chọn là lớp thực hành thì lấy số tín chỉ của lớp cha nó
					if (lopVuaChon.tenCha) {
						const lopCha = danhSachLopDktc.find((item) => item.ten === lopVuaChon.tenCha);
						if (!soTinChi) soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
						// Thêm cả lớp cha vào để hiển thị lịch học ở lớp đăng ký
						if (lopCha) temp.splice(0, 0, { ...lopCha, soTinChi, ...lopDangKy });
					}
					// Thêm lớp vừa chọn vào danh sách Lớp đăng ký
					// Loại đăng ký theo loại học phần đã chọn
					temp.splice(0, 0, { ...lopVuaChon, soTinChi, ...lopDangKy });

					setDanhSachLopDangKy(temp);
					setCoDangKyMoi(true);
					// Không tính lại lịch học ở đây vì sẽ trùng với các lớp trong môn hiện tại
				}
			};

			if (isHetCho) {
				Modal.confirm({
					title: 'Lớp đã đầy',
					content:
						'Lớp này hiện đã đủ sĩ số. Bạn có muốn đăng ký vào danh sách chờ không? Bạn sẽ được tự động chuyển vào lớp khi có chỗ trống hoặc khi giảng viên phê duyệt.',
					okText: 'Vào danh sách chờ',
					cancelText: 'Hủy',
					onOk: () => handleDangKy(true),
				});
				return;
			}

			handleDangKy(false);
		},

		getCheckboxProps: (record) => {
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
			const failed4 = siSo && (record.waitlistCount ?? 0) >= (settings?.SINH_VIEN?.extraSlots ?? 0);
			return {
				disabled: failed1 || failed2 || failed3 || failed4,
			};
		},
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

	const columns: IColumn<LopHocPhan.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.thutulop' }),
			dataIndex: 'soThuTuLop',
			width: 100,
			align: 'center',
			render: (val, rec) => (rec.soThuTuNhom ? `Nhóm TH ${rec.soThuTuNhom}` : val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.malop' }),
			dataIndex: 'maLop',
			width: 90,
			align: 'center',
			filterType: 'string',
			render: (val, rec) => {
				return (
					<a
					// onClick={(e) => {
					// 	e.stopPropagation();
					// 	handleXemDeCuong(val, rec?.ten);
					// }}
					>
						{val}
					</a>
				);
			},
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
			width: 60,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.controng' }),
			align: 'center',
			width: 60,
			render: (val, rec) => (rec.siSo !== undefined && rec.siSoToiDa >= rec.siSo ? rec.siSoToiDa - rec.siSo : 0),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.dlphong' }),
			dataIndex: 'phongCapacity',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.hangcho' }),
			dataIndex: 'waitlistCount',
			align: 'center',
			width: 60,
			render: (val, rec) => `${val ?? 0}/${settings?.SINH_VIEN?.extraSlots ?? 0}`,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.hinhthucdt' }),
			dataIndex: 'maHinhThuc',
			width: 80,
			render: (val, rec) => rec.hinhThuc?.ten ?? val,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.csdt' }),
			dataIndex: 'maCSDT',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.columntable.tinhchat' }),
			dataIndex: 'maTinhChat',
			align: 'center',
			width: 60,
			onCell,
		},
	];

	return (
		<FilterHocPhanDKTC>
			{recHocPhan?.ma ? (
				// recHocPhan.trangThai === ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? (
				<div className='table-dang-ky'>
					<TableBase
						columns={columns}
						dependencies={[page, limit, recHocKy?.ma, recHocPhan?.ma, typeLop]}
						getData={getData}
						dataState='danhSachLopDktc'
						modelName='lophocphan.lophocphan'
						hideCard
						buttons={{ create: false, filter: false }}
						addStt={false}
						scroll={{ y: 600 }}
						otherProps={{
							rowKey: 'ten',
							expandable: {
								expandRowByClick: true,
								indentSize: 0,
								expandedRowKeys: expandedLopHocPhan,
								onExpand,
							},
							rowSelection,
						}}
						otherButtons={
							loaiDangKy === ELoaiDangKyTheoLop.LOP_HANH_CHINH
								? [
										<Segmented
											key='1'
											options={[
												intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.lopgoiy' }),
												intl.formatMessage({ id: 'dangkytinchi.dankylophocphan.btn.segmented.luachonkhac' }),
											]}
											value={typeLop}
											onChange={(val) => setTypeLop(val.toString())}
										/>,
									]
								: undefined
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
		</FilterHocPhanDKTC>
	);
};

export default DangKyLopHocPhan;
