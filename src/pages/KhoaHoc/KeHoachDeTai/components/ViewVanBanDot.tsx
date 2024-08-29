import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import type { KeHoachDeTai } from '@/services/KhoaHoc/KeHoachDeTai/typings';
import { primaryColor } from '@/services/base/constant';
import { Descriptions, Tag } from 'antd';

const ViewVanBanDot = (props: { rec: KeHoachDeTai.IRecord }) => {
	const loaiDeTai = props.rec.loaiDeTai;

	return (
		<Descriptions>
			<Descriptions.Item span={6} label='Văn bản kèm theo'>
				{props.rec.vanBanKemTheoUrl.map((item, index) => (
					<Tag
						color={primaryColor}
						key={item}
						onClick={() => {
							window.open(item);
						}}
					>
						Tập tin {index + 1}
					</Tag>
				))}
			</Descriptions.Item>
			{loaiDeTai === ELoaiDeTai.SINH_VIEN_KHOA && (
				<Descriptions.Item span={6} label='Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp khoa'>
					<a href={props.rec.mauSinhVienKhoa}>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
			)}
			{loaiDeTai === ELoaiDeTai.SINH_VIEN_HOC_VIEN && (
				<Descriptions.Item span={6} label='Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp HV'>
					<a href={props.rec.mauSinhVienHocVien}>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
			)}
			{loaiDeTai === ELoaiDeTai.GIANG_VIEN && (
				<Descriptions.Item span={6} label='Mẫu phiếu đăng ký đề xuất đề tài cán bộ giảng viên'>
					<a href={props.rec.mauGiangVien}>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
			)}
		</Descriptions>
	);
};

export default ViewVanBanDot;
