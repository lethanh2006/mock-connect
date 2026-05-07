import ButtonExtend from '@/components/Table/ButtonExtend';
import ProgramDesignTable from '@/pages/SinhVien/DangKyChuyenNganhMoi/CustomBuild/components/ProgramDesignTable';
import { ETrangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import rules from '@/utils/rules';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Descriptions, Divider, Form, FormInstance, Input, Modal, Row } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';
import FormHpBuild from '../FormHpBuild';

interface StepProgramDesignProps {
	onPrevious: () => void;
	onNext: () => void;
	onSaveDraft?: () => void;
	isMinor?: boolean;
	form: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
	loading?: boolean;
	canEdit?: boolean;
}

const StepProgramDesign = ({
	onPrevious,
	onNext,
	onSaveDraft,
	isMinor = false,
	form,
	loading,
	canEdit,
}: StepProgramDesignProps) => {
	const intl = useIntl();
	const [showEdit, setShowEdit] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | undefined>(undefined);
	const [editingRecord, setEditingRecord] = useState<PhieuDkCtdt.KhoiHocPhanDkCtdt | undefined>(undefined);
	const khoiHpCtList = Form.useWatch('khoiHpCtList', form) || [];
	const tenDonViPhuTrach = Form.useWatch('tenDonViPhuTrach', form);
	const maDonViPhuTrach = Form.useWatch('maDonViPhuTrach', form);
	const { record: dotDangKy, fetchDotDangKy } = useModel('daotao.dotdkctdt');
	const { record: phieuMeDotHienTai } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');

	// Tính tổng số tín chỉ
	const totalCredits = khoiHpCtList.reduce((sum: number, item: any) => {
		return sum + (item.hocPhanChinh?.soTinChi || 0);
	}, 0);

	// Tính số tín chỉ đã học hoặc đã hoàn thành
	const completedCredits = khoiHpCtList.reduce((sum: number, item: any) => {
		const status = item.hocPhanChinh?.trangThaiKqht;
		if (status === ETrangThaiKqht.COMPLETED || status === ETrangThaiKqht.IN_PROGRESS) {
			return sum + (item.hocPhanChinh?.soTinChi || 0);
		}
		return sum;
	}, 0);

	const minCredits = dotDangKy?.minCredit ?? 0;
	const maxCompletedCredits = dotDangKy?.maxCompletedCredit ?? 0;
	const meetsMinCredits = totalCredits >= minCredits;
	const isWithinMaxCompletedCredits = completedCredits <= maxCompletedCredits;

	const handleDelete = (index: number) => {
		const updated = khoiHpCtList.filter((_: any, idx: number) => idx !== index);
		form.setFieldsValue({ khoiHpCtList: updated });
	};

	const handleEdit = (record: PhieuDkCtdt.KhoiHocPhanDkCtdt, index: number) => {
		setEditingIndex(index);
		setEditingRecord(record);
		setShowEdit(true);
	};

	const handleAdd = () => {
		setEditingIndex(undefined);
		setEditingRecord(undefined);
		setShowEdit(true);
	};

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
			<Row gutter={[0, 8]}>
				<Col span={24}>
					<Form.Item
						label={isMinor ? intl.formatMessage({ id: 'minor.idm.form.titleOfMinor' }) : intl.formatMessage({ id: 'minor.idm.form.titleOfConcentration' })}
						name='tenChuongTrinh'
						rules={rules.required}
					>
						<Input placeholder={intl.formatMessage({ id: 'minor.idm.form.titlePlaceholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='mucTieuLyDo'
						rules={[...rules.required, ...rules.length(5000)]}
						label={
							<div>
								<div>{intl.formatMessage({ id: 'minor.idm.goalsAndRationale.title' })}</div>
								<div style={{ fontWeight: 400, marginTop: 4, color: 'var(--color-text-secondary)', fontSize: '13px' }}>
									{isMinor
										? intl.formatMessage({ id: 'minor.idm.goalsAndRationale.description.minor' })
										: intl.formatMessage({ id: 'minor.idm.goalsAndRationale.description.concentration' })}
								</div>
							</div>
						}
					>
						<Input.TextArea
							rows={6}
							placeholder={intl.formatMessage({ id: 'minor.idm.goalsAndRationale.placeholder' })}
							showCount
							maxLength={5000}
						/>
					</Form.Item>

					<div>
						<Row gutter={[0, 8]} style={{ marginBottom: 8 }}>
							<Divider orientation='left' dashed className='divider-big-title'>
								{intl.formatMessage({ id: 'minor.idm.programDesign.title' })}
							</Divider>
						</Row>
						<Row gutter={[8, 8]}>
							{[
								{
									ok: meetsMinCredits,
									label: intl.formatMessage({ id: 'minor.idm.programDesign.creditsRegisteredMin' }),
									subLabel: intl.formatMessage(
										{ id: 'minor.idm.review.cardTotalCreditsSub' },
										{ min: minCredits ?? '-' },
									),
									value: `${totalCredits} / ${minCredits}`,
								},
								{
									ok: isWithinMaxCompletedCredits,
									label: intl.formatMessage({ id: 'minor.idm.programDesign.creditsCompletedMax' }),
									subLabel: intl.formatMessage(
										{ id: 'minor.idm.review.cardCompletedCreditsSub' },
										{ max: maxCompletedCredits ?? '-' },
									),
									value: `${completedCredits} / ${maxCompletedCredits}`,
								},
							].map((item, idx) => (
								<Col key={idx} xs={24} sm={24} md={12}>
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
											<Col>
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
							<Col span={24}>
								<Form.Item
									name='khoiHpCtList'
									rules={[
										{
											validator: async (_, value) => {
												const currentTotalCredits = (value || []).reduce(
													(sum: number, item: any) => sum + (item.hocPhanChinh?.soTinChi || 0),
													0,
												);
												if (currentTotalCredits < minCredits) {
													return Promise.reject(
														new Error(
															intl.formatMessage({ id: 'minor.idm.programDesign.error.minCredits' }, { min: minCredits }),
														),
													);
												}

												const currentCompletedCredits = (value || []).reduce((sum: number, item: any) => {
													const status = item.hocPhanChinh?.trangThaiKqht;
													if (status === ETrangThaiKqht.COMPLETED || status === ETrangThaiKqht.IN_PROGRESS) {
														return sum + (item.hocPhanChinh?.soTinChi || 0);
													}
													return sum;
												}, 0);

												if (currentCompletedCredits > maxCompletedCredits) {
													return Promise.reject(
														new Error(
															intl.formatMessage(
																{ id: 'minor.idm.programDesign.error.maxCompletedCredits' },
																{ max: maxCompletedCredits },
															),
														),
													);
												}

												return Promise.resolve();
											},
										},
									]}
								>
									<ProgramDesignTable
										data={khoiHpCtList}
										onDelete={handleDelete}
										onEdit={handleEdit}
										hasTotal
										title={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
										showEdit={showEdit}
										setShowEdit={setShowEdit}
										otherButtons={[
											<ButtonExtend
												key='add'
												icon={<PlusCircleOutlined />}
												onClick={handleAdd}
												type='primary'
												size='small'
											>
												{intl.formatMessage({ id: 'minor.idm.programDesign.addCourse' })}
											</ButtonExtend>,
										]}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Modal
							width={800}
							open={showEdit}
							onCancel={() => {
								setShowEdit(false);
								setEditingIndex(undefined);
								setEditingRecord(undefined);
							}}
							footer={null}
							title={editingIndex !== undefined ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'minor.idm.programDesign.addCourse' })}
						>
							<FormHpBuild
								form={form}
								onCancel={() => {
									setShowEdit(false);
									setEditingIndex(undefined);
									setEditingRecord(undefined);
								}}
								editIndex={editingIndex}
								initialValues={editingRecord}
							/>
						</Modal>
					</div>
				</Col>
			</Row>

			<FormFooter
				showPrevious
				onPrevious={onPrevious}
				onNext={onNext}
				onSaveDraft={onSaveDraft}
				loading={loading}
			/>
		</>
	);
};

export default StepProgramDesign;
