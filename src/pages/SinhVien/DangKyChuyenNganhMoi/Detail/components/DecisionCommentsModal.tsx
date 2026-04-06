import { Button, Input, Modal } from 'antd';
import type { ReactNode } from 'react';
import { useIntl } from 'umi';

const { TextArea } = Input;

interface DecisionCommentsModalProps {
	open: boolean;
	onCancel: () => void;
	width?: number;
	title: ReactNode;
	content?: string;
	closeText?: ReactNode;
}

const DecisionCommentsModal = (props: DecisionCommentsModalProps) => {
	const intl = useIntl();
	const { open, onCancel, width = 600, title, content = '', closeText } = props;

	const closeLabel = closeText ?? intl.formatMessage({ id: 'minor.modal.close' });

	return (
		<Modal
			title={title}
			open={open}
			onCancel={onCancel}
			footer={[
				<Button key='close' onClick={onCancel}>
					{closeLabel}
				</Button>,
			]}
			width={width}
		>
			<TextArea value={content} readOnly rows={6} />
		</Modal>
	);
};

export default DecisionCommentsModal;
