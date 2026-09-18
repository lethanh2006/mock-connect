import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import dayjs from '@/utils/dayjs';
import { resetFieldsForm } from '@/utils/utils';
import { Row } from '@/components/MyGrid';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useIntl } from 'umi';
import { usePersonalInfo } from '../hooks/usePersonalInfo';
import PersonalInfoFields from './PersonalInfoFields';

interface IProps {
	record?: KiemTraSucKhoe.IDotDangKy;
	onCancel: () => void;
}

const parseDate = (value?: string | null) => {
	if (!value) return null;

	const parsed = dayjs(value);
	if (parsed.isValid()) return parsed;

	const parsedVietnameseDate = dayjs(value, 'DD/MM/YYYY', true);
	return parsedVietnameseDate.isValid() ? parsedVietnameseDate : null;
};

/** Xem lại thông tin đã đăng ký khám sức khỏe tại trường (đăng ký gửi thẳng qua ChoiceModal, không có form nhập) */
const FormDangKyKiemTraSucKhoe = ({ record, onCancel }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const [form] = Form.useForm();

	const studentRegistration = record?.student;

	const personalInfo = usePersonalInfo(studentRegistration, true, form);

	useEffect(() => {
		form.setFieldsValue({
			fullName: personalInfo.studentFullName,
			studentCode: personalInfo.studentCode,
			ngaySinh: parseDate(personalInfo.studentNgaySinh),
			cccd: personalInfo.studentCccd,
			nationality: personalInfo.studentNationality,
			gioiTinh: personalInfo.studentGioiTinh,
			khoa: personalInfo.studentKhoa,
			nganh: personalInfo.studentNganh,
			phone: personalInfo.studentPhone,
			email: personalInfo.studentEmail,
		});

		return () => resetFieldsForm(form);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [record?._id, personalInfo.recordSinhVien?._id]);

	return (
		<Form layout='vertical' form={form}>
			<Row gutter={[12, 0]}>
				<PersonalInfoFields info={personalInfo} />
			</Row>
			<div className='form-footer'>
				<Button htmlType='button' onClick={onCancel}>
					{t('global.button.huy')}
				</Button>
			</div>
		</Form>
	);
};

export default FormDangKyKiemTraSucKhoe;
