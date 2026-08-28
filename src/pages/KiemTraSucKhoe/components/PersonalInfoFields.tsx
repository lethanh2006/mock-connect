import MyDatePicker from '@/components/MyDatePicker';
import { EGioiTinh, ktscNationalityOptionsIntlId } from '@/services/KiemTraSucKhoe/constant';
import rules from '@/utils/rules';
import { Col, Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import type { IPersonalInfo } from '../hooks/usePersonalInfo';

interface IProps {
	info: IPersonalInfo;
}

/** Khối thông tin cá nhân dùng chung giữa form đăng ký và form khai báo miễn kiểm tra sức khỏe */
const PersonalInfoFields = ({ info }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	const genderOptions = [
		{ value: EGioiTinh.Nam, label: t('kiemtrasuckhoe.mien.gioitinh.nam') },
		{ value: EGioiTinh.Nu, label: t('kiemtrasuckhoe.mien.gioitinh.nu') },
	];
	const nationalityOptions = ktscNationalityOptionsIntlId.map((item) => ({ ...item, label: t(item.intlId) }));

	return (
		<>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required, ...rules.text]} name='fullName' label={t('kiemtrasuckhoe.dangky.hoTen')}>
					<Input disabled={info.isPersonalFieldDisabled(info.studentFullName)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					name='studentCode'
					label={t('kiemtrasuckhoe.dangky.maSinhVien')}
				>
					<Input disabled={info.isPersonalFieldDisabled(info.studentCode)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='ngaySinh' label={t('kiemtrasuckhoe.dangky.ngaySinh')}>
					<MyDatePicker disabled={info.isPersonalFieldDisabled(info.studentNgaySinh)} format='DD/MM/YYYY' />
				</Form.Item>
			</Col>
			{info.isVN ? (
				<Col span={24} md={12}>
					<Form.Item rules={[...rules.required, ...rules.text]} name='cccd' label={t('kiemtrasuckhoe.dangky.cccd')}>
						<Input disabled={info.isPersonalFieldDisabled(info.studentCccd)} />
					</Form.Item>
				</Col>
			) : null}
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='nationality' label={t('kiemtrasuckhoe.dangky.quocTich')}>
					<Select disabled={info.isPersonalFieldDisabled(info.studentNationality)} options={nationalityOptions} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='gioiTinh' label={t('kiemtrasuckhoe.dangky.gioiTinh')}>
					<Select disabled={info.isPersonalFieldDisabled(info.studentGioiTinh)} options={genderOptions} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='khoa' label={t('kiemtrasuckhoe.dangky.college')}>
					{/*Luôn luôn disabled, vì đây là thông tin lấy từ hệ thống sinh viên, không cho phép chỉnh sửa*/}
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='nganh' label={t('kiemtrasuckhoe.dangky.nganh')}>
					{/*Luôn luôn disabled, vì đây là thông tin lấy từ hệ thống sinh viên, không cho phép chỉnh sửa*/}
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					name='phone'
					label={t('kiemtrasuckhoe.dangky.soDienThoai')}
				>
					<Input disabled={info.isPersonalFieldDisabled(info.studentPhone)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					rules={[...rules.required, ...rules.text, ...rules.email]}
					name='email'
					label={t('kiemtrasuckhoe.dangky.email')}
				>
					<Input disabled={info.isPersonalFieldDisabled(info.studentEmail)} />
				</Form.Item>
			</Col>
		</>
	);
};

export default PersonalInfoFields;
