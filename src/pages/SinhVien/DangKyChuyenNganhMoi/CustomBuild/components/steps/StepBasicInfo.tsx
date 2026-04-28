import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { Col, Descriptions, Form, FormInstance, Input, Row } from 'antd';
import { useIntl } from 'umi';
import FormFooter from '../FormFooter';

interface StepBasicInfoProps {
	onNext: () => void;
	onSaveDraft?: () => void;
	isMinor?: boolean;
	form: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
}

const StepBasicInfo = ({ onNext, onSaveDraft, isMinor = false, form }: StepBasicInfoProps) => {
	const intl = useIntl();
	const tenDonViPhuTrach = Form.useWatch('tenDonViPhuTrach', form);
	const maDonViPhuTrach = Form.useWatch('maDonViPhuTrach', form);

	return (
		<>
			{isMinor && tenDonViPhuTrach && (
				<Descriptions
					column={1}
					className='highlight'
					layout='horizontal'
					items={[
						{
							label: intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit' }),
							children: `${tenDonViPhuTrach}${maDonViPhuTrach ? ` (${maDonViPhuTrach})` : ''}`,
						},
					]}
				/>
			)}
			<Row gutter={[16, 0]}>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.fullName' })} name='ten'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.studentId' })} name='sinhVienSsoId'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.college' })} name='nganh'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.currentProgram' })} name='currentProgram'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.cumGPA' })} name='gpa'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.class' })} name='lop'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.dateOfBirth' })} name='ngaySinh'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item label={intl.formatMessage({ id: 'minor.idm.form.gender' })} name='gioiTinh'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'minor.idm.form.email' })}
						name='email'
						rules={[{ required: true, type: 'email' }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col xs={24} md={12}>
					<Form.Item
						label={intl.formatMessage({ id: 'minor.idm.form.phoneNumber' })}
						name='soDienThoai'
						rules={[{ required: true }]}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>
			<FormFooter onNext={onNext} onSaveDraft={onSaveDraft} />
		</>
	);
};

export default StepBasicInfo;
