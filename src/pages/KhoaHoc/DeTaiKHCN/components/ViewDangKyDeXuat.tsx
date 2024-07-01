import { ELoaiDeTaiCaNhan, MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { Button, Descriptions, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import TableThanhVien from './TableThanhVien';

const ViewDangKyDeXuat = (props: {
	rec: DeTaiKHCN.IRecord;
	mode: 'DangKyDeXuat' | 'HoiDongXetChonDeXuat';
	fieldNameLock?: 'lock' | 'lockXetDuyet' | 'lockNopDeCuong' | 'lockDeCuong';
	fieldNameTrangThai?: 'trangThaiDangKy' | 'trangThaiXetDuyetDangKy';
}) => {
	const { dangKyKhcn, xetDuyetKhcn } = props.rec;
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
				{props.mode === 'DangKyDeXuat' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>{dangKyKhcn?.comment ?? ''}</span>
					</Descriptions.Item>
				)}
				{props.mode === 'HoiDongXetChonDeXuat' && (
					<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetChonDeXuat?.ketQuaXetDuyet?.comment || xetDuyetKhcn?.comment || ''}
						</span>
					</Descriptions.Item>
				)}
				{props.mode === 'HoiDongXetChonDeXuat' && props.rec?.xetDuyetKhcn?.hoiDong?.length && (
					<>
						{props?.rec?.xetDuyetKhcn?.hoiDong?.map((item) => (
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

				{props.mode === 'HoiDongXetChonDeXuat' && (
					<Descriptions.Item span={6} label='Kết luận hội đồng xét chọn đề xuất đề tài NCKH'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetChonDeXuat?.ketQuaXetDuyet?.commentHoiDong ||
								xetDuyetKhcn?.commentHoiDong ||
								''}
						</span>
					</Descriptions.Item>
				)}
				{props.mode === 'HoiDongXetChonDeXuat' && (
					<Descriptions.Item span={6} label='Phiếu đánh giá xét chọn của Hội đồng'>
						<span style={{ color: primaryColor }}>
							{props.rec?.ketQuaHoiDongXetChonDeXuat?.ketQuaXetDuyet?.bienBanXetDuyetUrl ||
							xetDuyetKhcn?.bienBanXetDuyetUrl ? (
								<a
									href={
										props.rec?.ketQuaHoiDongXetChonDeXuat?.ketQuaXetDuyet?.bienBanXetDuyetUrl?.[0] ||
										xetDuyetKhcn?.bienBanXetDuyetUrl?.[0]
									}
									target='_blank'
									rel='noreferrer'
								>
									<Tag color={primaryColor}>Xem tập tin</Tag>
								</a>
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

				<Descriptions.Item span={6} label='Mục tiêu thực hiện'>
					<div dangerouslySetInnerHTML={{ __html: dangKyKhcn?.mucTieuDeTai }} />
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Tính cấp thiết và tính mới'>
					<div dangerouslySetInnerHTML={{ __html: dangKyKhcn?.tinhCanThietVaMoi }} />
				</Descriptions.Item>
				{/* <Descriptions.Item span={6} label='Tóm tắt các đề xuất, giải pháp'>
					<div dangerouslySetInnerHTML={{ __html: dangKyKhcn?.tomTatDeXuat }} />
				</Descriptions.Item> */}
			</Descriptions>
			{dangKyKhcn?.loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE && (
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
				<Descriptions.Item span={3} label='Thời gian dự kiến thực hiện đề tài'>
					{moment(dangKyKhcn.thoiGianThucHienBatDau).format('DD/MM/YYYY')} -{' '}
					{moment(dangKyKhcn.thoiGianThucHienKetThuc).format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Đề xuất người hướng dẫn nếu có'>
					{dangKyKhcn.nguoiHuongDan.ten} - {dangKyKhcn.nguoiHuongDan.tenDonVi}
				</Descriptions.Item>
				{/* <Descriptions.Item span={3} label='Tổng kinh phí đề nghị của đề tài'>
					{currencyFormat(dangKyKhcn.kinhPhi.kinhPhi)} {dangKyKhcn.kinhPhi.menhGia}
				</Descriptions.Item> */}
				<Descriptions.Item span={6} label='Phiếu đăng ký đề xuất'>
					<a href={dangKyKhcn.urlPhieuDangKyDeXuat} target='_blank' rel='noreferrer'>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewDangKyDeXuat;
