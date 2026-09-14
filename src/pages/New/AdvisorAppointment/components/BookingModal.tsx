import {
	ADVISING_MODE_LABEL_KEY,
	ADVISING_TOPIC_MAX_LENGTH,
	ADVISING_TYPE_LABEL_KEY,
	AdvisingType,
} from '@/services/Advising/constant';
import { Advising } from '@/services/Advising/typing';
import { formatDateTimeRange } from '@/utils/formatDate';
import rules from '@/utils/rules';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const { TextArea } = Input;

type BookingFormValues = {
	topic: string;
};

type BookingModalProps = {
	open: boolean;
	slot?: Advising.ISlot;
	advisingType?: AdvisingType;
	onClose: () => void;
	onSuccess: () => void;
};

const BookingModal: React.FC<BookingModalProps> = ({ open, slot, advisingType, onClose, onSuccess }) => {
	const intl = useIntl();
	const { postModel, formSubmiting } = useModel('advising.advising');
	const [form] = Form.useForm<BookingFormValues>();

	useEffect(() => {
		if (open) form.resetFields();
	}, [open, form]);

	const handleClose = () => {
		if (!form.isFieldsTouched()) {
			onClose();
			return;
		}

		Modal.confirm({
			title: intl.formatMessage({ id: 'advisorAppointment.modal.leave.title' }),
			content: intl.formatMessage({ id: 'advisorAppointment.modal.leave.content' }),
			okText: intl.formatMessage({ id: 'advisorAppointment.modal.leave.ok' }),
			cancelText: intl.formatMessage({ id: 'advisorAppointment.modal.leave.cancel' }),
			onOk: onClose,
		});
	};

	const handleFinish = async (values: BookingFormValues) => {
		if (!slot || !advisingType) return;

		const payload: Advising.ICreateBookingRequest = {
			slotId: slot._id,
			advisingType,
			topic: values.topic.trim(),
		};

		await postModel(
			payload as never,
			() => {},
			true,
			intl.formatMessage({ id: 'advisorAppointment.modal.submitSuccess' }),
			'bookings',
		);
		onSuccess();
		onClose();
	};

	return (
		<Modal
			open={open}
			title={intl.formatMessage({ id: 'advisorAppointment.modal.title' })}
			onCancel={handleClose}
			footer={null}
			destroyOnHidden
		>
			{slot && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						marginBottom: 16,
						padding: '12px 16px',
						border: '1px solid #f0f0f0',
						borderRadius: 8,
						background: '#fafafa',
					}}
				>
					<div>
						<Typography.Text type='secondary'>
							{intl.formatMessage({ id: 'advisorAppointment.modal.advisor' })}:{' '}
						</Typography.Text>
						<strong>{slot.advisorName}</strong>
					</div>
					<div>
						<Typography.Text type='secondary'>
							{intl.formatMessage({ id: 'advisorAppointment.modal.time' })}:{' '}
						</Typography.Text>
						{formatDateTimeRange(slot.startAt, slot.endAt)}
					</div>
					<div>
						<Typography.Text type='secondary'>
							{intl.formatMessage({ id: 'advisorAppointment.modal.mode' })}:{' '}
						</Typography.Text>
						{intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[slot.mode] })}
					</div>
					{slot.location && (
						<div>
							<Typography.Text type='secondary'>
								{intl.formatMessage({
									id:
										slot.mode === 'ONLINE'
											? 'advisorAppointment.modal.meetingLink'
											: 'advisorAppointment.modal.location',
								})}
								:{' '}
							</Typography.Text>
							{slot.location}
						</div>
					)}
					{advisingType && (
						<div>
							<Typography.Text type='secondary'>
								{intl.formatMessage({ id: 'advisorAppointment.modal.advisingType' })}:{' '}
							</Typography.Text>
							{intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[advisingType] })}
						</div>
					)}
				</div>
			)}

			<Form form={form} layout='vertical' onFinish={handleFinish}>
				<Form.Item
					name='topic'
					label={intl.formatMessage({ id: 'advisorAppointment.modal.topicLabel' })}
					rules={[
						{ required: true, message: intl.formatMessage({ id: 'advisorAppointment.modal.topicRequired' }) },
						...rules.length(ADVISING_TOPIC_MAX_LENGTH),
					]}
				>
					<TextArea
						autoSize={{ minRows: 4, maxRows: 8 }}
						maxLength={ADVISING_TOPIC_MAX_LENGTH}
						placeholder={intl.formatMessage({ id: 'advisorAppointment.modal.topicPlaceholder' })}
					/>
				</Form.Item>

				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Button onClick={handleClose}>{intl.formatMessage({ id: 'advisorAppointment.modal.cancel' })}</Button>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'advisorAppointment.modal.submit' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default BookingModal;
