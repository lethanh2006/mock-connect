import MyDatePicker from '@/components/MyDatePicker';
import { bhytNationalityOptionsIntlId, EGioiTinh } from '@/services/BaoHiemYTe/constant';
import rules from '@/utils/rules';
import { Col, Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import type { IPersonalInfo } from '../hooks/usePersonalInfo';

interface IProps {
	info: IPersonalInfo;
}

/** Khối thông tin cá nhân dùng chung giữa form đăng ký BHYT và form khai báo miễn BHYT */
const PersonalInfoFields = ({ info }: IProps) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });

	const genderOptions = [
		{ value: EGioiTinh.Nam, label: t('baohiemyte.mien.gioitinh.nam') },
		{ value: EGioiTinh.Nu, label: t('baohiemyte.mien.gioitinh.nu') },
	];
	const nationalityOptions = bhytNationalityOptionsIntlId.map((item) => ({ ...item, label: t(item.intlId) }));

	return (
		<>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='fullName' label={t('baohiemyte.dangky.hoTen')}>
					<Input disabled={info.isPersonalFieldDisabled(info.studentFullName)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='studentCode' label={t('baohiemyte.dangky.maSinhVien')}>
					<Input disabled={info.isPersonalFieldDisabled(info.studentCode)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='ngaySinh' label={t('baohiemyte.dangky.ngaySinh')}>
					<MyDatePicker disabled={info.isPersonalFieldDisabled(info.studentNgaySinh)} format='DD/MM/YYYY' />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				{info.isVN ? (
					<Form.Item rules={[...rules.required]} name='cccd' label={t('baohiemyte.dangky.cccd')}>
						<Input disabled={info.isPersonalFieldDisabled(info.studentCccd)} />
					</Form.Item>
				) : (
					<Form.Item rules={[...rules.required]} name='nationality' label={t('baohiemyte.dangky.quocTich')}>
						<Select disabled={info.isPersonalFieldDisabled(info.studentNationality)} options={nationalityOptions} />
					</Form.Item>
				)}
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='gioiTinh' label={t('baohiemyte.dangky.gioiTinh')}>
					<Select disabled={info.isPersonalFieldDisabled(info.studentGioiTinh)} options={genderOptions} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='khoa' label={t('baohiemyte.dangky.college')}>
					{/*Luôn luôn disabled, vì đây là thông tin lấy từ hệ thống sinh viên, không cho phép chỉnh sửa*/}
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='nganh' label={t('baohiemyte.dangky.nganh')}>
					{/*Luôn luôn disabled, vì đây là thông tin lấy từ hệ thống sinh viên, không cho phép chỉnh sửa*/}
					<Input disabled />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='phone' label={t('baohiemyte.dangky.soDienThoai')}>
					<Input disabled={info.isPersonalFieldDisabled(info.studentPhone)} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item rules={[...rules.required]} name='email' label={t('baohiemyte.dangky.email')}>
					<Input disabled={info.isPersonalFieldDisabled(info.studentEmail)} />
				</Form.Item>
			</Col>
		</>
	);
};

export default PersonalInfoFields;
