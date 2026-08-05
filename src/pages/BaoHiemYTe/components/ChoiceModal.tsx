import ModalExpandable from '@/components/Table/ModalExpandable';
import { Button, Col, Row } from 'antd';
import { useIntl } from 'umi';

interface IProps {
	open: boolean;
	onClose: () => void;
	onSelectDangKy: () => void;
	onSelectMien: () => void;
}

const cardStyle: React.CSSProperties = {
	border: '1px solid #E5E7EB',
	borderRadius: 8,
	padding: 20,
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
};

/** Modal chọn hình thức khai báo BHYT: đăng ký qua trường hoặc khai báo đã có BHYT bên ngoài */
const ChoiceModalBHYT = ({ open, onClose, onSelectDangKy, onSelectMien }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	return (
		<ModalExpandable
			title={
				<span style={{ color: '#0E50CF', fontWeight: 600, fontSize: 18 }}>
					{t('baohiemyte.dangky.choiceModal.title')}
				</span>
			}
			open={open}
			onCancel={onClose}
			width={900}
			footer={[
				<Button key='close' onClick={onClose}>
					{t('global.button.dong')}
				</Button>,
			]}
		>
			<Row gutter={16}>
				<Col span={24} md={12}>
					<div style={cardStyle}>
						<div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
							{t('baohiemyte.dangky.choiceModal.khongCoBHYT.title')}
						</div>
						<div style={{ color: '#595959', flex: 1, marginBottom: 16 }}>
							{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.khongCoBHYT.desc' })}
						</div>
						<div style={{ textAlign: 'right' }}>
							<Button type='primary' onClick={onSelectDangKy}>
								{t('baohiemyte.dangky.choiceModal.khongCoBHYT.button')}
							</Button>
						</div>
					</div>
				</Col>
				<Col span={24} md={12}>
					<div style={cardStyle}>
						<div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
							{t('baohiemyte.dangky.choiceModal.daCoBHYT.title')}
						</div>
						<div style={{ color: '#595959', flex: 1, marginBottom: 16 }}>
							{t('baohiemyte.dangky.choiceModal.daCoBHYT.desc')}
						</div>
						<div style={{ textAlign: 'right' }}>
							<Button onClick={onSelectMien}>{t('baohiemyte.dangky.choiceModal.daCoBHYT.button')}</Button>
						</div>
					</div>
				</Col>
			</Row>
		</ModalExpandable>
	);
};

export default ChoiceModalBHYT;
