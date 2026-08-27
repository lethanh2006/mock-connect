import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import SelectCategory from '@/pages/Core/Category/SelectCategory';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDonViHanhChinh from '@/pages/Core/DonViHanhChinh/SelectDonViHanhChinh';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { DANH_SACH_QUOC_TICH } from '@/services/Core/QuocTich/danhSach';
import { EGiayToCanNopType, isGiayToVisibleForNationality } from '@/services/DaoTao/DotNhapHoc/constant';
import type { DotNhapHoc } from '@/services/DaoTao/DotNhapHoc/typings';
import {
	colorTrangThaiGiayToNhapHoc,
	ELoaiNoiSinh,
	ETrangThaiGiayToNhapHoc,
	nameTrangThaiGiayToNhapHoc,
} from '@/services/DaoTao/SinhVien/constants';
import dayjs from '@/utils/dayjs';
import rules from '@/utils/rules';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleOutlined } from '@ant-design/icons';
import {
	Checkbox,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Radio,
	Row,
	Select,
	Tag,
	Tooltip,
	type FormInstance,
} from 'antd';
import { Fragment, useEffect, useMemo } from 'react';
import type { IntlShape } from 'react-intl';
import { useIntl, useModel } from 'umi';
import { dataBankArray } from './dataBank';
import styles from './index.less';
import PhoneCountrySelect from './PhoneCountrySelect';

const BANK_OPTIONS = dataBankArray.map((item) => ({
	key: item.swCode,
	value: item.bankName,
	label: item.bankName,
}));

const isForeignNationalityText = (nationality?: string) => {
	if (!nationality) return false;
	const normalized = nationality
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
	return !normalized.includes('viet nam');
};

const DocumentUploadCell = ({
	row,
	form,
	intl,
}: {
	row: DotNhapHoc.IGiayToCanNopNhapHoc;
	form: FormInstance;
	intl: IntlShape;
}) => {
	const fieldName = `document_${row.id}`;
	const isRejected = row.trangThai === ETrangThaiGiayToNhapHoc.KHONG_DUYET;
	const isApproved = row.trangThai === ETrangThaiGiayToNhapHoc.DA_DUYET;
	const canEdit = !isApproved;
	const requireFile = !!row.required;

	useEffect(() => {
		if (!row.urlFile) return;
		const current = form.getFieldValue(fieldName);
		const hasLocalFile = current?.fileList?.some((file: { originFileObj?: unknown }) => file.originFileObj);
		if (hasLocalFile) return;
		const currentUrl = typeof current === 'string' ? current : current?.fileList?.[0]?.url;
		if (currentUrl !== row.urlFile) form.setFieldValue(fieldName, row.urlFile);
	}, [fieldName, form, row.urlFile]);

	return (
		<Form.Item
			name={fieldName}
			initialValue={row.urlFile}
			rules={
				requireFile
					? [
							{
								required: true,
								validator: (_, value) => {
									const hasUrl = typeof value === 'string' && !!value.trim();
									const hasFileList = !!value?.fileList?.length;
									if (hasUrl || hasFileList) return Promise.resolve();
									return Promise.reject(
										new Error(intl.formatMessage({ id: 'global.validation.fileRequired.required' })),
									);
								},
							},
						]
					: undefined
			}
			validateStatus={isRejected ? 'error' : isApproved ? 'success' : undefined}
			help={row.ghiChu && (isRejected || isApproved) ? row.ghiChu : undefined}
			style={{ marginBottom: 0 }}
		>
			<UploadFile
				buttonSize='small'
				buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
				maxCount={1}
				disabled={!canEdit}
				otherProps={!canEdit ? { showUploadList: { showRemoveIcon: false } } : undefined}
				isPrivate
			/>
		</Form.Item>
	);
};

const getDocumentColumns = (intl: IntlShape, form: FormInstance): IColumn<DotNhapHoc.IGiayToCanNopNhapHoc>[] => [
	{ title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.name' }), dataIndex: 'ten', width: 180 },
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.quantity' }),
		dataIndex: 'soLuong',
		width: 90,
		align: 'center',
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.required' }),
		dataIndex: 'required',
		width: 90,
		align: 'center',
		render: (required?: boolean) =>
			required ? (
				<CheckCircleFilled style={{ color: '#57a443' }} />
			) : (
				<CloseCircleFilled style={{ color: '#ff4d4f' }} />
			),
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
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.guide' }),
		dataIndex: 'huongDan',
		width: 180,
		render: (huongDan?: string) => (huongDan ? <ExpandText ellipsis={{ rows: 2 }}>{huongDan}</ExpandText> : null),
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.guideFile' }),
		dataIndex: 'urlFileHuongDan',
		width: 160,
		render: (urlFileHuongDan: string | undefined) =>
			urlFileHuongDan ? <UploadFile value={urlFileHuongDan} disabled maxCount={1} isPrivate /> : null,
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.status' }),
		dataIndex: 'trangThai',
		width: 130,
		align: 'center',
		render: (trangThai?: ETrangThaiGiayToNhapHoc) => {
			if (!trangThai || !nameTrangThaiGiayToNhapHoc[trangThai]) return null;
			return (
				<Tag color={colorTrangThaiGiayToNhapHoc[trangThai]}>
					{intl.formatMessage({ id: nameTrangThaiGiayToNhapHoc[trangThai] })}
				</Tag>
			);
		},
	},
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.attachment' }),
		key: 'attachment',
		width: 200,
		fixed: 'right',
		render: (_, row) => <DocumentUploadCell row={row} form={form} intl={intl} />,
	},
];

const PersonalInformationStep = ({
	form,
	listTinh,
	documentsOnly = false,
}: {
	form: FormInstance<any>;
	listTinh?: DonViHanhChinh.IRecord[];
	documentsOnly?: boolean;
}) => {
	const intl = useIntl();
	const adjustmentNeeds: string[] = Form.useWatch('adjustmentNeeds', form) ?? [];
	const nationality: string | undefined = Form.useWatch('nationality', form);
	const maQuocTich: string | undefined = Form.useWatch('maQuocTich', form);
	const hasHealthProblem: boolean | undefined = Form.useWatch('hasHealthProblem', form);
	const placeOfBirthType: ELoaiNoiSinh | undefined = Form.useWatch('loaiNoiSinh', form);
	const isForeignNational = isForeignNationalityText(nationality);
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const documentRows = useMemo(() => {
		const hoSoById = new Map((recSinhVien?.hoSoNhapHoc?.danhSachGiayToNhapHoc ?? []).map((item) => [item.id, item]));

		return (recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [])
			.filter((item: DotNhapHoc.IGiayToCanNopNhapHoc) =>
				isGiayToVisibleForNationality(item.doiTuongApDung, nationality),
			)
			.map((item: DotNhapHoc.IGiayToCanNopNhapHoc) => {
				const hoSo = item.id ? hoSoById.get(item.id) : undefined;
				const urlFile = hoSo?.urlFile ?? item.urlFile;
				return {
					...item,
					trangThai: hoSo?.trangThai ?? item.trangThai ?? (urlFile ? ETrangThaiGiayToNhapHoc.CHO_DUYET : undefined),
					ghiChu: hoSo?.ghiChu ?? item.ghiChu,
					urlFile,
				};
			});
	}, [recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc, recSinhVien?.hoSoNhapHoc?.danhSachGiayToNhapHoc, nationality]);
	// Step 0 ↔ enrollmentStep === 1. Đã qua bước 1 thì khóa luôn phần health (kể cả lần trước chọn Không),
	// không cho đăng ký/đổi lại hasHealthProblem + miễn KTX.
	const isPastHealthDeclarationStep = (recSinhVien?.enrollmentStep ?? 1) > 1;

	const documentColumns = useMemo(() => getDocumentColumns(intl, form), [intl, form]);

	useEffect(() => {
		const found = DANH_SACH_QUOC_TICH.find((item) => item.tenQuocTich === nationality);
		form.setFieldsValue({ maQuocTich: found?.ma });
	}, [nationality, form]);

	useEffect(() => {
		if (placeOfBirthType === ELoaiNoiSinh.NUOC_NGOAI) {
			form.setFieldsValue({ tinhTpNoiSinh: undefined, maTinhTpNoiSinh: undefined });
			return;
		}
		if (placeOfBirthType === ELoaiNoiSinh.TRONG_NUOC) {
			form.setFieldsValue({ maTinhTpNoiSinh: undefined, quocGiaNoiSinh: undefined });
		}
	}, [placeOfBirthType, form]);

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
			<fieldset disabled={documentsOnly} style={{ border: 0, margin: 0, padding: 0, minInlineSize: 0 }}>
				<Divider size='small' className='divider-big-title' orientation='left' dashed style={{ marginTop: 0 }}>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.personalInfo' })}
				</Divider>
				<Row gutter={[12, 0]}>
					<Col span={24} md={8}>
						<Form.Item
							name='firstName'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.firstName' })}
							rules={[...rules.required]}
						>
							<Input placeholder={enterContentText} disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='middleName'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.middleName' })}
						>
							<Input placeholder={enterContentText} disabled />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='lastName'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.lastName' })}
							rules={[...rules.required]}
						>
							<Input placeholder={enterContentText} disabled />
						</Form.Item>
					</Col>

					<Col span={12} md={8}>
						<Form.Item
							name='dob'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.dob' })}
							rules={[...rules.required, ...rules.ngaySinh]}
						>
							<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear disabled />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='gender'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.gender' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={enterContentText}
								options={[
									{ value: 'Nam', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.male' }) },
									{ value: 'Nữ', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.female' }) },
									// { value: 'Khác', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.gender.other' }) },
								]}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.phone' })} required>
							<Input.Group compact style={{ display: 'flex' }}>
								<Form.Item name='phoneCountryCode' noStyle initialValue='+84'>
									<PhoneCountrySelect />
								</Form.Item>
								<Form.Item name='phoneNumber' noStyle rules={[...rules.required, ...rules.phoneOnlyDigits]}>
									<Input style={{ flex: 1 }} placeholder={enterContentText} />
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Col>

					<Col span={12} md={8}>
						<Form.Item
							name='vinuniAccount'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.vinuniAccount' })}
							rules={[...rules.required, ...rules.email]}
						>
							<Input disabled={!!recSinhVien?.email} placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='postalCode'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.postalCode' })}
							rules={[...rules.text, ...rules.length(20)]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
				</Row>

				<Divider size='small' className='divider-big-title' orientation='left' dashed>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.additionalInfo' })}
				</Divider>
				<Row gutter={[12, 0]}>
					<Col span={24} md={8}>
						<Form.Item
							name='nationality'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.nationality' })}
							rules={[...rules.required]}
						>
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
								<Form.Item
									name='ethnicity'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.ethnicity' })}
									rules={[...rules.required]}
								>
									<SelectDanToc allowClear />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='religion'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.religion' })}
									rules={[...rules.required]}
								>
									<SelectTonGiao allowClear />
								</Form.Item>
							</Col>
						</Fragment>
					)}

					<Col span={12} md={8}>
						<Form.Item
							name='nationalIdNumber'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.nationalId' })}
							rules={[...rules.CMND]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='issueDate'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.issueDate' })}
							rules={[...rules.truocHomNay]}
						>
							<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='placeOfIssue'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.placeOfIssue' })}
							rules={[...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>

					{!isForeignNational && (
						<Fragment>
							<Col span={24} md={12}>
								<Form.Item
									name='frontIdCard'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.frontIdCard' })}
									rules={[...rules.fileRequired]}
								>
									<UploadFile
										buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
										maxCount={1}
										otherProps={{ className: styles.uploadButton }}
										isPrivate
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item
									name='backIdCard'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.backIdCard' })}
									rules={[...rules.fileRequired]}
								>
									<UploadFile
										buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
										maxCount={1}
										otherProps={{ className: styles.uploadButton }}
										isPrivate
									/>
								</Form.Item>
							</Col>
						</Fragment>
					)}
				</Row>

				{isForeignNational && (
					<Fragment>
						<div className={styles.subLabel}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.visaInfo' })}
						</div>
						<Row gutter={[12, 0]}>
							<Col span={24} md={8}>
								<Form.Item
									name='passportNumber'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportNumber' })}
									rules={[...rules.required, ...rules.text]}
								>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
							{/* <Col span={24} md={8}>
								<Form.Item
									name='tenQuocGia'
									label={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.maquocgia' })}
									rules={[...rules.required]}
								>
									<SelectQuocTich
										allowClear
										selectTen
										placeholder={intl.formatMessage({ id: 'thongtincanhan.form.thongtinvisa.maquocgia.place' })}
									/>
								</Form.Item>
							</Col> */}
							<Col span={24} md={8}>
								<Form.Item
									name='visaNumber'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaNumber' })}
									rules={[...rules.required, ...rules.text]}
								>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='visaType'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaType' })}
									rules={[...rules.required]}
								>
									{/*<Select placeholder={enterContentText} allowClear options={VISA_TYPE_OPTIONS} />*/}
									<SelectCategory allowClear category='visa' />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='visaIssueDate'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaIssueDate' })}
									rules={[...rules.required, ...rules.truocHomNay]}
								>
									<MyDatePicker
										placeholder={selectText}
										style={{ width: '100%' }}
										allowClear
										disabledDate={(cur) => dayjs(cur).isAfter(dayjs(), 'day')}
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='visaExpiryDate'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaExpiryDate' })}
									rules={[...rules.required]}
								>
									<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='visaIssuingAuthority'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaIssuingAuthority' })}
									rules={[...rules.required]}
									initialValue={intl.formatMessage({
										id: 'global.enrollmentDeclaration.field.visaIssuingAuthority.default',
									})}
								>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='visaPlaceOfIssue'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.visaPlaceOfIssue' })}
									rules={[...rules.text]}
								>
									<Input placeholder={enterContentText} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item
									name='passportAttachment'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportAttachment' })}
									rules={[...rules.fileRequired]}
								>
									<UploadFile
										buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
										maxCount={1}
										otherProps={{ className: styles.uploadButton }}
										isPrivate
									/>
								</Form.Item>
								{/* <div className={styles.uploadHelperText}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.field.passportAttachmentHelper' })}</div> */}
							</Col>
						</Row>
					</Fragment>
				)}

				{!isForeignNational && (
					<>
						<div className={styles.subLabel}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.placeOfBirth' })}
						</div>
						<Row gutter={[12, 0]}>
							<Col span={24} md={8}>
								<Form.Item
									name='loaiNoiSinh'
									label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.placeOfBirthType' })}
									rules={[...rules.required]}
								>
									<Radio.Group>
										{Object.values(ELoaiNoiSinh).map((value) => (
											<Radio key={value} value={value}>
												{intl.formatMessage({
													id:
														value === ELoaiNoiSinh.TRONG_NUOC
															? 'global.enrollmentDeclaration.field.placeOfBirthType.domestic'
															: 'global.enrollmentDeclaration.field.placeOfBirthType.foreign',
												})}
											</Radio>
										))}
									</Radio.Group>
								</Form.Item>
							</Col>
							{placeOfBirthType === ELoaiNoiSinh.NUOC_NGOAI ? (
								<Col span={24} md={24}>
									<Form.Item
										name='quocGiaNoiSinh'
										label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.placeOfBirthForeign' })}
										rules={[...rules.required, ...rules.text, ...rules.length(250)]}
									>
										<Input placeholder={enterContentText} style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							) : (
								<Col span={24} md={24}>
									<SelectDonViHanhChinh
										form={form}
										listTinh={listTinh}
										suffix='NoiSinh'
										hideXaPhuong
										hasLabel
										labelTinh={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.provinceCity' })}
										placeholderTinh={enterContentText}
									/>
								</Col>
							)}
						</Row>

						<div className={styles.subLabel}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.placeOfResidence' })}
						</div>
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
						<div className={styles.subLabel}>
							{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.permanentResidence' })}
						</div>
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
					</>
				)}
				<Divider size='small' className='divider-big-title' orientation='left' dashed>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.bankAccountInfo' })}
				</Divider>
				<Row gutter={[12, 0]}>
					<Col span={24} md={16}>
						<Form.Item name='bank' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bank' })}>
							<Select
								placeholder={enterContentText}
								allowClear
								showSearch
								options={BANK_OPTIONS}
								optionFilterProp='label'
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={[12, 0]}>
					<Col span={24} md={8}>
						<Form.Item
							name='bankAccountNumber'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bankAccountNumber' })}
							rules={[...rules.sotaikhoan]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='accountHolderName'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.accountHolderName' })}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='bankBranch'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bankBranch' })}
							rules={[...rules.text, ...rules.length(250)]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
				</Row>

				<Divider size='small' className='divider-big-title' orientation='left' dashed>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.healthInfo' })}
				</Divider>
				<Row gutter={[12, 0]}>
					<Col span={12} md={6}>
						<Form.Item
							name='height'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.height' })}
							rules={[...rules.required, ...rules.number(300, 0)]}
						>
							<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='weight'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.weight' })}
							rules={[...rules.required, ...rules.number(300, 0)]}
						>
							<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='disabilityType'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.disabilityType' })}
						>
							<SelectCategory allowClear category='disability' placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item
							name='bloodType'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.bloodType' })}
							rules={[...rules.length(10)]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='medicalNotes'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.field.medicalNotes' })}
							rules={[...rules.length(1000)]}
						>
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
								disabled={isPastHealthDeclarationStep}
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
											<Tooltip
												title={intl.formatMessage({
													id: 'global.enrollmentDeclaration.field.healthProblemAttachment.tooltip',
												})}
											>
												<InfoCircleOutlined style={{ color: '#1890ff', marginLeft: 4 }} />
											</Tooltip>
										</span>
									}
									rules={[...rules.fileRequired]}
								>
									<UploadFile
										buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.docTable.uploadButton' })}
										maxCount={1}
										disabled={isPastHealthDeclarationStep}
										otherProps={{ className: styles.uploadButton }}
										isPrivate
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='isRegisterFreeDormitory' valuePropName='checked' style={{ marginBottom: 0 }}>
									<Checkbox disabled={isPastHealthDeclarationStep} style={{ fontWeight: 600, color: '#262626' }}>
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
			</fieldset>

			<Divider size='small' className='divider-big-title' orientation='left' dashed>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.documentUpload' })}
			</Divider>
			<TableStaticData
				columns={documentColumns}
				data={documentRows}
				size='small'
				addStt
				globalSearch={false}
				columnSetting={false}
				otherProps={{ pagination: false, className: styles.docTable }}
			/>

			<fieldset disabled={documentsOnly} style={{ border: 0, margin: 0, padding: 0, minInlineSize: 0 }}>
				<Divider size='small' className='divider-big-title' orientation='left' dashed>
					{intl.formatMessage({ id: 'global.enrollmentDeclaration.section.survey' })}
				</Divider>
				<Form.Item
					name='firstGenStudent'
					label={intl.formatMessage({ id: 'global.enrollmentDeclaration.survey.q1' })}
					rules={[...rules.required]}
				>
					<Radio.Group
						options={[
							{ value: false, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.no' }) },
							{ value: true, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.yes' }) },
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
			</fieldset>
		</Fragment>
	);
};

export default PersonalInformationStep;
