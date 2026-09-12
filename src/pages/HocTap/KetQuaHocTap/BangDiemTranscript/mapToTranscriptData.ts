import { EGioiTinh } from '@/services/DaoTao/constant';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import dayjs from 'dayjs';
import _ from 'lodash';
import { appendDiemChuNotation, getSoLanHocFromDiem } from '@/utils/diemChuNotation';
import { TRANSCRIPT_STATIC, type TTranscriptData } from './data';

export type TMissingTranscriptField = {
	field: string;
	note: string;
};

const removeDiacritics = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');

const formatDob = (raw?: string) => {
	if (!raw) return '';
	const d = dayjs(raw);
	return d.isValid() ? d.format('DD.MM.YYYY') : raw;
};

const formatIssueEn = (d = dayjs()) => d.locale('en').format('DD MMM YYYY').toUpperCase();
const formatIssueVi = (d = dayjs()) => d.format('DD/MM/YYYY');

type TCtdtTranscript = ChuongTrinhDaoTao.IRecord & {
	ghiChuBangDiem?: string;
	ghiChuBangDiemForeign?: string;
};

type TKqhkTranscript = KetQuaHocKy.IRecord & {
	danhHieu?: string[];
	trungBinhHocKyAll?: number;
};

type THocTapHienTai = SinhVien.IThongTinHocTapHienTai & {
	chuyenNganh?: { ten?: string; tenTiengAnh?: string };
	chuyenNganhPhu?: { ten?: string; tenTiengAnh?: string };
};

type TDiemTranscript = LopHocPhan.IDiemHpSvHk & {
	maHocKyCaiThien?: string;
	maHocKyDat?: string;
	hocKyDat?: HocKy.IRecord;
	maHocPhanGoc?: string;
	soLanHoc?: number;
};

type Params = {
	sinhVien?: SinhVien.IRecord | null;
	maKhoaNganh: string;
	kqhkList: TKqhkTranscript[];
	diemList: TDiemTranscript[];
	/** CTĐT hiện tại theo khóa ngành */
	chuongTrinhDaoTao?: TCtdtTranscript | null;
	/** Fallback thêm từ API thông tin học tập (nếu có) */
	hocTapHienTai?: THocTapHienTai | null;
	/** Quyết định tốt nghiệp (có số + ngày mới hiện đoạn công nhận TN) */
	quyetDinh?: { soQuyetDinh?: string; ngayBanHanh?: string | Date | null } | null;
};

const formatDecisionDateEn = (raw?: string | Date | null) => {
	if (!raw) return '';
	const d = dayjs(raw);
	return d.isValid() ? d.locale('en').format('MMM D, YYYY') : '';
};

const formatDecisionDateVi = (raw?: string | Date | null) => {
	if (!raw) return '';
	const d = dayjs(raw);
	return d.isValid() ? d.format('D [tháng] M [năm] YYYY') : '';
};

const normName = (s?: string) => removeDiacritics((s || '').trim().toLowerCase()).replace(/\s+/g, ' ');

const isFilled = (s?: string) => !!s && s !== '—';

/** EN = tenTiengAnh, VI = ten (tách field, không dùng ten làm fallback EN) */
const pickSemesterTitle = (hocKy: any, fallback: string) => {
	const title = (hocKy?.tenTiengAnh || '').trim() || fallback;
	const titleVi = (hocKy?.ten || '').trim();
	return {
		title,
		titleVi: titleVi && normName(titleVi) !== normName(title) ? titleVi : '',
	};
};

/** Điểm theo kỳ (IDiemHpSvHk): maHocKy. Điểm HP cuối (IDiemHocPhanSv): maHocKyCaiThien → maHocKyDat. */
const getMaHocKyDiem = (diem: TDiemTranscript) =>
	('maHocKy' in diem ? diem.maHocKy : undefined) ||
	('maHocKyCaiThien' in diem ? diem.maHocKyCaiThien : undefined) ||
	('maHocKyDat' in diem ? diem.maHocKyDat : undefined) ||
	'';

const getHocKyDiem = (diem: TDiemTranscript) =>
	('hocKy' in diem ? diem.hocKy : undefined) || ('hocKyDat' in diem ? diem.hocKyDat : undefined);

const getMaHocPhanQuyDoi = (diem: TDiemTranscript, maKhoaNganh: string) => {
	if ('infoKhoaNganh' in diem) {
		const maHocPhanQuyDoi = diem.infoKhoaNganh?.[maKhoaNganh]?.maHocPhanQuyDoi;
		if (maHocPhanQuyDoi && maHocPhanQuyDoi !== diem.maHocPhan) return maHocPhanQuyDoi;
	}

	if ('maHocPhanGoc' in diem && diem.maHocPhanGoc && diem.maHocPhanGoc !== diem.maHocPhan) return diem.maHocPhanGoc;

	return diem.maHocPhan;
};

/**
 * Map dữ liệu KQHT thật → TTranscriptData (A4 TranscriptSheet).
 * Trường thiếu sẽ fallback + ghi vào `missing`.
 */
export function mapToTranscriptData(params: Params): {
	data: TTranscriptData;
	missing: TMissingTranscriptField[];
} {
	const { sinhVien, maKhoaNganh, kqhkList, diemList, chuongTrinhDaoTao, hocTapHienTai, quyetDinh } = params;
	const missing: TMissingTranscriptField[] = [];

	const pushMissing = (field: string, note: string) => {
		if (!missing.some((m) => m.field === field)) missing.push({ field, note });
	};

	// ----- Student -----
	const fullNameVi = sinhVien?.ten?.trim() || '—';
	const fullNameEn = removeDiacritics(fullNameVi).toUpperCase();
	if (!sinhVien?.ten) pushMissing('student.fullName / fullNameVi', 'Không có họ tên sinh viên');
	else pushMissing('student.fullName (EN)', 'Không có họ tên tiếng Anh — đang bỏ dấu từ tên VI');

	const studentId = sinhVien?.ma || '—';
	if (!sinhVien?.ma) pushMissing('student.studentId', 'Không có mã sinh viên');

	const dateOfBirth = formatDob(sinhVien?.ngaySinh);
	if (!sinhVien?.ngaySinh) pushMissing('student.dateOfBirth', 'Không có ngày sinh');

	const gioi = sinhVien?.gioiTinh;
	let gender = '—';
	let genderVi = '—';
	if (gioi === EGioiTinh.Nam) {
		gender = 'Male';
		genderVi = 'Nam';
	} else if (gioi === EGioiTinh.Nu) {
		gender = 'Female';
		genderVi = 'Nữ';
	} else {
		pushMissing('student.gender / genderVi', 'Không có giới tính');
	}

	// Degree = tên ngành; Program = CTĐT hiện tại từ API hien-tai (ten / tenTiengAnh ở root)
	const ctdtKhoaNganh: TCtdtTranscript | null =
		chuongTrinhDaoTao || hocTapHienTai?.chuongTrinhDaoTao || null;
	const ctdtChuan = ctdtKhoaNganh?.chuongTrinhDaoTaoChuan;
	const nganh =
		hocTapHienTai?.nganhDaoTao ||
		ctdtKhoaNganh?.nganh ||
		(sinhVien?.nganh as { ten?: string; tenTiengAnh?: string } | undefined);
	const chuyenNganh =
		hocTapHienTai?.chuyenNganh || (sinhVien?.chuyenNganh as { ten?: string; tenTiengAnh?: string } | undefined);
	const chuyenNganhPhu =
		hocTapHienTai?.chuyenNganhPhu || (sinhVien?.chuyenNganh2 as { ten?: string; tenTiengAnh?: string } | undefined);

	let degreeVi = nganh?.ten || '';
	let degree = nganh?.tenTiengAnh || degreeVi;
	if (!nganh?.ten) {
		pushMissing('student.degree', 'Không có tên ngành');
		degreeVi = '—';
		degree = '—';
	} else if (!nganh?.tenTiengAnh) {
		pushMissing('student.degree (EN)', 'Không có tên ngành tiếng Anh — đang dùng tên VI');
	}

	// Ưu tiên đúng field root của CTĐT hiện tại (vd. tenTiengAnh: Bachelor of Science in ...)
	const programEnFromCtdt = (ctdtKhoaNganh?.tenTiengAnh || '').trim();
	const programViFromCtdt = (ctdtKhoaNganh?.ten || '').trim();
	let programVi = programViFromCtdt || ctdtChuan?.ten || '';
	let program = programEnFromCtdt || ctdtChuan?.tenTiengAnh || programVi;
	const maCtdt = ctdtKhoaNganh?.ma || ctdtKhoaNganh?.maChuongTrinhDaoTaoChuan || ctdtChuan?.ma || '';
	if (!programVi && !program && maCtdt) {
		program = maCtdt;
		programVi = maCtdt;
		pushMissing('student.program', 'Chưa có tên CTĐT — đang hiển thị mã CTĐT');
	} else if (!programVi && !program) {
		pushMissing('student.program', 'Không có chương trình đào tạo hiện tại');
		program = '';
		programVi = '';
	} else if (!programEnFromCtdt && !ctdtChuan?.tenTiengAnh) {
		pushMissing('student.program (EN)', 'Không có tên CTĐT tiếng Anh — đang dùng tên VI');
	}

	// Không xóa program khi trùng degree — UI chỉ ẩn Degree với ngành Bác sĩ Y khoa.

	// Concentration / Minor: chỉ hiện khi có và khác Degree
	let concentrationVi = (chuyenNganh?.ten || '').trim();
	let concentration = (chuyenNganh?.tenTiengAnh || concentrationVi).trim();
	if (
		!isFilled(concentration) ||
		normName(concentration) === normName(degree) ||
		normName(concentrationVi) === normName(degreeVi)
	) {
		concentration = '';
		concentrationVi = '';
	}

	let minorVi = (chuyenNganhPhu?.ten || '').trim();
	let minor = (chuyenNganhPhu?.tenTiengAnh || minorVi).trim();
	if (!isFilled(minor)) {
		minor = '';
		minorVi = '';
	}

	// ----- Semesters -----
	const gHocKy = _.groupBy(diemList, getMaHocKyDiem);
	const sortedMaHk = Object.keys(gHocKy).sort((a, b) => (a > b ? 1 : -1)); // cũ → mới cho transcript

	const semesters = sortedMaHk.map((mahk) => {
		const coursesRaw = gHocKy[mahk] || [];
		const kqhk = kqhkList.find((j) => j.maHocKy === mahk);
		// Ưu tiên hocKy từ KQHK (đúng kỳ theo maHocKy) — có tenTiengAnh / ten
		const hocKy = kqhk?.hocKy || getHocKyDiem(coursesRaw[0]);
		const { title, titleVi } = pickSemesterTitle(hocKy, mahk);
		if (!hocKy?.tenTiengAnh && !hocKy?.ten)
			pushMissing(`semester.title (EN) [${mahk}]`, 'Không có tên học kỳ tenTiengAnh/ten — đang dùng fallback');

		const badges = (kqhk?.danhHieu || [])
			.map((b) => String(b || '').trim())
			.filter(Boolean);

		const coursesMapped = coursesRaw.map((diem) => {
			const soTinChi = Number(diem.hocPhan?.soTinChi ?? 0);
			const code = getMaHocPhanQuyDoi(diem, maKhoaNganh);

			// EN = tenTiengAnh, VI = ten (không dùng ten làm fallback EN — giống kỳ học)
			const nameVi = (diem.hocPhan?.ten || '').trim() || '—';
			const nameEn = (diem.hocPhan?.tenTiengAnh || '').trim() || '—';
			if (!diem.hocPhan?.tenTiengAnh)
				pushMissing(`course.nameEn [${diem.maHocPhan}]`, 'Không có tên học phần tiếng Anh (tenTiengAnh)');
			if (!diem.hocPhan?.ten)
				pushMissing(`course.nameVi [${diem.maHocPhan}]`, 'Không có tên học phần (ten)');

			// Transcript chỉ lấy soTinChi học phần — không xét tichLuy
			if (soTinChi === 0) pushMissing(`course.credit [${diem.maHocPhan}]`, 'Không có số tín chỉ học phần');

			let grade = diem.diemChu || '—';
			if (!diem.diemChu) pushMissing(`course.grade [${diem.maHocPhan}]`, 'Chưa có điểm chữ');
			else {
				// Transcript chỉ hiện (R) học lại; không gắn (T) quy đổi
				grade = appendDiemChuNotation(grade, {
					isQuyDoi: false,
					soLanHoc: getSoLanHocFromDiem(diem as any, maKhoaNganh),
				});
			}

			const note = ('ghiChuDiem' in diem ? diem.ghiChuDiem : undefined)?.trim() || undefined;

			return {
				code,
				nameEn,
				nameVi,
				creditAttempted: soTinChi,
				creditEarned: soTinChi,
				grade,
				note,
			};
		});

		// Điểm thường (không ghi chú) ở đầu kỳ; nhóm cùng ghiChuDiem gom 1 title và đẩy xuống cuối
		const withoutNote = coursesMapped.filter((c) => !c.note);
		const noteOrder: string[] = [];
		const byNote = new Map<string, typeof coursesMapped>();
		coursesMapped.forEach((c) => {
			if (!c.note) return;
			if (!byNote.has(c.note)) {
				byNote.set(c.note, []);
				noteOrder.push(c.note);
			}
			byNote.get(c.note)!.push(c);
		});
		const courses = [...withoutNote, ...noteOrder.flatMap((key) => byNote.get(key)!)];

		return {
			title,
			titleVi,
			badges: badges.length ? badges : undefined,
			gpa: Number(kqhk?.trungBinhHocKyAll ?? kqhk?.trungBinhHocKyThang4 ?? 0),
			creditEarned: Number(
				kqhk?.tongSoTinChiTichLuyHocKy ?? kqhk?.tongSoTinChiHocKy ?? _.sumBy(courses, 'creditEarned'),
			),
			courses,
		};
	});

	// Deduplicate noisy missing (keep unique field prefixes for course.nameEn etc. as summary)
	const courseNameEnMissing = missing.filter((m) => m.field.startsWith('course.nameEn'));
	const courseGradeMissing = missing.filter((m) => m.field.startsWith('course.grade'));
	const semTitleMissing = missing.filter((m) => m.field.startsWith('semester.title'));

	const compactMissing: TMissingTranscriptField[] = missing.filter(
		(m) =>
			!m.field.startsWith('course.nameEn') &&
			!m.field.startsWith('course.grade') &&
			!m.field.startsWith('semester.title'),
	);

	if (courseNameEnMissing.length)
		compactMissing.push({
			field: 'course.nameEn',
			note: `${courseNameEnMissing.length} học phần thiếu tên tiếng Anh`,
		});
	if (courseGradeMissing.length)
		compactMissing.push({
			field: 'course.grade',
			note: `${courseGradeMissing.length} học phần chưa có điểm chữ`,
		});
	if (semTitleMissing.length)
		compactMissing.push({
			field: 'semester.title (EN)',
			note: `${semTitleMissing.length} học kỳ thiếu tên EN — dùng tenVietTat/maHocKy`,
		});

	compactMissing.push({
		field: 'course.creditAttempted vs creditEarned',
		note: 'API chỉ có soTinChi — attempted/earned đều = hocPhan.soTinChi',
	});

	// summary
	const latestKq = [...kqhkList].sort((a, b) => ((a.maHocKy || '') > (b.maHocKy || '') ? -1 : 1))[0];
	const creditsFromSv = (sinhVien as any)?.kqhtTichLuyList?.[0]?.tongSoTinChi;
	const creditsFinal = Number(latestKq?.tongSoTinChiTichLuyToanKhoa ?? creditsFromSv ?? 0);
	const cgpa = Number(latestKq?.trungBinhTichLuyToanKhoaThang4 ?? (sinhVien as any)?.gpa ?? 0);
	if (!latestKq?.tongSoTinChiTichLuyToanKhoa && !creditsFromSv)
		compactMissing.push({ field: 'summary.creditsEarned', note: 'Không có tổng tín chỉ tích lũy toàn khóa' });
	if (!latestKq?.trungBinhTichLuyToanKhoaThang4 && !(sinhVien as any)?.gpa)
		compactMissing.push({ field: 'summary.cgpa', note: 'Không có CGPA toàn khóa' });

	compactMissing.push({
		field: 'summary.dateOfIssueEn / dateOfIssueVi',
		note: 'Không có ngày ban hành từ API — đang dùng ngày hiện tại',
	});

	compactMissing.push({
		field: 'notations / creditNote / gradeScale',
		note: 'Dùng nội dung tĩnh từ template (không lấy từ API KQHT)',
	});

	const data: TTranscriptData = {
		student: {
			fullName: fullNameEn,
			fullNameVi,
			studentId,
			dateOfBirth: dateOfBirth || '—',
			gender,
			genderVi,
			degree,
			degreeVi,
			program,
			programVi,
			concentration,
			concentrationVi,
			minor,
			minorVi,
		},
		summary: {
			creditsEarned: creditsFinal,
			cgpa,
			dateOfIssueEn: formatIssueEn(),
			dateOfIssueVi: formatIssueVi(),
			noteEn: (ctdtKhoaNganh?.ghiChuBangDiemForeign || '').trim(),
			noteVi: (ctdtKhoaNganh?.ghiChuBangDiem || '').trim(),
			decisionNo: (quyetDinh?.soQuyetDinh || '').trim() || undefined,
			decisionDateEn: formatDecisionDateEn(quyetDinh?.ngayBanHanh) || undefined,
			decisionDateVi: formatDecisionDateVi(quyetDinh?.ngayBanHanh) || undefined,
		},
		semesters,
		notations: TRANSCRIPT_STATIC.notations,
		creditNote: TRANSCRIPT_STATIC.creditNote,
		durationNote: TRANSCRIPT_STATIC.durationNote,
		authentication: TRANSCRIPT_STATIC.authentication,
		gradeScale: TRANSCRIPT_STATIC.gradeScale,
	};

	// unique by field
	const seen = new Set<string>();
	const uniqueMissing = compactMissing.filter((m) => {
		if (seen.has(m.field)) return false;
		seen.add(m.field);
		return true;
	});

	return { data, missing: uniqueMissing };
}
