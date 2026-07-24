import UploadFile from '@/components/Upload/UploadFile';
import ModalExpandable from '@/components/Table/ModalExpandable';
import FormDangKyBHYT from '@/pages/BaoHiemYTe/components/FormDangKy';
import FormMienBHYT from '@/pages/BaoHiemYTe/components/FormMien';
import FormMienKiemTraSucKhoe from '@/pages/KiemTraSucKhoe/components/FormMien';
import type { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import type { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { formatDate } from '@/utils/formatDate';
import rules from '@/utils/rules';
import {
	BankOutlined,
	FormOutlined,
	HomeOutlined,
	InfoCircleFilled,
	SafetyCertificateOutlined,
	WarningFilled,
} from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Tag, message, type FormInstance } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { getLocale, useIntl, useModel } from 'umi';
import styles from './index.less';
import StudentHousingModal from './StudentHousingModal';

const enterContentText = 'Enter content';

const AdditionalServicesStep = ({ form }: { form: FormInstance<any> }) => {
	const intl = useIntl();

	// Models KiemTraSucKhoe
	const { getByIdModel: getKskPeriod, postSinhVienDangKyKhamModel, formSubmiting: loadingDangKyKham } =
		useModel('kiemtrasuckhoe.dotdangky');

	// Models BaoHiemYTe
	const { getByIdModel: getBhytPeriod } = useModel('baohiemyte.dotdangky');

	// Models KyTucXa
	const { getByIdModel: getDotDangKyKtx } = useModel('kytucxa.dotdangky');
	const { getModel: getLichSuDangKyKtx } = useModel('kytucxa.phieudangky');

	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');

	const alreadyHadCheckup: boolean | undefined = Form.useWatch('alreadyHadCheckup', form);
	const hasInsurance: boolean | undefined = Form.useWatch('hasInsurance', form);
	const isRegisterDormitory: boolean | undefined = Form.useWatch('isRegisterDormitory', form);

	// Modals & Registrations
	const [housingModalOpen, setHousingModalOpen] = useState(false);
	const [formMienKskModalOpen, setFormMienKskModalOpen] = useState(false);
	const [formDangKyBhytModalOpen, setFormDangKyBhytModalOpen] = useState(false);
	const [formMienBhytModalOpen, setFormMienBhytModalOpen] = useState(false);

	const [currentKskRecord, setCurrentKskRecord] = useState<KiemTraSucKhoe.IDotDangKy | undefined>(undefined);
	const [currentBhytRecord, setCurrentBhytRecord] = useState<BaoHiemYTe.IDotDangKy | undefined>(undefined);

	const [kskRegistration, setKskRegistration] = useState<any>(undefined);
	const [bhytRegistration, setBhytRegistration] = useState<any>(undefined);
	const [ktxPeriod, setKtxPeriod] = useState<any>(undefined);
	const [ktxRegistration, setKtxRegistration] = useState<any>(undefined);

	const fetchKtxRegistration = async () => {
		try {
			const dotRes: any = await getDotDangKyKtx('me/one', false);
			const dot = dotRes?.data ?? dotRes;
			setKtxPeriod(dot?._id ? dot : undefined);

			if (!dot?._id || dot?.isMienKyTucXa) {
				setKtxRegistration(undefined);
				return;
			}

			const lichSuRes: any = await getLichSuDangKyKtx(
				{ maDotId: dot._id },
				undefined,
				undefined,
				undefined,
				undefined,
				'me/page',
				undefined,
				false,
			);
			setKtxRegistration(lichSuRes?.[0]);
		} catch {
			setKtxPeriod(undefined);
			setKtxRegistration(undefined);
		}
	};

	useEffect(() => {
		getKskPeriod('me/current', false)
			.then((res: any) => {
				if (res?.myRegistration || res?.student?.declarationType) {
					setKskRegistration(res.myRegistration || res.student);
				}
			})
			.catch(() => setKskRegistration(undefined));

		getBhytPeriod('me/current', false)
			.then((res: any) => {
				if (res?.myRegistration || res?.student?.declarationType) {
					setBhytRegistration(res.myRegistration || res.student);
				}
			})
			.catch(() => setBhytRegistration(undefined));

		fetchKtxRegistration();
	}, []);

	const hasActiveKtxPeriod = Boolean(ktxPeriod?._id);

	const handleOpenHousingModal = () => {
		if (!hasActiveKtxPeriod) {
			message.warning(intl.formatMessage({ id: 'kytucxa.dangky.empty.noDotDangKy' }));
			return;
		}
		setHousingModalOpen(true);
	};

	const handleHousingSelectSuccess = () => {
		form.setFieldsValue({ isRegisterDormitory: true });
		fetchKtxRegistration();
	};

	// 1. Health Checkup Handlers
	const handleSelectHealthDangKy = async () => {
		form.setFieldsValue({ alreadyHadCheckup: false, healthCheckupAttachment: undefined });

		try {
			const res: any = await getKskPeriod('me/current', false);
			const period = res?.period;
			const student = res?.student ?? {};

			if (period?._id) {
				const payload: KiemTraSucKhoe.ISinhVienDangKy = {
					periodStudentId: (recordSinhVien as any)?.ssoId,
					periodId: period._id,
					fullName: student.fullName || [recordSinhVien?.firstName, recordSinhVien?.lastName].filter(Boolean).join(' '),
					studentCode: student.studentCode || recordSinhVien?.ma,
					ngaySinh: student.ngaySinh,
					cccd: student.cccd || recordSinhVien?.cccd,
					nationality: student.nationality || recordSinhVien?.quocTich,
					gioiTinh: student.gioiTinh || recordSinhVien?.gioiTinh,
					khoa: student.khoa,
					nganh: student.nganh,
					maKhoa: (recordSinhVien as any)?.maKhoaSinhVien,
					maNganh: (recordSinhVien as any)?.maNganh,
					phone: student.phone || recordSinhVien?.soDienThoai,
					email: student.email || recordSinhVien?.email,
				};
				await postSinhVienDangKyKhamModel(payload);
				setKskRegistration({ declarationType: 'DA_DANG_KY', createdAt: new Date() });
			} else {
				message.success(intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.chuaKham.title' }));
			}
		} catch (error) {
			console.error('Lỗi khi đăng ký khám sức khỏe:', error);
		}
	};

	const handleSelectHealthMien = async () => {
		form.setFieldsValue({ alreadyHadCheckup: true });
		try {
			const res: any = await getKskPeriod('me/current', false);
			if (res?.period) {
				const student = res?.student ?? {};
				setCurrentKskRecord({
					...res.period,
					periodId: res.period._id,
					student: {
						fullName: student.fullName || [recordSinhVien?.firstName, recordSinhVien?.lastName].filter(Boolean).join(' '),
						studentCode: student.studentCode || recordSinhVien?.ma,
						ngaySinh: student.ngaySinh,
						cccd: student.cccd || recordSinhVien?.cccd,
						nationality: student.nationality || recordSinhVien?.quocTich,
						gioiTinh: student.gioiTinh || recordSinhVien?.gioiTinh,
						khoa: student.khoa,
						nganh: student.nganh,
						phone: student.phone || recordSinhVien?.soDienThoai,
						email: student.email || recordSinhVien?.email,
					},
				});
			}
		} catch (error) {
			console.error('Lỗi khi lấy thông tin đợt khám:', error);
		}
		setFormMienKskModalOpen(true);
	};

	// 2. Health Insurance Handlers
	const handleSelectInsuranceDangKy = async () => {
		form.setFieldsValue({
			hasInsurance: false,
			healthInsuranceNumber: undefined,
			healthInsuranceAttachment: undefined,
		});

		try {
			const res: any = await getBhytPeriod('me/current', false);
			if (res?.period) {
				const student = res?.student ?? {};
				setCurrentBhytRecord({
					...res.period,
					periodId: res.period._id,
					student: {
						fullName: student.fullName || [recordSinhVien?.firstName, recordSinhVien?.lastName].filter(Boolean).join(' '),
						studentCode: student.studentCode || recordSinhVien?.ma,
						ngaySinh: student.ngaySinh,
						cccd: student.cccd || recordSinhVien?.cccd,
						nationality: student.nationality || recordSinhVien?.quocTich,
						gioiTinh: student.gioiTinh || recordSinhVien?.gioiTinh,
						khoa: student.khoa,
						nganh: student.nganh,
						phone: student.phone || recordSinhVien?.soDienThoai,
						email: student.email || recordSinhVien?.email,
					},
				});
			}
		} catch (error) {
			console.error('Lỗi khi lấy đợt BHYT:', error);
		}
		setFormDangKyBhytModalOpen(true);
	};

	const handleSelectInsuranceMien = async () => {
		form.setFieldsValue({ hasInsurance: true });

		try {
			const res: any = await getBhytPeriod('me/current', false);
			if (res?.period) {
				const student = res?.student ?? {};
				setCurrentBhytRecord({
					...res.period,
					periodId: res.period._id,
					student: {
						fullName: student.fullName || [recordSinhVien?.firstName, recordSinhVien?.lastName].filter(Boolean).join(' '),
						studentCode: student.studentCode || recordSinhVien?.ma,
						ngaySinh: student.ngaySinh,
						cccd: student.cccd || recordSinhVien?.cccd,
						nationality: student.nationality || recordSinhVien?.quocTich,
						gioiTinh: student.gioiTinh || recordSinhVien?.gioiTinh,
						khoa: student.khoa,
						nganh: student.nganh,
						phone: student.phone || recordSinhVien?.soDienThoai,
						email: student.email || recordSinhVien?.email,
					},
				});
			}
		} catch (error) {
			console.error('Lỗi khi lấy đợt BHYT:', error);
		}
		setFormMienBhytModalOpen(true);
	};

	const isKskRegistered = kskRegistration?.declarationType || alreadyHadCheckup === false;
	const isBhytRegistered = bhytRegistration?.declarationType || hasInsurance === false;

	const isKtxActuallyRegistered =
		Boolean(ktxRegistration?.formDon?._id) && ktxRegistration?.trangThaiThanhToan !== EMaTrangThaiThanhToan.DONG;
	const isDormitoryRegistered = Boolean(isRegisterDormitory) && isKtxActuallyRegistered;

	const formattedKtxSubmittedDate = formatDate(
		ktxRegistration?.createdAt || (ktxRegistration as any)?.createdAtTime || new Date(),
		getLocale().startsWith('vi') ? 'DD/MM/YYYY' : 'DD MMM YYYY',
	);

	const formattedKskSubmittedDate = formatDate(
		kskRegistration?.createdAt || new Date(),
		getLocale().startsWith('vi') ? 'DD/MM/YYYY' : 'DD MMM YYYY',
	);

	const formattedBhytSubmittedDate = formatDate(
		bhytRegistration?.createdAt || new Date(),
		getLocale().startsWith('vi') ? 'DD/MM/YYYY' : 'DD MMM YYYY',
	);

	return (
		<Fragment>
			{/* Hidden Form.Item so AntD Form registers field and triggers Form.useWatch */}
			<Form.Item name='alreadyHadCheckup' hidden>
				<Input />
			</Form.Item>
			<Form.Item name='hasInsurance' hidden>
				<Input />
			</Form.Item>

			{/* Card 1: Health Checkup */}
			<div className={styles.serviceCard}>
				<div className={styles.serviceHeader}>
					<div className={styles.serviceIconBox}>
						<FormOutlined />
					</div>
					<div className={styles.serviceTitle}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthCheckupTitle' })}
					</div>
				</div>

				{isKskRegistered ? (
					<Fragment>
						<div className={styles.dormitoryInfoAlert}>
							<InfoCircleFilled className={styles.infoIcon} />
							<div className={styles.infoText}>
								{alreadyHadCheckup === false
									? intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskRegisteredSchoolAlert' })
									: intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskExemptionAlert' })}
							</div>
						</div>

						<div className={styles.dormitoryExemptionCard}>
							<div className={styles.dormitoryExemptionHeader}>
								<div className={styles.dormitoryExemptionTitle}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskTitle' })}
								</div>
								<div className={styles.dormitoryExemptionTagWrap}>
									<Tag className={styles.dormitoryExemptionTag}>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.pendingApproval' })}
									</Tag>
									<div className={styles.dormitoryExemptionSubDate}>
										{intl.formatMessage(
											{ id: 'global.enrollmentDeclaration.additional.submittedDate' },
											{ date: formattedKskSubmittedDate },
										)}
									</div>
								</div>
							</div>
							<div className={styles.dormitoryExemptionBody}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskBody' })}
							</div>
						</div>

						<Button disabled block icon={<FormOutlined />} className={styles.actionButton}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskRegisteredBtn' })}
						</Button>

						<div className={styles.dormitoryUnavailableNote}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.kskUnavailableNote' })}
						</div>
					</Fragment>
				) : (
					<Fragment>
						<div className={styles.warningBox}>
							<WarningFilled className={styles.warningIcon} />
							<div className={styles.warningContent}>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthCheckupLine1' })}</div>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthCheckupLine2' })}</div>
							</div>
						</div>

						<Row gutter={[16, 16]}>
							<Col span={24} md={12}>
								<div
									className={`${styles.checkupOptionCard} ${alreadyHadCheckup === false ? styles.active : ''}`}
									onClick={handleSelectHealthDangKy}
								>
									<div className={styles.checkupOptionTitle}>
										{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.chuaKham.title' })}
									</div>
									<div className={styles.checkupOptionDesc}>
										{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.chuaKham.desc' })}
									</div>
									<div className={styles.checkupOptionAction}>
										<Button
											type='primary'
											loading={loadingDangKyKham}
											onClick={(e) => {
												e.stopPropagation();
												handleSelectHealthDangKy();
											}}
										>
											{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.chuaKham.button' })}
										</Button>
									</div>
								</div>
							</Col>

							<Col span={24} md={12}>
								<div
									className={`${styles.checkupOptionCard} ${alreadyHadCheckup === true ? styles.active : ''}`}
									onClick={handleSelectHealthMien}
								>
									<div className={styles.checkupOptionTitle}>
										{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.daKham.title' })}
									</div>
									<div className={styles.checkupOptionDesc}>
										{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.daKham.desc' })}
									</div>
									<div className={styles.checkupOptionAction}>
										<Button
											type={alreadyHadCheckup === true ? 'primary' : 'default'}
											onClick={(e) => {
												e.stopPropagation();
												handleSelectHealthMien();
											}}
										>
											{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.daKham.button' })}
										</Button>
									</div>
								</div>
							</Col>
						</Row>

						{alreadyHadCheckup === true && (
							<Form.Item
								name='healthCheckupAttachment'
								label={intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthCheckupAttachment' })}
								rules={[...rules.fileRequired]}
								style={{ marginTop: 16, marginBottom: 0 }}
							>
								<UploadFile
									buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
									maxCount={1}
									otherProps={{ className: styles.uploadButton }}
								/>
							</Form.Item>
						)}
					</Fragment>
				)}
			</div>

			{/* Card 2: Health Insurance */}
			<div className={styles.serviceCard}>
				<div className={styles.serviceHeader}>
					<div className={styles.serviceIconBox}>
						<SafetyCertificateOutlined />
					</div>
					<div className={styles.serviceTitle}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthInsuranceSection' })}
					</div>
				</div>

				{isBhytRegistered ? (
					<Fragment>
						<div className={styles.dormitoryInfoAlert}>
							<InfoCircleFilled className={styles.infoIcon} />
							<div className={styles.infoText}>
								{hasInsurance === false
									? intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytRegisteredSchoolAlert' })
									: intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytExemptionAlert' })}
							</div>
						</div>

						<div className={styles.dormitoryExemptionCard}>
							<div className={styles.dormitoryExemptionHeader}>
								<div className={styles.dormitoryExemptionTitle}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytTitle' })}
								</div>
								<div className={styles.dormitoryExemptionTagWrap}>
									<Tag className={styles.dormitoryExemptionTag}>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.pendingApproval' })}
									</Tag>
									<div className={styles.dormitoryExemptionSubDate}>
										{intl.formatMessage(
											{ id: 'global.enrollmentDeclaration.additional.submittedDate' },
											{ date: formattedBhytSubmittedDate },
										)}
									</div>
								</div>
							</div>
							<div className={styles.dormitoryExemptionBody}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytBody' })}
							</div>
						</div>

						<Button disabled block icon={<SafetyCertificateOutlined />} className={styles.actionButton}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytRegisteredBtn' })}
						</Button>

						<div className={styles.dormitoryUnavailableNote}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.bhytUnavailableNote' })}
						</div>
					</Fragment>
				) : (
					<Fragment>
						<div className={styles.warningBox}>
							<WarningFilled className={styles.warningIcon} />
							<div className={styles.warningContent}>
								<div className={styles.warningTitle}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthInsuranceTitle' })}
								</div>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthInsuranceLine1' })}</div>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.healthInsuranceLine2' })}</div>
							</div>
						</div>

						<Row gutter={[16, 16]}>
							<Col span={24} md={12}>
								<div
									className={`${styles.checkupOptionCard} ${hasInsurance === false ? styles.active : ''}`}
									onClick={handleSelectInsuranceDangKy}
								>
									<div className={styles.checkupOptionTitle}>
										{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.khongCoBHYT.title' })}
									</div>
									<div className={styles.checkupOptionDesc}>
										{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.khongCoBHYT.desc' })}
									</div>
									<div className={styles.checkupOptionAction}>
										<Button
											type='primary'
											onClick={(e) => {
												e.stopPropagation();
												handleSelectInsuranceDangKy();
											}}
										>
											{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.khongCoBHYT.button' })}
										</Button>
									</div>
								</div>
							</Col>

							<Col span={24} md={12}>
								<div
									className={`${styles.checkupOptionCard} ${hasInsurance === true ? styles.active : ''}`}
									onClick={handleSelectInsuranceMien}
								>
									<div className={styles.checkupOptionTitle}>
										{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.daCoBHYT.title' })}
									</div>
									<div className={styles.checkupOptionDesc}>
										{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.daCoBHYT.desc' })}
									</div>
									<div className={styles.checkupOptionAction}>
										<Button
											type={hasInsurance === true ? 'primary' : 'default'}
											onClick={(e) => {
												e.stopPropagation();
												handleSelectInsuranceMien();
											}}
										>
											{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.daCoBHYT.button' })}
										</Button>
									</div>
								</div>
							</Col>
						</Row>

						{hasInsurance === true && (
							<Row gutter={16} style={{ marginTop: 16 }}>
								<Col span={24} md={12}>
									<Form.Item
										name='healthInsuranceNumber'
										label={intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.insuranceCardNumber' })}
										rules={[...rules.required]}
									>
										<Input placeholder={enterContentText} />
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item
										name='healthInsuranceAttachment'
										label={intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.insuranceAttachment' })}
										rules={[...rules.fileRequired]}
									>
										<UploadFile
											buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
											maxCount={1}
											otherProps={{ className: styles.uploadButton }}
										/>
									</Form.Item>
								</Col>
							</Row>
						)}
					</Fragment>
				)}
			</div>

			{/* Card 3: Dormitory Registration */}
			<div className={styles.serviceCard}>
				<div className={styles.serviceHeader}>
					<div className={styles.serviceIconBox}>
						<HomeOutlined />
					</div>
					<div className={styles.serviceTitle}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitorySection' })}
					</div>
				</div>

				{isDormitoryRegistered ? (
					<Fragment>
						<div className={styles.dormitoryInfoAlert}>
							<InfoCircleFilled className={styles.infoIcon} />
							<div className={styles.infoText}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitoryExemptionAlert' })}
							</div>
						</div>

						<div className={styles.dormitoryExemptionCard}>
							<div className={styles.dormitoryExemptionHeader}>
								<div className={styles.dormitoryExemptionTitle}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitoryExemptionTitle' })}
								</div>
								<div className={styles.dormitoryExemptionTagWrap}>
									<Tag className={styles.dormitoryExemptionTag}>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.pendingApproval' })}
									</Tag>
									<div className={styles.dormitoryExemptionSubDate}>
										{intl.formatMessage(
											{ id: 'global.enrollmentDeclaration.additional.submittedDate' },
											{ date: formattedKtxSubmittedDate },
										)}
									</div>
								</div>
							</div>
							<div className={styles.dormitoryExemptionBody}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitoryExemptionBody' })}
							</div>
						</div>

						<Form.Item name='isRegisterDormitory' valuePropName='checked' style={{ marginBottom: 0 }}>
							<Button disabled block icon={<BankOutlined />} className={styles.actionButton}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.applyDormitory' })}
							</Button>
						</Form.Item>

						{/* <div className={styles.dormitoryUnavailableNote}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitoryUnavailableNote' })}
						</div> */}
					</Fragment>
				) : (
					<Fragment>
						<div className={styles.warningBox}>
							<WarningFilled className={styles.warningIcon} />
							<div className={styles.warningContent}>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.dormitoryTitle' })}</div>
							</div>
						</div>

						{!hasActiveKtxPeriod && (
							<div className={styles.warningBox} style={{ marginTop: 8 }}>
								<WarningFilled className={styles.warningIcon} />
								<div className={styles.warningContent}>
									<div>{intl.formatMessage({ id: 'kytucxa.dangky.empty.noDotDangKy' })}</div>
								</div>
							</div>
						)}

						<Form.Item name='isRegisterDormitory' valuePropName='checked' style={{ marginBottom: 0 }}>
							<Button
								type='primary'
								block
								icon={<BankOutlined />}
								className={styles.actionButton}
								disabled={!hasActiveKtxPeriod}
								onClick={handleOpenHousingModal}
							>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.applyDormitory' })}
							</Button>
						</Form.Item>
					</Fragment>
				)}
			</div>

			{/* Modal KSK Miễn */}
			<ModalExpandable
				title={
					<span style={{ color: '#0E50CF', fontWeight: 600, fontSize: 18 }}>
						{intl.formatMessage({ id: 'kiemtrasuckhoe.dangky.choiceModal.daKham.title' })}
					</span>
				}
				open={formMienKskModalOpen}
				onCancel={() => setFormMienKskModalOpen(false)}
				width={800}
				footer={null}
			>
				<FormMienKiemTraSucKhoe
					record={currentKskRecord}
					isView={false}
					edit={false}
					onCancel={() => setFormMienKskModalOpen(false)}
				/>
			</ModalExpandable>

			{/* Modal BHYT Đăng ký */}
			<ModalExpandable
				title={
					<span style={{ color: '#0E50CF', fontWeight: 600, fontSize: 18 }}>
						{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.khongCoBHYT.title' })}
					</span>
				}
				open={formDangKyBhytModalOpen}
				onCancel={() => setFormDangKyBhytModalOpen(false)}
				width={800}
				footer={null}
			>
				<FormDangKyBHYT
					record={currentBhytRecord}
					isView={false}
					onCancel={() => setFormDangKyBhytModalOpen(false)}
				/>
			</ModalExpandable>

			{/* Modal BHYT Miễn / Khai báo */}
			<ModalExpandable
				title={
					<span style={{ color: '#0E50CF', fontWeight: 600, fontSize: 18 }}>
						{intl.formatMessage({ id: 'baohiemyte.dangky.choiceModal.daCoBHYT.title' })}
					</span>
				}
				open={formMienBhytModalOpen}
				onCancel={() => setFormMienBhytModalOpen(false)}
				width={800}
				footer={null}
			>
				<FormMienBHYT
					record={currentBhytRecord}
					isView={false}
					edit={false}
					onCancel={() => setFormMienBhytModalOpen(false)}
				/>
			</ModalExpandable>

			{/* Modal Student Housing */}
			<StudentHousingModal
				open={housingModalOpen}
				onClose={() => setHousingModalOpen(false)}
				onSelectSuccess={handleHousingSelectSuccess}
			/>
		</Fragment>
	);
};

export default AdditionalServicesStep;
