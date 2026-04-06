import dayjs from '@/utils/dayjs';
import { useModel } from '@umijs/max';
import { Col, Descriptions, Divider, Row } from 'antd';
import { useIntl } from 'umi';

const PersonalInfo = () => {
	const intl = useIntl();
	const { record: phieuDkCtdtMe } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	return (
		<div>
			<Divider orientation='left' className='divider-big-title' style={{ marginTop: 0 }} dashed>
				{intl.formatMessage({ id: 'minor.idm.detail.personalInfo.title' })}
			</Divider>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Descriptions column={2} layout='vertical' className='highlight'>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.studentSsoId' })}>
							{phieuDkCtdtMe?.sinhVienSsoId || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='GPA'>{phieuDkCtdtMe?.gpa?.toFixed(2) || '-'}</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.major' })}>
							{phieuDkCtdtMe?.nganh || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.semester' })}>
							{phieuDkCtdtMe?.dot?.hocKy?.ten || '-'}
						</Descriptions.Item>
					</Descriptions>
				</Col>
				<Col span={24}>
					<Descriptions column={2} layout='vertical'>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.fullName' })}>
							{phieuDkCtdtMe?.ten || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.studentCode' })}>
							{phieuDkCtdtMe?.ma || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.major' })}>
							{phieuDkCtdtMe?.nganh || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Lớp'>{phieuDkCtdtMe?.lop || '-'}</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.dateOfBirth' })}>
							{dayjs(phieuDkCtdtMe?.ngaySinh).format('DD/MM/YYYY') || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.gender' })}>
							{phieuDkCtdtMe?.gioiTinh || '-'}
						</Descriptions.Item>
						<Descriptions.Item label='Email'>{phieuDkCtdtMe?.email || '-'}</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'minor.idm.detail.personalInfo.phoneNumber' })}>
							{phieuDkCtdtMe?.soDienThoai || '-'}
						</Descriptions.Item>
					</Descriptions>
				</Col>
			</Row>
		</div>
	);
};

export default PersonalInfo;
