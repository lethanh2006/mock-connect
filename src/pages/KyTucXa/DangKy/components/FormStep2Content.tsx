import { Checkbox, Form, Typography } from 'antd';
import { useIntl } from 'umi';

interface FormStep2ContentProps {
	showCheckbox?: boolean; // true = show confirmTerms checkbox (create mode), false = hide (view mode)
}

const FormStep2Content = ({ showCheckbox = true }: FormStep2ContentProps) => {
	const intl = useIntl();

	return (
		<div className="ktx-step2-wrapper">
			<div className="ktx-register-section">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.section.commitments' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<div className="ktx-terms-content">
						<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.desc' })}</p>
						<ol className="ktx-terms-list">
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.1.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.1.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.2.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.2.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.3.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.3.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.4.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.4.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.5.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.5.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.6.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.6.content' })}
							</li>
							<li>
								<strong>{intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.7.title' })}:</strong> {intl.formatMessage({ id: 'kytucxa.dangky.form.commitments.7.content' })}
							</li>
						</ol>
					</div>
				</div>
			</div>

			<div className="ktx-register-section mt-4">
				<Typography.Title level={5} className="ktx-section-title-arrow">{intl.formatMessage({ id: 'kytucxa.dangky.form.step.waiver' })}</Typography.Title>
				<div className="ktx-register-section__content">
					<div className="ktx-terms-content">
						<p className="fw-500" style={{ marginBottom: 12 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.warning' })}</p>
						<ol className="ktx-terms-list">
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.1' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.2' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.3' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.4' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.5' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.6' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.7' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.8' })}</li>
							<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.waiver.9' })}</li>
						</ol>
					</div>
				</div>
			</div>

			{showCheckbox && (
				<div className="ktx-register-section mt-4">
					<div className="ktx-register-section__content">
						<Form.Item
							name="confirmTerms"
							valuePropName="checked"
							rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error(intl.formatMessage({ id: 'kytucxa.dangky.form.msg.mustAgree' }))) }]}
						>
							<Checkbox className="ktx-confirm-checkbox">
								<span className="ktx-confirm-text">
									{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmText' })}
								</span>
							</Checkbox>
						</Form.Item>
					</div>
				</div>
			)}
		</div>
	);
};

export default FormStep2Content;
