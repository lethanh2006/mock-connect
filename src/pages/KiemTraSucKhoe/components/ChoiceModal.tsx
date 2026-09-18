import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { useIntl } from 'umi';

interface IProps {
	open: boolean;
	onClose: () => void;
	onSelectDangKy: () => void;
	onSelectMien: () => void;
	loadingDangKy?: boolean;
}

const cardStyle: React.CSSProperties = {
	border: '1px solid #E5E7EB',
	borderRadius: 8,
	padding: 20,
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
};

/** Modal chọn hình thức khai báo kiểm tra sức khỏe: đăng ký khám tại trường hoặc khai báo miễn khám */
const ChoiceModalKiemTraSucKhoe = ({ open, onClose, onSelectDangKy, onSelectMien, loadingDangKy }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	return (
		<ModalExpandable
			title={
				<span style={{ color: '#0E50CF', fontWeight: 600, fontSize: 18 }}>
					{t('kiemtrasuckhoe.dangky.choiceModal.title')}
				</span>
			}
			open={open}
			onCancel={onClose}
			width={900}
			footer={[
				<Button key='close' variant='outline' onClick={onClose}>
					{t('global.button.dong')}
				</Button>,
			]}
		>
			<Row gutter={16}>
				<Col span={24} md={12}>
					<div style={cardStyle}>
						<div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
							{t('kiemtrasuckhoe.dangky.choiceModal.chuaKham.title')}
						</div>
						<div style={{ color: '#595959', flex: 1, marginBottom: 16 }}>
							{t('kiemtrasuckhoe.dangky.choiceModal.chuaKham.desc')}
						</div>
						<div style={{ textAlign: 'right' }}>
							<Button variant='default' loading={loadingDangKy} onClick={onSelectDangKy}>
								{t('kiemtrasuckhoe.dangky.choiceModal.chuaKham.button')}
							</Button>
						</div>
					</div>
				</Col>
				<Col span={24} md={12}>
					<div style={cardStyle}>
						<div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
							{t('kiemtrasuckhoe.dangky.choiceModal.daKham.title')}
						</div>
						<div style={{ color: '#595959', flex: 1, marginBottom: 16 }}>
							{t('kiemtrasuckhoe.dangky.choiceModal.daKham.desc')}
						</div>
						<div style={{ textAlign: 'right' }}>
							<Button variant='outline' onClick={onSelectMien}>
								{t('kiemtrasuckhoe.dangky.choiceModal.daKham.button')}
							</Button>
						</div>
					</div>
				</Col>
			</Row>
		</ModalExpandable>
	);
};

export default ChoiceModalKiemTraSucKhoe;
