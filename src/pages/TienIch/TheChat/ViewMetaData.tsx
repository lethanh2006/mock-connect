import type { TheChat } from '@/services/TienIch/TheChat/typing';
import { Button, Descriptions, Image, Modal } from 'antd';
import { useIntl } from 'umi';

interface IProps {
	visible: boolean;
	setVisible: (val: boolean) => void;
	data: TheChat.IMetaData;
}

const ViewMetaData = ({ visible, setVisible, data }: IProps) => {
	const intl = useIntl();

	return (
		<Modal title='Thông tin chi tiết' visible={visible} onCancel={() => setVisible(false)} footer={null} width={700}>
			<Descriptions bordered column={2} size='middle' labelStyle={{ fontWeight: 600, width: 180 }}>
				<Descriptions.Item label='Mã sinh viên'>{data?.STUDENT_CODE ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Mã bài thi'>{data?.EXAM_ID ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Thiết bị'>{data?.DEVICE_ID ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Khoảng cách'>{data?.STUDENT_DISTANCE ?? '--'} m</Descriptions.Item>

				<Descriptions.Item label='Thời gian làm'>{data?.STUDENT_MINS ?? '--'} phút</Descriptions.Item>

				<Descriptions.Item label='Điểm số'>{data?.STUDENT_SCORE ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Nhịp tim bắt đầu'>{data?.STUDENT_HEART_START ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='Nhịp tim kết thúc'>{data?.STUDENT_HEART_END ?? '--'}</Descriptions.Item>

				<Descriptions.Item label='MAP (Google Map)' span={2}>
					{data?.STUDENT_MAP ? (
						<Image
							src={`data:image/png;base64,${data?.STUDENT_MAP}`}
							alt='map'
							width={'100%'}
							style={{ borderRadius: 6 }}
						/>
					) : (
						'Không có dữ liệu MAP'
					)}
				</Descriptions.Item>
			</Descriptions>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
			</div>
		</Modal>
	);
};

export default ViewMetaData;
