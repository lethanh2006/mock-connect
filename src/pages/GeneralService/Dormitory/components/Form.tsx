import rules from '@/utils/rules';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { useIntl } from 'umi';

const FormDormitory = () => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const onFinish = async (values: any) => {};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical'>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
						Accommodation Terms & Conditions
					</Divider>
				</Col>

				<Col span={24}>
					<p>1. Rooms are assigned on a first-come, first-served basis.</p>
					<p>2. Any changes after moving in must be communicated to the Residential Officers for review.</p>
					<p>
						3. Residents are required to adhere to all accommodation terms and conditions outlined in the Code of
						Conduct.
					</p>
					<p>4. Residents must take care of their personal belongings while living in the Accommodation.</p>
					<p>
						5. Each student will have to pay an additional deposit equivalent to one month's rent at the Accommodation.
					</p>
					<p>6. This amount will be used to offset any additional costs or penalties (if applicable).</p>
					<p>
						7. Fees are non-refundable if a student leaves the Accommodation for subjective reasons, including
						disciplinary actions from the school.
					</p>
				</Col>

				<Col span={24}>
					<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
						STUDENT INFORMATION
					</Divider>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='name' label='Full name' rules={[...rules.required]}>
						<Input placeholder='Full name' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='id' label='Student ID#' rules={[...rules.required]}>
						<Input placeholder='Student ID#' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='dob' label='Date of Birth' rules={[...rules.required]}>
						<Input placeholder='Date of Birth' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='gender' label='Gender' rules={[...rules.required]}>
						<Input placeholder='Gender' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='email' label='Email' rules={[...rules.required]}>
						<Input placeholder='Email' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='number' label='Phone Number' rules={[...rules.required]}>
						<Input placeholder='Phone Number' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='apid' label='APID' rules={[...rules.required]}>
						<Input placeholder='APID' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='college' label='College' rules={[...rules.required]}>
						<Input placeholder='College' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='nation' label='Nationality' rules={[...rules.required]}>
						<Input placeholder='Nationality' />
					</Form.Item>
				</Col>

				<Col span={24} md={12}>
					<Form.Item name='other' label='Others' rules={[...rules.required]}>
						<Input placeholder='Others' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='home' label='Permanent Home Address' rules={[...rules.required]}>
						<Input.TextArea rows={3} placeholder='Permanent Home Address' />
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{intl.formatMessage({ id: 'global.button.luulai' })}
				</Button>
				<Button>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormDormitory;
