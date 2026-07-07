import MyDatePicker from '@/components/MyDatePicker';
import { Checkbox, Col, Divider, Form, FormInstance, Input, Row } from 'antd';
import FormItemNguoiThanKTX from '../NguoiThan/FormItem';

const FormDangKyKTX = (props: { form: FormInstance }) => {
	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					Accommodation Terms & Conditions
				</Divider>
			</Col>
			<Col span={24}>
				<div>1. Rooms are assigned on a first-come, first-served basis.</div>
				<div>2. Any changes after moving in must be communicated to the Residential Officers for review.</div>
				<div>
					3. Residents are required to adhere to all accommodation terms and conditions outlined in the Code of Conduct.
				</div>
				<div>4. Residents must take care of their personal belongings while living in the dormitory.</div>
				<div>
					5. Each student will have to pay an additional deposit equivalent to one month's rent at the dormitory. This
					amount will be used to offset any additional costs or penalties (if applicable).
				</div>
				<div>
					6. Fees are non-refundable if a student leaves the dormitory for subjective reasons, including disciplinary
					actions from the school.
				</div>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					Student Information
				</Divider>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='fullName' label='Full Name'>
					<Input placeholder='Full Name' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='studentId' label='Student ID'>
					<Input placeholder='Student ID' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='dateOfBirth' label='Date of Birth'>
					<MyDatePicker placeholder='Date of Birth' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='gender' label='Gender'>
					<Input placeholder='Gender' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='email' label='Email'>
					<Input placeholder='Enter Email' />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='phoneNumber' label='Phone Number'>
					<Input placeholder='Enter Phone Number' />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='program' label='Program'>
					<Input placeholder='Program' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='college' label='College'>
					<Input placeholder='College' disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='identityNumber' label='ID or Passport No.'>
					<Input placeholder='Enter ID or Passport No.' />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='dateOfIssue' label='Date of issue'>
					<MyDatePicker placeholder='Select date of issue' />
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item name='placeOfIssue' label='Place of issue'>
					<Input placeholder='Enter place of issue' />
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item name='nationality' label='Nationality'>
					<Input placeholder='Enter nationality' />
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item name='permanentHomeAddress' label='Permanent Home Address'>
					<Input.TextArea rows={2} placeholder='Enter permanent home address' />
				</Form.Item>
			</Col>

			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					Emergency Contact Information
				</Divider>
			</Col>

			<Col span={24}>
				<Form.Item name='emergencyContacts'>
					<FormItemNguoiThanKTX />
				</Form.Item>
			</Col>
			<Col span={24}>
				<div>By proceeding with this registration, I acknowledge and confirm that:</div>
				<div>
					1. All personal information provided above is accurate, complete, and up-to-date. I am responsible for
					promptly notifying the Residential Office of any changes during my stay.
				</div>
				<div>2. I have read and understood the Accommodation Terms & Conditions stated above.</div>
				<div>
					3. I consent to VinUniversity collecting, storing, and processing my personal data (including emergency
					contact information) for the purposes of dormitory management, safety, and emergency response, in accordance
					with the University's Data Privacy Policy.
				</div>
				<div>
					4. I understand that providing false or misleading information may result in the cancellation of my dormitory
					registration and disciplinary action under the Student Code of Conduct.
				</div>
			</Col>

			<Col span={24}>
				<Form.Item name='checkbox1' valuePropName='checked'>
					<Checkbox>
						<div className='text-info'>I have read and agree to the above</div>
					</Checkbox>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormDangKyKTX;
