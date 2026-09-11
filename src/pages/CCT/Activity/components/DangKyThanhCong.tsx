import { IconShieldCheck } from '@/components/Icons';
import { Modal, Space, Typography } from 'antd';
import { useIntl } from 'umi';

const { Title } = Typography;

const ModalDangKyThanhCong = (props: { visibleDangKy: boolean; setVisibleDangKy: (val: boolean) => void }) => {
	const intl = useIntl();
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
					<IconShieldCheck style={{ fontSize: 48, color: '#329323' }} />
				</div>
			</Space>

			<div style={{ textAlign: 'center', marginTop: 12 }}>
				<Title level={4} style={{ color: '#329323' }}>
					{intl.formatMessage({ id: 'activity.chitiet.dangkythanhcong' })}
				</Title>
			</div>
		</Modal>
	);
};

export default ModalDangKyThanhCong;
