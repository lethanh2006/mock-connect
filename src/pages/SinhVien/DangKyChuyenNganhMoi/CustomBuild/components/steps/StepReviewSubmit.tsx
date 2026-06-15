import ProgramDesignTable from '@/pages/SinhVien/DangKyChuyenNganhMoi/CustomBuild/components/ProgramDesignTable';
import { ETrangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Card, Checkbox, Col, Divider, Form, Row, Tag, Typography } from 'antd';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';

interface StepReviewSubmitProps {
	formData: PhieuDkCtdt.UpdatePhieuDkCtdtMeDto;
	onPrevious: () => void;
	onSubmit: () => void;
	onSaveDraft?: () => void;
	isMinor?: boolean;
	loading?: boolean;
	submitLoading?: boolean;
	canEdit?: boolean;
	trangThai?: string;
}

const StepReviewSubmit = ({
	formData,
	onPrevious,
	onSubmit,
	onSaveDraft,
	isMinor = false,
	loading,
	submitLoading,
	canEdit,
	trangThai,
}: StepReviewSubmitProps) => {
	const intl = useIntl();
	const tenDonViPhuTrach = Form.useWatch('tenDonViPhuTrach', Form.useFormInstance());
	const maDonViPhuTrach = Form.useWatch('maDonViPhuTrach', Form.useFormInstance());
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

	const tenChuongTrinh = Form.useWatch('tenChuongTrinh', Form.useFormInstance());
	const mucTieuLyDo = Form.useWatch('mucTieuLyDo', Form.useFormInstance());
	const soDienThoaiWatch = Form.useWatch('soDienThoai', Form.useFormInstance());
	const emailWatch = Form.useWatch('email', Form.useFormInstance());
	const hoTenChinhWatch = Form.useWatch('hoTenCoVanHocTapChinh', Form.useFormInstance());
	const emailChinhWatch = Form.useWatch('emailCoVanHocTapChinh', Form.useFormInstance());
	const hoTenPhuWatch = Form.useWatch('hoTenCoVanHocTapPhu', Form.useFormInstance());
	const emailPhuWatch = Form.useWatch('emailCoVanHocTapPhu', Form.useFormInstance());

	const { danhSach } = useModel('tochucnhansu.nhansu');
	const ssoIdChinh =
		Form.useWatch('ssoIdCoVanHocTapChinh', Form.useFormInstance()) || phieuMeDotHienTai?.ssoIdCoVanHocTapChinh;
	const maChinh = Form.useWatch('maCoVanHocTapChinh', Form.useFormInstance()) || phieuMeDotHienTai?.maCoVanHocTapChinh;
	const advisorChinh = danhSach?.find((item) => (maChinh ? item.maCanBo === maChinh : item.ssoId === ssoIdChinh));

	const ssoIdPhu = Form.useWatch('ssoIdCoVanHocTapPhu', Form.useFormInstance()) || formData?.ssoIdCoVanHocTapPhu;
	const maPhu = Form.useWatch('maCoVanHocTapPhu', Form.useFormInstance()) || formData?.maCoVanHocTapPhu;
	const advisorPhu = danhSach?.find((item) => (maPhu ? item.maCanBo === maPhu : item.ssoId === ssoIdPhu));

	const isPending = trangThai === 'pending';
	const submitText = isPending
		? intl.formatMessage({ id: 'minor.button.updateRecord' }, { defaultMessage: 'Cập nhật phiếu' })
		: intl.formatMessage({ id: 'minor.idm.button.submit' });

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
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Divider orientation='left' dashed className='divider-big-title'>
								{intl.formatMessage({ id: 'minor.idm.review.studentSummary' })}
							</Divider>
							<Row gutter={[16, 12]}>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.review.studentId' })}
									</div>
									<div style={{ fontWeight: 600 }}>
										{phieuMeDotHienTai?.ma ? (
											<Typography.Text style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>
												{phieuMeDotHienTai.ma}
											</Typography.Text>
										) : (
											'-'
										)}
									</div>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.form.studentName' }, { defaultMessage: 'Họ tên' })}
									</div>
									<div style={{ fontWeight: 600 }}>{phieuMeDotHienTai?.ten ?? '-'}</div>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.review.gpa' })}
									</div>
									<div style={{ fontWeight: 600 }}>{phieuMeDotHienTai?.gpa ?? '-'}</div>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.review.college' })}
									</div>
									<div style={{ fontWeight: 600 }}>{phieuMeDotHienTai?.nganh ?? '-'}</div>
								</Col>
								{/* {phieuMeDotHienTai?.ctdt?.ten && ( */}
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.info.currentProgram' })}
									</div>
									<div style={{ fontWeight: 600 }}>{phieuMeDotHienTai?.ctdt?.ten ?? '-'}</div>
								</Col>
								{/* )} */}
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.review.semester' })}
									</div>
									<div style={{ fontWeight: 600 }}>{phieuMeDotHienTai?.dot?.hocKy?.soThuTu ?? '-'}</div>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.form.phoneNumber' })}
									</div>
									<div style={{ fontWeight: 600 }}>{soDienThoaiWatch ?? formData?.soDienThoai ?? '-'}</div>
								</Col>
								<Col xs={24} sm={12} md={6}>
									<div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
										{intl.formatMessage({ id: 'minor.idm.form.email' })}
									</div>
									<div style={{ fontWeight: 600 }}>{emailWatch ?? formData?.email ?? '-'}</div>
								</Col>
							</Row>
						</Col>

						<Col span={24}>
							<Divider orientation='left' dashed className='divider-big-title'>
								{intl.formatMessage({ id: 'minor.idm.review.advisorSummary' })}
							</Divider>
							<Row gutter={[16, 16]}>
								{isMinor && (
									<Col xs={24}>
										<div style={{ marginBottom: 12 }}>
											<Tag color='purple' style={{ marginBottom: 8 }}>
												{intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit' })}
											</Tag>
											<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
												<div>
													<span style={{ color: 'var(--color-text-secondary)' }}>
														{intl.formatMessage({ id: 'minor.detail.tenDonVi' }, { defaultMessage: 'Tên đơn vị' })}:
													</span>{' '}
													<span style={{ fontWeight: 600 }}>
														{tenDonViPhuTrach ?? formData?.tenDonViPhuTrach ?? '-'}
													</span>
												</div>
											</div>
										</div>
									</Col>
								)}
								<Col xs={24} md={12}>
									<div style={{ marginBottom: 12 }}>
										<Tag color='blue' style={{ marginBottom: 8 }}>
											{intl.formatMessage({ id: 'minor.idm.advisor.facultyAdvisorLabel' })}
										</Tag>
										<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
											<div>
												<span style={{ color: 'var(--color-text-secondary)' }}>
													{intl.formatMessage({ id: 'minor.idm.review.advisorName' })}:
												</span>{' '}
												<span style={{ fontWeight: 600 }}>
													{hoTenChinhWatch ?? phieuMeDotHienTai?.hoTenCoVanHocTapChinh ?? '-'}
												</span>
											</div>
											<div>
												<span style={{ color: 'var(--color-text-secondary)' }}>
													{intl.formatMessage({ id: 'minor.idm.review.advisorEmail' })}:
												</span>{' '}
												<span style={{ fontWeight: 600 }}>
													{emailChinhWatch ?? phieuMeDotHienTai?.emailCoVanHocTapChinh ?? '-'}
												</span>
											</div>
											{advisorChinh?.donViChinh?.ten && (
												<div>
													<span style={{ color: 'var(--color-text-secondary)' }}>
														{intl.formatMessage({ id: 'minor.idm.review.advisorCollege' })}:
													</span>{' '}
													<span style={{ fontWeight: 600 }}>{advisorChinh.donViChinh.ten}</span>
												</div>
											)}
											{(advisorChinh?.hocHam || advisorChinh?.hocVi || advisorChinh?.donViViTri?.tenChucVu) && (
												<div>
													<span style={{ color: 'var(--color-text-secondary)' }}>
														{intl.formatMessage({ id: 'minor.idm.review.advisorExpertise' })}:
													</span>{' '}
													<span style={{ fontWeight: 600 }}>
														{[advisorChinh?.hocHam, advisorChinh?.hocVi, advisorChinh?.donViViTri?.tenChucVu]
															.filter(Boolean)
															.join(', ')}
													</span>
												</div>
											)}
										</div>
									</div>
								</Col>

								{(hoTenPhuWatch || formData?.hoTenCoVanHocTapPhu) && (
									<Col xs={24} md={12}>
										<div style={{ marginBottom: 12 }}>
											<Tag color='cyan' style={{ marginBottom: 8 }}>
												{intl.formatMessage({ id: 'minor.idm.review.secondaryAdvisor' })}
											</Tag>
											<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
												<div>
													<span style={{ color: 'var(--color-text-secondary)' }}>
														{intl.formatMessage({ id: 'minor.idm.review.advisorName' })}:
													</span>{' '}
													<span style={{ fontWeight: 600 }}>
														{hoTenPhuWatch ?? formData?.hoTenCoVanHocTapPhu ?? '-'}
													</span>
												</div>
												<div>
													<span style={{ color: 'var(--color-text-secondary)' }}>
														{intl.formatMessage({ id: 'minor.idm.review.advisorEmail' })}:
													</span>{' '}
													<span style={{ fontWeight: 600 }}>
														{emailPhuWatch ?? formData?.emailCoVanHocTapPhu ?? '-'}
													</span>
												</div>
												{advisorPhu?.donViChinh?.ten && (
													<div>
														<span style={{ color: 'var(--color-text-secondary)' }}>
															{intl.formatMessage({ id: 'minor.idm.review.advisorCollege' })}:
														</span>{' '}
														<span style={{ fontWeight: 600 }}>{advisorPhu.donViChinh.ten}</span>
													</div>
												)}
												{(advisorPhu?.hocHam || advisorPhu?.hocVi || advisorPhu?.donViViTri?.tenChucVu) && (
													<div>
														<span style={{ color: 'var(--color-text-secondary)' }}>
															{intl.formatMessage({ id: 'minor.idm.review.advisorExpertise' })}:
														</span>{' '}
														<span style={{ fontWeight: 600 }}>
															{[advisorPhu?.hocHam, advisorPhu?.hocVi, advisorPhu?.donViViTri?.tenChucVu]
																.filter(Boolean)
																.join(', ')}
														</span>
													</div>
												)}
											</div>
										</div>
									</Col>
								)}

								{isMinor && (tenDonViPhuTrach || formData?.tenDonViPhuTrach) && (
									<Col span={24}>
										<div
											style={{
												padding: '8px 12px',
												background: 'var(--color-primary-bg-hover)',
												borderRadius: '6px',
												display: 'inline-block',
											}}
										>
											<span style={{ color: 'var(--color-text-secondary)' }}>
												{intl.formatMessage({ id: 'minor.idm.advisor.responsibleUnit' })}:
											</span>{' '}
											<span style={{ fontWeight: 600 }}>
												{tenDonViPhuTrach || formData?.tenDonViPhuTrach}
												{maDonViPhuTrach || formData?.maDonViPhuTrach
													? ` (${maDonViPhuTrach || formData?.maDonViPhuTrach})`
													: ''}
											</span>
										</div>
									</Col>
								)}
							</Row>
						</Col>
					</Row>

					<Row gutter={[0, 8]}>
						<Divider orientation='left' dashed className='divider-big-title'>
							{intl.formatMessage({ id: 'minor.idm.review.programOverview' })}
						</Divider>
						<Col xs={24} md={24} style={{ marginBottom: 16 }}>
							<div style={{ marginBottom: 12 }}>
								<span style={{ color: 'var(--color-text-secondary)', marginRight: 8 }}>
									{isMinor
										? intl.formatMessage({ id: 'minor.idm.form.titleOfMinor' })
										: intl.formatMessage({ id: 'minor.idm.form.titleOfConcentration' })}
									:
								</span>
								<span style={{ fontWeight: 600 }}>{tenChuongTrinh || formData?.tenChuongTrinh || '-'}</span>
							</div>
							<div>
								<div style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>
									{intl.formatMessage({ id: 'minor.idm.goalsAndRationale.title' })}:
								</div>
								<div style={{ fontWeight: 600, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
									{mucTieuLyDo || formData?.mucTieuLyDo || '-'}
								</div>
							</div>
						</Col>
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
						validateTrigger='onChange'
						rules={[
							{
								validator: (_, value) => {
									if (value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error(intl.formatMessage({ id: 'minor.idm.review.confirmRequired' })));
								},
							},
						]}
					>
						<Checkbox>{intl.formatMessage({ id: 'minor.idm.review.confirmLabel' })}</Checkbox>
					</Form.Item>
					<ul style={{ paddingLeft: 24 }}>
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
				</Col>
			</Row>
			<FormFooter
				showPrevious
				onPrevious={onPrevious}
				onSubmit={onSubmit}
				onSaveDraft={onSaveDraft}
				loading={loading}
				submitLoading={submitLoading}
				submitText={submitText}
			/>
		</>
	);
};

export default StepReviewSubmit;
