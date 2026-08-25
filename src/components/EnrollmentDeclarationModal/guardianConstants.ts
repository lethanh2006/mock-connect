/**
 * Values per api-nhap-hoc-sinh-vien.md § 4 (`LoaiThanhVienGiaDinh`), kept in sync with the
 * `ELoaiThanhVienGiaDinh` enum in src/services/DaoTao/SinhVien/constants.ts. Defined locally
 * since this wizard also needs i18n label mapping (`getFamilyRelationshipOptions`).
 */
export const FAMILY_RELATIONSHIP_OPTIONS = [
	{ value: 'Bố', label: 'Father' },
	{ value: 'Mẹ', label: 'Mother' },
	{ value: 'Người giám hộ', label: 'Guardian' },
	{ value: 'Anh/Chị/Em', label: 'Sister/Brother' },
	{ value: 'Con', label: 'Child' },
	{ value: 'Vợ/Chồng', label: 'Spouse' },
];

export const getFamilyRelationshipOptions = (intl: any) => [
	{ value: 'Bố', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.father' }) },
	{ value: 'Mẹ', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.mother' }) },
	{ value: 'Người giám hộ', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.guardian' }) },
	{ value: 'Anh/Chị/Em', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.siblings' }) },
	{ value: 'Con', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.child' }) },
	{ value: 'Vợ/Chồng', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.relationship.spouse' }) },
];

export const TRAINING_LEVEL_OPTIONS = [
	{ value: 'High School', label: 'High School' },
	{ value: 'Undergraduate', label: 'Undergraduate' },
	{ value: 'Graduate', label: 'Graduate' },
	{ value: 'Postgraduate', label: 'Postgraduate' },
	{ value: 'Doctorate', label: 'Doctorate' },
	{ value: 'Other', label: 'Other' },
];

export const getTrainingLevelOptions = (intl: any) => [
	{ value: 'High School', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.highSchool' }) },
	{
		value: 'Undergraduate',
		label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.undergraduate' }),
	},
	{ value: 'Graduate', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.graduate' }) },
	{
		value: 'Postgraduate',
		label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.postgraduate' }),
	},
	{ value: 'Doctorate', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.doctorate' }) },
	{ value: 'Other', label: intl.formatMessage({ id: 'global.enrollmentDeclaration.trainingLevel.other' }) },
];

export const getLiabilityWaiverIntro = (intl: any): string =>
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverIntro' });

export const getLiabilityWaiverItems = (intl: any): string[] => [
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem1' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem2' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem3' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem4' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem5' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem6' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem7' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem8' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.waiverItem9' }),
];

export const getStudentDeclarationItems = (intl: any): string[] => [
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem1' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem2' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem3' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem4' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem5' }),
	intl.formatMessage({ id: 'global.enrollmentDeclaration.guardian.declarationItem6' }),
];

export const LIABILITY_WAIVER_INTRO =
	'THIS IS A LEGAL AGREEMENT AND INCLUDES A RELEASE OF LEGAL RIGHTS. READ AND BE CERTAIN YOU UNDERSTAND IT BEFORE SIGNING.';

export const LIABILITY_WAIVER_ITEMS = [
	"I, the undersigned, acknowledge and understand that I'm fully responsible for my own living at VinUniversity and for my safety, health & well-being while living, studying and playing on and off campus.",
	'I further acknowledge and understand the dangers, hazards, and risks that may arise from engaging in activities, such as playing sports, supporting events or joining club program activities… These dangers, hazards, and risks can result in injury and impairment to my body, general health, well-being, and could include serious or even fatal injuries.',
	'Knowing the dangers, hazards, and risks of those activities and in consideration of being permitted to participate in activities, on behalf of myself, my guardians, and personal representative(s) (the "Releasers"), I agree to assume all the risks and responsibilities surrounding my participation. On behalf of myself and the Releasers I hereby covenant not to sue VinUniversity, or its trustees, officers, representatives, and employees ("Releasees"), and I hereby release, waive, forever discharge the Releasees from and against any and all liability for any harm, injury, damage, claims, demands, actions, causes of action, costs, and expenses of any nature that I may have or that may hereafter accused by me or a Releaser, arising out of, or related to, those activities. I further agree to indemnify and hold harmless the Releasees from and against any loss, liability, damage or cost, including court costs and attorneys\' fees that may arise due to my participation in activities. It is my expressed intent that this Liability Release and Waiver shall bind me, my Releasers, and shall be deemed as a legally binding release, waiver, discharge and covenant not to sue the Releasees.',
	'I also grant VinUniversity the right to use my photograph for its publications to the public.',
	'I agree to conduct myself in accordance with the rules of conduct and standards of behavior and attitude that are expected of me as a student of the VinUniversity and to abide by the various instructions, guidance and policy I am given by Student Affairs Office, Residential Office, or University members.',
	'I understand, agree, and hereby grant Releasees permission to authorize emergency medical treatment for me and contact my emergency contact below. I acknowledge that Releasees is not liable for any severe health complications or outcomes that may arise during my study if caused by my own health condition or fault. This includes but is not limited to costs associated with medical treatment, hospitalization, or other health-related services beyond what is offered on campus.',
	'I pledge to abide by all laws of the nations I am a citizen of, as well as the laws of any country I visit during my time as a student at VinUniversity.',
	'I commit to taking full responsibility for the care of my personal belongings and will not hold VinUniversity responsible for any loss or damage.',
	"I agree to provide VinUniversity with my personal information and allow VinUniversity to process it in accordance with VinUniversity's personal data protection policy.",
];

export const STUDENT_DECLARATION_ITEMS = [
	'I understand and agree that the decision of VinUniversity is final with respect to my enrollment and studies at VinUniversity. If admitted, I commit to complying with all applicable policies, rules and regulations of VinUniversity and the applicable laws during my time at VinUniversity.',
	'I declare that, the information provided in this enrollment form and supporting documents is true, complete and correct. I will promptly notify VinUniversity of any changes to my personal details. I declare that I have obtained necessary consents for providing information of the designated contact person(s) listed above to VinUniversity.',
	'I acknowledge that the providing false information, withholding information or failing to submit required documents may result in the cancellation of any offer made by VinUniversity',
	'I understand and agree that this enrollment form allows information, including my personal details and information about my educational and financial records, to be released to the contact person(s) listed above only after proper identification has been made',
	'I understand that VinUniversity may be required to disclose my personal information and information about my studies to related competent authorities as part of its legal obligations',
	"I hereby consent to providing my personal information to VinUniversity and consent to VinUniversity using and processing my personal data for the purposes of my enrollment and studies at VinUni and operations of VinUni in accordance with the Personal Data Protection Policy as published on VinUniversity's official website (www.vinuni.edu.vn)",
];
