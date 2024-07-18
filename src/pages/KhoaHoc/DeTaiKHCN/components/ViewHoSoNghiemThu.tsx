import { EDangSanPham, MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { Button, Descriptions, Tag } from 'antd';
import { useModel } from 'umi';
import TableKeHoachUngDung from './TableKeHoachUngDung';
import TableSanPham from './TableSanPham';
import TableUngDungTrongHocVien from './TableUngDungTrongHocVien';
import moment from 'moment';

const ViewHoSoNghiemThu = (props: {
	rec: DeTaiKHCN.IRecord;
	mode: 'NopHoSoNghiemThu' | 'HoiDongXetDuyetHoSoNghiemThu';
	fieldNameLock?: 'lockNopNghiemThu' | 'lockNghiemThu';
	fieldNameTrangThai?: 'trangThaiNopNghiemThu' | 'trangThaiNghiemThu';
}) => {
	const { dangKyKhcn, nghiemThuKhcn } = props.rec;
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
				{props.mode === 'NopHoSoNghiemThu' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>{props.rec?.commentNopNghiemThu ?? ''}</span>
					</Descriptions.Item>
				)}
				{/* {props.mode === 'HoiDongXetDuyetThuyetMinh' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetDuyetThuyetMinh?.ketQuaDeCuong?.comment || dangKyKhcn?.comment || ''}
						</span>
					</Descriptions.Item>
				)} */}
				{props.mode === 'HoiDongXetDuyetHoSoNghiemThu' && props.rec.nghiemThuKhcn?.hoiDong?.length && (
					<>
						{props.rec.nghiemThuKhcn.hoiDong.map((item) => (
							<>
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
								{props.rec.nghiemThuKhcn?.hoiDong?.length > 1 && (
									<Descriptions.Item key={item._id} span={3} label='Trạng thái hội đồng'>
										<Tag
											color={
												MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[
													props.rec.ketQuaHoiDongNghiemThu?.trangThaiNghiemThu ||
														props.rec?.ketQuaHoiDong?.[item._id]?.trangThaiNghiemThu ||
														props.rec?.trangThaiNghiemThu
												]
											}
										>
											{props.rec.ketQuaHoiDongNghiemThu?.trangThaiNghiemThu ||
												props.rec?.ketQuaHoiDong?.[item._id]?.trangThaiNghiemThu ||
												props.rec?.trangThaiNghiemThu}
										</Tag>
									</Descriptions.Item>
								)}
								<Descriptions.Item span={3} label='Tổng điểm đánh giá'>
									<span style={{ color: primaryColor }}>
										{props.rec?.ketQuaHoiDongNghiemThu?.ketQuaNghiemThu?.tongDiem ||
											props.rec?.ketQuaHoiDong?.[item._id]?.ketQuaNghiemThu?.tongDiem ||
											nghiemThuKhcn?.tongDiem ||
											'Chưa có'}{' '}
										điểm
									</span>
								</Descriptions.Item>

								<Descriptions.Item span={3} label='Có bài kỷ yếu?'>
									<span style={{ color: primaryColor }}>
										{props.rec?.ketQuaHoiDongNghiemThu?.ketQuaNghiemThu?.coBaiKyYeu ||
										props.rec?.ketQuaHoiDong?.[item._id]?.ketQuaNghiemThu?.coBaiKyYeu ||
										nghiemThuKhcn?.coBaiKyYeu
											? 'Có bài'
											: 'Không có bài'}
									</span>
								</Descriptions.Item>
								<Descriptions.Item span={6} label='Kết luận hội đồng nghiệm thu đề tài NCKH'>
									<span style={{ color: primaryColor }}>
										{props.rec?.ketQuaHoiDongNghiemThu?.ketQuaNghiemThu?.comment ||
											props.rec?.ketQuaHoiDong?.[item._id]?.ketQuaNghiemThu?.comment ||
											nghiemThuKhcn?.comment ||
											''}
									</span>
								</Descriptions.Item>
								{props.rec?.ketQuaHoiDongNghiemThu?.ketQuaNghiemThu?.bienBanUrl?.length ||
								props.rec?.ketQuaHoiDong?.[item._id]?.ketQuaNghiemThu?.bienBanUrl?.length ||
								nghiemThuKhcn?.bienBanUrl?.length ? (
									<Descriptions.Item span={6} label='Phiếu nhận xét, đánh giá của Hội đồng'>
										<span style={{ color: primaryColor }}>
											<>
												{[
													...(props.rec?.ketQuaHoiDongNghiemThu?.ketQuaNghiemThu?.bienBanUrl ||
														props.rec?.ketQuaHoiDong?.[item._id]?.ketQuaNghiemThu?.bienBanUrl ||
														nghiemThuKhcn?.bienBanUrl ||
														[]),
												].map((ele) => (
													<a key={ele} href={ele} target='_blank' rel='noreferrer'>
														<Tag color={primaryColor}>Xem tập tin</Tag>
													</a>
												))}
											</>
										</span>
									</Descriptions.Item>
								) : null}
							</>
						))}
					</>
				)}

				<Descriptions.Item span={6} label='Tên đề tài'>
					{dangKyKhcn.ten}
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Sinh viên chịu trách nhiệm thực hiện chính'>
					{dangKyKhcn.chuTriDeTai.ten}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Mã sinh viên'>
					{dangKyKhcn.chuTriDeTai.maDinhDanh}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Khoa'>
					{dangKyKhcn.chuTriDeTai.tenDonVi}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Ngày sinh'>
					{moment(dangKyKhcn.chuTriDeTai.ngaySinh).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={2} label='Nơi sinh'>
					{dangKyKhcn.chuTriDeTai.noiSinh}
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Địa chỉ liên hệ'>
					{dangKyKhcn.chuTriDeTai.diaChi}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Email'>
					{dangKyKhcn.chuTriDeTai.email}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='SĐT'>
					{dangKyKhcn.chuTriDeTai.soDienThoai}
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Số tài khoản và chi nhánh ngân hàng'>
					{dangKyKhcn.chuTriDeTai.soTaiKhoanNganHang}
				</Descriptions.Item>
			</Descriptions>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={6} label='Báo cáo tổng hợp kết quả nghiên cứu đề tài NCKH'>
					{nghiemThuKhcn?.baoCaoUrl?.map((item) => (
						<a href={item} key={item} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin</Tag>
						</a>
					))}
				</Descriptions.Item>
				{nghiemThuKhcn?.banGiaiTrinhUrl?.length ? (
					<Descriptions.Item
						span={6}
						label='Bản giải trình nội dung chỉnh sửa Báo cáo tổng hợp kết quả nghiên cứu đề tài'
					>
						<a href={nghiemThuKhcn?.banGiaiTrinhUrl?.[0]} target='_blank' rel='noreferrer'>
							<Tag color={primaryColor}>Xem tập tin</Tag>
						</a>
					</Descriptions.Item>
				) : null}
				{/* <Descriptions.Item
					label={'Sản phẩm của đề tài được công bố hoặc minh chứng ứng dụng trong thực tiễn (nếu có)'}
					span={6}
				>
					{''}
				</Descriptions.Item> */}
				{nghiemThuKhcn?.sanPham
					?.filter((item) => item?.url?.length > 0)
					?.map((item, index) => (
						<Descriptions.Item
							key={item.loai}
							span={6}
							label={
								<div style={{ fontWeight: 400 }}>
									{index + 1}. {item.loai}
								</div>
							}
						>
							{item?.url?.map((ele) => (
								<a href={ele} key={ele} target='_blank' rel='noreferrer'>
									<Tag color={primaryColor}>Xem tập tin</Tag>
								</a>
							))}
						</Descriptions.Item>
					))}
			</Descriptions>

			{nghiemThuKhcn?.noiDungUngDungHocVien?.length ? (
				<>
					<div>
						<b> Nội dung ứng dụng trong đào tạo (quá trình dạy và học) tại Học viện</b>
					</div>
					<TableUngDungTrongHocVien mode='view' data={nghiemThuKhcn?.noiDungUngDungHocVien ?? []} />
					<br />
				</>
			) : null}
			{/* <Descriptions>
				<Descriptions.Item label='Nội dung ứng dụng khác'>
					<div dangerouslySetInnerHTML={{ __html: nghiemThuKhcn?.noiDungUngDungKhac }} />
				</Descriptions.Item>
			</Descriptions> */}
			{nghiemThuKhcn?.sanPhamDeCuongDangI?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng I)</b>
					</div>
					<TableSanPham
						phase='nghiemThuKhcn'
						mode='view'
						data={nghiemThuKhcn?.sanPhamDeCuongDangI ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_I}
					/>
					<br />
				</>
			) : null}
			{nghiemThuKhcn?.sanPhamDeCuongDangII?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng II)</b>
					</div>
					<TableSanPham
						phase='nghiemThuKhcn'
						mode='view'
						data={nghiemThuKhcn?.sanPhamDeCuongDangII ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_II}
					/>
					<br />
				</>
			) : null}
			{nghiemThuKhcn?.sanPhamDeCuongDangIII?.length ? (
				<>
					<div>
						<b>Sản phẩm chính của đề tài (Dạng III)</b>
					</div>
					<TableSanPham
						phase='nghiemThuKhcn'
						mode='view'
						data={nghiemThuKhcn?.sanPhamDeCuongDangIII ?? []}
						type={EDangSanPham.DANG_SAN_PHAM_III}
					/>
					<br />
				</>
			) : null}
			<>
				<div>
					<b>Kế hoạch ứng dụng</b>
				</div>
				<TableKeHoachUngDung mode='view' data={nghiemThuKhcn?.keHoachUngDung ?? []} />
				<br />
			</>
		</>
	);
};

export default ViewHoSoNghiemThu;
