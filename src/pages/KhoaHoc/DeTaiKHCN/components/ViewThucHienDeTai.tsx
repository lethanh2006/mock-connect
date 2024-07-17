import {
	EDangSanPham,
	MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
	MapKeyColorTrangThaiTienDo,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';
import TableSanPham from './TableSanPham';
import TableThanhVien from './TableThanhVien';
import TableTimeline from './TableTimeline';

const ViewThucHienDeTai = (props: { rec: DeTaiKHCN.IRecord }) => {
	const { dangKyKhcn, deCuongKhcn } = props.rec;

	return (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Trạng thái nộp'>
					<Tag color={props?.rec?.lockThucHien ? '#28a745' : '#dc3545'}>
						{props.rec?.lockThucHien ? 'Đã nộp' : 'Chưa nộp'}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Trạng thái xử lý'>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[props.rec?.trangThaiThucHien]}>
						{props.rec?.trangThaiThucHien}
					</Tag>
				</Descriptions.Item>

				<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
					<span style={{ color: primaryColor }}>{props.rec?.commentThucHien ?? ''}</span>
				</Descriptions.Item>

				<Descriptions.Item span={6} label='Tên đề tài'>
					{dangKyKhcn.ten}
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Sinh viên chịu trách nhiệm thực hiện chính'>
					{dangKyKhcn.chuTriDeTai.ten}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Học hàm'>
					{dangKyKhcn.chuTriDeTai.hocHam}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Học vị'>
					{dangKyKhcn.chuTriDeTai.hocVi}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Ngày sinh'>
					{moment(dangKyKhcn.chuTriDeTai.ngaySinh).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Đơn vị công tác'>
					{dangKyKhcn.chuTriDeTai.tenDonVi}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Chuyên ngành đào tạo (cao nhất)'>
					{dangKyKhcn.chuTriDeTai.chuyenNganhDaoTaoCaoNhat}
				</Descriptions.Item>
			</Descriptions>
			<div>
				<b>Thành viên đề tài</b>
			</div>
			<TableThanhVien type='DeTai' fieldName='danhSachCTV' mode='view' data={props.rec.dangKyKhcn.danhSachCTV || []} />
			<br />

			<div>
				<b>Kế hoạch, phương án tổ chức thực hiện</b>
			</div>
			<TableTimeline showMinhChung mode='view' data={deCuongKhcn?.timeline ?? []} />
			<br />
			{deCuongKhcn?.sanPhamDeCuongDangI?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng I)</b>
					</div>
					<TableSanPham
						phase='deCuongKhcn'
						showMinhChung
						mode='view'
						data={deCuongKhcn?.sanPhamDeCuongDangI ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_I}
					/>
					<br />
				</>
			) : null}
			{deCuongKhcn?.sanPhamDeCuongDangII?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng II)</b>
					</div>
					<TableSanPham
						phase='deCuongKhcn'
						showMinhChung
						mode='view'
						data={deCuongKhcn?.sanPhamDeCuongDangII ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_II}
					/>
					<br />
				</>
			) : null}
			{deCuongKhcn?.sanPhamDeCuongDangIII?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng III)</b>
					</div>
					<TableSanPham
						phase='deCuongKhcn'
						showMinhChung
						mode='view'
						data={deCuongKhcn?.sanPhamDeCuongDangIII ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_III}
					/>
					<br />
				</>
			) : null}
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Đã thực hiện tạm ứng?'>
					{deCuongKhcn?.daThucHienTamUng ? 'Đã tạm ứng' : 'Chưa tạm ứng'}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Kết luận'>
					<Tag color={MapKeyColorTrangThaiTienDo[deCuongKhcn.ketLuanTienDo]}>{deCuongKhcn?.ketLuanTienDo}</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Dự kiến lịch bảo vệ'>
					{deCuongKhcn?.duKienLichBaoVe ? moment(deCuongKhcn.duKienLichBaoVe).format('DD/MM/YYYY') : 'Chưa có'}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewThucHienDeTai;
