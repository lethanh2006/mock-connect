import { primaryColor } from '@/services/base/constant';
import { MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { Descriptions, Tag } from 'antd';

const ViewHoSoSauXetDuyetThuyetMinh = (props: { rec: DeTaiKHCN.IRecord }) => {
	const { deCuongKhcn } = props.rec;

	return (
		<>
			<Descriptions column={{ xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }}>
				<Descriptions.Item span={3} label='Trạng thái nộp'>
					<Tag color={props?.rec?.lockSauXetDuyetDeCuong ? '#28a745' : '#dc3545'}>
						{props.rec?.lockSauXetDuyetDeCuong ? 'Đã nộp' : 'Chưa nộp'}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Trạng thái xử lý'>
					<Tag color={MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc[props.rec?.trangThaiSauXetDuyetDeCuong]}>
						{props.rec?.trangThaiSauXetDuyetDeCuong}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item span={6} label='Ghi chú của phòng QLKH'>
					<span style={{ color: primaryColor }}>{props.rec?.commentSauXetDuyetDeCuong ?? ''}</span>
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Thuyết minh đề tài NCKH (bản chỉnh sửa)'>
					<a href={deCuongKhcn?.deCuongUrlChinhSua?.[0]} target='_blank' rel='noreferrer'>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>

				<Descriptions.Item span={3} label='Bản giải trình nội dung chỉnh sửa và bổ sung thuyết minh'>
					<a href={deCuongKhcn?.banGiaiTrinhUrl?.[0]} target='_blank' rel='noreferrer'>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
				<Descriptions.Item span={3} label='Dự toán kinh phí'>
					<a href={deCuongKhcn?.duToanUrl?.[0]} target='_blank' rel='noreferrer'>
						<Tag color={primaryColor}>Xem tập tin</Tag>
					</a>
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};

export default ViewHoSoSauXetDuyetThuyetMinh;
