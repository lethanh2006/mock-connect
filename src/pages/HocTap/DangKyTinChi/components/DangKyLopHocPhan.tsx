import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
	EColorLopDangKy,
	ELoaiDangKyTheoLop,
	ELoaiHocPhanDangKyTinChi,
	ETrangThaiDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty, Segmented } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FilterHocPhanDKTC from './FilterHocPhan';
import RenderLichHoc from './RenderLichHoc';

const DangKyLopHocPhan = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { page, limit, danhSach, sinhVienGetLopDangKyModel } = useModel('daotao.lophocphan');
	const { danhSachLopDangKy, setDanhSachLopDangKy, tinhDataLichHoc, checkTrungLich } =
		useModel('daotao.dotdangkytinchi');
	const { record: recHocPhan, loaiDangKy } = useModel('hocphan.hocphan');
	const { sinhVienGetModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien'); // Đã get khóa ngành của tôi ở file Filter Học phần
	const [danhSachMaLopHc, setDanhSachMaLopHc] = useState<string[]>();
	const [coDangKyMoi, setCoDangKyMoi] = useState<boolean>();
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);
	const [typeLop, setTypeLop] = useState<string>('Lớp gợi ý');
	// Học phần đang chọn đã được đăng ký 1 lớp nào đó rồi
	const dangKyRoi = danhSachLopDangKy.find(
		(item) => item.maHocPhan === recHocPhan?.ma && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY,
	);

	const getData = () =>
		recHocKy?.ma &&
		recHocPhan?.ma &&
		sinhVienGetLopDangKyModel(recHocKy.ma, loaiDangKy, recHocPhan.ma, typeLop !== 'Lớp gợi ý').then((data) =>
			setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)),
		);

	useEffect(() => {
		getLopHc(undefined).then((res) => setDanhSachMaLopHc(res.map((item) => item.ten)));
	}, []);

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
			fontWeight: rec.lopHpHcList?.some((item) => danhSachMaLopHc?.includes(item.maLopHc ?? '')) ? 600 : undefined,
		},
	});

	const rowSelection: TableRowSelection<LopHocPhan.IRecord> = {
		hideSelectAll: true,
		preserveSelectedRowKeys: true,
		fixed: true,
		// type: 'radio',     // Dùng radio không được
		selectedRowKeys: danhSachLopDangKy?.map((item) => item.ten),

		onChange: (selectedRowKeys, selectedRows) => {
			const lopVuaChon = selectedRows?.at(-1);
			// Nếu chọn ít nhất 1 lớp và chưa đăng ký
			if (lopVuaChon && !dangKyRoi && lopVuaChon.maHocPhan === recHocPhan?.ma) {
				const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác cùng học phần
				let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? recHocPhan?.soTinChi ?? 0;
				const lopDangKy = {
					hocPhan: recHocPhan,
					maKhoaNganh:
						loaiDangKy === ELoaiDangKyTheoLop.KHOA_NGANH_2
							? khoaNganhMe?.khoaNganhPhu?.ma
							: khoaNganhMe?.khoaNganhChinh?.ma,
					// TODO: Update loại đăng ký
					loai: ELoaiHocPhanDangKyTinChi.TIEN_TRINH,
					trangThai: ETrangThaiDangKyTinChi.CHUA_DANG_KY,
				};
				// Nếu lớp vừa chọn là lớp thực hành thì lấy số tín chỉ của lớp cha nó
				if (lopVuaChon.tenCha) {
					const lopCha = danhSach.find((item) => item.ten === lopVuaChon.tenCha);
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
		},

		getCheckboxProps: (record) => {
			const lopCha = danhSach.find((item) => item.ten === record.tenCha);
			// Check trùng cả thời khóa biểu của lớp cha
			const allThoiKhoaBieu = [...(record.thoiKhoaBieuList ?? []), ...(lopCha?.thoiKhoaBieuList ?? [])];
			// Check sĩ số còn trống ở cả lớp cha nữa
			const siSo =
				record.siSoToiDa - (record.siSo ?? 0) <= 0 || (!!lopCha?._id && lopCha.siSoToiDa - (lopCha.siSo ?? 0) <= 0);
			return {
				disabled: !!dangKyRoi || checkTrungLich(allThoiKhoaBieu) || !!record.children?.length || siSo,
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
			title: 'Thứ tự lớp',
			dataIndex: 'soThuTuLop',
			width: 80,
			align: 'center',
			render: (val, rec) => `${val}${rec.soThuTuNhom ? ` (nhóm ${rec.soThuTuNhom})` : ''}`,
			onCell,
		},
		{
			title: 'Thông tin chi tiết',
			width: 400,
			render: (val, rec) => <RenderLichHoc lopHocPhan={rec} />,
			onCell,
		},
		{
			title: 'Sĩ số tối đa',
			dataIndex: 'siSoToiDa',
			align: 'center',
			width: 60,
			onCell,
		},
		{
			title: 'Còn trống',
			align: 'center',
			width: 60,
			render: (val, rec) => (rec.siSo !== undefined && rec.siSoToiDa >= rec.siSo ? rec.siSoToiDa - rec.siSo : 0),
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
						modelName='daotao.lophocphan'
						hideCard
						buttons={{ create: false, reload: false, filter: false }}
						hideTotal
						addStt={false}
						rowSelection
						detailRow={rowSelection}
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
						otherButtons={
							loaiDangKy === ELoaiDangKyTheoLop.LOP_HANH_CHINH
								? [
										<Segmented
											key='1'
											options={['Lớp gợi ý', 'Lựa chọn khác']}
											value={typeLop}
											onChange={(val) => setTypeLop(val.toString())}
										/>,
								  ]
								: undefined
						}
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
					description={<i style={{ color: '#999' }}>Vui lòng chọn học phần muốn đăng ký !</i>}
					style={{ marginTop: 30, marginBottom: 30 }}
				/>
			)}
		</FilterHocPhanDKTC>
	);
};

export default DangKyLopHocPhan;
