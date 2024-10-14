import { Button, Card, Descriptions } from 'antd';
import { useModel } from 'umi';

const ViewLichTrinhDeCuong = () => {
	const { record, setVisibleForm } = useModel('hocphan.noidunghp');

	return (
		<Card title='Nội dung học phần'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} bordered>
				<Descriptions.Item label='Tiêu đề' span={2}>
					{record?.tieuDe ?? '--'}
				</Descriptions.Item>
				<Descriptions.Item label='Nội dung' span={2}>
					<div dangerouslySetInnerHTML={{ __html: record?.ten ?? '--' }} />
				</Descriptions.Item>
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
