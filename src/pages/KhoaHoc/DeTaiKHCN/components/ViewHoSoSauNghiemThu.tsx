import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { primaryColor } from '@/services/base/constant';
import { Descriptions, Tag } from 'antd';
import moment from 'moment';

const ViewHoSoSauNghiemThu = (props: { rec: DeTaiKHCN.IRecord }) => {
	const { dangKyKhcn } = props.rec;

	return (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Trạng thái nộp'>
					<Tag color={props?.rec?.lockSauNghiemThu ? '#28a745' : '#dc3545'}>
						{props.rec?.lockSauNghiemThu ? 'Đã nộp' : 'Chưa nộp'}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Trạng thái xử lý'>
					<Tag color={props?.rec?.hoanThanh ? '#28a745' : '#007bff'}>
						{props.rec?.hoanThanh ? 'Đã tiếp nhận' : 'Chưa tiếp nhận'}
					</Tag>
				</Descriptions.Item>

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
				{/* <Descriptions.Item span={3} label='Cơ quan chủ trì đề tài'>
					{dangKyKhcn.donViChuTri}
				</Descriptions.Item> */}
			</Descriptions>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				{props.rec.taiLieuSauNghiemThu
					?.filter((item) => item?.url?.length > 0)
					?.map((item, index) => (
						<Descriptions.Item
							key={item.ten}
							span={6}
							label={
								<div style={{ fontWeight: 400 }}>
									{index + 1}. {item.ten}
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
		</>
	);
};

export default ViewHoSoSauNghiemThu;
