import { Checkbox, Col, Form, Input, Row, Typography, Switch } from 'antd';
import { useIntl } from 'umi';
import TableEmergencyContactKTX from '../TableEmergencyContact';
import rules from '@/utils/rules';
import UploadFile from '@/components/Upload/UploadFile';

const { TextArea } = Input;

import ReactMarkdown from 'react-markdown';

interface FormStep1ContentProps {
	disabled?: boolean;
	showCheckbox?: boolean;
	onReload?: () => Promise<void>;
	policyText?: string;
}

const FormStep1Content: React.FC<FormStep1ContentProps> = (props) => {
	const { disabled, showCheckbox, onReload, policyText } = props;
	const intl = useIntl();

	const nationality = Form.useWatch('nationality');
	const haveHealthInsurance = Form.useWatch('haveHealthInsurance');
	const hasSpecialCondition = Form.useWatch('hasSpecialCondition');

	const isVietnam = !nationality || 
		nationality.toString().toLowerCase().includes('việt nam') || 
		nationality.toString().toLowerCase().includes('vietnam') || 
		nationality.toString().toLowerCase().includes('viet nam');

	const isHtml = policyText && /<[a-z][\s\S]*>/i.test(policyText);

	return (
		<>
			<div className="ktx-register-section">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.terms' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<div className="ktx-terms-content">
						{policyText ? (
							isHtml ? (
								<div dangerouslySetInnerHTML={{ __html: policyText }} />
							) : (
								<ReactMarkdown>{policyText}</ReactMarkdown>
							)
						) : (
							<ol className="ktx-terms-list">
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.1' })}</li>
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.2' })}</li>
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.3' })}</li>
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.4' })}</li>
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.5' })}</li>
								<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.6' })}</li>
							</ol>
						)}
					</div>
				</div>
			</div>

			<div className="ktx-register-section">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.studentInfo' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item name="fullName" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="studentId" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="dateOfBirth" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="gender" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="email" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' })} rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="phoneNumber" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber' })} rules={[...rules.required]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="program" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })} rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="college" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })} rules={[{ required: true }]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="identityNumber" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber' })} rules={[...rules.required]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item name="dateOfIssue" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue' })} rules={[...rules.required]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={24}>
							<Form.Item name="placeOfIssue" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue' })} rules={[...rules.required]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item name="nationality" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality' })} rules={[...rules.required]}>
								<Input disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={24}>
							<Form.Item name="permanentHomeAddress" label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress' })} rules={[...rules.required]}>
								<TextArea rows={2} disabled />
							</Form.Item>
						</Col>

						{isVietnam ? (
							<>
								<Col xs={24} md={12}>
									<Form.Item
										name="identityCardFrontUrl"
										label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityCardFront' }, { defaultMessage: 'Mặt trước CCCD' })}
										rules={[{ required: true, message: intl.formatMessage({ id: 'kytucxa.dangky.form.msg.identityCardFrontRequired' }, { defaultMessage: 'Vui lòng tải lên ảnh mặt trước CCCD' }) }]}
									>
										<UploadFile disabled={disabled} maxCount={1} accept=".pdf,.png,.jpg,.jpeg" maxFileSize={5} />
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item
										name="identityCardBackUrl"
										label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityCardBack' }, { defaultMessage: 'Mặt sau CCCD' })}
										rules={[{ required: true, message: intl.formatMessage({ id: 'kytucxa.dangky.form.msg.identityCardBackRequired' }, { defaultMessage: 'Vui lòng tải lên ảnh mặt sau CCCD' }) }]}
									>
										<UploadFile disabled={disabled} maxCount={1} accept=".pdf,.png,.jpg,.jpeg" maxFileSize={5} />
									</Form.Item>
								</Col>
							</>
						) : (
							<Col xs={24} md={12}>
								<Form.Item
									name="passportUrl"
									label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.passport' }, { defaultMessage: 'Ảnh hộ chiếu' })}
									rules={[{ required: true, message: intl.formatMessage({ id: 'kytucxa.dangky.form.msg.passportRequired' }, { defaultMessage: 'Vui lòng tải lên ảnh hộ chiếu' }) }]}
								>
									<UploadFile disabled={disabled} maxCount={1} accept=".pdf,.png,.jpg,.jpeg" maxFileSize={5} />
								</Form.Item>
							</Col>
						)}

						<Col xs={24} md={12}>
							<Form.Item
								name="haveHealthInsurance"
								valuePropName="checked"
								label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.haveHealthInsurance' }, { defaultMessage: 'Bạn có bảo hiểm y tế không?' })}
							>
								<Switch disabled={disabled} />
							</Form.Item>
						</Col>

						{haveHealthInsurance && (
							<Col xs={24} md={12}>
								<Form.Item
									name="healthInsuranceFile"
									label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.healthInsuranceFile' }, { defaultMessage: 'Ảnh thẻ bảo hiểm y tế' })}
									rules={[{ required: true, message: intl.formatMessage({ id: 'kytucxa.dangky.form.msg.healthInsuranceFileRequired' }, { defaultMessage: 'Vui lòng tải lên ảnh thẻ bảo hiểm y tế' }) }]}
								>
									<UploadFile disabled={disabled} maxCount={1} accept=".pdf,.png,.jpg,.jpeg" maxFileSize={5} />
								</Form.Item>
							</Col>
						)}

						<Col xs={24} md={12}>
							<Form.Item
								name="hasSpecialCondition"
								valuePropName="checked"
								label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.hasSpecialCondition' }, { defaultMessage: 'Bạn có bệnh lý hoặc hoàn cảnh đặc biệt không?' })}
							>
								<Switch disabled={disabled} />
							</Form.Item>
						</Col>

						{hasSpecialCondition && (
							<Col xs={24} md={24}>
								<Form.Item
									name="conditionDetails"
									label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.conditionDetails' }, { defaultMessage: 'Chi tiết bệnh lý / hoàn cảnh đặc biệt' })}
									rules={[...rules.required]}
								>
									<TextArea rows={2} disabled={disabled} placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.placeholder.conditionDetails' }, { defaultMessage: 'Nhập thông tin chi tiết...' })} />
								</Form.Item>
							</Col>
						)}
					</Row>
				</div>
			</div>

			<div className="ktx-register-section mt-4">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.emergencyContact' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<Form.Item
						name="emergencyContacts"
						rules={showCheckbox ? [
							{
								validator: (_, value) => {
									if (!value || value.length < 2) {
										return Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.table.emergencyContact.msg.min2Contacts' })));
									}
									const isInvalid = value.some((item: any) => {
										const name = item?.emergencyContactName?.trim();
										const relationship = item?.emergencyRelationship?.trim();
										const number = item?.emergencyContactNumber?.trim();
										const addr = item?.address?.trim();

										return !name || name === '-' ||
											!relationship || relationship === '-' ||
											!number || number === '-' ||
											!addr || addr === '-';
									});
									if (isInvalid) {
										return Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.emergencyContactsRequired' })));
									}
									return Promise.resolve();
								}
							}
						] : []}
					>
						<TableEmergencyContactKTX disabled={disabled} onReload={onReload} />
					</Form.Item>
				</div>
			</div>

			<div className="ktx-register-section mt-4">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.privacyPolicy' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<div className="ktx-terms-content">
						<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.desc' })}</p>
						<ol className="ktx-terms-list">
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.1' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.2' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.3' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.4' })}</li>
						</ol>
					</div>
				</div>
			</div>

			{showCheckbox && (
				<div className="ktx-register-section mt-4">
					<div className="ktx-register-section__content">
						<Form.Item name="confirmInfo" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.mustAgree' }))) }]}>
							<Checkbox className="ktx-confirm-checkbox ktx-confirm-checkbox-step1">
								<span className="ktx-confirm-text">
									{intl.formatMessage({ id: 'kytucxa.dangky.form.privacy.confirmText' })}
								</span>
							</Checkbox>
						</Form.Item>
					</div>
				</div>
			)}
		</>
	);
};

export default FormStep1Content;
