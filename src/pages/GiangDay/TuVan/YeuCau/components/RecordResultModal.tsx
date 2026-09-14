import type { TuVan } from '@/services/TuVan/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Modal, Radio, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const TEXT_MAX_LENGTH = 2000;

type RecordResultFormValues = {
	attended: boolean;
	objective?: string;
	outcome?: string;
	nextStep?: string;
};

type RecordResultModalProps = {
	record?: TuVan.IBooking;
	onCancel: () => void;
	onSuccess?: () => void;
};

/**
 * Modal ghi nhận kết quả 1 buổi tư vấn — `PUT advising/bookings/:id/result`.
 * `attended=true` → bắt buộc đủ mục tiêu/kết quả/bước tiếp theo. `attended=false` → bỏ trống cả 3.
 */
const RecordResultModal: React.FC<RecordResultModalProps> = ({ record, onCancel, onSuccess }) => {
	const intl = useIntl();
	const [form] = Form.useForm<RecordResultFormValues>();
	const { recordResultModel, formSubmiting } = useModel('tuvan.yeucau');
	const attended = Form.useWatch('attended', form) ?? true;

	useEffect(() => {
		if (!record) resetFieldsForm(form);
	}, [record]);

	const onFinish = async (values: RecordResultFormValues) => {
		if (!record) return;

		const payload: TuVan.IRecordResultRequest = values.attended
			? {
					attended: true,
					objective: values.objective?.trim(),
					outcome: values.outcome?.trim(),
					nextStep: values.nextStep?.trim(),
				}
			: { attended: false };

		await recordResultModel(record._id, payload, intl.formatMessage({ id: 'tuvan.recordResult.success' }));
		onSuccess?.();
	};

	return (
		<Modal
			open={!!record}
			onCancel={onCancel}
			title={intl.formatMessage({ id: 'tuvan.recordResult.title' })}
			footer={null}
			maskClosable={false}
			destroyOnClose
		>
			<Typography.Paragraph type='secondary'>
				{intl.formatMessage({ id: 'tuvan.recordResult.description' }, { name: record?.studentName ?? '—' })}
			</Typography.Paragraph>

			<Form form={form} layout='vertical' onFinish={onFinish} initialValues={{ attended: true }}>
				<Form.Item
					name='attended'
					label={intl.formatMessage({ id: 'tuvan.recordResult.attendedLabel' })}
					rules={rules.required}
				>
					<Radio.Group
						optionType='button'
						options={[
							{ label: intl.formatMessage({ id: 'tuvan.recordResult.attendedYes' }), value: true },
							{ label: intl.formatMessage({ id: 'tuvan.recordResult.attendedNo' }), value: false },
						]}
					/>
				</Form.Item>

				{attended && (
					<>
						<Form.Item
							name='objective'
							label={intl.formatMessage({ id: 'tuvan.detail.objective' })}
							rules={[...rules.required, ...rules.length(TEXT_MAX_LENGTH)]}
						>
							<Input.TextArea rows={2} maxLength={TEXT_MAX_LENGTH} />
						</Form.Item>
						<Form.Item
							name='outcome'
							label={intl.formatMessage({ id: 'tuvan.detail.outcome' })}
							rules={[...rules.required, ...rules.length(TEXT_MAX_LENGTH)]}
						>
							<Input.TextArea rows={2} maxLength={TEXT_MAX_LENGTH} />
						</Form.Item>
						<Form.Item
							name='nextStep'
							label={intl.formatMessage({ id: 'tuvan.detail.nextStep' })}
							rules={[...rules.required, ...rules.length(TEXT_MAX_LENGTH)]}
						>
							<Input.TextArea rows={2} maxLength={TEXT_MAX_LENGTH} />
						</Form.Item>
					</>
				)}

				<div className='form-footer'>
					<Button type='primary' htmlType='submit' loading={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.xacnhan' })}
					</Button>
					<Button onClick={onCancel} disabled={formSubmiting}>
						{intl.formatMessage({ id: 'global.button.huy' })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default RecordResultModal;
