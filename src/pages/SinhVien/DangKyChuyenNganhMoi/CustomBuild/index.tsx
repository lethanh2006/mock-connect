import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import { Breadcrumb, Card, Col, Form, Row, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { history, useIntl, useLocation, useModel } from 'umi';
import AlertBanners from '../History/components/AlertBanners';
import SidebarRequirements from './components/SidebarRequirements';
import StepBasicInfo from './components/steps/StepBasicInfo';
import StepProgramDesign from './components/steps/StepProgramDesign';
import StepReviewSubmit from './components/steps/StepReviewSubmit';
import StepSelectAdvisor from './components/steps/StepSelectAdvisor';

const IDMPage = () => {
	const intl = useIntl();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const loai = searchParams.get('loai') || 'minor';

	const isMinor = loai.toLowerCase() === 'minor';
	const pageTitle = intl.formatMessage({
		id: isMinor ? 'minor.build.pageTitle.minor' : 'minor.build.pageTitle.concentration',
	});
	const breadcrumbTitle = intl.formatMessage({
		id: isMinor ? 'minor.build.pageTitle.minor' : 'minor.build.pageTitle.concentration',
	});

	const [form] = Form.useForm();
	const {
		record: phieuDangKyHienTai,
		submitPhieuDangKy,
		fetchPhieuDangKyHienTai,
		updatePhieuDangKy,
	} = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	const { record: dotDangKy, fetchDotDangKy } = useModel('daotao.dotdkctdt');
	const formValues = Form.useWatch([], form);
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<any>({});

	useEffect(() => {
		if (!dotDangKy?._id) fetchDotDangKy(loai as 'minor' | 'concentration');
	}, [loai]);

	useEffect(() => {
		if (dotDangKy?._id) fetchPhieuDangKyHienTai(dotDangKy?._id);
	}, [dotDangKy?._id]);

	useEffect(() => {
		if (phieuDangKyHienTai) {
			setFormData((prev: any) => ({
				...prev,
				...phieuDangKyHienTai,
				hasDiscussedWithAdvisor: !!phieuDangKyHienTai?.hoTenCoVanHocTapPhu,
			}));

			form.setFieldsValue({
				...phieuDangKyHienTai,
				hasDiscussedWithAdvisor: !!phieuDangKyHienTai?.hoTenCoVanHocTapPhu,
			});
		}
	}, [phieuDangKyHienTai, form]);

	console.log(phieuDangKyHienTai, 'phieuDangKyHienTai');

	const steps = [
		intl.formatMessage({ id: 'minor.build.step.basicInfo' }),
		intl.formatMessage({ id: 'minor.build.step.selectAdvisor' }),
		intl.formatMessage({ id: 'minor.build.step.programDesign' }),
		intl.formatMessage({ id: 'minor.build.step.reviewSubmit' }),
	];

	useEffect(() => {
		if (formValues) {
			setFormData((prev: any) => ({
				...prev,
				...formValues,
			}));
		}
	}, [formValues]);

	useEffect(() => {
		if (phieuDangKyHienTai?.khoiHpCtList?.length && phieuDangKyHienTai?.khoiHpCtList?.length > 0) {
			setCurrentStep(3);
		} else if (phieuDangKyHienTai?.maCoVanHocTapPhu && phieuDangKyHienTai?.maCoVanHocTapPhu !== '') {
			setCurrentStep(2);
		} else if (phieuDangKyHienTai?.soDienThoai && phieuDangKyHienTai?.soDienThoai !== '') {
			setCurrentStep(1);
		}
	}, [phieuDangKyHienTai]);

	const onNext = async () => {
		await form.validateFields();

		const currentFormValues = form.getFieldsValue();
		let updatedFormData = {};

		updatedFormData = {
			...currentFormValues,
		};

		if (phieuDangKyHienTai?._id) await updatePhieuDangKy(phieuDangKyHienTai?._id, updatedFormData);

		setFormData(updatedFormData);
		setCurrentStep(currentStep + 1);
	};

	const onPrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		if (phieuDangKyHienTai?._id)
			await submitPhieuDangKy(
				phieuDangKyHienTai?._id,
				{
					loai: ELoaiPhieuDkCtdt.PERSONAL,
				},
				() => {
					history.push('/hoc-tap/khac#dang-ky-chuyen-nganh-hep');
				},
			);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return <StepBasicInfo onNext={onNext} form={form} />;
			case 1:
				return <StepSelectAdvisor onPrevious={onPrevious} onNext={onNext} form={form} />;
			case 2:
				return <StepProgramDesign onPrevious={onPrevious} onNext={onNext} form={form} />;
			case 3:
				return <StepReviewSubmit onPrevious={onPrevious} onSubmit={handleSubmit} formData={formData} />;
			default:
				return null;
		}
	};

	return (
		<Card
			title={pageTitle}
			className='card-big-title'
			extra={
				<Breadcrumb
					items={[
						{ title: intl.formatMessage({ id: 'minor.build.breadcrumb.study' }) },
						{
							title: breadcrumbTitle,
							onClick: () => history.push('/hoc-tap/dang-ky-chuyen-nganh/register?loai=' + loai),
						},
						{ title: isMinor ? 'IDM' : 'IDC' },
					]}
				/>
			}
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Card variant='borderless' style={{ height: 'fit-content', marginBottom: 16 }}>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								<AlertBanners type={loai as 'minor' | 'concentration'} buttonRegister={false} />
							</Col>
							<Steps
								labelPlacement='vertical'
								current={currentStep}
								onChange={(step) => {
									if (step <= currentStep) {
										setCurrentStep(step);
									}
								}}
							>
								{steps.map((step, index) => (
									<Steps.Step
										key={index}
										title={step}
										status={index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'}
									/>
								))}
							</Steps>
						</Row>
					</Card>
					<Card title={steps[currentStep] ?? ''} style={{ height: 'fit-content' }}>
						<Form form={form} layout='vertical'>
							{renderStepContent()}
						</Form>
					</Card>
				</Col>
				<SidebarRequirements />
			</Row>
		</Card>
	);
};

export default IDMPage;
