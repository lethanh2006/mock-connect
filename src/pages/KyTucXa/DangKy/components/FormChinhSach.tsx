import { Checkbox, Col, Divider, Form, FormInstance, Row } from 'antd';
import { useIntl } from 'umi';

const FormChinhSachKTX = (props: { form: FormInstance }) => {
	const intl = useIntl();

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					{intl.formatMessage({ id: 'kytucxa.dangky.chinchsach.section.commitments' })}
				</Divider>
			</Col>
			<Col span={24}>
				<div style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.intro' })}</div>
				<ol className='custom-ordered-list'>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item1' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item2' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item3' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item4' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item5' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item6' })}</li>
					<li>{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.commitments.item7' })}</li>
				</ol>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.section.liabilityWaiver' })}
				</Divider>
			</Col>
			<Col span={24}>
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
			</Col>

			<Col span={24}>
				<Form.Item name='checkbox2' valuePropName='checked'>
					<Checkbox>
						<div className='text-info'>
							{intl.formatMessage({ id: 'kytucxa.dangky.chinhsach.checkbox2.label' })}
						</div>
					</Checkbox>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormChinhSachKTX;
