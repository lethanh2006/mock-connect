import ModalExpandable from '@/components/Table/ModalExpandable';
import { primaryColor } from '@/services/base/constant';
import { thongTinWithdraw } from '@/services/HocTap/LopHocPhan';
import { ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';
import { Button, Checkbox, Descriptions, Divider, Flex, Space, Spin, Steps, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useIntl, useModel } from 'umi';

type Props = {
	visible: boolean;
	setVisible: (val: boolean) => void;
};

const { Text, Paragraph } = Typography;

const getWithdrawResult = (
	currentProgress: number,
	totalWCredits: number,
	maxWCredits: number,
	maxPercent: number,
): 'W' | 'F' => {
	const isOverPercent = currentProgress > maxPercent;
	const isOverWLimit = totalWCredits >= maxWCredits;

	if (!isOverPercent && !isOverWLimit) return ELoaiDiemChu.W;
	return ELoaiDiemChu.F;
};

const ModalWithdraw: React.FC<Props> = ({ visible, setVisible }) => {
	const intl = useIntl();
	const { record: recLHP, postWithdrawModel, formSubmiting } = useModel('lophocphan.lophocphan');
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0);
	const [confirmed, setConfirmed] = useState(false);
	const [record, setRecord] = useState<{
		gioiHanTinChiW: number;
		gioiHanPhanTram: number;
		tongTinChiW: number;
		tongSoBuoi: number;
		soBuoiDaQua: number;
	}>();

	useEffect(() => {
		if (!visible) return;

		setStep(0);
		setConfirmed(false);

		if (recLHP?._id) {
			setLoading(true);
			thongTinWithdraw(recLHP._id)
				.then((res) => setRecord(res?.data?.data))
				.finally(() => setLoading(false));
		}
	}, [recLHP?._id, visible]);

	const currentProgress = record?.tongSoBuoi ? Math.round((record.soBuoiDaQua / record.tongSoBuoi) * 100) : 0;
	const totalWCredits = record?.tongTinChiW || 0;
	const maxWCredits = record?.gioiHanTinChiW || 0;
	const maxPercent = record?.gioiHanPhanTram || 0;
	const soTinChi = recLHP?.hocPhan?.soTinChi ?? 0;
	const creditsAfter = totalWCredits + soTinChi;

	const result = getWithdrawResult(currentProgress, totalWCredits, maxWCredits, maxPercent);
	const isW = result === ELoaiDiemChu.W;

	const maLop = recLHP?.ten || recLHP?.soThuTuLop || recLHP?.maLop || '--';
	const maHocPhan = recLHP?.hocPhan?.ma || recLHP?.maHocPhan || '--';
	const facultyNames =
		(recLHP?.nhanSuList ?? [])
			.map((item) => item?.nhanSu?.hoTen ?? item?.tenNhanSu)
			.filter(Boolean)
			.join(', ') || '--';

	const policyRules = [
		{
			icon: 'W',
			color: undefined as string | undefined,
			text: intl.formatMessage({ id: 'lophocphan.withdraw.policy.rule.w' }, { percent: maxPercent }),
		},
		{
			icon: 'F',
			color: '#c41d1d',
			text: intl.formatMessage({ id: 'lophocphan.withdraw.policy.rule.f' }, { percent: maxPercent }),
		},
		{
			icon: String(maxWCredits || 18),
			color: undefined,
			text: intl.formatMessage({ id: 'lophocphan.withdraw.policy.rule.max' }, { max: maxWCredits }),
		},
	];

	const impactItems = isW
		? [
				intl.formatMessage({ id: 'lophocphan.withdraw.outcome.impact.w.1' }),
				intl.formatMessage({ id: 'lophocphan.withdraw.outcome.impact.w.2' }),
			]
		: [
				intl.formatMessage({ id: 'lophocphan.withdraw.outcome.impact.f.1' }),
				intl.formatMessage({ id: 'lophocphan.withdraw.outcome.impact.f.2' }),
			];

	const handleClose = () => setVisible(false);

	const handleConfirm = () => {
		if (!recLHP?._id || !confirmed) return;
		postWithdrawModel({ lopHpSvId: recLHP._id }).then(() => history.push('/hoc-tap/lop-tin-chi'));
	};

	return (
		<ModalExpandable
			title={intl.formatMessage({ id: 'lophocphan.withdraw.title' })}
			open={visible}
			onCancel={handleClose}
			footer={null}
			width={920}
			destroyOnClose
		>
			<Spin spinning={loading}>
				<Steps
					current={step}
					size='small'
					style={{ marginBottom: 12 }}
					items={[
						{
							title: intl.formatMessage({ id: 'lophocphan.withdraw.step.policy' }),
						},
						{
							title: intl.formatMessage({ id: 'lophocphan.withdraw.step.outcome' }),
						},
					]}
				/>

				{step === 0 ? (
					<Space direction='vertical' size='middle' style={{ width: '100%' }}>
						<Divider orientation='left' className='divider-big-title' dashed style={{ marginTop: 0 }}>
							{intl.formatMessage({ id: 'lophocphan.withdraw.step.policy' })}
						</Divider>

						<Paragraph style={{ marginBottom: 0 }}>
							{intl.formatMessage({ id: 'lophocphan.withdraw.policy.intro' })}
						</Paragraph>

						<Space direction='vertical' size='middle' style={{ width: '100%' }}>
							{policyRules.map((rule) => (
								<Flex key={rule.icon} gap={16} align='flex-start'>
									<Text strong style={{ fontSize: 28, lineHeight: 1, color: rule.color, minWidth: 40 }}>
										{rule.icon}
									</Text>
									<Text>{rule.text}</Text>
								</Flex>
							))}
						</Space>

						<Paragraph style={{ marginBottom: 0 }}>
							{intl.formatMessage(
								{ id: 'lophocphan.withdraw.policy.outro' },
								{
									irreversible: (
										<Text strong>{intl.formatMessage({ id: 'lophocphan.withdraw.policy.irreversible' })}</Text>
									),
								},
							)}
						</Paragraph>
					</Space>
				) : (
					<Space direction='vertical' size='small' style={{ width: '100%' }}>
						<div>
							<Divider size='small' orientation='left' className='divider-big-title' dashed style={{ marginTop: 0 }}>
								{intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo' })}
							</Divider>
							<Descriptions column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2 }} size='small'>
								<Descriptions.Item span={2} label={intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo.name' })}>
									{recLHP?.hocPhan?.ten ?? '--'}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo.code' })}>
									{maHocPhan}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo.credits' })}>
									{soTinChi || '--'}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo.section' })}>
									{maLop}
								</Descriptions.Item>
								<Descriptions.Item
									label={intl.formatMessage({ id: 'lophocphan.withdraw.courseInfo.faculty' })}
									span={2}
								>
									{facultyNames}
								</Descriptions.Item>
							</Descriptions>
						</div>

						<div>
							<Divider size='small' orientation='left' className='divider-big-title' dashed>
								{intl.formatMessage({ id: 'lophocphan.withdraw.statusTitle' })}
							</Divider>
							<Descriptions column={1} size='small'>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.status' })}>
									{totalWCredits} / {maxWCredits}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.status.after' })}>
									{creditsAfter} / {maxWCredits}
								</Descriptions.Item>
							</Descriptions>
						</div>

						<div>
							<Divider size='small' orientation='left' className='divider-big-title' dashed>
								{intl.formatMessage({ id: 'lophocphan.withdraw.outcomeTitle' })}
							</Divider>
							<Descriptions column={1} size='small'>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.outcome.status' })}>
									{intl.formatMessage({ id: 'lophocphan.withdraw.outcome.status.value' })}
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.outcome.grade' })}>
									<Text strong type={isW ? undefined : 'danger'} style={isW ? undefined : { color: '#c41d1d' }}>
										{intl.formatMessage({
											id: isW ? 'lophocphan.withdraw.outcome.grade.w' : 'lophocphan.withdraw.outcome.grade.f',
										})}
									</Text>
								</Descriptions.Item>
								<Descriptions.Item label={intl.formatMessage({ id: 'lophocphan.withdraw.outcome.impact' })}>
									<ul style={{ margin: 0, paddingLeft: 20 }}>
										{impactItems.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</Descriptions.Item>
							</Descriptions>
						</div>

						<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
							<Text style={{ color: primaryColor }}>
								{intl.formatMessage({ id: 'lophocphan.withdraw.confirmCheckbox' })}
							</Text>
						</Checkbox>
					</Space>
				)}

				<div className='form-footer'>
					{step === 0 ? (
						<>
							<Button type='primary' onClick={() => setStep(1)}>
								{intl.formatMessage({ id: 'global.button.tieptheo' })}
							</Button>
							<Button onClick={handleClose}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
						</>
					) : (
						<>
							<Button type='primary' loading={formSubmiting} disabled={!confirmed} onClick={handleConfirm}>
								{intl.formatMessage({ id: 'lophocphan.withdraw.confirm' })}
							</Button>
							<Button onClick={() => setStep(0)}>{intl.formatMessage({ id: 'global.button.quaylai' })}</Button>
						</>
					)}
				</div>
			</Spin>
		</ModalExpandable>
	);
};

export default ModalWithdraw;
