import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EGiayToCanNopType } from '@/services/DaoTao/DotNhapHoc/constant';
import rules from '@/utils/rules';
import { CheckCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Table, Tooltip, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Fragment, useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';
import styles from './index.less';
import SectionHeader from './SectionHeader';
import type { DotNhapHoc } from '@/services/DaoTao/DotNhapHoc/typings';

const isForeignNationalityText = (nationality?: string) => {
	if (!nationality) return false;
	const normalized = nationality
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	return !normalized.includes('viet nam');
};

const BANK_OPTIONS = [
	'Vietcombank',
	'BIDV',
	'Agribank',
	'VietinBank',
	'Techcombank',
	'MB Bank',
	'ACB',
	'VPBank',
	'Sacombank',
	'TPBank',
].map((name) => ({ value: name, label: name }));

const PHONE_COUNTRY_OPTIONS = [
	{ value: '+84', label: 'VietNam (+84)' },
	{ value: '+1', label: 'USA (+1)' },
	{ value: '+82', label: 'Korea (+82)' },
	{ value: '+86', label: 'China (+86)' },
];

/** Placeholder — no such catalog exists in this codebase yet. */
const VISA_TYPE_OPTIONS = [
	{ value: 'Student Visa (DH)', label: 'Student Visa (DH)' },
	{ value: 'Tourist Visa (DL)', label: 'Tourist Visa (DL)' },
	{ value: 'Business Visa (DN)', label: 'Business Visa (DN)' },
	{ value: 'Other', label: 'Other' },
];

/** Placeholder — no such catalog exists in this codebase yet. */
const VISA_ISSUING_AUTHORITY_OPTIONS = [
	{ value: 'Vietnam Immigration Department', label: 'Vietnam Immigration Department' },
	{ value: 'Embassy/Consulate of Vietnam', label: 'Embassy/Consulate of Vietnam' },
	{ value: 'Other', label: 'Other' },
];

const getDocumentColumns = (intl: IntlShape): ColumnsType<DotNhapHoc.IGiayToCanNopNhapHoc> => [
	{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.no' }), width: 56, render: (_, __, index) => index + 1 },
	{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.name' }), dataIndex: 'ten' },
	{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.quantity' }), dataIndex: 'soLuong', width: 90, align: 'center' },
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.required' }),
		dataIndex: 'required',
		width: 90,
		align: 'center',
		render: (required?: boolean) => (required ? <CheckCircleFilled style={{ color: '#57a443' }} /> : null),
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.type' }),
		dataIndex: 'type',
		width: 120,
		render: (type?: EGiayToCanNopType[]) =>
			type?.map((item) => (
				<div key={item}>
					{item === EGiayToCanNopType.BAN_MEM
						? intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.typeSoft' })
						: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.typeHard' })}
				</div>
			)),
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.notes' }),
		dataIndex: 'huongDan',
		render: (huongDan: string | undefined, row) => (
			<Fragment>
				{huongDan}
				{row.urlFileHuongDan && (
					<div>
						<a href={row.urlFileHuongDan} target='_blank' rel='noreferrer'>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.viewSample' })}
						</a>
					</div>
				)}
			</Fragment>
		),
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.attachment' }),
		key: 'attachment',
		width: 160,
		render: (_, row) => (
			<Form.Item name={`document_${row.id}`} noStyle>
				<UploadFile buttonSize='small' buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })} maxCount={1} isPrivate />
			</Form.Item>
		),
	},
];

const PersonalInformationStep = ({
	form,
	listTinh,
	listLoaiKhuyetTat,
}: {
	form: FormInstance<any>;
	listTinh?: DonViHanhChinh.IRecord[];
	listLoaiKhuyetTat?: LoaiKhuyetTat.IRecord[];
}) => {
	const intl = useIntl();
	const adjustmentNeeds: string[] = Form.useWatch('adjustmentNeeds', form) ?? [];
	const nationality: string | undefined = Form.useWatch('nationality', form);
	const maQuocTich: string | undefined = Form.useWatch('maQuocTich', form);
	const hasHealthProblem: boolean | undefined = Form.useWatch('hasHealthProblem', form);
	const isForeignNational = isForeignNationalityText(nationality);
	const { danhSach: quocTichList } = useModel('core.quoctich');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const documentRows = recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [];

	const documentColumns = useMemo(() => getDocumentColumns(intl), [intl]);

	useEffect(() => {
		const found = quocTichList?.find((item) => item.tenQuocTich === nationality);
		form.setFieldsValue({ maQuocTich: found?.ma });
	}, [nationality, quocTichList]);

	const handleSameAsResidence = (checked: boolean) => {
		if (!checked) return;
		form.setFieldsValue({
			tinhTpThuongTru: form.getFieldValue('tinhTpKhaiBao'),
			maTinhTpThuongTru: form.getFieldValue('maTinhTpKhaiBao'),
			xaPhuongThuongTru: form.getFieldValue('xaPhuongKhaiBao'),
			maXaPhuongThuongTru: form.getFieldValue('maXaPhuongKhaiBao'),
		});
	};

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });
	const selectText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.select' });

	return (
		<Fragment>
			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.personalInfo' })}</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='firstName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.firstName' })} rules={[...rules.required, ...rules.ten]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='middleName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.middleName' })} rules={[...rules.ten]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='lastName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.lastName' })} rules={[...rules.required, ...rules.ten]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='dob' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.dob' })} rules={[...rules.required, ...rules.ngaySinh]}>
						<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='gender' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.gender' })} rules={[...rules.required]}>
						<Select
							placeholder={enterContentText}
							options={[
								{ value: 'Nam', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.male' }) },
								{ value: 'Nữ', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.female' }) },
								{ value: 'Khác', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.other' }) },
							]}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.phone' })} required>
						<Input.Group compact style={{ display: 'flex' }}>
							<Form.Item name='phoneCountryCode' noStyle initialValue='+84'>
								<Select style={{ width: 150 }} options={PHONE_COUNTRY_OPTIONS} />
							</Form.Item>
							<Form.Item name='phoneNumber' noStyle rules={[...rules.required, ...rules.phoneOnlyDigits]}>
								<Input style={{ flex: 1 }} placeholder={enterContentText} />
							</Form.Item>
						</Input.Group>
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='nationalIdNumber' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.nationalId' })} rules={[...rules.CMND]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='issueDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.issueDate' })} rules={[...rules.truocHomNay]}>
						<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='placeOfIssue' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.placeOfIssue' })}
						rules={[...rules.text, ...rules.length(250)]}
					>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>

				<Col span={12} md={8}>
					<Form.Item name='vinuniAccount' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.vinuniAccount' })} rules={[...rules.required, ...rules.email]}>
						<Input disabled={!!recSinhVien?.email} placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={12} md={8}>
					<Form.Item name='postalCode' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.postalCode' })} rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
			</Row>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.additionalInfo' })}</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='nationality' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.nationality' })} rules={[...rules.required]}>
						<SelectQuocTich allowClear selectTen />
					</Form.Item>
					<Form.Item name='maQuocTich' noStyle>
						<Input type='hidden' />
					</Form.Item>
				</Col>

				{isForeignNational ? (
					<Col span={24} md={8}>
						<Form.Item label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.countryCode' })} required>
							<Input disabled value={maQuocTich} placeholder={enterContentText} />
						</Form.Item>
					</Col>
				) : (
					<Fragment>
						<Col span={24} md={8}>
							<Form.Item name='ethnicity' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.ethnicity' })} rules={[...rules.required]}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='religion' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.religion' })} rules={[...rules.required]}>
								<SelectTonGiao allowClear />
							</Form.Item>
						</Col>
					</Fragment>
				)}

				{!isForeignNational && (
					<Fragment>
						<Col span={24} md={12}>
							<Form.Item name='frontIdCard' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.frontIdCard' })} rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })} maxCount={1} otherProps={{ className: styles.uploadButton }} isPrivate />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='backIdCard' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.backIdCard' })} rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })} maxCount={1} otherProps={{ className: styles.uploadButton }} isPrivate />
							</Form.Item>
						</Col>
					</Fragment>
				)}
			</Row>

			{isForeignNational && (
				<Fragment>
					<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.visaInfo' })}</div>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='passportNumber' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportNumber' })} rules={[...rules.required, ...rules.text]}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaType' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaType' })} rules={[...rules.required]}>
								<Select placeholder={enterContentText} allowClear options={VISA_TYPE_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaIssueDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaIssueDate' })} rules={[...rules.required]}>
								<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaExpiryDate' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaExpiryDate' })} rules={[...rules.required]}>
								<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaIssuingAuthority' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaIssuingAuthority' })} rules={[...rules.required]}>
								<Select placeholder={enterContentText} allowClear options={VISA_ISSUING_AUTHORITY_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='visaPlaceOfIssue' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaPlaceOfIssue' })} rules={[...rules.text]}>
								<Input placeholder={enterContentText} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='passportAttachment' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportAttachment' })} rules={[...rules.fileRequired]}>
								<UploadFile buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })} maxCount={1} otherProps={{ className: styles.uploadButton }} isPrivate />
							</Form.Item>
							{/* <div className={styles.uploadHelperText}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportAttachmentHelper' })}</div> */}
						</Col>
					</Row>
				</Fragment>
			)}


			{!isForeignNational && <>
				<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.placeOfBirth' })}</div>
				<SelectDonViHanhChinh
					form={form}
					listTinh={listTinh}
					suffix='NoiSinh'
					hideXaPhuong
					hasLabel
					labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
					placeholderTinh={enterContentText}
				/>

				<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.placeOfResidence' })}</div>
				<SelectDonViHanhChinh
					form={form}
					listTinh={listTinh}
					suffix='KhaiBao'
					hasLabel
					labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
					placeholderTinh={enterContentText}
					labelXaPhuong={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.communeWard' })}
					placeholderXaPhuong={enterContentText}
				/>
				<div className={styles.subLabel}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.permanentResidence' })}</div>
				<Form.Item name='sameAsResidence' valuePropName='checked' style={{ marginBottom: 8 }}>
					<Checkbox onChange={(e) => handleSameAsResidence(e.target.checked)}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.sameAsResidence' })}
					</Checkbox>
				</Form.Item>
				<SelectDonViHanhChinh
					form={form}
					listTinh={listTinh}
					suffix='ThuongTru'
					hasSoNha
					hasLabel
					labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
					placeholderTinh={enterContentText}
					labelXaPhuong={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.communeWard' })}
					placeholderXaPhuong={enterContentText}
					labelSoNha={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.houseNumber' })}
					placeholderSoNha={enterContentText}
				/>
			</>}
			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.bankAccountInfo' })}</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={24} md={8}>
					<Form.Item name='bank' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bank' })}>
						<Select placeholder={enterContentText} allowClear showSearch options={BANK_OPTIONS} optionFilterProp='label' />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='bankAccountNumber' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bankAccountNumber' })} rules={[...rules.sotaikhoan]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='accountHolderName' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.accountHolderName' })} rules={[...rules.ten]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={8}>
					<Form.Item name='bankBranch' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bankBranch' })} rules={[...rules.text, ...rules.length(250)]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
			</Row>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.healthInfo' })}</SectionHeader>
			<Row gutter={[12, 0]}>
				<Col span={12} md={6}>
					<Form.Item name='height' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.height' })} rules={[...rules.required, ...rules.number(300, 0)]}>
						<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='weight' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.weight' })} rules={[...rules.required, ...rules.number(300, 0)]}>
						<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='disabilityType' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.disabilityType' })}>
						<Select
							placeholder={enterContentText}
							allowClear
							showSearch
							optionFilterProp='label'
							options={listLoaiKhuyetTat?.map((item) => ({ value: item.ma, label: item.ten }))}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='bloodType' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bloodType' })} rules={[...rules.length(10)]}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item name='medicalNotes' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.medicalNotes' })} rules={[...rules.length(1000)]}>
						<Input.TextArea rows={3} placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={hasHealthProblem === true ? 12 : 24}>
					<Form.Item
						name='hasHealthProblem'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.hasHealthProblem' })}
						rules={[...rules.required]}
					>
						<Radio.Group
							options={[
								{ value: false, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.no' }) },
								{ value: true, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.yes' }) },
							]}
						/>
					</Form.Item>
				</Col>
				{hasHealthProblem === true && (
					<>
						<Col span={24} md={12}>
							<Form.Item
								name='healthProblemAttachment'
								label={
									<span>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.healthProblemAttachment' })}{' '}
										<Tooltip title={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.healthProblemAttachment.tooltip' })}>
											<InfoCircleOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
										</Tooltip>
									</span>
								}
								rules={[...rules.fileRequired]}
							>
								<UploadFile buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })} maxCount={1} otherProps={{ className: styles.uploadButton }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='isRegisterFreeDormitory' valuePropName='checked' style={{ marginBottom: 0 }}>
								<Checkbox style={{ fontWeight: 600, color: '#262626' }}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.isRegisterFreeDormitory' })}
								</Checkbox>
							</Form.Item>
							<div style={{ color: '#595959', fontSize: 13, paddingLeft: 24, marginTop: 4, lineHeight: 1.6 }}>
								<div>{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.freeDormitoryIntro' })}</div>
								<div>1. {intl.formatMessage({ id: 'global.enrollmentDeclaration.field.freeDormitoryMental' })}</div>
								<div>2. {intl.formatMessage({ id: 'global.enrollmentDeclaration.field.freeDormitoryPhysical' })}</div>
								<div>*{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.freeDormitoryFooter' })}</div>
							</div>
						</Col>
					</>
				)}
			</Row>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.documentUpload' })}</SectionHeader>
			<Table
				className={styles.docTable}
				rowKey={(row, index) => row.id ?? index ?? 0}
				dataSource={documentRows}
				columns={documentColumns}
				pagination={false}
				size='small'
			/>

			<SectionHeader>{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.survey' })}</SectionHeader>
			<Form.Item
				name='firstGenStudent'
				label={intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.q1' })}
				rules={[...rules.required]}
			>
				<Radio.Group
					options={[
						{ value: true, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.yes' }) },
						{ value: false, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.no' }) },
					]}
				/>
			</Form.Item>

			<Form.Item
				name='adjustmentNeeds'
				label={intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.q2' })}
				rules={[...rules.required]}
			>
				<Checkbox.Group
					options={[
						{ value: 'sensory', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.sensory' }) },
						{ value: 'physical', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.physical' }) },
						{ value: 'mental', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.mental' }) },
						{ value: 'medical', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.medical' }) },
						{ value: 'others', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.others' }) },
					]}
					style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
				/>
			</Form.Item>

			{adjustmentNeeds?.includes('others') && (
				<Form.Item name='adjustmentOthersText' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder={enterContentText} />
				</Form.Item>
			)}
		</Fragment>
	);
};

export default PersonalInformationStep;
