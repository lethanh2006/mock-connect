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
		const isPersonal =
			phieuDkCtdtMe?.loai === ELoaiPhieuDkCtdt.PERSONAL ||
			!!phieuDkCtdtMe?.mucTieuLyDo ||
			(phieuDkCtdtMe?.khoiHpCtList?.length ?? 0) > 0 ||
			!!phieuDkCtdtMe?.hoTenCoVanHocTapChinh ||
			!!phieuDkCtdtMe?.maCoVanHocTapChinh;

		const steps: {
			title: string;
			status?: ETrangThaiDangKyChuyenNganh;
			commentType: PhieuDkCtdt.TCommentType;
			comment?: string;
		}[] = [];

		if (isPersonal) {
			steps.push({
				title: intl.formatMessage({ id: 'minor.idm.detail.process.advisorDecision' }),
				status: phieuDkCtdtMe?.trangThaiDuyetCVHT,
				commentType: 'ghiChuCVHT',
				comment: phieuDkCtdtMe?.ghiChuCVHT,
			});

			steps.push({
				title: intl.formatMessage({ id: 'minor.idm.detail.process.facultyDecision' }),
				status: phieuDkCtdtMe?.trangThaiDuyetKhoaBoMon,
				commentType: 'ghiChuBoMon',
				comment: phieuDkCtdtMe?.ghiChuBoMon,
			});
		}

		steps.push({
			title: intl.formatMessage({ id: 'minor.idm.detail.process.trainingDecision' }),
			status: phieuDkCtdtMe?.trangThaiDuyetQldt,
			commentType: 'ghiChuQldt',
			comment: phieuDkCtdtMe?.ghiChuQldt,
		});

		return steps;
	}, [intl, phieuDkCtdtMe]);

	const currentActiveStep = useMemo(() => {
		const idx = processSteps.findIndex(
			(s) =>
				!s.status ||
				s.status === ETrangThaiDangKyChuyenNganh.CHO_DUYET ||
				s.status === ETrangThaiDangKyChuyenNganh.KHONG_DUYET ||
				s.status === ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA,
		);
		return idx !== -1 ? idx : processSteps.length - 1;
	}, [processSteps]);

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
				<Steps
					direction='vertical'
					current={currentStep || currentActiveStep}
					onChange={onStepChange}
					size='small'
				>
					{processSteps.map((step, index) => {
						let antStatus: 'wait' | 'process' | 'finish' | 'error' = 'wait';
						if (step.status === ETrangThaiDangKyChuyenNganh.DA_DUYET) antStatus = 'finish';
						else if (step.status === ETrangThaiDangKyChuyenNganh.CHO_DUYET) antStatus = 'process';
						else if (
							step.status === ETrangThaiDangKyChuyenNganh.KHONG_DUYET ||
							step.status === ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA
						)
							antStatus = 'error';
						else if (index === currentActiveStep && !step.status) antStatus = 'process';

						return (
							<Steps.Step
								key={index}
								title={step.title}
								status={antStatus}
								description={
									<Space direction='vertical' size={4} style={{ marginTop: 4 }}>
										{step.status ? (
											<Tag color={colorTrangThaiDangKyChuyenNganh[step.status as ETrangThaiDangKyChuyenNganh]}>
												{trangThaiDangKyChuyenNganh[step.status as ETrangThaiDangKyChuyenNganh]}
											</Tag>
										) : (
											<span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)' }}>
												{index === currentActiveStep ? 'Đang xử lý' : 'Chưa đến bước này'}
											</span>
										)}
										{step.comment && onViewComments && (
											<Button type='primary' size='small' onClick={() => onViewComments(step.commentType)}>
												{intl.formatMessage({
													id:
														step.status === ETrangThaiDangKyChuyenNganh.KHONG_DUYET
															? 'minor.idm.detail.process.viewReason'
															: 'minor.idm.detail.process.viewNotes',
												})}
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
