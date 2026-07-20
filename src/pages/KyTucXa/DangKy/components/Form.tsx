import MyDatePicker from '@/components/MyDatePicker';
import { Checkbox, Col, Divider, Form, FormInstance, Input, Radio, Row, Space } from 'antd';
import { useIntl } from 'umi';
import FormItemNguoiThanKTX, {
	chuanHoaDanhSachLienHeKhanCap,
	coThongTinLienHeBiTrung,
	isDuThongTinLienHeKhanCap,
	SO_LIEN_HE_KHAN_CAP_MAC_DINH,
} from '../NguoiThan/FormItem';

const FormDangKyKTX = (props: { form: FormInstance; disabled?: boolean }) => {
	const intl = useIntl();
	const { disabled } = props;

	return (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
					{intl.formatMessage({ id: 'kytucxa.dangky.form.section.termsConditions' })}
				</Divider>
			</Col>
			<Col span={24}>
				<div className='check-in-prep-content'>
					<ol style={{ paddingLeft: 16, margin: 0 }}>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item1' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item2' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item3' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item4' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item5' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.terms.item6' })}</li>
					</ol>
				</div>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
					{intl.formatMessage({ id: 'kytucxa.dangky.form.section.studentInfo' })}
				</Divider>
			</Col>
			<Col span={24} md={12}>
				<Form.Item name='fullName' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='studentId' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='dateOfBirth' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })}>
					<MyDatePicker placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='gender' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='email' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email.placeholder' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='phoneNumber' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber' })}>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber.placeholder' })}
						disabled
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='program' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='college' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })}>
					<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })} disabled />
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='identityNumber' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber' })}>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber.placeholder' })}
						disabled
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item name='dateOfIssue' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue' })}>
					<MyDatePicker
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue.placeholder' })}
						disabled
					/>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item name='placeOfIssue' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue' })}>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue.placeholder' })}
						disabled
					/>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item name='nationality' label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality' })}>
					<Radio.Group disabled>
						<Space direction='horizontal'>
							<Radio value='Việt Nam'>{intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality.vn' })}</Radio>
							<Radio value='Quốc tế'>{intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality.intl' })}</Radio>
						</Space>
					</Radio.Group>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item
					name='permanentHomeAddress'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress' })}
				>
					<Input.TextArea
						rows={2}
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress.placeholder' })}
						disabled
					/>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }} dashed>
					{intl.formatMessage({ id: 'kytucxa.dangky.form.section.emergencyContact' })}
				</Divider>
			</Col>

			<Col span={24}>
				<Form.Item
					name='emergencyContacts'
					rules={[
						{
							validator: (_, value) => {
								const danhSach = chuanHoaDanhSachLienHeKhanCap(value).filter((item: any) => !item.khoiLienHeDefault);
								const duSoLuong = danhSach.length >= SO_LIEN_HE_KHAN_CAP_MAC_DINH;
								const duThongTin = danhSach
									.slice(0, SO_LIEN_HE_KHAN_CAP_MAC_DINH)
									.every((item) => isDuThongTinLienHeKhanCap(item));

								if (!duSoLuong || !duThongTin) {
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.validation.requiredTwo' })),
									);
								}

								if (coThongTinLienHeBiTrung(danhSach.slice(0, SO_LIEN_HE_KHAN_CAP_MAC_DINH))) {
									return Promise.reject(new Error('Thông tin liên hệ khẩn cấp không được trùng'));
								}

								return Promise.resolve();
							},
						},
					]}
				>
					<FormItemNguoiThanKTX disabled={disabled} />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Divider className='divider-big-title' orientation='left' style={{ marginTop: 0, marginBottom: 0 }}>
					{intl.formatMessage({ id: 'kytucxa.dangky.form.section.confirmation' })}
				</Divider>
			</Col>
			<Col span={24}>
				<div className='check-in-prep-content'>
					<div style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmation.intro' })}</div>
					<ol style={{ paddingLeft: 16, margin: 0 }}>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmation.item1' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmation.item2' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmation.item3' })}</li>
						<li>{intl.formatMessage({ id: 'kytucxa.dangky.form.confirmation.item4' })}</li>
					</ol>
				</div>
			</Col>

			<Col span={24}>
				<Form.Item name='checkbox1' valuePropName='checked'>
					<Checkbox disabled={disabled}>
						<div className='text-info'>{intl.formatMessage({ id: 'kytucxa.dangky.form.checkbox1.label' })}</div>
					</Checkbox>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default FormDangKyKTX;
