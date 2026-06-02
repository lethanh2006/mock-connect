import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';

export interface SyllabusTableColumnConfig {
	title: string;
	dataIndex: string;
	tooltip?: string;
	align?: 'left' | 'center' | 'right';
	renderAsHtml?: boolean;
	render?: (val: any, record?: any) => string;
}

export type TCloPloMatrixMapping = { maClo?: string; maPlo?: string; tyLeAnhHuong?: number };

export const COURSE_SCHEDULE_COLUMNS: SyllabusTableColumnConfig[] = [
	{ title: 'Week / Topic', dataIndex: 'tieuDe' },
	{ title: 'Phase', dataIndex: 'giaiDoanDayHoc' },
	{ title: 'Content', dataIndex: 'ten', renderAsHtml: true },
	{ title: 'LEC', dataIndex: 'gioLyThuyet', align: 'center' },
	{ title: 'SEM/TUT', dataIndex: 'gioBaiTapTL', align: 'center' },
	{ title: 'PRAC/LAB', dataIndex: 'gioThucHanh', align: 'center' },
	{ title: 'Self-study', dataIndex: 'gioTuHoc', align: 'center' },
	{ title: 'Assessments', dataIndex: 'listTrongSoTuongUng', render: (val: string[]) => val?.join(', ') || '' },
];

export const ASSESSMENT_COLUMNS: SyllabusTableColumnConfig[] = [
	{ title: 'Assessment', dataIndex: 'assessment', align: 'center' },
	{ title: 'Weight (%)', dataIndex: 'weight', align: 'center', render: (val: any) => `${val || 0}%` },
	{ title: 'Assessed Task (specific)', dataIndex: 'assessedTask', align: 'center' },
	{ title: 'CLOs Measured', dataIndex: 'matchingClos', align: 'center' },
];

export const GRADING_SCHEME_COLUMNS: SyllabusTableColumnConfig[] = [
	{
		title: 'Lower Bound',
		dataIndex: 'diemFrom',
		align: 'center',
		render: (val: any, item: any) => Number(val ?? item?.canDuoi ?? 0).toFixed(1),
	},
	{
		title: 'Upper Bound',
		dataIndex: 'diemTo',
		align: 'center',
		render: (val: any, item: any) => Number(val ?? item?.canTren ?? 0).toFixed(1),
	},
	{
		title: 'Letter Grade',
		dataIndex: 'diemChu',
		align: 'center',
		render: (val: string, item: any) => {
			const color = ColorDiemChu[val as ELoaiDiemChu] || item.color || '#bfbfbf';
			return `<span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:4px;background:${color};color:#fff;margin:0;font-weight:500;">${val}</span>`;
		},
	},
];

export const ASSESSMENT_TASKS_TABLE_COLUMNS: readonly string[] = [
	'No',
	'Assessment Name',
	'Supported Assessment Type',
	'Assessment Schedule',
] as const;

export const ASSESSMENT_TASKS_HEADING_TITLE = 'Assessment Tasks';
export const LATE_SUBMISSION_HEADING_TITLE = 'Late Submission Policy and Makeup Request Procedures';
export const ASSESSMENT_NOI_DUNG_HEADING_TITLES = [
	ASSESSMENT_TASKS_HEADING_TITLE,
	LATE_SUBMISSION_HEADING_TITLE,
] as const;

export const ASSESSMENT_NOI_DUNG_SPLIT_MARKER = '<!--SYLLABUS:ASSESSMENT_NOIDUNG_SPLIT-->';

const ASSESSMENT_NOI_DUNG_SPLIT_MARKER_RE = new RegExp(
	ASSESSMENT_NOI_DUNG_SPLIT_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
);

export const DEFAULT_NOI_DUNG_ESSENTIAL_LOGISTICS = `
<h2><strong>Required Materials</strong></h2>
<p><strong>MOET regulations require each course to have one primary textbook with hard copies available in the library.</strong></p>

<h2><strong>Additional Materials</strong></h2>

<h2><strong>Teaching/Learning Methods</strong></h2>
<h4><strong>Workload Expectations</strong></h4>
<p><strong>The VinUniversity expectation is that students must spend 2 hours per week outside of class per 1 credit hour for pre-class work, practice, and independent learning.</strong> This will vary – some weeks will be lighter or heavier than others, but on average you must devote 2:1 time outside of class. If you are struggling to keep up with the workload, please contact me and I will try my best to support you.</p>
`.trim();

export const DEFAULT_NOI_DUNG_COURSE_EXPECTATIONS = `
<h2><strong>Attendance and Punctuality</strong></h2>
<p><strong>Regular attendance and punctuality are essential for your academic success and contribute to a dynamic learning environment for all VinUniversity students.</strong> Please arrive on time or a few minutes early to settle in, review materials, and be ready to engage from the start of class. Late arrivals disrupt the learning process for everyone and can cause you to miss important announcements or context. Your presence and participation enrich class discussions and help build the collaborative learning community that makes this course meaningful.</p>

<h2><strong>Communication Expectations</strong></h2>

<h2><strong>Behavior Expectations</strong></h2>

<h2><strong>Emergency Protocols and Safety</strong></h2>
<p><strong>In the event of emergency situations that require class cancellation or format changes, you will be notified through official VinUniversity communication channels.</strong> If classes must be suspended, we will transition to online learning to ensure continuity of instruction. All assignments, deadlines, and course expectations will be communicated clearly during any emergency period. In case of severe weather, natural disasters, or other emergencies affecting campus operations, please monitor official VinUniversity announcements and do not come to campus if conditions are unsafe. Your safety is our top priority. If you experience personal emergencies that affect your ability to attend class or complete coursework, please contact your instructor and Student Affairs Management as soon as possible to discuss accommodations. For immediate campus emergencies, follow posted evacuation procedures and emergency contact information. Please familiarize yourself with emergency exits and emergency procedures. If you notice any safety hazards, please contact the Operations department at <a href="mailto:operation@vinuni.edu.vn">operation@vinuni.edu.vn</a>.</p>
`.trim();

const COURSE_SCHEDULE_FOOTER_HTML = `
<h2 style="margin-top: 12px; font-weight: bold;">Schedule Modification</h2>
<p>This schedule may be modified to best accommodate learners. Any major changes will be communicated through official channels.</p>
`.trim();

const GRADING_SCHEME_ROUNDING_POLICY_STATIC_HTML = `
<h2 style="margin-top: 12px;"><strong>Grading Scheme Rounding Policy</strong></h2>
<p>Note: When scores are at a boundary between two letter grades, they are rounded up from 0.5 - 0.99 and remain at the same letter grade from 0.01 – 0.49.</p>
`.trim();

const TH_STYLE = 'background:#fafafa;border:1px solid #f0f0f0;padding:10px 12px;font-weight:600;';
const TD_STYLE = 'border:1px solid #f0f0f0;padding:10px 12px;';
const GROUP_ROW_STYLE = `${TD_STYLE}background:#f6ffed;font-weight:600;`;
const SECTION_HEADING_STYLE = 'margin-top: 12px;';

const tdStyleForAlign = (align?: 'left' | 'center' | 'right') => `${TD_STYLE}${align ? `text-align:${align};` : ''}`;
const thStyleForAlign = (align?: 'left' | 'center' | 'right') => `${TH_STYLE}${align ? `text-align:${align};` : ''}`;

function escapeHtmlTextForTableCell(s: string): string {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSectionHeadingHtml(title: string, level: 'h2' | 'h3' = 'h2'): string {
	return `<${level} style="${SECTION_HEADING_STYLE}"><strong>${title}</strong></${level}>`;
}

function findHeadingStartIndex(html: string, title: string): number {
	const lowerHtml = html.toLowerCase();
	const lowerTitle = title.toLowerCase();
	let cursor = 0;
	while (cursor < lowerHtml.length) {
		const titleIdx = lowerHtml.indexOf(lowerTitle, cursor);
		if (titleIdx === -1) return -1;
		const openingMatch = /<h[1-6][^>]*>(?![\s\S]*<h[1-6][^>]*>)/i.exec(lowerHtml.slice(0, titleIdx));
		if (openingMatch && typeof openingMatch.index === 'number') {
			const openIdx = openingMatch.index;
			const closingBefore = lowerHtml.slice(openIdx, titleIdx).search(/<\/h[1-6]>/i);
			if (closingBefore === -1) return openIdx;
		}
		cursor = titleIdx + lowerTitle.length;
	}
	return -1;
}

export function buildCourseScheduleHtml(lichTrinhChungList?: any[] | null): string {
	const list = lichTrinhChungList ?? [];

	const headerHtml = COURSE_SCHEDULE_COLUMNS.map(
		(col) => `<th style="${TH_STYLE}"${col.tooltip ? ` title="${col.tooltip}"` : ''}>${col.title}</th>`,
	).join('');

	const rowsHtml = list
		.map((item) => {
			const cells = COURSE_SCHEDULE_COLUMNS.map((col) => {
				const val = (item as any)[col.dataIndex];
				const displayVal = col.render ? col.render(val, item) : (val ?? '');
				const cellClass = col.renderAsHtml ? ' class="syllabus-cs-content-html"' : '';
				return `<td${cellClass} style="${tdStyleForAlign(col.align)}">${displayVal}</td>`;
			}).join('');
			return `<tr>${cells}</tr>`;
		})
		.join('');

	const table = `
<table contenteditable="false" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`.trim();

	return `${table}\n${COURSE_SCHEDULE_FOOTER_HTML}`.trim();
}

export const CLO_IRM_LEGEND_HTML = `
<ul class="syllabus-clo-irm-legend" style="list-style:none;margin:0;padding:0;font-size:14px;color:rgba(0,0,0,0.88);">
<li style="margin-bottom:8px;"><strong>Introduced (I):</strong> The knowledge/skills related to the Program Learning Outcomes (PLOs) are presented in the course. This typically occurs in foundational or lower-level courses in your program.</li>
<li style="margin-bottom:8px;"><strong>Reinforced/Practiced (R):</strong> The knowledge/skills related to the Program Learning Outcomes (PLOs) are being worked on at a level above the introductory stage and/or the knowledge/skills are being developed at a deeper level.</li>
<li><strong>Mastery (M):</strong> You should have developed a sufficient level of competency in the knowledge/skills related to the Program Learning Outcomes (PLOs). This is where the assessment of the program learning outcome is done (or the artifact for analysis is collected).</li>
</ul>
`.trim();

export const CLO_TARGETS_TABLE_HEADING_TITLE = 'Course Learning Outcomes (CLOs)';
export const CLO_PLO_MATRIX_TABLE_HEADING_TITLE = 'CLO–PLO Mapping Matrix';

export function cloMatrixHintParagraphHtml(message: string): string {
	if (!message) return '';
	return `<p class="syllabus-clo-matrix-hint" style="font-size:12px;font-style:italic;color:rgba(0,0,0,0.45);margin:0;">${escapeHtmlTextForTableCell(message)}</p>`;
}

export function buildCloPloEditorBodyHtml(parts: { targetsTableHtml: string; matrixBlockHtml: string }): string {
	return `
<div class="syllabus-clo-irm-legend-wrap">${CLO_IRM_LEGEND_HTML}</div>
${buildSectionHeadingHtml(CLO_TARGETS_TABLE_HEADING_TITLE, 'h3')}
<div class="syllabus-clo-targets-table" style="margin-top:8px;width:100%;">${parts.targetsTableHtml}</div>
${buildSectionHeadingHtml(CLO_PLO_MATRIX_TABLE_HEADING_TITLE, 'h3')}
<div class="syllabus-clo-matrix-block" style="margin-top:8px;width:100%;">${parts.matrixBlockHtml}</div>
`.trim();
}

export function buildCloTargetsTableHtml(rows: { ma?: string; ten?: string }[]): string {
	const list = rows ?? [];
	const headerHtml = [
		`<th style="${thStyleForAlign('center')}width:15%;">CLO Code</th>`,
		`<th style="${thStyleForAlign('left')}">Description</th>`,
	].join('');

	const rowsHtml = list
		.map(
			(r) =>
				`<tr>
<td style="${tdStyleForAlign('center')}"><strong>${escapeHtmlTextForTableCell(r.ma ?? '')}</strong></td>
<td style="${tdStyleForAlign('left')}">${escapeHtmlTextForTableCell(r.ten ?? '')}</td>
</tr>`,
		)
		.join('');

	return `
<table contenteditable="false" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`.trim();
}

function levelLetterFromTyLeAnhHuong(tyLeAnhHuong?: number): '' | 'I' | 'R' | 'M' {
	switch (tyLeAnhHuong) {
		case 1:
			return 'I';
		case 2:
			return 'R';
		case 3:
			return 'M';
		default:
			return '';
	}
}

function cloLevelBadgeSpanHtml(level: 'I' | 'R' | 'M'): string {
	const bg = level === 'I' ? '#fff7e6' : level === 'R' ? '#e6f7ff' : '#f6ffed';
	return `<span style="display:inline-block;min-width:20px;border-radius:4px;background-color:${bg};text-align:center;color:#000;font-size:11px;font-weight:500;">${level}</span>`;
}

export function buildCloPloMatrixTableHtml(
	cloRows: { ma?: string }[],
	ploCodes: string[],
	mappings: TCloPloMatrixMapping[],
): string {
	const th = 'background:#fafafa;border:1px solid #f0f0f0;padding:8px 10px;font-weight:600;font-size:12px;';
	const td = 'border:1px solid #f0f0f0;padding:8px 10px;font-size:12px;';

	const ploHeaderCells = ploCodes
		.map((p) => `<th style="${th}text-align:center;white-space:nowrap;">${escapeHtmlTextForTableCell(p)}</th>`)
		.join('');

	const headerRow = `<tr><th style="${th}text-align:center;min-width:80px;">CLO Code</th>${ploHeaderCells}</tr>`;

	const body = cloRows
		.map((row) => {
			const ma = row.ma ?? '';
			const first = `<td style="${td}text-align:center;"><strong>${escapeHtmlTextForTableCell(ma)}</strong></td>`;
			const rest = ploCodes
				.map((plo) => {
					const m = mappings.find((it) => it.maClo === ma && it.maPlo === plo);
					const level = m ? levelLetterFromTyLeAnhHuong(m.tyLeAnhHuong) : '';
					if (!level) return `<td style="${td}text-align:center;"></td>`;
					return `<td style="${td}text-align:center;">${cloLevelBadgeSpanHtml(level)}</td>`;
				})
				.join('');
			return `<tr>${first}${rest}</tr>`;
		})
		.join('');

	return `
<div style="overflow-x:auto;width:100%;">
<table contenteditable="false" style="width:100%;min-width:max-content;border-collapse:collapse;border:1px solid #f0f0f0;">
<thead>${headerRow}</thead>
<tbody>${body}</tbody>
</table>
</div>`.trim();
}

export const buildGradingSchemeTableData = (deCuong?: any, gradingSchemeData?: any[]) => {
	let finalGradingData = (gradingSchemeData || []) as any[];
	if (deCuong?.isTinhDiem && deCuong?.coCheTinhDiem) {
		const sortedCoChe = [...(deCuong.coCheTinhDiem || [])].sort((a, b) => (a.index || 0) - (b.index || 0));
		finalGradingData = sortedCoChe.map((item: any) => ({
			...item,
			diemChu: item.name,
			diemFrom: item.min,
			diemTo: item.max,
			diemThang4: item.diemThang4 ?? 0,
		}));
	}
	return finalGradingData;
};

function matchingClosMeasuredFromCdr(
	item: { isFinal?: boolean; field?: string },
	cloList: any[],
	cdrList: any[],
): string {
	const trongSoKey = `${item.isFinal ? 'trongSoThi' : 'trongSo'}${item.field}`;
	const cloIdsWithTinhDiem = new Set<string>();
	for (const r of cdrList) {
		if (!r?.isTinhDiem || r?.trongSoTuongUng !== trongSoKey || !r?.cloId) continue;
		cloIdsWithTinhDiem.add(String(r.cloId));
	}
	if (!cloIdsWithTinhDiem.size || !cloList.length) return '';
	return cloList
		.filter((c: any) => c?._id != null && cloIdsWithTinhDiem.has(String(c._id)))
		.map((c: any) => c.ma as string)
		.filter(Boolean)
		.sort()
		.join(', ');
}

function buildAssessmentSummaryTableHtml(deCuong: any, cloList: any[], cdrList: any[]): string {
	const colCount = ASSESSMENT_COLUMNS.length;
	const sectionHeaderRow = (label: string) =>
		`<tr><td colspan="${colCount}" style="${TD_STYLE}background:#f6ffed;font-weight:600;text-align:left;">${escapeHtmlTextForTableCell(
			label,
		)}</td></tr>`;

	const mapItemToRow = (item: any) => ({
		assessment: item.moTa || (item.isFinal ? `Final Exam ${item.field}` : ''),
		weight: item.trongSo,
		assessedTask: item.hinhThucDanhGia || '',
		matchingClos: matchingClosMeasuredFromCdr(item, cloList, cdrList),
	});

	const renderDataRow = (rowData: Record<string, unknown>) => {
		const cells = ASSESSMENT_COLUMNS.map((col) => {
			const val = rowData[col.dataIndex];
			const displayVal = col.render ? col.render(val, rowData) : val || '';
			return `<td style="${tdStyleForAlign(col.align)}">${displayVal}</td>`;
		}).join('');
		return `<tr>${cells}</tr>`;
	};

	const processItems = (deCuong?.thongTinTrongSo ?? []).map((item: any) => ({ ...item, isFinal: false }));
	const finalItems = (deCuong?.thongTinTrongSoThi ?? []).map((item: any) => ({ ...item, isFinal: true }));

	const rows = [
		...(processItems.length ? [sectionHeaderRow('Continuous Assessment')] : []),
		...processItems.map(mapItemToRow).map(renderDataRow),
		...(finalItems.length ? [sectionHeaderRow('Summative Assessment')] : []),
		...finalItems.map(mapItemToRow).map(renderDataRow),
	].join('');

	const headerHtml = ASSESSMENT_COLUMNS.map(
		(col) =>
			`<th style="${TH_STYLE}"${col.tooltip ? ` title="${escapeHtmlTextForTableCell(col.tooltip)}"` : ''}>${col.title}</th>`,
	).join('');

	return `
<table contenteditable="false" class="syllabus-assessment-section-table" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rows}</tbody>
</table>`.trim();
}

function buildGradingSchemeTableHtml(deCuong: any, gradingSchemeData?: any[]): string {
	const finalGradingData = buildGradingSchemeTableData(deCuong, gradingSchemeData);

	const headerHtml = GRADING_SCHEME_COLUMNS.map((col) => `<th style="${TH_STYLE}">${col.title}</th>`).join('');

	const rowsHtml = finalGradingData
		.map((item) => {
			const cells = GRADING_SCHEME_COLUMNS.map((col) => {
				const val = (item as any)[col.dataIndex];
				const displayVal = col.render ? col.render(val, item) : (val ?? '');
				return `<td style="${tdStyleForAlign(col.align)}">${displayVal}</td>`;
			}).join('');
			return `<tr>${cells}</tr>`;
		})
		.join('');

	return `
<table contenteditable="false" class="syllabus-grading-scheme-table" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`.trim();
}

function buildCloWeightMatrixTableHtml(deCuong: any, cloList: any[], cdrList: any[]): string {
	const weightRows = [
		...(deCuong?.thongTinTrongSo ?? []).map((item: any) => ({ ...item, isFinal: false })),
		...(deCuong?.thongTinTrongSoThi ?? []).map((item: any) => ({ ...item, isFinal: true })),
	];

	const usedCloIds = new Set(
		(cdrList ?? [])
			.map((row: any) => row?.cloId)
			.filter((id: any) => id != null)
			.map(String),
	);
	const filteredCloList = cloList.filter((clo: any) => clo?._id != null && usedCloIds.has(String(clo._id)));

	const matrixHeader = [
		`<th style="${thStyleForAlign('left')}">Assessment Type</th>`,
		...filteredCloList.map((clo: any) => {
			const cloHeader = `${clo?.ma ?? ''}${clo?.diemToiThieu != null ? ` (${clo?.diemToiThieu})` : ''}`;
			return `<th style="${thStyleForAlign('center')}">${escapeHtmlTextForTableCell(cloHeader)}</th>`;
		}),
	].join('');

	const totalTinhDiemByClo = filteredCloList.map((clo: any) =>
		cdrList
			.filter((row: any) => row?.cloId === clo?._id && row?.isTinhDiem)
			.reduce((sum: number, row: any) => sum + Number(row?.tyLeAnhHuong ?? 0), 0),
	);

	const buildWeightRow = (item: any) => {
		const trongSoKey = `${item.isFinal ? 'trongSoThi' : 'trongSo'}${item.field}`;
		const labelDefault = item.isFinal ? `Final Exam ${item.field}` : `Assessment ${item.field}`;
		const label = `${item.moTa || labelDefault} (GPA weight: ${item.trongSo ?? 0}%)`;
		const cloCells = filteredCloList
			.map((clo: any) => {
				const matched = cdrList.find((row: any) => row?.trongSoTuongUng === trongSoKey && row?.cloId === clo?._id);
				const val = Number(matched?.tyLeAnhHuong ?? 0);
				return `<td style="${tdStyleForAlign('center')}">${Number.isFinite(val) ? val : 0}%</td>`;
			})
			.join('');
		return `<tr>
<td style="${TD_STYLE}font-weight:600;">${escapeHtmlTextForTableCell(label)}</td>
${cloCells}
</tr>`;
	};

	const processRows = weightRows.filter((item: any) => !item.isFinal).map(buildWeightRow);
	const finalRows = weightRows.filter((item: any) => item.isFinal).map(buildWeightRow);

	const totalRow = `<tr>
<td style="${TD_STYLE}font-weight:600;">Total Graded Weight</td>
${totalTinhDiemByClo
	.map((v: number) => `<td style="${TD_STYLE}text-align:center;color:#52c41a;font-weight:600;">${v}%</td>`)
	.join('')}
</tr>`;

	const groupRow = (label: string) =>
		`<tr><td colspan="${1 + filteredCloList.length}" style="${GROUP_ROW_STYLE}">${label}</td></tr>`;

	const matrixBody = `
${groupRow('Continuous Assessment')}
${processRows.join('')}
${groupRow('Summative Assessment')}
${finalRows.join('')}
${totalRow}`.trim();

	return `
${buildSectionHeadingHtml('CLO Weight Matrix', 'h3')}
<table contenteditable="false" class="syllabus-clo-weight-matrix-table" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${matrixHeader}</tr></thead>
<tbody>${matrixBody}</tbody>
</table>`.trim();
}

export function buildAssessmentStaticHtmlParts(
	deCuong?: any,
	cloData?: any[],
	gradingSchemeData?: any[],
	cdrHinhThucData?: any[],
): { beforeTasks: string; afterTasks: string } {
	const cloList = cloData ?? [];
	const cdrList = cdrHinhThucData ?? [];

	const beforeTasks = `
${buildAssessmentSummaryTableHtml(deCuong, cloList, cdrList)}
${buildCloWeightMatrixTableHtml(deCuong, cloList, cdrList)}
`.trim();

	const afterTasks = `
${buildSectionHeadingHtml('Grading Scheme')}
${buildGradingSchemeTableHtml(deCuong, gradingSchemeData)}
${GRADING_SCHEME_ROUNDING_POLICY_STATIC_HTML}
`.trim();

	return { beforeTasks, afterTasks };
}

function buildAssessmentTasksTableHtml(): string {
	const headerCells = ASSESSMENT_TASKS_TABLE_COLUMNS.map(
		(c) => `<th style="${thStyleForAlign('center')}">${c}</th>`,
	).join('');
	const emptyRow = `<tr>${ASSESSMENT_TASKS_TABLE_COLUMNS.map((_, idx) =>
		idx === 0 ? `<td style="${tdStyleForAlign('center')}">1</td>` : `<td style="${TD_STYLE}">&nbsp;</td>`,
	).join('')}</tr>`;
	return `
<table style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerCells}</tr></thead>
<tbody>${emptyRow}</tbody>
</table>`.trim();
}

export function buildAssessmentTasksDefaultHtml(): string {
	return `${buildSectionHeadingHtml(ASSESSMENT_TASKS_HEADING_TITLE)}\n${buildAssessmentTasksTableHtml()}`;
}

export function buildLateSubmissionDefaultHtml(): string {
	return buildSectionHeadingHtml(LATE_SUBMISSION_HEADING_TITLE);
}

export function buildAssessmentNoiDungDefaultHtml(): string {
	return combineAssessmentNoiDungParts(buildAssessmentTasksDefaultHtml(), buildLateSubmissionDefaultHtml());
}

export function combineAssessmentNoiDungParts(assessmentTasks?: string, lateSubmission?: string): string {
	const a = (assessmentTasks ?? '').trim();
	const l = (lateSubmission ?? '').trim();
	return `${a}\n${ASSESSMENT_NOI_DUNG_SPLIT_MARKER}\n${l}`.trim();
}

export function splitAssessmentNoiDung(html: string): {
	assessmentTasks: string;
	lateSubmission: string;
} {
	const fullText = (html ?? '').trim();
	if (!fullText) return { assessmentTasks: '', lateSubmission: '' };

	const markerMatch = ASSESSMENT_NOI_DUNG_SPLIT_MARKER_RE.exec(fullText);
	if (markerMatch) {
		return {
			assessmentTasks: fullText.slice(0, markerMatch.index).trim(),
			lateSubmission: fullText.slice(markerMatch.index + markerMatch[0].length).trim(),
		};
	}

	const lateIdx = findHeadingStartIndex(fullText, LATE_SUBMISSION_HEADING_TITLE);
	if (lateIdx !== -1) {
		return {
			assessmentTasks: fullText.slice(0, lateIdx).trim(),
			lateSubmission: fullText.slice(lateIdx).trim(),
		};
	}

	const hasAssessmentTasks = findHeadingStartIndex(fullText, ASSESSMENT_TASKS_HEADING_TITLE) !== -1;
	return hasAssessmentTasks
		? { assessmentTasks: fullText, lateSubmission: '' }
		: { assessmentTasks: '', lateSubmission: fullText };
}

const DEFAULT_NOI_DUNG_BY_TEMPLATE_TITLE: Record<string, string> = {
	'Essential Logistics': DEFAULT_NOI_DUNG_ESSENTIAL_LOGISTICS,
	'Course Expectations': DEFAULT_NOI_DUNG_COURSE_EXPECTATIONS,
};

export function getDefaultNoiDungForTemplateLoai(loai: string): string {
	return DEFAULT_NOI_DUNG_BY_TEMPLATE_TITLE[loai] ?? '';
}

/** Full Assessment section HTML for preview (static tables + edited middle + grading). */
export function buildAssessmentHtml(
	deCuong?: any,
	cloData?: any[],
	gradingSchemeData?: any[],
	editorNoiDung?: string | null,
	cdrHinhThucData?: any[],
): string {
	const { beforeTasks, afterTasks } = buildAssessmentStaticHtmlParts(
		deCuong,
		cloData,
		gradingSchemeData,
		cdrHinhThucData ?? [],
	);
	const middle =
		editorNoiDung != null && String(editorNoiDung).trim() !== ''
			? String(editorNoiDung).trim()
			: buildAssessmentNoiDungDefaultHtml();
	return `${beforeTasks}\n${middle}\n${afterTasks}`.trim();
}
