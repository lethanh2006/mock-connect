import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const normalizeThongTinLienHe = (value?: string) => value?.trim().toLowerCase();

const normalizeSoDienThoaiLienHe = (value?: string) => normalizeThongTinLienHe(value)?.replace(/\s+/g, '');

const FIELD_KIEM_TRA_TRUNG_LIEN_HE_KHAN_CAP = [
	{ key: 'emergencyContactName', normalize: normalizeThongTinLienHe },
	{ key: 'emergencyRelationship', normalize: normalizeThongTinLienHe },
	{ key: 'emergencyEmail', normalize: normalizeThongTinLienHe },
];

const FIELD_SO_DIEN_THOAI_LIEN_HE_KHAN_CAP = ['emergencyContactNumber', 'secondaryContactNumber'];

const FormNguoiThanKTX = (props: {
	onOk: (val: PhieuDangKyKTX.INguoiThan) => void;
	danhSachNguoiThan?: PhieuDangKyKTX.INguoiThan[];
}) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk, danhSachNguoiThan = [] } = props;
	const { setVisibleForm, visibleForm, record, edit, isView } = useModel('kytucxa.nguoithan');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?.index) form.setFieldsValue(record);
	}, [visibleForm, record?.index]);

	const onFinish = async (values: PhieuDangKyKTX.INguoiThan) => {
		onOk({ ...values });
	};

	const getDuplicateRule = (fieldName: keyof PhieuDangKyKTX.INguoiThan, label: string) => ({
		validator: (_: any, value?: string) => {
			if (FIELD_SO_DIEN_THOAI_LIEN_HE_KHAN_CAP.includes(fieldName)) {
				const normalizedValue = normalizeSoDienThoaiLienHe(value);

				if (!normalizedValue) return Promise.resolve();

				const fieldKhac = fieldName === 'emergencyContactNumber' ? 'secondaryContactNumber' : 'emergencyContactNumber';
				const trungTrongCungLienHe = normalizeSoDienThoaiLienHe(form.getFieldValue(fieldKhac)) === normalizedValue;
				const trungLienHeKhac = danhSachNguoiThan
					.filter((item) => item.index !== record?.index)
					.some((item: any) =>
						FIELD_SO_DIEN_THOAI_LIEN_HE_KHAN_CAP.some(
							(phoneField) => normalizeSoDienThoaiLienHe(item?.[phoneField]) === normalizedValue,
						),
					);

				if (trungTrongCungLienHe || trungLienHeKhac) {
					return Promise.reject(
						new Error(intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.validation.duplicate' }, { label })),
					);
				}

				return Promise.resolve();
			}

			const fieldConfig = FIELD_KIEM_TRA_TRUNG_LIEN_HE_KHAN_CAP.find((item) => item.key === fieldName);
			const normalizedValue = fieldConfig?.normalize(value);

			if (!normalizedValue) return Promise.resolve();

			const isDuplicate = danhSachNguoiThan
				.filter((item) => item.index !== record?.index)
				.some((item: any) => fieldConfig?.normalize(item?.[fieldName]) === normalizedValue);

			if (isDuplicate) {
				return Promise.reject(
					new Error(intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.validation.duplicate' }, { label })),
				);
			}

			return Promise.resolve();
		},
	});

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item
						name='emergencyContactName'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name' })}
						rules={[
							...rules.text,
							...rules.required,
							getDuplicateRule(
								'emergencyContactName',
								intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name' }),
							),
						]}
					>
						<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyRelationship'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship' })}
						rules={[
							...rules.required,
							getDuplicateRule(
								'emergencyRelationship',
								intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship' }),
							),
						]}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship.placeholder' })}
							options={[
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.father' }),
									value: 'Father',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.mother' }),
									value: 'Mother',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.guardian' }),
									value: 'Guardian',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.other' }),
									value: 'Other',
								},
							]}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyContactNumber'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone' })}
						dependencies={['secondaryContactNumber']}
						rules={[
							...rules.required,
							...rules.soDienThoai,
							getDuplicateRule(
								'emergencyContactNumber',
								intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone' }),
							),
						]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone.placeholder' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='secondaryContactNumber'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone' })}
						dependencies={['emergencyContactNumber']}
						rules={[
							...rules.soDienThoai,
							getDuplicateRule(
								'secondaryContactNumber',
								intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone' }),
							),
						]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone.placeholder' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyEmail'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email' })}
						rules={[
							...rules.text,
							...rules.email,
							...rules.length(255),
							getDuplicateRule('emergencyEmail', intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email' })),
						]}
					>
						<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='address'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.address' })}
						rules={[...rules.text, ...rules.required, ...rules.length(255)]}
					>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.address.placeholder' })}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView ? (
					<Button htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormNguoiThanKTX;
