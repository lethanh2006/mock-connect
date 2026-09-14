import {
	ADVISOR_CHANGE_REASON_MAX_LENGTH,
	ADVISOR_CHANGE_REASON_MIN_LENGTH,
	ADVISOR_TYPE_LABEL_KEY,
	EAdvisorType,
} from '@/services/AdvisorChange/constant';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import rules from '@/utils/rules';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Modal, Segmented, Typography } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAdvisor from './SelectAdvisor';

const { TextArea } = Input;

type AdvisorChangeFormValues = {
	reason: string;
	toAdvisorSsoId: string;
};

type AdvisorChangeFormProps = {
	/**
	 * Loại cố vấn đang yêu cầu đổi — 1 sinh viên có thể có cả `FACULTY_ADVISOR` lẫn `PEER_ADVISOR`.
	 * Optional chỉ để khớp kiểu `React.FC<{}>` của prop `Form` bên `TableBase` — thực tế luôn được
	 * `AdvisorChangePage` truyền vào trước khi mở form.
	 */
	advisorType?: EAdvisorType;
	/** Các loại cố vấn còn được phép chọn (chưa có yêu cầu đang chờ duyệt) — hiện thành toggle trong modal. */
	availableTypes?: EAdvisorType[];
	/** Báo về `AdvisorChangePage` khi người dùng đổi toggle, để cập nhật `currentAdvisorName`/`maNganh` theo loại mới. */
	onTypeChange?: (type: EAdvisorType) => void;
	/** Cố vấn đang phụ trách (đúng `advisorType`) — từ `GET /student/me/advisor`. */
	currentAdvisorName?: string;
	/** SSO ID của cố vấn đang phụ trách — dùng để chặn chọn lại đúng cố vấn hiện tại, không so theo tên. */
	currentAdvisorSsoId?: string;
	/** Ngành của sinh viên — để liệt kê cố vấn cùng ngành. */
	maNganh?: string;
	/** Tải lại danh sách sau khi gửi. */
	onSuccess?: () => void;
};

const AdvisorChangeForm: React.FC<AdvisorChangeFormProps> = ({
	advisorType,
	availableTypes,
	onTypeChange,
	currentAdvisorName,
	currentAdvisorSsoId,
	maNganh,
	onSuccess,
}) => {
	const intl = useIntl();
	const { setVisibleForm, postModel, formSubmiting } = useModel('advisorChange.advisorChange');
	const [form] = Form.useForm<AdvisorChangeFormValues>();
	const [selectedAdvisorName, setSelectedAdvisorName] = useState<string>();

	/** Đổi loại cố vấn: reset cố vấn mong muốn vì danh sách gợi ý (`SelectAdvisor`) lọc theo `type`. */
	const handleTypeChange = (type: EAdvisorType) => {
		form.setFieldValue('toAdvisorSsoId', undefined);
		setSelectedAdvisorName(undefined);
		onTypeChange?.(type);
	};

	const handleFinish = async (values: AdvisorChangeFormValues) => {
		const payload: AdvisorChange.ICreateRequest = {
			// Luôn được `AdvisorChangePage` truyền vào trước khi mở form — xem chú thích ở prop.
			type: advisorType!,
			reason: values.reason.trim(),
			toAdvisorSsoId: values.toAdvisorSsoId,
			toAdvisorName: selectedAdvisorName,
		};
		// Tham số cuối là phần đuôi của base url `student/me` (xem model).
		await postModel(
			payload as never,
			onSuccess,
			undefined,
			intl.formatMessage({ id: 'idp.advisorChange.form.submitSuccess' }),
			'change-request-advisor',
		);
	};

	const handleCancel = () => {
		if (!form.isFieldsTouched()) {
			setVisibleForm(false);
			return;
		}

		Modal.confirm({
			title: intl.formatMessage({ id: 'idp.advisorChange.form.leave.title' }),
			content: intl.formatMessage({ id: 'idp.advisorChange.form.leave.content' }),
			okText: intl.formatMessage({ id: 'idp.advisorChange.form.leave.ok' }),
			cancelText: intl.formatMessage({ id: 'idp.advisorChange.form.leave.cancel' }),
			onOk: () => setVisibleForm(false),
		});
	};

	return (
		<Form form={form} layout='vertical' onFinish={handleFinish}>
			{advisorType && (
				<Form.Item label={intl.formatMessage({ id: 'idp.advisorChange.form.typeLabel' })}>
					{availableTypes && availableTypes.length > 1 ? (
						<Segmented
							block
							value={advisorType}
							onChange={(val) => handleTypeChange(val as EAdvisorType)}
							options={availableTypes.map((type) => ({
								label: intl.formatMessage({ id: ADVISOR_TYPE_LABEL_KEY[type] }),
								value: type,
							}))}
						/>
					) : (
						<Typography.Text strong>{intl.formatMessage({ id: ADVISOR_TYPE_LABEL_KEY[advisorType] })}</Typography.Text>
					)}
				</Form.Item>
			)}

			<Alert
				style={{ marginBottom: 16 }}
				type='info'
				showIcon
				message={intl.formatMessage({ id: 'idp.advisorChange.form.alert' })}
			/>

			{/* Màn hẹp / tên cố vấn dài: cho xuống dòng thay vì tràn khối. */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					gap: 12,
					marginBottom: 16,
					padding: '12px 16px',
					border: '1px solid #f0f0f0',
					borderRadius: 8,
					background: '#fafafa',
				}}
			>
				<div style={{ flex: '1 1 160px', minWidth: 0, overflowWrap: 'anywhere' }}>
					<Typography.Text type='secondary' style={{ fontSize: 12 }}>
						{intl.formatMessage({ id: 'idp.advisorChange.currentAdvisorLabel' })}
					</Typography.Text>
					<div>{currentAdvisorName ?? '—'}</div>
				</div>

				<ArrowRightOutlined style={{ flex: '0 0 auto', color: '#8c8c8c' }} />

				<div style={{ flex: '1 1 160px', minWidth: 0, overflowWrap: 'anywhere' }}>
					<Typography.Text type='secondary' style={{ fontSize: 12 }}>
						{intl.formatMessage({ id: 'idp.advisorChange.form.desiredAdvisor' })}
					</Typography.Text>
					<div>
						{selectedAdvisorName ? (
							<strong>{selectedAdvisorName}</strong>
						) : (
							<Typography.Text type='secondary'>
								{intl.formatMessage({ id: 'idp.advisorChange.form.notSelected' })}
							</Typography.Text>
						)}
					</div>
				</div>
			</div>

			<Form.Item
				name='toAdvisorSsoId'
				label={intl.formatMessage({ id: 'idp.advisorChange.form.desiredAdvisor' })}
				rules={[
					{ required: true, message: intl.formatMessage({ id: 'idp.advisorChange.form.advisorRequired' }) },
					{
						// So theo SSO ID (định danh duy nhất) thay vì tên — tránh bị bypass khi 2 cố vấn trùng tên chuẩn hoá.
						validator: (_rule, value: string | undefined) =>
							value && currentAdvisorSsoId && value === currentAdvisorSsoId
								? Promise.reject(new Error(intl.formatMessage({ id: 'idp.advisorChange.form.advisorDuplicated' })))
								: Promise.resolve(),
					},
				]}
			>
				<SelectAdvisor
					maNganh={maNganh}
					condition={{ type: advisorType }}
					allowClear
					onChange={(_val, option) => setSelectedAdvisorName(option?.rawData?.advisorName)}
				/>
			</Form.Item>

			<Form.Item
				name='reason'
				label={intl.formatMessage({ id: 'idp.advisorChange.form.reasonLabel' })}
				extra={intl.formatMessage(
					{ id: 'idp.advisorChange.form.reasonExtra' },
					{ min: ADVISOR_CHANGE_REASON_MIN_LENGTH, max: ADVISOR_CHANGE_REASON_MAX_LENGTH },
				)}
				rules={[
					...rules.required,
					{
						min: ADVISOR_CHANGE_REASON_MIN_LENGTH,
						message: intl.formatMessage(
							{ id: 'idp.advisorChange.form.reasonMin' },
							{ min: ADVISOR_CHANGE_REASON_MIN_LENGTH },
						),
					},
					...rules.length(ADVISOR_CHANGE_REASON_MAX_LENGTH),
				]}
			>
				<TextArea autoSize={{ minRows: 4, maxRows: 8 }} maxLength={ADVISOR_CHANGE_REASON_MAX_LENGTH} />
			</Form.Item>

			<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
				<Button onClick={handleCancel}>{intl.formatMessage({ id: 'idp.advisorChange.form.cancel' })}</Button>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					{intl.formatMessage({ id: 'idp.advisorChange.form.submit' })}
				</Button>
			</div>
		</Form>
	);
};

export default AdvisorChangeForm;
