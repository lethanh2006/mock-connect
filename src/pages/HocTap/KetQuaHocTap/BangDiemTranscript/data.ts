export type TCourse = {
	code: string;
	nameEn: string;
	nameVi: string;
	creditAttempted: number;
	creditEarned: number;
	grade: string;
	/** Ghi chú điểm — học phần cùng ghi chú được group trong kỳ */
	note?: string;
};

/** Title nhóm chuyển điểm trên transcript: EN + VI */
export function formatTransferGroupTitle(note?: string): { en: string; vi: string } {
	const n = (note || '').trim();
	if (!n) return { en: '', vi: '' };
	const school = n.replace(/^transferred\s+from\s*/i, '').trim() || n;
	const en = /^transferred\s+from\b/i.test(n) ? n : `Transferred from ${school}`;
	const vi = `Chuyển từ ${school}`;
	return { en, vi };
}

export type TSemester = {
	title: string;
	titleVi?: string;
	badges?: string[];
	gpa: number;
	creditEarned: number;
	courses: TCourse[];
};

export type TStudent = {
	fullName: string;
	fullNameVi: string;
	studentId: string;
	dateOfBirth: string;
	gender: string;
	genderVi: string;
	/** Tên ngành (Degree) */
	degree: string;
	degreeVi: string;
	/** CTĐT chuẩn — rỗng nếu trùng ngành / không có; fallback mã maChuongTrinhDaoTaoChuan */
	program: string;
	programVi: string;
	/** Chuyên ngành — rỗng nếu không có */
	concentration: string;
	concentrationVi: string;
	/** Chuyên ngành phụ — rỗng nếu không có */
	minor: string;
	minorVi: string;
};

export type TSummary = {
	creditsEarned: number;
	cgpa: number;
	dateOfIssueEn: string;
	dateOfIssueVi: string;
	/** Ghi chú bảng điểm EN (từ CTĐT.ghiChuBangDiemForeign) */
	noteEn?: string;
	/** Ghi chú bảng điểm VI (từ CTĐT.ghiChuBangDiem) */
	noteVi?: string;
	/** Số quyết định tốt nghiệp — có thì mới hiện đoạn công nhận TN */
	decisionNo?: string;
	decisionDateEn?: string;
	decisionDateVi?: string;
};

export type TNotation = {
	code: string;
	en: string;
	vi: string;
};

export type TTranscriptData = {
	student: TStudent;
	summary: TSummary;
	notations: TNotation[];
	creditNote: { en: string; vi: string };
	durationNote: { en: string; vi: string };
	authentication: {
		titleEn: string;
		titleVi: string;
		items: { en: string; vi: string }[];
	};
	gradeScale: { letters: string[]; points: string[] };
	semesters: TSemester[];
};

/** Nội dung tĩnh trên transcript (không lấy từ API) */
export const TRANSCRIPT_STATIC = {
	notations: [
		{ code: 'CR', en: 'Credit (Pass)', vi: 'Đạt' },
		{ code: 'NCR', en: 'No Credit', vi: 'Không đạt' },
		{ code: 'S', en: 'Satisfactory', vi: 'Đạt yêu cầu' },
		{ code: 'U', en: 'Unsatisfactory', vi: 'Không đạt yêu cầu' },
		{ code: 'IP', en: 'In-Progress', vi: 'Đang trong tiến trình học' },
		{ code: 'MT', en: 'Multi-Term', vi: 'Học phần kéo dài nhiều kỳ' },
		{ code: 'I', en: 'Incomplete', vi: 'Chưa hoàn thành' },
		{ code: 'NGR', en: 'No Grade Report', vi: 'Chưa có điểm' },
		{ code: 'W', en: 'Withdrawn', vi: 'Đã rút học phần' },
		{ code: 'Z', en: 'Exemption', vi: 'Được miễn học' },
		{ code: 'T', en: 'Credit Transfer', vi: 'Điểm chuyển đổi' },
		{ code: 'R', en: 'Repeated Course', vi: 'Học phần học lại' },
	] satisfies TNotation[],
	creditNote: {
		en: 'One (01) credit is roughly equivalent to 15 contact hours for courses that use a lecture or classroom-based instruction; 30 - 45 contact hours for practicum and laboratory courses; 45 - 90 contact hours for fieldwork (in industry, communities, or hospitals) based courses; 45 - 60 hours for courses that involve independent studies such as thesis or internship.',
		vi: 'Một (01) tín chỉ được quy định bằng 15 giờ học lý thuyết; 30 - 45 giờ học thực hành, thí nghiệm hoặc thảo luận; 45 - 90 giờ thực tập tại cơ sở (doanh nghiệp, cộng đồng, hoặc bệnh viện); 45 - 60 giờ làm tiểu luận, bài tập lớn hoặc đồ án, khoá luận tốt nghiệp hoặc chuyên đề thực tập.',
	},
	durationNote: {
		en: 'Duration of training: 4 years - 08 regular semesters and 6 years - 12 regular semesters (Medical Doctor Program) excluding Summer semesters.',
		vi: 'Thời gian đào tạo: 4 năm - 08 học kỳ chính và 6 năm - 12 học kỳ chính (chương trình đào tạo Bác sĩ Y khoa) không bao gồm học kỳ hè.',
	},
	authentication: {
		titleEn: 'TRANSCRIPT AUTHENTICATION',
		titleVi: 'Xác thực bảng điểm',
		items: [
			{
				en: 'This transcript is valid only when it bears the signature of an authorized representative and the official seal of VinUniversity.',
				vi: 'Bảng điểm chỉ có giá trị khi có chữ ký của đại diện có thẩm quyền và dấu của Trường Đại học VinUni.',
			},
			{
				en: 'A transcript without an original signature and seal, or bearing any erasure or alteration, is considered invalid.',
				vi: 'Bảng điểm không có chữ ký gốc và dấu, hoặc bị tẩy xóa, sửa chữa, được coi là không hợp lệ.',
			},
			{
				en: 'All verification requests should be directed to the Office of the Registrar. Email: registrar@vinuni.edu.vn.',
				vi: 'Mọi yêu cầu xác minh xin gửi về Phòng Quản lý Đào tạo.',
			},
		],
	},
	gradeScale: {
		letters: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
		points: ['4.0', '3.7', '3.3', '3.0', '2.7', '2.3', '2.0', '1.7', '1.3', '1.0', '0.7', '0.0'],
	},
};
