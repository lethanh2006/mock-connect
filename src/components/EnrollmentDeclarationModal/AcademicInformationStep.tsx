import MyDatePicker from '@/components/MyDatePicker';
import type { IColumn } from '@/components/Table/typing';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTruongThpt from '@/pages/Core/TruongThpt/SelectTruongThpt';
import SelectChungChi, { CERTIFICATE_TYPE_OTHER } from '@/pages/DaoTao/ChungChi/Select';
import { EPhuongThucTinhDiem } from '@/services/DaoTao/constant';
import rules from '@/utils/rules';
import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Divider, Form, Input, InputNumber, Radio, Row, Select, Table, type FormInstance } from 'antd';
import { Fragment, useEffect, useMemo } from 'react';
import type { IntlShape } from 'react-intl';
import { useIntl, useModel } from 'umi';
import UploadFile from '../Upload/UploadFile';
import { PRIORITY_AREA_OPTIONS, PRIORITY_CATEGORY_OPTIONS } from './academicConstants';
import { getTrainingLevelOptions } from './guardianConstants';
import styles from './index.less';

type TGradeRow = {
	key: 'diemToan' | 'diemVan' | 'diemTiengAnh' | 'diemLy' | 'diemHoa' | 'diemSinh' | 'diemTrungBinhNam';
	label: string;
};

const getGradeRows = (intl: IntlShape): TGradeRow[] => [
	{ key: 'diemToan', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.math' }) },
	{ key: 'diemVan', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.literature' }) },
	{ key: 'diemTiengAnh', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.english' }) },
	{ key: 'diemLy', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.physics' }) },
	{ key: 'diemHoa', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.chemistry' }) },
	{ key: 'diemSinh', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.biology' }) },
	{
		key: 'diemTrungBinhNam',
		label: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subject.yearAvg' }),
	},
];

const getGradeColumns = (intl: IntlShape): IColumn<TGradeRow>[] => [
	{
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.subjects' }),
		dataIndex: 'label',
		width: 200,
	},
	...(['10', '11', '12'] as const).map((grade): IColumn<TGradeRow> => ({
		title: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeHeader' }, { grade }),
		dataIndex: 'key',
		key: `grade${grade}`,
		width: 160,
		render: (_: unknown, row: TGradeRow) => (
			<Form.Item name={`${row.key}_${grade}`} rules={[...rules.required]} style={{ marginBottom: 0 }}>
				<InputNumber
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' })}
				/>
			</Form.Item>
		),
	})),
];

/** One high-school identity block — reused for the single (not-transferred) case and per grade-year when the student transferred schools */
const HighSchoolBlock = ({
	form,
	listTinhTruongThpt,
	suffix,
	isDomestic,
	intl,
}: {
	form: FormInstance<any>;
	listTinhTruongThpt?: TruongThpt.ITinhTP[];
	suffix: string;
	isDomestic: boolean;
	intl: IntlShape;
}) => {
	if (isDomestic) {
		return <SelectTruongThpt form={form} suffix={suffix} listTinh={listTinhTruongThpt} />;
	}

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={12}>
				<Form.Item
					name={`hsCountry${suffix}`}
					label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })}
					rules={[...rules.required, ...rules.text]}
				>
					<SelectQuocTich placeholder={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.country' })} />
				</Form.Item>
			</Col>
			<Col span={24} md={12}>
				<Form.Item
					name={`hsCity${suffix}`}
					label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.provinceCity' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={enterContentText} />
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item
					name={`hsName${suffix}`}
					label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolName' })}
					rules={[...rules.required, ...rules.text]}
				>
					<Input placeholder={enterContentText} />
				</Form.Item>
			</Col>
		</Row>
	);
};

const AcademicInformationStep = ({
	form,
	listTinhTruongThpt,
}: {
	form: FormInstance<any>;
	listTinhTruongThpt?: TruongThpt.ITinhTP[];
}) => {
	const intl = useIntl();
	const { danhSach: danhSachChungChi } = useModel('daotao.chungchi');
	const pursuingDegree: boolean | undefined = Form.useWatch('pursuingDegree', form);
	const attendedHighSchoolInVietnam: boolean | undefined = Form.useWatch('attendedHighSchoolInVietnam', form);
	const transferredHighSchool: boolean | undefined = Form.useWatch('transferredHighSchool', form);
	const certificateType: string | undefined = Form.useWatch('certificateType', form);
	const isDomestic = attendedHighSchoolInVietnam === true;
	const isTransferred = transferredHighSchool === true;

	const danhSachNgoaiNgu = useMemo(
		() => danhSachChungChi.filter((item) => item.loaiChungChi?.isNgoaiNgu),
		[danhSachChungChi],
	);

	const isOtherCertificate = certificateType === CERTIFICATE_TYPE_OTHER;

	const selectedChungChi = useMemo(
		() => (isOtherCertificate ? undefined : danhSachNgoaiNgu.find((item) => item.ma === certificateType)),
		[danhSachNgoaiNgu, certificateType, isOtherCertificate],
	);

	// Map saved custom certificate names (not in catalog) back to Other + free-text input
	useEffect(() => {
		if (!certificateType || !danhSachNgoaiNgu.length || certificateType === CERTIFICATE_TYPE_OTHER) return;

		const found = danhSachNgoaiNgu.some((item) => item.ma === certificateType);
		if (!found) {
			form.setFieldsValue({
				certificateType: CERTIFICATE_TYPE_OTHER,
				certificateTypeOther: certificateType,
				isChungChiKhac: true,
			});
		}
	}, [certificateType, danhSachNgoaiNgu, form]);

	const certificateScoreRules = useMemo(() => {
		if (!selectedChungChi) return [...rules.required, ...rules.text];

		if (selectedChungChi.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC) return [...rules.required];

		if (selectedChungChi.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM) {
			return [...rules.required, ...rules.number(selectedChungChi.max, selectedChungChi.min)];
		}

		return [...rules.required, ...rules.text];
	}, [selectedChungChi]);

	const resetCertificateScoreFields = (nextType?: string) => {
		const isOther = nextType === CERTIFICATE_TYPE_OTHER;
		form.setFieldsValue({
			certificateScore: undefined,
			diemNghe: undefined,
			diemNoi: undefined,
			diemDoc: undefined,
			diemViet: undefined,
			isChungChiKhac: isOther,
			certificateTypeOther: isOther ? form.getFieldValue('certificateTypeOther') : undefined,
		});
	};

	const yesNoOptions = useMemo(
		() => [
			{ value: true, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.yes' }) },
			{ value: false, label: intl.formatMessage({ id: 'global.enrollmentDeclaration.no' }) },
		],
		[intl],
	);

	const gradeRows = useMemo(() => getGradeRows(intl), [intl]);
	const gradeColumns = useMemo(() => getGradeColumns(intl), [intl]);
	const trainingLevelOptions = useMemo(() => getTrainingLevelOptions(intl), [intl]);

	const enterContentText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.enter' });
	const selectText = intl.formatMessage({ id: 'global.enrollmentDeclaration.placeholder.select' });

	return (
		<Fragment>
			<Divider size='small' className='divider-big-title' orientation='left' dashed style={{ marginTop: 0 }}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolSection' })}
			</Divider>

			<Form.Item
				name='pursuingDegree'
				label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.pursuingDegree' })}
				rules={[...rules.required]}
			>
				<Radio.Group options={yesNoOptions} />
			</Form.Item>

			{pursuingDegree === true && (
				<Row gutter={[12, 0]}>
					<Col span={24} md={12}>
						<Form.Item
							name='universityName'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityName' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='universityMajor'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityMajor' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
					<Col span={24} md={8}>
						<Form.Item
							name='universityDegreeLevel'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.universityDegreeLevel' })}
							rules={[...rules.required]}
						>
							<Select placeholder={enterContentText} allowClear options={trainingLevelOptions} />
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='universityFromDate'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.fromDate' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								pickerStyle='month'
								format='MM/YYYY'
								placeholder='mm/yyyy'
								style={{ width: '100%' }}
								allowClear
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={8}>
						<Form.Item
							name='universityToDate'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.toDate' })}
							rules={[...rules.required]}
						>
							<MyDatePicker
								pickerStyle='month'
								format='MM/YYYY'
								placeholder='mm/yyyy'
								style={{ width: '100%' }}
								allowClear
							/>
						</Form.Item>
					</Col>
				</Row>
			)}

			<div className={styles.subLabel}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.highSchoolSection' })}
			</div>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item
						name='attendedHighSchoolInVietnam'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.attendedInVietnam' })}
						rules={[...rules.required]}
					>
						<Radio.Group options={yesNoOptions} />
					</Form.Item>
				</Col>
				{attendedHighSchoolInVietnam && (
					<Col span={24} md={12}>
						<Form.Item
							name='transferredHighSchool'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.transferred' })}
							rules={[...rules.required]}
						>
							<Radio.Group options={yesNoOptions} />
						</Form.Item>
					</Col>
				)}
			</Row>

			{attendedHighSchoolInVietnam !== undefined &&
				(isTransferred ? (
					(['10', '11', '12'] as const).map((grade) => (
						<Fragment key={grade}>
							<div className={styles.subLabel}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeHighSchool' }, { grade })}
							</div>
							<HighSchoolBlock
								form={form}
								listTinhTruongThpt={listTinhTruongThpt}
								suffix={grade}
								isDomestic={isDomestic}
								intl={intl}
							/>
						</Fragment>
					))
				) : (
					<HighSchoolBlock
						form={form}
						listTinhTruongThpt={listTinhTruongThpt}
						suffix=''
						isDomestic={isDomestic}
						intl={intl}
					/>
				))}

			<Row gutter={[12, 0]}>
				{isDomestic && (
					<Fragment>
						<Col span={24} md={8}>
							<Form.Item
								name='priorityCategory'
								label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.priorityCategory' })}
							>
								<Select placeholder={enterContentText} allowClear options={PRIORITY_CATEGORY_OPTIONS} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='priorityArea'
								label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.priorityArea' })}
							>
								<Select placeholder={enterContentText} allowClear options={PRIORITY_AREA_OPTIONS} />
							</Form.Item>
						</Col>
					</Fragment>
				)}
				<Col span={24} md={isDomestic ? 8 : 24}>
					<Form.Item
						name='graduationYear'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.graduationYear' })}
						rules={[...rules.required, ...rules.number(2100, 1900, false)]}
					>
						<InputNumber style={{ width: '100%' }} placeholder={enterContentText} />
					</Form.Item>
				</Col>
			</Row>

			<div className={styles.subLabel}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSection' })}
			</div>
			<div className={styles.dormitoryInfoAlert}>
				<InfoCircleFilled className={styles.infoIcon} />
				<div className={styles.infoText}>
					<div>
						{intl.formatMessage(
							{ id: 'global.enrollmentDeclaration.academic.gradeSectionNote.intro' },
							{ b: (chunks: any) => <b>{chunks}</b> },
						)}
					</div>
					<ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
						<li>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSectionNote.bullet1' })}</li>
						<li>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSectionNote.bullet2' })}</li>
						<li>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSectionNote.bullet3' })}</li>
						<li>{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.gradeSectionNote.bullet4' })}</li>
					</ul>
				</div>
			</div>
			<Table
				className={styles.docTable}
				rowKey='key'
				dataSource={gradeRows}
				columns={gradeColumns}
				pagination={false}
				size='small'
			/>

			<Divider size='small' className='divider-big-title' orientation='left' dashed>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateSection' })}
			</Divider>
			<Row gutter={[12, 0]}>
				<Form.Item name='isChungChiKhac' hidden initialValue={false} />
				<Col span={24} md={isOtherCertificate ? 6 : 8}>
					<Form.Item
						name='certificateType'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateType' })}
						rules={[...rules.required]}
					>
						<SelectChungChi
							selectMa
							hasOther
							onlyNgoaiNgu
							allowClear
							placeholder={enterContentText}
							onChange={resetCertificateScoreFields}
						/>
					</Form.Item>
				</Col>
				{isOtherCertificate ? (
					<Col span={24} md={6}>
						<Form.Item
							name='certificateTypeOther'
							label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateType.otherLabel' })}
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder={enterContentText} />
						</Form.Item>
					</Col>
				) : null}
				<Col span={24} md={isOtherCertificate ? 6 : 8}>
					<Form.Item
						name='certificateScore'
						label={
							selectedChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC
								? intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateLevel' })
								: intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateScore' })
						}
						rules={certificateScoreRules}
					>
						{selectedChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.BAC && selectedChungChi.bac?.length ? (
							<Select
								placeholder={selectText}
								allowClear
								options={selectedChungChi.bac.map((item) => ({
									key: item.order,
									label: item.ten,
									value: item.ten,
								}))}
							/>
						) : selectedChungChi?.phuongThucTinhDiem === EPhuongThucTinhDiem.DIEM ? (
							<InputNumber
								style={{ width: '100%' }}
								placeholder={enterContentText}
								min={selectedChungChi.min ?? undefined}
								max={selectedChungChi.max ?? undefined}
								step={selectedChungChi.step ?? 1}
							/>
						) : (
							<Input placeholder={enterContentText} />
						)}
					</Form.Item>
				</Col>
				<Col span={24} md={isOtherCertificate ? 6 : 8}>
					<Form.Item
						rules={[...rules.required]}
						name='certificateIssueDate'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateIssueDate' })}
					>
						<MyDatePicker placeholder={selectText} style={{ width: '100%' }} allowClear />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={[12, 0]}>
				<Col span={24} md={6}>
					<Form.Item
						name='diemNghe'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.diemNghe' })}
					>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item name='diemNoi' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.diemNoi' })}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item name='diemDoc' label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.diemDoc' })}>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={6}>
					<Form.Item
						name='diemViet'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.diemViet' })}
					>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
			</Row>
			<Row gutter={[12, 0]}>
				<Col span={24} md={12}>
					<Form.Item
						name='certificateIssuer'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateIssuer' })}
						rules={[...rules.text]}
					>
						<Input placeholder={enterContentText} />
					</Form.Item>
				</Col>
				<Col span={24} md={12}>
					<Form.Item
						name='certificateAttachment'
						label={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.certificateAttachment' })}
						rules={[...rules.fileRequired]}
					>
						<UploadFile
							buttonDescription={intl.formatMessage({ id: 'global.enrollmentDeclaration.academic.chooseFile' })}
							maxCount={1}
							otherProps={{ className: styles.uploadButton }}
							isPrivate
						/>
					</Form.Item>
				</Col>
			</Row>
		</Fragment>
	);
};

export default AcademicInformationStep;
