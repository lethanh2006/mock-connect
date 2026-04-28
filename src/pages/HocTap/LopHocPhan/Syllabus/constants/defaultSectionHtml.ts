import { ColorDiemChu, ELoaiDiemChu } from '@/services/HocTap/LopHocPhan/constant';

export interface SyllabusTableColumnConfig {
	title: string;
	dataIndex: string;
	tooltip?: string;
	align?: 'left' | 'center' | 'right';
	renderAsHtml?: boolean;
	render?: (val: any, record?: any) => string;
}

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
			return `<span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 4px; background: ${color}; color: #fff; margin: 0; font-weight: 500;">${val}</span>`;
		},
	},
];

export const ASSESSMENT_FOOTER_HEADING_TITLES = [
	'Grading Scheme Rounding Policy',
	'Late Submission Policy and Makeup Request Procedures',
] as const;

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

const COURSE_SCHEDULE_FOOTER_HTML = `
<h2 style="margin-top: 12px;">Schedule Modification</h2>
<p>This schedule may be modified to best accommodate learners. Any major changes will be communicated through official channels.</p>
`.trim();

/** Dùng chung cho `buildCourseScheduleHtml` và `buildCloTargetsTableHtml`. */
const COURSE_TABLE_TH_STYLE = 'background:#fafafa;border:1px solid #f0f0f0;padding:10px 12px;font-weight:600;';

const cloTargetsTdStyle = (align: 'left' | 'center' | 'right') =>
	`border:1px solid #f0f0f0;padding:10px 12px;text-align:${align};`;

export function buildCourseScheduleHtml(lichTrinhChungList?: any[] | null): string {
	const list = lichTrinhChungList ?? [];

	const headerHtml = COURSE_SCHEDULE_COLUMNS.map(
		(col) => `<th style="${COURSE_TABLE_TH_STYLE}"${col.tooltip ? ` title="${col.tooltip}"` : ''}>${col.title}</th>`,
	).join('');

	const rowsHtml = list
		.map((item) => {
			const rowHtml = COURSE_SCHEDULE_COLUMNS.map((col) => {
				const val = (item as any)[col.dataIndex];
				const displayVal = col.render ? col.render(val, item) : (val ?? '');
				const style = `border:1px solid #f0f0f0;padding:10px 12px;${col.align ? `text-align:${col.align};` : ''}`;
				const cellClass = col.renderAsHtml ? ' class="syllabus-cs-content-html"' : '';
				return `<td${cellClass} style="${style}">${displayVal}</td>`;
			}).join('');
			return `<tr>${rowHtml}</tr>`;
		})
		.join('');

	const table = `
<table contenteditable="false" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`.trim();
	return `${table}
${COURSE_SCHEDULE_FOOTER_HTML}`.trim();
}

function escapeHtmlTextForTableCell(s: string): string {
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildCloTargetsTableHtml(rows: { ma?: string; ten?: string }[]): string {
	const list = rows ?? [];
	const headerHtml = [
		`<th style="${COURSE_TABLE_TH_STYLE}text-align:center;width:15%;">CLO code</th>`,
		`<th style="${COURSE_TABLE_TH_STYLE}text-align:left;">Description</th>`,
	].join('');

	const rowsHtml = list
		.map(
			(r) =>
				`<tr>
<td style="${cloTargetsTdStyle('center')}"><strong>${escapeHtmlTextForTableCell(r.ma ?? '')}</strong></td>
<td style="${cloTargetsTdStyle('left')}">${escapeHtmlTextForTableCell(r.ten ?? '')}</td>
</tr>`,
		)
		.join('');

	return `
<table contenteditable="false" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${headerHtml}</tr></thead>
<tbody>${rowsHtml}</tbody>
</table>`.trim();
}

export type TCloPloMatrixMapping = { maClo?: string; maPlo?: string; tyLeAnhHuong?: number };

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

	const headerRow = `<tr><th style="${th}text-align:center;min-width:80px;">CLO</th>${ploHeaderCells}</tr>`;

	const body = cloRows
		.map((row) => {
			const ma = row.ma ?? '';
			const first = `<td style="${td}text-align:center;"><strong>${escapeHtmlTextForTableCell(ma)}</strong></td>`;
			const rest = ploCodes
				.map((plo) => {
					const m = mappings.find((it) => it.maClo === ma && it.maPlo === plo);
					const level = m ? levelLetterFromTyLeAnhHuong(m.tyLeAnhHuong) : '';
					if (!level) {
						return `<td style="${td}text-align:center;"></td>`;
					}
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

export function buildAssessmentFooterDefaultHtml(): string {
	return ASSESSMENT_FOOTER_HEADING_TITLES.map((t) => `<h2 style="margin-top: 12px;">${t}</h2>`).join('\n');
}

export function buildAssessmentStaticHtml(deCuong?: any, cloData?: any[], gradingSchemeData?: any[]): string {
	const matchingClos = (cloData?.map((item: any) => item?.ma) || []).join(', ');
	const rowDataList = [
		...(deCuong?.thongTinTrongSo ?? []).map((item: any) => ({ ...item, isFinal: false })),
		...(deCuong?.thongTinTrongSoThi ?? []).map((item: any) => ({ ...item, isFinal: true })),
	]
		.map((item: any) => ({
			assessment: item.moTa || (item.isFinal ? `Thi KTHP ${item.field}` : ''),
			weight: item.trongSo,
			assessedTask: item.hinhThucDanhGia || '',
		}))
		.map((a) => ({ ...a, matchingClos }));

	const assessmentHeader = ASSESSMENT_COLUMNS.map(
		(col) =>
			`<th style="background:#fafafa;border:1px solid #f0f0f0;padding:10px 12px;font-weight:600;">${col.title}</th>`,
	).join('');

	const assessmentRows = rowDataList
		.map((rowData) => {
			const rowHtml = ASSESSMENT_COLUMNS.map((col) => {
				const val = (rowData as any)[col.dataIndex];
				const displayVal = col.render ? col.render(val, rowData) : val || '';
				const style = `border:1px solid #f0f0f0;padding:10px 12px;${col.align ? `text-align:${col.align};` : ''}`;
				return `<td style="${style}">${displayVal}</td>`;
			}).join('');

			return `<tr>${rowHtml}</tr>`;
		})
		.join('');

	const assessmentTable = `
<table contenteditable="false" class="syllabus-assessment-section-table" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${assessmentHeader}</tr></thead>
<tbody>${assessmentRows}</tbody>
</table>`;

	const finalGradingData = buildGradingSchemeTableData(deCuong, gradingSchemeData);

	const gradingSchemeHeader = GRADING_SCHEME_COLUMNS.map(
		(col) =>
			`<th style="background:#fafafa;border:1px solid #f0f0f0;padding:10px 12px;font-weight:600;">${col.title}</th>`,
	).join('');

	const gradingSchemeRows = finalGradingData
		.map((item) => {
			const rowHtml = GRADING_SCHEME_COLUMNS.map((col) => {
				const val = (item as any)[col.dataIndex];
				const displayVal = col.render ? col.render(val, item) : (val ?? '');
				const style = `border:1px solid #f0f0f0;padding:10px 12px;${col.align ? `text-align:${col.align};` : ''}`;
				return `<td style="${style}">${displayVal}</td>`;
			}).join('');
			return `<tr>${rowHtml}</tr>`;
		})
		.join('');

	const gradingSchemeTable = `
<table contenteditable="false" class="syllabus-grading-scheme-table" style="width:100%;border-collapse:collapse;margin-top:8px;">
<thead><tr>${gradingSchemeHeader}</tr></thead>
<tbody>${gradingSchemeRows}</tbody>
</table>`;

	return `
${assessmentTable}
<h2 style="margin-top: 12px;"><strong>Grading Scheme</strong></h2>
${gradingSchemeTable}
`.trim();
}

export const buildAssessmentHtml = (
	deCuong?: any,
	cloData?: any[],
	gradingSchemeData?: any[],
	footerNoiDung?: string | null,
): string => {
	const staticPart = buildAssessmentStaticHtml(deCuong, cloData, gradingSchemeData);
	const footer =
		footerNoiDung != null && String(footerNoiDung).trim() !== ''
			? String(footerNoiDung)
			: buildAssessmentFooterDefaultHtml();
	return `${staticPart}\n${footer}`.trim();
};
