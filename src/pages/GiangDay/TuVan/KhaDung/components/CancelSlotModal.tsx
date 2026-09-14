import type { TuVan } from '@/services/TuVan/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const REASON_MAX_LENGTH = 2000;

type CancelSlotModalProps = {
	record?: TuVan.ISlot;
	onCancel: () => void;
	onSuccess?: () => void;
};

/** Modal huỷ 1 ca tư vấn — `PUT advising/slots/:id/cancel`, bắt buộc nhập lý do (1-2000 ký tự). */
const CancelSlotModal: React.FC<CancelSlotModalProps> = ({ record, onCancel, onSuccess }) => {
	const intl = useIntl();
	const [form] = Form.useForm<{ reason: string }>();
	const { cancelSlotModel, formSubmiting } = useModel('tuvan.khadung');

	useEffect(() => {
		if (!record) resetFieldsForm(form);
	}, [record]);

	const onFinish = async (values: { reason: string }) => {
		if (!record) return;

		await cancelSlotModel(
			record._id,
			{ reason: values.reason.trim() },
			intl.formatMessage({ id: 'tuvan.cancelSlot.success' }),
		);
		onSuccess?.();
	};

	return (
		<Modal
			open={!!record}
			onCancel={onCancel}
			title={intl.formatMessage({ id: 'tuvan.cancelSlot.title' })}
			footer={null}
			maskClosable={false}
			destroyOnClose
		>
			<Typography.Paragraph type='secondary'>
				{intl.formatMessage({ id: 'tuvan.cancelSlot.description' })}
			</Typography.Paragraph>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='reason'
					label={intl.formatMessage({ id: 'tuvan.cancelSlot.reasonLabel' })}
					rules={[...rules.required, ...rules.length(REASON_MAX_LENGTH)]}
				>
					<Input.TextArea
						rows={4}
						maxLength={REASON_MAX_LENGTH}
						placeholder={intl.formatMessage({ id: 'tuvan.cancelSlot.reasonPlaceholder' })}
					/>
				</Form.Item>

				<div className='form-footer'>
					<Button type='primary' danger htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'tuvan.cancelSlot.confirm' })}
					</Button>
					<Button onClick={onCancel} disabled={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CancelSlotModal;
