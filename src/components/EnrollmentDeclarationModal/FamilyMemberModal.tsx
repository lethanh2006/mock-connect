import MyDatePicker from '@/components/MyDatePicker';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDiaChiHoSoFormItem from '@/pages/Core/DonViHanhChinh/SelectDiaChiHoSo';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Tooltip } from 'antd';
import { useEffect, useMemo } from 'react';
import { useIntl } from 'umi';
import { getFamilyRelationshipOptions, getTrainingLevelOptions } from './guardianConstants';
import styles from './index.less';
import type { TFamilyMember } from './typing';

const PHONE_COUNTRY_OPTIONS = [
	{ value: '+84', label: 'VietNam (+84)' },
	{ value: '+1', label: 'USA (+1)' },
	{ value: '+82', label: 'Korea (+82)' },
	{ value: '+86', label: 'China (+86)' },
];

type FamilyMemberModalProps = {
	open: boolean;
	initialValues?: TFamilyMember;
	listTinh?: DonViHanhChinh.IRecord[];
	onClose: () => void;
	onSave: (values: TFamilyMember) => void;
};

const FamilyMemberModal = ({ open, initialValues, listTinh, onClose, onSave }: FamilyMemberModalProps) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const quocTich = Form.useWatch('quocTich', form);
	const isVietnam = !quocTich || quocTich === 'Việt Nam' || quocTich === 'VietNam' || quocTich === 'VN';

	const relationshipOptions = useMemo(() => getFamilyRelationshipOptions(intl), [intl]);
	const trainingLevelOptions = useMemo(() => getTrainingLevelOptions(intl), [intl]);

	useEffect(() => {
		if (!open) return;
		form.resetFields();
		if (initialValues) form.setFieldsValue(initialValues);
	}, [open, initialValues]);

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			onSave({ ...initialValues, ...values });
		} catch (error) {
			console.error(error);
		}
	};

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });
	const selectText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.select' });

	return (
		<Modal open={open} onCancel={onClose} closable={false} footer={null} width={1000} centered className={styles.declarationModal}>
			<div className={styles.header}>
				<h1 className={styles.title}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.title' })}</h1>
				<Button type='text' icon={<span>✕</span>} className={styles.closeButton} onClick={onClose} />
			</div>

			<div className={styles.content} style={{ maxHeight: '75vh' }}>
				<Form form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item name='loaiThanhVien' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.relationship' })} rules={[...rules.required]}>
								<Select placeholder={enterContentText} options={relationshipOptions} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='fullName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.fullName' })} rules={[...rules.required, ...rules.ten]}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='ngaySinh' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.dob' })}>
								<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='quocTich' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.nationality' })} initialValue='Việt Nam'>
								<SelectQuocTich allowClear selectTen />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='danToc' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.ethnicity' })}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.phone' })} required={isVietnam}>
								<Input.Group compact style={{ display: 'flex' }}>
									<Form.Item name='maVungDienThoai' noStyle initialValue={isVietnam ? '+84' : '+1'}>
										<Select style={{ width: 150 }} options={PHONE_COUNTRY_OPTIONS} />
									</Form.Item>
									<Form.Item
										name='soDienThoai'
										noStyle
										rules={[...(isVietnam ? rules.required : []), ...rules.phoneOnlyDigits]}
									>
										<Input style={{ flex: 1 }} placeholder={enterContentText} />
									</Form.Item>
								</Input.Group>
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='soDienThoai2' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.secondaryPhone' })} rules={[...rules.phoneOnlyDigits]}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='email' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.email' })} rules={[...rules.email]}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='tonGiao' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.religion' })}>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='ngheNghiep' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.occupation' })}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='coQuanCongTac' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.employer' })}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='trinhDoDaoTao' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.trainingLevel' })} initialValue='Undergraduate'>
								<Select placeholder={enterContentText} allowClear options={trainingLevelOptions} />
							</Form.Item>
						</Col>
					</Row>

					{isVietnam && (
						<>
							<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.permanentResidence' })}</div>
							<Form.Item name='hoKhauThuongTru'>
								<SelectDiaChiHoSoFormItem
									listTinh={listTinh}
									labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
									placeholderTinh={enterContentText}
									labelXaPhuong={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.communeWard' })}
									placeholderXaPhuong={enterContentText}
								/>
							</Form.Item>
						</>
					)}

					<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.currentAddress' })}</div>
					{isVietnam ? (
						<Form.Item name='diaChiHienNay'>
							<SelectDiaChiHoSoFormItem
								listTinh={listTinh}
								hasSoNha
								labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
								placeholderTinh={enterContentText}
								labelXaPhuong={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.communeWard' })}
								placeholderXaPhuong={enterContentText}
								labelSoNha={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.houseNumber' })}
								placeholderSoNha={enterContentText}
							/>
						</Form.Item>
					) : (
						<Row gutter={[12, 0]}>
							<Col span={24} md={12}>
								<Form.Item name={['diaChiHienNay', 'quocGia']} label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })}>
									<SelectQuocTich allowClear selectTen placeholder={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })} />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name={['diaChiHienNay', 'tenTP']} label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
						</Row>
					)}

					{isVietnam && (
						<Row gutter={[12, 0]}>
							<Col span={24} md={12}>
								<Form.Item name='soTheBHYT' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.healthInsuranceCard' })}>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='hoatDongChinhTriXaHoi' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.politicalSocialActivities' })}>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
						</Row>
					)}

					<Form.Item name='laLienLacKhanCap' valuePropName='checked'>
						<Checkbox>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.emergencyContact' })}{' '}
							<Tooltip title={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.emergencyContactTooltip' })}>
								<InfoCircleOutlined />
							</Tooltip>
						</Checkbox>
					</Form.Item>
					<Form.Item name='taoTaiKhoan' valuePropName='checked'>
						<Checkbox>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.createAccount' })}{' '}
							<Tooltip title={intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.createAccountTooltip' })}>
								<InfoCircleOutlined />
							</Tooltip>
						</Checkbox>
					</Form.Item>
				</Form>
			</div>

			<div className={styles.footer}>
				<Button onClick={onClose}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.close' })}</Button>
				<Button type='primary' onClick={handleSave}>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.familyModal.save' })}
				</Button>
			</div>
		</Modal>
	);
};

export default FamilyMemberModal;
