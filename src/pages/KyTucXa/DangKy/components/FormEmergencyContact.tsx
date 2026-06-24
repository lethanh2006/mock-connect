import { Button, Form, Input, Modal, Select } from 'antd';
import { useIntl } from 'umi';
import { useEffect } from 'react';
import rules from '@/utils/rules';

export interface EmergencyContact {
	id?: string;
	emergencyContactName: string;
	emergencyRelationship: string;
	emergencyContactNumber: string;
	secondaryContactNumber?: string;
	emergencyEmail?: string;
	address: string;
}

interface FormEmergencyContactProps {
	visible: boolean;
	onClose: () => void;
	onSave: (data: EmergencyContact) => void;
	initialData?: EmergencyContact | null;
}

const FormEmergencyContactKTX: React.FC<FormEmergencyContactProps> = ({
	visible,
	onClose,
	onSave,
	initialData,
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();

	useEffect(() => {
		if (visible && initialData) {
			const sanitizedData = { ...initialData };
			Object.keys(sanitizedData).forEach((key) => {
				const val = sanitizedData[key as keyof EmergencyContact];
				if (val === '-') {
					(sanitizedData as any)[key] = undefined;
				}
			});
			form.setFieldsValue(sanitizedData);
		} else if (visible && !initialData) {
			form.resetFields();
		}
	}, [visible, initialData, form]);

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			onSave({ ...initialData, ...values });
			form.resetFields();
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleClose = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			title={intl.formatMessage({ id: 'kytucxa.dangky.form.emergencyContact.title' })}
			open={visible}
			onCancel={handleClose}
			footer={
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
					<Button onClick={handleClose}>
						{intl.formatMessage({ id: 'kytucxa.dangky.form.close' })}
					</Button>
					<Button type="primary" onClick={handleSave}>
						{intl.formatMessage({ id: 'kytucxa.dangky.form.save' })}
					</Button>
				</div>
			}
			destroyOnClose
			width={600}
		>
			<Form form={form} layout="vertical" className="mt-4">
				<Form.Item 
					name="emergencyContactName" 
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyContactName' })} 
					rules={[
						...rules.required,
						{ max: 250, message: intl.formatMessage({ id: 'global.validation.length.max' }, { len: 250 }) }
					]}
				>
					<Input maxLength={251} placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.emergencyContactName' })} />
				</Form.Item>

				<Form.Item name="emergencyRelationship" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyRelationship' })} rules={[...rules.required]}>
					<Select placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.emergencyRelationship' })}>
						<Select.Option value={intl.formatMessage({ id: 'kytucxa.dangky.form.option.father' })}>{intl.formatMessage({ id: 'kytucxa.dangky.form.option.father' })}</Select.Option>
						<Select.Option value={intl.formatMessage({ id: 'kytucxa.dangky.form.option.mother' })}>{intl.formatMessage({ id: 'kytucxa.dangky.form.option.mother' })}</Select.Option>
						<Select.Option value={intl.formatMessage({ id: 'kytucxa.dangky.form.option.guardian' })}>{intl.formatMessage({ id: 'kytucxa.dangky.form.option.guardian' })}</Select.Option>
						<Select.Option value={intl.formatMessage({ id: 'kytucxa.dangky.form.option.other' })}>{intl.formatMessage({ id: 'kytucxa.dangky.form.option.other' })}</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item 
					name="emergencyContactNumber" 
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.emergencyContactNumber' })} 
					rules={[
						...rules.required,
						{ pattern: /^\d{10}$/, message: intl.formatMessage({ id: 'global.validation.soDienThoai.invalid' }) }
					]}
				>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.emergencyContactNumber' })} maxLength={10} />
				</Form.Item>

				<Form.Item 
					name="secondaryContactNumber" 
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.secondaryContactNumber' })}
					rules={[
						{ pattern: /^\d{10}$/, message: intl.formatMessage({ id: 'global.validation.soDienThoai.invalid' }) }
					]}
				>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.secondaryContactNumber' })} maxLength={10} />
				</Form.Item>

				<Form.Item 
					name="emergencyEmail" 
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' })} 
					rules={[
						{ type: 'email', message: intl.formatMessage({ id: 'global.validation.email.invalid' }) },
						{ max: 250, message: intl.formatMessage({ id: 'global.validation.length.max' }, { len: 250 }) },
						{ pattern: /^[^\s]+$/, message: intl.formatMessage({ id: 'global.validation.email.invalid' }) }
					]}
				>
					<Input maxLength={251} placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.email' })} />
				</Form.Item>

				<Form.Item 
					name="address" 
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.address' })} 
					rules={[
						...rules.required,
						{ max: 250, message: intl.formatMessage({ id: 'global.validation.length.max' }, { len: 250 }) }
					]}
				>
					<Input.TextArea maxLength={251} rows={2} placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.address' })} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormEmergencyContactKTX;
