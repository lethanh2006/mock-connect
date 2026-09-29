import MyDatePicker from '@/components/MyDatePicker';
import type { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import rules from '@/utils/rules';
import { Checkbox, Divider, Form, FormInstance, Radio, Space } from 'antd';
import { Col, Row } from '@/components/MyGrid';
import Input from '@/components/MyInput';
import { useIntl } from 'umi';
import FormItemNguoiThanKTX, {
	chuanHoaDanhSachLienHeKhanCap,
	coThongTinLienHeBiTrung,
	isDuThongTinLienHeKhanCap,
	SO_LIEN_HE_KHAN_CAP_MAC_DINH,
} from '../NguoiThan/FormItem';

type TTruongThongTinSinhVien = keyof Pick<
	PhieuDangKyKTX.IDangKy,
	| 'fullName'
	| 'studentId'
	| 'dateOfBirth'
	| 'gender'
	| 'email'
	| 'phoneNumber'
	| 'program'
	| 'college'
	| 'identityNumber'
	| 'dateOfIssue'
	| 'placeOfIssue'
	| 'nationality'
	| 'permanentHomeAddress'
>;
export enum FIELD_NATIONALITY {
	VIET_NAM = 'Việt Nam',
	QUOC_TE = 'Quốc tế',
}

const FormDangKyKTX = (props: {
	form: FormInstance;
	disabled?: boolean;
	truongSinhVienDuocSua?: Partial<Record<TTruongThongTinSinhVien, boolean>>;
}) => {
	const intl = useIntl();
	const { disabled, truongSinhVienDuocSua = {} } = props;
	const isDisabled = (field: TTruongThongTinSinhVien) => disabled || !truongSinhVienDuocSua[field];

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
				<Form.Item
					name='fullName'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.fullName' })}
						disabled={isDisabled('fullName')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='studentId'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.studentId' })}
						disabled={isDisabled('studentId')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='dateOfBirth'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })}
					rules={[...rules.required]}
				>
					<MyDatePicker
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfBirth' })}
						disabled={isDisabled('dateOfBirth')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='gender'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.gender' })}
						disabled={isDisabled('gender')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='email'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email' })}
					rules={[...rules.required, ...rules.email]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.email.placeholder' })}
						disabled={isDisabled('email')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='phoneNumber'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.phoneNumber.placeholder' })}
						disabled={isDisabled('phoneNumber')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='program'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.program' })}
						disabled={isDisabled('program')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='college'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.college' })}
						disabled={isDisabled('college')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='identityNumber'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.identityNumber.placeholder' })}
						disabled={isDisabled('identityNumber')}
					/>
				</Form.Item>
			</Col>

			<Col span={24} md={12}>
				<Form.Item
					name='dateOfIssue'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue' })}
					rules={[...rules.required]}
				>
					<MyDatePicker
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.dateOfIssue.placeholder' })}
						disabled={isDisabled('dateOfIssue')}
					/>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item
					name='placeOfIssue'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue' })}
					rules={[...rules.required]}
				>
					<Input
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.placeOfIssue.placeholder' })}
						disabled={isDisabled('placeOfIssue')}
					/>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item
					name='nationality'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality' })}
					rules={[...rules.required]}
				>
					<Radio.Group disabled={isDisabled('nationality')}>
						<Space direction='horizontal'>
							<Radio value={FIELD_NATIONALITY.VIET_NAM}>
								{intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality.vn' })}
							</Radio>
							<Radio value={FIELD_NATIONALITY.QUOC_TE}>
								{intl.formatMessage({ id: 'kytucxa.dangky.form.field.nationality.intl' })}
							</Radio>
						</Space>
					</Radio.Group>
				</Form.Item>
			</Col>

			<Col span={24}>
				<Form.Item
					name='permanentHomeAddress'
					label={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress' })}
					rules={[...rules.required]}
				>
					<Input.TextArea
						rows={2}
						placeholder={intl.formatMessage({ id: 'kytucxa.dangky.form.field.permanentHomeAddress.placeholder' })}
						disabled={isDisabled('permanentHomeAddress')}
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
