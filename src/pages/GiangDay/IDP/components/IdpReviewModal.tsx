import { IdpStatus, type IdpReviewStatus } from '@/services/IdpCoVan/constant';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Input, Modal, Typography } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const COMMENT_MAX_LENGTH = 2000;

type IdpReviewModalProps = {
	status?: IdpReviewStatus;
	id: string;
	studentName?: string;
	onCancel: () => void;
	onSuccess?: () => void;
};

const IdpReviewModal: React.FC<IdpReviewModalProps> = ({ status, id, studentName, onCancel, onSuccess }) => {
	const intl = useIntl();
	const [form] = Form.useForm<Pick<IdpCoVan.IReviewPayload, 'comment'>>();
	const { reviewIdpModel, formSubmiting } = useModel('idp.covanidp');

	useEffect(() => {
		if (!status) resetFieldsForm(form);
	}, [status]);

	const isRequiredComment = !!status && status !== IdpStatus.APPROVED;

	const onFinish = async (values: { comment?: string }) => {
		if (!status) return;

		await reviewIdpModel(
			id,
			{ status, comment: values.comment?.trim() || undefined },
			intl.formatMessage({ id: `idpcovan.review.success.${status}` }),
		);
		onSuccess?.();
	};

	return (
		<Modal
			open={!!status}
			onCancel={onCancel}
			title={status ? intl.formatMessage({ id: `idpcovan.review.modalTitle.${status}` }) : ''}
			footer={null}
			maskClosable={false}
			destroyOnClose
		>
			<Typography.Paragraph type='secondary'>
				{status
					? intl.formatMessage({ id: `idpcovan.review.modalDescription.${status}` }, { name: studentName ?? '—' })
					: ''}
			</Typography.Paragraph>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='comment'
					label={intl.formatMessage({ id: `idpcovan.review.commentLabel.${status ?? IdpStatus.APPROVED}` })}
					rules={
						isRequiredComment
							? [...rules.required, ...rules.length(COMMENT_MAX_LENGTH)]
							: rules.length(COMMENT_MAX_LENGTH)
					}
				>
					<Input.TextArea
						rows={6}
						maxLength={COMMENT_MAX_LENGTH}
						placeholder={intl.formatMessage({
							id: `idpcovan.review.commentPlaceholder.${status ?? IdpStatus.APPROVED}`,
						})}
					/>
				</Form.Item>

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

export default IdpReviewModal;
