import {
	colorTrangThaiDangKyChuyenNganh,
	ETrangThaiDangKyChuyenNganh,
	trangThaiDangKyChuyenNganh,
} from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import { PhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/typing';
import { useModel } from '@umijs/max';
import { Affix, Button, Card, Space, Steps, Tag } from 'antd';
import { useMemo } from 'react';
import { useIntl } from 'umi';

interface ProcessStepsSidebarProps {
	currentStep: number;
	onStepChange: (step: number) => void;
	onViewComments?: (commentType: PhieuDkCtdt.TCommentType) => void;
	showViewCommentsStepIndex?: number;
	affixOffsetTop?: number;
}

const ProcessStepsSidebar = ({
	currentStep,
	onStepChange,
	onViewComments,
	affixOffsetTop = 64,
}: ProcessStepsSidebarProps) => {
	const intl = useIntl();
	const { record: phieuDkCtdtMe } = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');

	const processSteps = useMemo(() => {
		const isPersonal = phieuDkCtdtMe?.loai === ELoaiPhieuDkCtdt.PERSONAL;
		const isFinal = [ETrangThaiDangKyChuyenNganh.DA_DUYET, ETrangThaiDangKyChuyenNganh.KHONG_DUYET].includes(
			phieuDkCtdtMe?.trangThai as any,
		);
		const getStepStatus = (s?: ETrangThaiDangKyChuyenNganh) => (isFinal ? phieuDkCtdtMe?.trangThai : s);

		const steps: {
			title: string;
			status?: ETrangThaiDangKyChuyenNganh;
			commentType: PhieuDkCtdt.TCommentType;
			comment?: string;
		}[] = [];

		if (isPersonal) {
			steps.push({
				title: intl.formatMessage({ id: 'minor.idm.detail.process.advisorDecision' }),
				status: getStepStatus(phieuDkCtdtMe?.trangThaiDuyetCVHT),
				commentType: 'ghiChuCVHT',
				comment: phieuDkCtdtMe?.ghiChuCVHT,
			});
		}

		steps.push({
			title: intl.formatMessage({ id: 'minor.idm.detail.process.facultyDecision' }),
			status: getStepStatus(phieuDkCtdtMe?.trangThaiDuyetKhoaBoMon),
			commentType: 'ghiChuBoMon',
			comment: phieuDkCtdtMe?.ghiChuBoMon,
		});

		steps.push({
			title: intl.formatMessage({ id: 'minor.idm.detail.process.trainingDecision' }),
			status: getStepStatus(phieuDkCtdtMe?.trangThaiDuyetQldt),
			commentType: 'ghiChuQldt',
			comment: phieuDkCtdtMe?.ghiChuQldt,
		});

		return steps;
	}, [intl, phieuDkCtdtMe]);

	const lastApproveIdx = useMemo(
		() => processSteps.findLastIndex((s) => s.status === ETrangThaiDangKyChuyenNganh.DA_DUYET),
		[processSteps],
	);

	return (
		<Affix offsetTop={affixOffsetTop}>
			<Card
				title={intl.formatMessage({ id: 'minor.idm.detail.process.title' })}
				extra={
					phieuDkCtdtMe?.trangThai && (
						<Tag color={colorTrangThaiDangKyChuyenNganh[phieuDkCtdtMe.trangThai]}>
							{trangThaiDangKyChuyenNganh[phieuDkCtdtMe.trangThai]}
						</Tag>
					)
				}
			>
				<Steps direction='vertical' current={currentStep} onChange={onStepChange} size='small'>
					{processSteps.map((step, index) => {
						let antStatus: 'wait' | 'process' | 'finish' | 'error' = 'wait';
						if (lastApproveIdx !== -1 && index <= lastApproveIdx) antStatus = 'finish';
						else if (step.status === ETrangThaiDangKyChuyenNganh.DA_DUYET) antStatus = 'finish';
						else if (step.status === ETrangThaiDangKyChuyenNganh.CHO_DUYET) antStatus = 'process';
						else if (
							step.status === ETrangThaiDangKyChuyenNganh.KHONG_DUYET ||
							step.status === ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA
						)
							antStatus = 'error';

						return (
							<Steps.Step
								key={index}
								title={step.title}
								status={antStatus}
								description={
									<Space direction='vertical'>
										<Tag color={colorTrangThaiDangKyChuyenNganh[step.status as ETrangThaiDangKyChuyenNganh]}>
											{trangThaiDangKyChuyenNganh[step.status as ETrangThaiDangKyChuyenNganh]}
										</Tag>
										{step.comment && onViewComments && (
											<Button type='primary' size='small' onClick={() => onViewComments(step.commentType)}>
												{intl.formatMessage({ id: 'minor.idm.detail.process.viewComments' })}
											</Button>
										)}
									</Space>
								}
							/>
						);
					})}
				</Steps>
			</Card>
		</Affix>
	);
};

export default ProcessStepsSidebar;
