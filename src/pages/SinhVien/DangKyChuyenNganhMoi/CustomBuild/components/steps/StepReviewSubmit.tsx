import ProgramDesignTable from '@/pages/SinhVien/DangKyChuyenNganhMoi/CustomBuild/components/ProgramDesignTable';
import { ETrangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Card, Checkbox, Col, Descriptions, Divider, Form, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';

interface StepReviewSubmitProps {
	formData: PhieuDkCtdt.UpdatePhieuDkCtdtMeDto;
	onPrevious: () => void;
	onSubmit: () => void;
}

const StepReviewSubmit = ({ formData, onPrevious, onSubmit }: StepReviewSubmitProps) => {
	const intl = useIntl();
	const { record: phieuMeDotHienTai } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	const { record: kyHienTai } = useModel('daotao.dotdkctdt');
	const khoiHpCtList = formData?.khoiHpCtList || [];

	const minGpa = kyHienTai?.gpaMin;
	const minCredits = kyHienTai?.minCredit;
	const maxCompletedCredits = kyHienTai?.maxCompletedCredit;

	const gpa = phieuMeDotHienTai?.gpa != null ? Number(phieuMeDotHienTai.gpa) : 0;
	const totalCredits = khoiHpCtList.reduce((sum: number, item: any) => sum + (item.hocPhanChinh?.soTinChi || 0), 0);
	const completedCredits = khoiHpCtList.reduce((sum: number, item: any) => {
		const status = item.hocPhanChinh?.trangThaiKqht;
		if (status === ETrangThaiKqht.COMPLETED || status === ETrangThaiKqht.IN_PROGRESS) {
			return sum + (item.hocPhanChinh?.soTinChi || 0);
		}
		return sum;
	}, 0);

	const meetsGpa = minGpa == null || gpa >= minGpa;
	const meetsMinCredits = minCredits == null || totalCredits >= minCredits;
	const meetsMaxCompletedCredits = maxCompletedCredits == null || completedCredits <= maxCompletedCredits;

	return (
		<>
			<Row gutter={[0, 8]}>
				<Col span={24}>
					<Alert
						type='warning'
						icon={<WarningOutlined />}
						message={intl.formatMessage({ id: 'minor.idm.review.warning' })}
					/>
				</Col>
				<Col span={24}>
					<Row gutter={[0, 8]}>
						<Divider orientation='left' dashed className='divider-big-title'>
							{intl.formatMessage({ id: 'minor.idm.review.applicationSummary' })}
						</Divider>
						<Col xs={24} md={24}>
							<Descriptions
								column={2}
								className='highlight'
								layout='vertical'
								title={intl.formatMessage({ id: 'minor.idm.review.studentSummary' })}
								items={[
									{
										key: 'studentId',
										label: intl.formatMessage({ id: 'minor.idm.review.studentId' }),
										children: `${phieuMeDotHienTai?.ma ?? '-'}`,
									},
									{
										key: 'gpa',
										label: intl.formatMessage({ id: 'minor.idm.review.gpa' }),
										children: `${phieuMeDotHienTai?.gpa ?? '-'}`,
									},
									{
										key: 'college',
										label: intl.formatMessage({ id: 'minor.idm.review.college' }),
										children: `${phieuMeDotHienTai?.nganh ?? '-'}`,
									},
									{
										key: 'semester',
										label: intl.formatMessage({ id: 'minor.idm.review.semester' }),
										children: `${phieuMeDotHienTai?.dot?.hocKy?.soThuTu ?? '-'}`,
									},
								]}
							/>
						</Col>
						<Col xs={24} md={24}>
							<Descriptions
								column={2}
								className='highlight'
								layout='vertical'
								title={intl.formatMessage({ id: 'minor.idm.review.advisorSummary' })}
								items={[
									{
										key: 'advisorName',
										label: intl.formatMessage({ id: 'minor.idm.review.advisorName' }),
										children: phieuMeDotHienTai?.hoTenCoVanHocTapChinh ?? '-',
									},
									{
										key: 'advisorCollege',
										label: intl.formatMessage({ id: 'minor.idm.review.advisorCollege' }),
										children: '-',
									},
									{
										key: 'advisorEmail',
										label: intl.formatMessage({ id: 'minor.idm.review.advisorEmail' }),
										children: phieuMeDotHienTai?.emailCoVanHocTapChinh ?? '-',
									},
									{
										key: 'advisorExpertise',
										label: intl.formatMessage({ id: 'minor.idm.review.advisorExpertise' }),
										children: '-',
									},
								]}
							/>
						</Col>
					</Row>

					<Row gutter={[0, 8]}>
						<Divider orientation='left' dashed className='divider-big-title'>
							{intl.formatMessage({ id: 'minor.idm.review.programOverview' })}
						</Divider>
						<Col span={24}>
							<Form.Item name='khoiHpCtList'>
								<ProgramDesignTable
									data={khoiHpCtList}
									hideActions
									hasTotal
									title={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
									showEdit={false}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={[0, 8]}>
						<Divider orientation='left' dashed className='divider-big-title'>
							{intl.formatMessage({ id: 'minor.idm.review.requirementsChecklist' })}
						</Divider>
					</Row>
					<Row gutter={[8, 8]}>
						{[
							{
								ok: meetsGpa,
								label: intl.formatMessage({ id: 'minor.idm.review.cardGpa' }),
								subLabel: intl.formatMessage({ id: 'minor.idm.review.cardGpaSub' }, { min: minGpa ?? '-' }),
								value: gpa > 0 ? gpa.toFixed(1) : '-',
							},
							{
								ok: meetsMinCredits,
								label: intl.formatMessage({ id: 'minor.idm.review.cardTotalCredits' }),
								subLabel: intl.formatMessage(
									{ id: 'minor.idm.review.cardTotalCreditsSub' },
									{ min: minCredits ?? '-' },
								),
								value: String(totalCredits),
							},
							{
								ok: meetsMaxCompletedCredits,
								label: intl.formatMessage({ id: 'minor.idm.review.cardCompletedCredits' }),
								subLabel: intl.formatMessage(
									{ id: 'minor.idm.review.cardCompletedCreditsSub' },
									{ max: maxCompletedCredits ?? '-' },
								),
								value: String(completedCredits),
							},
						].map((item, idx) => (
							<Col key={idx} xs={24} sm={24} md={8}>
								<Card
									style={{
										background: item.ok ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
									}}
								>
									<Row align='middle' gutter={12}>
										<Col flex='1'>
											{item.ok ? (
												<CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
											) : (
												<CloseCircleOutlined style={{ color: 'var(--color-error)' }} />
											)}
											<div style={{ fontWeight: 600 }}>{item.label}</div>
											<sub>{item.subLabel}</sub>
										</Col>
										<Col style={{ display: 'flex', alignItems: 'center' }}>
											<h2
												style={{
													fontWeight: 700,
													color: item.ok ? 'var(--color-success)' : 'var(--color-error)',
													margin: 0,
												}}
											>
												{item.value}
											</h2>
										</Col>
									</Row>
								</Card>
							</Col>
						))}
					</Row>
				</Col>
				<Col span={24}>
					<Form.Item
						name='confirmCheckbox'
						valuePropName='checked'
						rules={[{ required: true, message: intl.formatMessage({ id: 'minor.idm.review.confirmRequired' }) }]}
					>
						<Checkbox>{intl.formatMessage({ id: 'minor.idm.review.confirmLabel' })}</Checkbox>
						<ul>
							<li style={{ color: 'var(--color-primary)' }}>
								{intl.formatMessage({ id: 'minor.idm.review.confirmItem1' })}
							</li>
							<li style={{ color: 'var(--color-primary)' }}>
								{intl.formatMessage({ id: 'minor.idm.review.confirmItem2' })}
							</li>
							<li style={{ color: 'var(--color-primary)' }}>
								{intl.formatMessage({ id: 'minor.idm.review.confirmItem3' })}
							</li>
							<li style={{ color: 'var(--color-primary)' }}>
								{intl.formatMessage({ id: 'minor.idm.review.confirmItem4' })}
							</li>
						</ul>
					</Form.Item>
				</Col>
			</Row>
			<FormFooter showPrevious onPrevious={onPrevious} onSubmit={onSubmit} />
		</>
	);
};

export default StepReviewSubmit;
