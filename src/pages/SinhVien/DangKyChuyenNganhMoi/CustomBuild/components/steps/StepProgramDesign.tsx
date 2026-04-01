import ButtonExtend from '@/components/Table/ButtonExtend';
import ProgramDesignTable from '@/pages/SinhVien/DangKyChuyenNganhMoi/CustomBuild/components/ProgramDesignTable';
import { ETrangThaiKqht } from '@/services/DaoTao/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import rules from '@/utils/rules';
import { CheckCircleOutlined, CloseCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Card, Col, Collapse, Divider, Form, FormInstance, Input, Modal, Row } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormFooter from '../FormFooter';
import FormHpBuild from '../FormHpBuild';

const { Panel } = Collapse;

interface StepProgramDesignProps {
	onPrevious: () => void;
	onNext: () => void;
	form: FormInstance<PhieuDkCtdt.UpdatePhieuDkCtdtMeDto>;
}

const StepProgramDesign = ({ onPrevious, onNext, form }: StepProgramDesignProps) => {
	const intl = useIntl();
	const [showEdit, setShowEdit] = useState(false);
	const khoiHpCtList = Form.useWatch('khoiHpCtList', form) || [];
	const { record: dotDangKy } = useModel('daotao.dotdkctdt');

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
	const meetsMaxCompletedCredits = completedCredits > 0 && completedCredits <= maxCompletedCredits;

	const handleDelete = (index: number) => {
		const updated = khoiHpCtList.filter((_: any, idx: number) => idx !== index);
		form.setFieldsValue({ khoiHpCtList: updated });
	};

	return (
		<>
			<Row gutter={[0, 8]}>
				<Col span={24}>
					<Form.Item
						label={intl.formatMessage({ id: 'minor.idm.form.titleOfMinor' })}
						name='tenChuongTrinh'
						rules={rules.required}
					>
						<Input placeholder={intl.formatMessage({ id: 'minor.idm.form.titlePlaceholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Collapse defaultActiveKey={['1']}>
						<Panel header={intl.formatMessage({ id: 'minor.idm.goalsAndRationale.title' })} key='1'>
							<div style={{ marginBottom: 8 }}>
								{intl.formatMessage({ id: 'minor.idm.goalsAndRationale.description' })}{' '}
							</div>
							<Form.Item name='mucTieuLyDo'>
								<Input.TextArea
									rows={6}
									placeholder={intl.formatMessage({ id: 'minor.idm.goalsAndRationale.placeholder' })}
									showCount
									maxLength={500}
								/>
							</Form.Item>
						</Panel>
					</Collapse>

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
									value: `${totalCredits} / ${minCredits}`,
								},
								{
									ok: !meetsMaxCompletedCredits,
									label: intl.formatMessage({ id: 'minor.idm.programDesign.creditsCompletedMax' }),
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
								<Form.Item name='khoiHpCtList'>
									<ProgramDesignTable
										data={khoiHpCtList}
										onDelete={handleDelete}
										hasTotal
										title={intl.formatMessage({ id: 'minor.idm.button.addNew' })}
										showEdit={showEdit}
										setShowEdit={setShowEdit}
										otherButtons={[
											<ButtonExtend
												key='add'
												icon={<PlusCircleOutlined />}
												onClick={() => setShowEdit(true)}
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
							onCancel={() => setShowEdit(false)}
							footer={null}
							title={intl.formatMessage({ id: 'minor.idm.programDesign.addCourse' })}
						>
							<FormHpBuild form={form} onCancel={() => setShowEdit(false)} />
						</Modal>
					</div>
				</Col>
			</Row>

			<FormFooter showPrevious onPrevious={onPrevious} onNext={onNext} />
		</>
	);
};

export default StepProgramDesign;
