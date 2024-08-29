import {
	EDangSanPham,
	ELoaiDeTaiCaNhan,
	MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { currencyFormat } from '@/utils/utils';
import { Button, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import TableSanPham from './TableSanPham';
import TableThanhVien from './TableThanhVien';
import TableTimeline from './TableTimeline';

const ViewThuyetMinh = (props: {
	rec: DeTaiKHCN.IRecord;
	mode: 'NopThuyetMinh' | 'HoiDongXetDuyetThuyetMinh';
	fieldNameLock?: 'lockNopDeCuong' | 'lockDeCuong';
	fieldNameTrangThai?: 'trangThaiNopDeCuong' | 'trangThaiXetDuyetDeCuong';
}) => {
	const { dangKyKhcn, deCuongKhcn } = props.rec;
	const { fieldNameLock, fieldNameTrangThai } = props;
	const { setVisibleViewDetail, getByIdModel } = useModel('khoahoc.hoidongkhcn');
	return (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				{fieldNameLock && (
					<Descriptions.Item span={3} label='Trạng thái nộp'>
						<Tag color={props?.rec?.[fieldNameLock] ? '#28a745' : '#dc3545'}>
							{props.rec?.[fieldNameLock] ? 'Đã nộp' : 'Chưa nộp'}
						</Tag>
					</Descriptions.Item>
				)}
				{fieldNameTrangThai && (
					<Descriptions.Item span={3} label='Trạng thái xử lý'>
						<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[props.rec?.[fieldNameTrangThai]]}>
							{props.rec?.[fieldNameTrangThai]}
						</Tag>
					</Descriptions.Item>
				)}
				{props.mode === 'NopThuyetMinh' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>{props.rec?.commentNopDeCuong ?? ''}</span>
					</Descriptions.Item>
				)}
				{/* {props.mode === 'HoiDongXetDuyetThuyetMinh' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.comment || dangKyKhcn?.comment || ''}
						</span>
					</Descriptions.Item>
				)} */}
				{props.mode === 'HoiDongXetDuyetThuyetMinh' && props.rec.deCuongKhcn.hoiDong?.length && (
					<>
						{props.rec.deCuongKhcn.hoiDong?.map((item) => (
							<Descriptions.Item key={item._id} span={6} label='Hội đồng'>
								<span>
									{item.ten} (
									<Button
										onClick={async () => {
											await getByIdModel(item._id);
											setVisibleViewDetail(true);
										}}
										size='small'
										type='link'
									>
										Xem chi tiết
									</Button>
									)
								</span>
							</Descriptions.Item>
						))}
					</>
				)}

				{props.mode === 'HoiDongXetDuyetThuyetMinh' && (
					<Descriptions.Item span={6} label='Kết luận hội đồng xét chọn đề xuất đề tài NCKH'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.comment || deCuongKhcn?.comment || ''}
						</span>
					</Descriptions.Item>
				)}
				{props.mode === 'HoiDongXetDuyetThuyetMinh' && (
					<Descriptions.Item span={6} label='Tổng điểm đánh giá của các thành viên trong hội đồng'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.tongDiem ||
								deCuongKhcn?.tongDiem ||
								'Chưa có'}{' '}
							điểm
						</span>
					</Descriptions.Item>
				)}
				{props.mode === 'HoiDongXetDuyetThuyetMinh' && (
					<Descriptions.Item span={6} label='Phiếu nhận xét, đánh giá của Hội đồng'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.bienBanUrl || deCuongKhcn?.bienBanUrl ? (
								<>
									{[
										...(props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.bienBanUrl ||
											deCuongKhcn?.bienBanUrl ||
											[]),
									].map((item) => (
										<a key={item} href={item} target='_blank' rel='noreferrer'>
											<Tag color={primaryColor}>Xem tập tin</Tag>
										</a>
									))}
								</>
							) : null}
						</span>
					</Descriptions.Item>
				)}
				<Descriptions.Item span={6} label='Tên đề tài'>
					{dangKyKhcn.ten}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Loại đề tài'>
					{dangKyKhcn.loaiCaNhan}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Sinh viên chịu trách nhiệm thực hiện chính'>
					{dangKyKhcn.chuTriDeTai.ten}
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Ngày sinh'>
					{moment(dangKyKhcn.chuTriDeTai.ngaySinh).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Khoa'>
					{dangKyKhcn.chuTriDeTai.tenDonVi}
				</Descriptions.Item>
			</Descriptions>
			{dangKyKhcn.loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE && (
				<>
					<div>
						<b>Thành viên đề tài</b>
					</div>
					<TableThanhVien
						type='DeTai'
						fieldName='danhSachCTV'
						mode='view'
						data={props.rec.dangKyKhcn.danhSachCTV || []}
					/>
					<br />
				</>
			)}
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Cơ quan chủ trì đề tài'>
					{dangKyKhcn.donViChuTri}
				</Descriptions.Item>
			</Descriptions>
			<div>
				<b>Kế hoạch, phương án tổ chức thực hiện</b>
			</div>
			<TableTimeline mode='view' data={deCuongKhcn?.timeline ?? []} />
			<br />
			{deCuongKhcn?.sanPhamDeCuongDangI?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng I)</b>
					</div>
					<TableSanPham
						phase='deCuongKhcn'
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
						mode='view'
						data={deCuongKhcn?.sanPhamDeCuongDangIII ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_III}
					/>
					<br />
				</>
			) : null}
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Thời gian thực hiện đề tài'>
					{moment(dangKyKhcn.thoiGianThucHienBatDau).format('DD/MM/YYYY')} -{' '}
					{moment(dangKyKhcn.thoiGianThucHienKetThuc).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Tổng kinh phí đề nghị của đề tài'>
					{currencyFormat(dangKyKhcn.kinhPhi.kinhPhi)} {dangKyKhcn.kinhPhi.menhGia}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Thuyết minh đề tài NCKH'>
					<a href={deCuongKhcn?.deCuongUrl?.[0]} target='_blank' rel='noreferrer'>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
				{deCuongKhcn?.banGiaiTrinhUrl?.length ? (
					<Descriptions.Item span={3} label='Bản giải trình nội dung chỉnh sửa và bổ sung thuyết minh'>
						<a href={deCuongKhcn?.banGiaiTrinhUrl?.[0]} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin</Tag>
						</a>
					</Descriptions.Item>
				) : null}
			</Descriptions>
		</>
	);
};

export default ViewThuyetMinh;
