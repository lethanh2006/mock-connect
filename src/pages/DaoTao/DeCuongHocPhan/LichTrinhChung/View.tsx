import { Button, Card, Col, Descriptions, Divider, Row } from 'antd';
import DOMPurify from 'dompurify';
import { useModel } from 'umi';

const ViewLichTrinhDeCuong = () => {
	const { record, setVisibleForm } = useModel('hocphan.noidunghp');

	return (
		<Card title='Mô tả tóm tắt học phần/Kế hoạch giảng dạy'>
			<Row gutter={[0, 12]}>
				<Col span={24}>
					<span className='fw500'>Tiêu đề: </span> {record?.tieuDe ?? '--'}
				</Col>
				<Col span={24}>
					<span className='fw500'>Giai đoạn dạy học: </span> {record?.giaiDoanDayHoc ?? '--'}
				</Col>
				<Col span={24}>
					<div className='fw500'>Nội dung: </div>
					<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(record?.ten ?? '--') }} />
				</Col>
				<Col span={24}>
					<span className='fw500'>Đáp ứng chuẩn đầu ra: </span> {record?.listMaChuanDauRa?.join(', ') ?? '--'}
				</Col>
				<Col span={24}>
					<span className='fw500'>Bài đánh giá: </span> {record?.listTrongSoTuongUng?.join(', ') ?? '--'}
				</Col>
			</Row>

			<Divider>Thời gian tổ chức giảng dạy</Divider>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}>
				<Descriptions.Item label='Lý thuyết'>{record?.gioLyThuyet ?? '--'} tiết</Descriptions.Item>
				<Descriptions.Item label='Bài tập / Thảo luận'>{record?.gioBaiTapTL ?? '--'} tiết</Descriptions.Item>
				<Descriptions.Item label='Thực hành'>{record?.gioThucHanh ?? '--'} tiết</Descriptions.Item>
				<Descriptions.Item label='Tự học'>{record?.gioTuHoc ?? '--'} tiết</Descriptions.Item>
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
			</div>
		</Card>
	);
};

export default ViewLichTrinhDeCuong;
