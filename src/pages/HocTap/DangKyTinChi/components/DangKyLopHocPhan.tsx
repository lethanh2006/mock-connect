import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
	EColorLopDangKy,
	ELoaiHocPhanDangKyTinChi,
	ETrangThaiDangKyTinChi,
	ETrangThaiHocPhanDangKyTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import { ELoaiLopHocPhan, ETrangThaiLopHocPhan } from '@/services/HocTap/LopHocPhan/constant';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { Empty } from 'antd';
import { type TableRowSelection } from 'antd/lib/table/interface';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FilterHocPhanDKTC from './FilterHocPhan';

const DangKyLopHocPhan = () => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { page, limit, danhSach, getModel } = useModel('daotao.lophocphan');
	const { danhSachLopDangKy, setDanhSachLopDangKy, tinhDataLichHoc, checkTrungLich } =
		useModel('daotao.dotdangkytinchi');
	const { record: hocPhanDangKy } = useModel('daotao.hocphandangkytinchi');
	const [coDangKyMoi, setCoDangKyMoi] = useState<boolean>();
	const [expandedLopHocPhan, setExpandedLopHocPhan] = useState<string[]>([]);
	// Học phần đang chọn đã được đăng ký 1 lớp nào đó rồi
	const dangKyRoi = danhSachLopDangKy.find(
		(item) => item.maHocPhan === hocPhanDangKy?.maHocPhan && item.trangThai !== ETrangThaiDangKyTinChi.CHUA_DANG_KY,
	);

	const getData = () =>
		getModel(
			{
				maHocKy: recHocKy?.ma,
				loai: ELoaiLopHocPhan.CHINH,
				maHocPhan: hocPhanDangKy?.maHocPhan,
				trangThaiLop: ETrangThaiLopHocPhan.MO,
			},
			undefined,
			{ soThuTuLop: 1 },
			undefined,
			undefined,
			'dang-ky/pageable',
		).then((data) => setExpandedLopHocPhan(data.filter((item) => !!item.children?.length).map((item) => item.ten)));

	/**
	 * Khi nào chuyển sang học phần khác
	 */
	useEffect(() => {
		if (hocPhanDangKy?.maHocPhan) {
			const lopChonMoi = danhSachLopDangKy.find(
				(item) => item.maHocPhan === hocPhanDangKy.maHocPhan && item.trangThai === ETrangThaiDangKyTinChi.CHUA_DANG_KY,
			);
			// Học phần này có trong danh sách vừa mới chọn
			if (!!lopChonMoi) {
				const tempDanhSach = danhSachLopDangKy.filter((item) => item.maHocPhan !== hocPhanDangKy.maHocPhan);
				tinhDataLichHoc(tempDanhSach); // Tính lại lịch học không bao gồm môn này
				setCoDangKyMoi(true); // Đánh dấu để khi sang học phần khác thì tính lại lịch học
			}
			// Hp trước đó có chọn lớp mới
			else if (coDangKyMoi) {
				tinhDataLichHoc(danhSachLopDangKy); // Tính lại dữ liệu lịch học bao gồm lớp vừa chọn kia
				setCoDangKyMoi(false);
			}
		}
	}, [hocPhanDangKy?.maHocPhan]);

	const onCell = (rec: LopHocPhan.IRecord) => ({
		style: {
			background: !!danhSachLopDangKy.find((item) => item._id === rec._id)
				? undefined
				: rec.siSoToiDa - (rec.siSo ?? 0) <= 0
				? EColorLopDangKy.FULL_LOP
				: checkTrungLich(rec.thoiKhoaBieuList ?? [])
				? EColorLopDangKy.TRUNG_LICH
				: undefined,
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
			if (lopVuaChon && !dangKyRoi) {
				const temp = danhSachLopDangKy.filter((item) => item.maHocPhan !== lopVuaChon.maHocPhan); // Bỏ những lớp khác cùng học phần
				let soTinChi = lopVuaChon.hocPhan?.soTinChi ?? 0;
				// Nếu lớp vừa chọn là lớp thực hành thì lấy số tín chỉ của lớp cha nó
				if (lopVuaChon.tenCha) {
					const lopCha = danhSach.find((item) => item.ten === lopVuaChon.tenCha);
					if (!soTinChi) soTinChi = lopCha?.hocPhan?.soTinChi ?? 0;
					// Thêm cả lớp cha vào để hiển thị lịch học ở lớp đăng ký
					if (lopCha)
						temp.splice(0, 0, {
							...lopCha,
							soTinChi,
							loai: hocPhanDangKy?.nhuCau ? ELoaiHocPhanDangKyTinChi.NHU_CAU : hocPhanDangKy?.loai,
							trangThai: ETrangThaiDangKyTinChi.CHUA_DANG_KY,
						});
				}
				// Thêm lớp vừa chọn vào danh sách Lớp đăng ký
				// Loại đăng ký theo loại học phần đã chọn
				temp.splice(0, 0, {
					...lopVuaChon,
					soTinChi,
					loai: hocPhanDangKy?.nhuCau ? ELoaiHocPhanDangKyTinChi.NHU_CAU : hocPhanDangKy?.loai,
					trangThai: ETrangThaiDangKyTinChi.CHUA_DANG_KY,
				});
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
			title: 'TT lớp',
			dataIndex: 'soThuTuLop',
			width: 70,
			align: 'center',
			onCell,
		},
		{
			title: 'TT nhóm',
			dataIndex: 'soThuTuNhom',
			width: 60,
			align: 'center',
			onCell,
		},
		{
			title: 'Lịch học & giảng viên',
			width: 350,
			render: (val, rec) =>
				rec.maHoaLichHoc?.length ? (
					<ul className='lich-hoc'>
						{rec.maHoaLichHoc
							?.sort((a, b) => a.thu - b.thu)
							?.map((item, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<li key={index}>
									{item.thu < 7 ? `T${item.thu + 1}` : 'CN'} ({item.tietBatDau}-{item.tietBatDau + item.soTiet - 1}),
									tuần{' '}
									{item.danhSachTuan
										.map((j) => j.tuan)
										.sort((a, b) => a - b)
										.join(',')}
									, {item.nhanSu ?? <i style={{ color: '#999' }}>Không có thông tin giảng viên</i>}
								</li>
							))}
					</ul>
				) : (
					<i style={{ color: '#999' }}>Không có thông tin lịch học</i>
				),
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
			render: (val, rec) => rec.siSoToiDa - (rec.siSo ?? 0),
			onCell,
		},
	];

	return (
		<FilterHocPhanDKTC
			child={() => (
				<>
					{hocPhanDangKy?.maHocPhan ? (
						hocPhanDangKy.trangThai === ETrangThaiHocPhanDangKyTinChi.DUOC_DK ? (
							<div className='table-dang-ky'>
								<TableBase
									columns={columns}
									dependencies={[page, limit, recHocKy?.ma, hocPhanDangKy?.maHocPhan]}
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
								/>
							</div>
						) : (
							<Empty
								description={
									<>
										<i style={{ color: '#999' }}>Bạn không đủ điều kiện để đăng ký học phần này !</i>
										<br />
										{hocPhanDangKy.trangThai === ETrangThaiHocPhanDangKyTinChi.MIEN
											? 'Học phần được miễn'
											: hocPhanDangKy.trangThai}
										{hocPhanDangKy.hpTienQuyet ? (
											<div>
												Học phần tiên quyết: {hocPhanDangKy.hpTienQuyet?.ten ?? ''} -{' '}
												{hocPhanDangKy.hpTienQuyet?.ma ?? ''}
											</div>
										) : null}
										{hocPhanDangKy.hpHocTruoc ? (
											<div>
												Học phần trước: {hocPhanDangKy.hpHocTruoc?.ten ?? ''} - {hocPhanDangKy.hpHocTruoc?.ma ?? ''}
											</div>
										) : null}
									</>
								}
								style={{ marginTop: 30, marginBottom: 30 }}
							/>
						)
					) : (
						<Empty
							description={<i style={{ color: '#999' }}>Vui lòng chọn học phần muốn đăng ký !</i>}
							style={{ marginTop: 30, marginBottom: 30 }}
						/>
					)}
				</>
			)}
		/>
	);
};

export default DangKyLopHocPhan;
