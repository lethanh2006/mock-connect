import { Col, Row } from '@/components/MyGrid';
import { Checkbox, Divider, Form, FormInstance } from 'antd';
import { useIntl } from 'umi';

const commitmentItems = [
	'kytucxa.dangky.chinhsach.commitments.item1',
	'kytucxa.dangky.chinhsach.commitments.item2',
	'kytucxa.dangky.chinhsach.commitments.item3',
	'kytucxa.dangky.chinhsach.commitments.item4',
	'kytucxa.dangky.chinhsach.commitments.item5',
	'kytucxa.dangky.chinhsach.commitments.item6',
	'kytucxa.dangky.chinhsach.commitments.item7',
];

const renderBoldPrefix = (text: string) => {
	const separatorIndex = text.indexOf(':');
	if (separatorIndex === -1) return text;

	return (
		<>
			<b>{text.slice(0, separatorIndex + 1)}</b>
			{text.slice(separatorIndex + 1)}
		</>
	);
};

const FormChinhSachKTX = (props: { form: FormInstance; disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
					{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.section.commitments' })}
				</Divider>
			</Col>
			<Col span={24}>
				<div className='check-in-prep-content'>
					<div style={{ marginBottom: 4 }}>
						{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.intro' })}
					</div>
					<ol className='custom-ordered-list'>
						{commitmentItems.map((id) => (
							<li key={id}>{renderBoldPrefix(intl.formatMessage({ id }))}</li>
						))}
					</ol>
				</div>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
					{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.section.liabilityWaiver' })}
				</Divider>
			</Col>
			<Col span={24}>
				<div className='check-in-prep-content'>
					<div style={{ marginBottom: 4, color: '#707070' }}>
						{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.legalWarning' })}
					</div>
					<ol style={{ paddingLeft: 16, margin: 0 }}>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item1' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item2' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item3' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item4' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item5' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item6' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item7' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item8' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.liability.item9' })}</li>
					</ol>
				</div>
			</Col>

			<Col span={24}>
				<Form.Item name='checkbox2' valuePropName='checked'>
					<Checkbox disabled={disabled}>
						<div className='text-info'>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.checkbox2.label' })}</div>
					</Checkbox>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormChinhSachKTX;
