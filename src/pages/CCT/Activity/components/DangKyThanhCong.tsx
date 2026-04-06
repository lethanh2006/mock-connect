import { CheckCircleFilled } from '@ant-design/icons';
import { Modal, Space, Typography } from 'antd';

const { Title } = Typography;

const ModalDangKyThanhCong = (props: { visibleDangKy: boolean; setVisibleDangKy: (val: boolean) => void }) => {
	const { visibleDangKy, setVisibleDangKy } = props;

	return (
		<Modal open={visibleDangKy} onCancel={() => setVisibleDangKy(false)} footer={null} centered width={400}>
			<Space direction='vertical' size={24} align='center' style={{ width: '100%' }}>
				<div
					style={{
						width: 90,
						height: 90,
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<CheckCircleFilled style={{ fontSize: 48, color: '#329323' }} />
				</div>
			</Space>

			<div style={{ textAlign: 'center', marginTop: 12 }}>
				<Title level={4} style={{ color: '#329323' }}>
					You have successfully registered
				</Title>
			</div>
		</Modal>
	);
};

export default ModalDangKyThanhCong;
