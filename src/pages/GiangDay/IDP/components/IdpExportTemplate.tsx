import skylineImg from '@/assets/idp/footer-skyline.png';
import improvementImg from '@/assets/idp/pb-improvement.png';
import strengthsImg from '@/assets/idp/pb-strengths.png';
import logoImg from '@/assets/idp/vinuni-logo.png';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import { formatDate } from '@/utils/formatDate';
import { CSSProperties, forwardRef, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'umi';
import { CoinsIcon, GlobeIcon, HeartIcon, IkigaiCircles, ThumbUpIcon } from './IdpExportIcons';

/**
 * Template PDF của IDP — tái hiện 1:1 file mẫu VinUni (docs/idp-export). Bố cục, cỡ chữ, khoảng cách lấy
 * trực tiếp từ toạ độ trong file .mhtml (bản gốc Canva, khổ A4 794×1123). Ba hình khối trang trí —
 * vòng tròn IKIGAI, logo VinUni, skyline footer — là ảnh Canva KHÔNG có watermark nên được nhúng nguyên
 * bản (src/assets/idp/*). 4 icon nhỏ trong sơ đồ IKIGAI ở mẫu là ảnh stock có watermark nên được VẼ LẠI
 * bằng SVG (IdpExportIcons).
 *
 * CỐ Ý dùng style nội tuyến chứ không phải CSS Module/.less — html2canvas clone document sang iframe rồi
 * đo lại layout, bản clone không chắc nhận stylesheet nạp bằng <link>. Style nội tuyến luôn sống sót.
 *
 * NGOẠI LỆ: font-family phải khai qua thẻ <style> nội bộ (FONT_OVERRIDE_CSS) chứ không chỉ style nội tuyến,
 * vì src/styles/custom_vinuni.less có `* { font-family: 'Montserrat' !important }` — quy tắc !important của
 * stylesheet đè lên style nội tuyến không-important. Selector `.idp-export-root *` có specificity cao hơn
 * `*` nên thắng; thẻ <style> nằm trong subtree được chụp nên html2canvas vẫn đọc được.
 *
 * Mã màu sample pixel từ file mẫu: navy #1F4174 (đồng thời là màu chữ thân bài), gold #916E41,
 * gold kem trên nền navy #F5DFC0, nền header bảng #E0E4F5.
 */
const NAVY = '#1f4174';
const GOLD = '#916e41';
const GOLD_CREAM = '#f5dfc0';
const TABLE_HEAD_BG = '#e0e4f5';
// Font đúng mẫu VinUni: Lora (serif) cho tiêu đề PART A/PART B/MY ACTION PLAN, 4 nhãn "What", nhãn
// SHORT-/LONG-TERM GOALS + phụ đề, "PART A/B", và tiêu đề header. Montserrat cho toàn bộ phần còn lại
// (student info, hint, nội dung câu trả lời, MY STRENGTHS/AREAS, bảng, footer, nhãn "IKIGAI").
const SERIF = "'Lora', Georgia, 'Times New Roman', serif";
const SANS = "'Montserrat', 'Segoe UI', Arial, sans-serif";

/**
 * Đè quy tắc `* { font-family: Montserrat !important }` của app. Class `idp-serif` cho các phần dùng Lora,
 * còn lại là Montserrat. font-weight đặt lại 400 ở gốc (mẫu dùng weight thường cho thân bài; app có
 * `body { font-weight: 500 }`) — các chỗ cần đậm vẫn tự set weight nội tuyến.
 */
const FONT_OVERRIDE_CSS = `
@font-face {
	font-family: 'Lora';
	src: url('/font/Lora.ttf') format('truetype');
	font-weight: 400 700;
	font-style: normal;
	font-display: swap;
}
.idp-export-root { font-weight: 400 !important; }
.idp-export-root, .idp-export-root * { font-family: ${SANS} !important; }
.idp-export-root .idp-serif, .idp-export-root .idp-serif * { font-family: ${SERIF} !important; }
`;

/** A4 @ 96dpi. */
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

/** Nhóm field PART A — IKIGAI, đúng thứ tự icon (Heart / ThumbUp / Globe / Coins). */
const PART_A_FIELDS: (keyof IdpCoVan.IContent)[] = ['whatILove', 'whatIAmGoodAt', 'whatTheWorldNeeds', 'whatICanBePaidFor'];

/**
 * Cột nội dung chính của mẫu (lưới IKIGAI, lưới PART B, bảng) căn giữa với lề ~78px hai bên — tức thụt
 * thêm 38px so với padding 40px của thân trang. Badge/student/footer thì bám sát lề 40px.
 */
const CONTENT_INDENT = 38;
/** Cạnh khối sơ đồ 4 vòng tròn IKIGAI (giữ nguyên như mẫu ~250px). */
const DIAGRAM_SIZE = 248;
/** Bề rộng cột chữ hai bên PART A (chỉ vừa chạm rìa vòng tròn, không chồng lên). */
const IKIGAI_COLUMN_WIDTH = 192;
/** Khoảng trống giữa 2 cột chữ = phần còn lại của bề ngang nội dung (638). */
const IKIGAI_SPACER = 638 - IKIGAI_COLUMN_WIDTH * 2;
/** Lề trái ảnh vòng tròn trong wrap (rộng 638) để căn giữa. */
const DIAGRAM_LEFT = (638 - DIAGRAM_SIZE) / 2;
/**
 * Chiều cao tối thiểu của ô câu hỏi TRÊN mỗi cột PART A: khi nội dung ngắn, nó vẫn giữ chỗ để ô DƯỚI
 * ("What the World Needs" / "What I Can Be Paid For") bắt đầu ~ ngang hàng 2 vòng tròn dưới; nội dung dài
 * hơn thì ô dưới tự trôi xuống (không đè PART B như cách định vị absolute trước đây).
 */
const IKIGAI_FIELD_TOP_MIN_HEIGHT = 138;

const defineStyles = <T extends Record<string, CSSProperties>>(styles: T) => styles;

/**
 * Đường "ngoặc" navy dưới mỗi nhãn IKIGAI: đoạn ngang 172px dưới nhãn + gập chéo (12×14) về phía sơ đồ.
 * Cả 4 cái ĐỒNG BỘ hoàn toàn về độ dài đoạn ngang và độ dốc đường chéo, chỉ đối xứng trái/phải. Đường
 * chéo ngắn (dốc) nên đầu mút lùi khỏi rìa vòng tròn → có khoảng hở ở cả 4 vị trí.
 * KHÔNG dùng margin âm — html2canvas cắt phần SVG tràn ra ngoài containing block.
 */
const CONNECTOR_INDENT = 18;
const Connector: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
	<svg width={192} height={16} viewBox='0 0 192 16' style={{ display: 'block', margin: '4px 0 0' }}>
		<path
			d={side === 'left' ? 'M0 1 H172 L184 15' : 'M6 15 L18 1 H192'}
			fill='none'
			stroke={NAVY}
			strokeWidth={1.3}
		/>
	</svg>
);

/**
 * html2canvas 1.4.1 KHÔNG hỗ trợ `background-clip: text` (chỉ border/padding/content-box) → không thể tô
 * chữ bằng linear-gradient trực tiếp. Thay vào đó tô MÀU ĐẶC cho từng ký tự theo gradient của MẪU:
 * mỗi DÒNG chạy một đoạn gradient 90° trọn vẹn (như `linear-gradient(90deg, ...)` áp riêng từng dòng) —
 * dòng 1 kem→trắng, dòng 2 trắng→vàng-kem... Cần đo vị trí ký tự sau layout nên xử lý trong GradientTitle.
 */
const GRADIENT_STOPS: [number, [number, number, number]][] = [
	[0, [244, 218, 178]], // #f4dab2
	[0.5, [255, 255, 255]], // #ffffff
	[1, [221, 189, 139]], // #ddbd8b
];
const headerTitleColorAt = (t: number): string => {
	const clamped = Math.min(1, Math.max(0, t));
	let [t0, c0] = GRADIENT_STOPS[0];
	let [t1, c1] = GRADIENT_STOPS[GRADIENT_STOPS.length - 1];
	for (let i = 0; i < GRADIENT_STOPS.length - 1; i += 1) {
		if (clamped >= GRADIENT_STOPS[i][0] && clamped <= GRADIENT_STOPS[i + 1][0]) {
			[t0, c0] = GRADIENT_STOPS[i];
			[t1, c1] = GRADIENT_STOPS[i + 1];
			break;
		}
	}
	const k = t1 === t0 ? 0 : (clamped - t0) / (t1 - t0);
	const ch = (a: number, b: number) => Math.round(a + (b - a) * k);
	return `rgb(${ch(c0[0], c1[0])}, ${ch(c0[1], c1[1])}, ${ch(c0[2], c1[2])})`;
};

/**
 * Tiêu đề header với "chữ gradient": tách từng ký tự thành <span>, sau khi trình bày xong thì đo lại vị
 * trí và tô màu theo MỘT gradient 90° phủ TRỌN khung chữ (mọi dòng chung một trục) → dải trắng ở giữa
 * thẳng cột giữa các dòng, đúng như mẫu. Chạy lại khi font tải xong vì font đổi thì ngắt dòng đổi theo.
 */
const GradientTitle: React.FC<{ text: string; className?: string; style?: CSSProperties }> = ({
	text,
	className,
	style,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const chars = Array.from(text);

	useLayoutEffect(() => {
		const paint = () => {
			const node = ref.current;
			if (!node) return;
			const spans = Array.from(node.querySelectorAll<HTMLSpanElement>('span[data-c]'));
			const visible = spans.filter((s) => (s.textContent ?? '').trim().length > 0);
			if (!visible.length) return;

			const left = Math.min(...visible.map((s) => s.offsetLeft));
			const right = Math.max(...visible.map((s) => s.offsetLeft + s.offsetWidth));
			const width = right - left || 1;
			spans.forEach((s) => {
				const frac = (s.offsetLeft + s.offsetWidth / 2 - left) / width;
				s.style.color = headerTitleColorAt(frac);
			});
		};

		paint();
		let cancelled = false;
		// Ép nạp Lora rồi vẽ lại: ngắt dòng của tiêu đề phụ thuộc font, và nếu không chờ Lora thì
		// html2canvas có thể chụp lúc còn đang dùng font fallback.
		Promise.all([document.fonts?.load("400 1em 'Lora'"), document.fonts?.load("700 1em 'Lora'"), document.fonts?.ready])
			.then(() => {
				if (!cancelled) paint();
			})
			.catch(() => undefined);
		return () => {
			cancelled = true;
		};
	}, [text]);

	return (
		<div ref={ref} className={className} style={style}>
			{chars.map((chr, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<span key={index} data-c='' style={{ color: headerTitleColorAt(chars.length < 2 ? 0 : index / (chars.length - 1)) }}>
					{chr}
				</span>
			))}
		</div>
	);
};

const S = defineStyles({
	page: {
		display: 'flex',
		flexDirection: 'column',
		width: PAGE_WIDTH,
		minHeight: PAGE_HEIGHT,
		color: NAVY,
		background: '#fff',
		fontFamily: SANS,
		fontWeight: 400,
	},

	// Header cao ~123px như mẫu.
	header: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		padding: '18px 40px 22px',
		background: NAVY,
	},
	headerTitle: {
		// maxWidth ép ngắt dòng đúng mẫu: "INDIVIDUAL DEVELOPMENT" / "PLAN".
		maxWidth: 405,
		color: GOLD_CREAM,
		fontFamily: SERIF,
		fontSize: 30,
		fontWeight: 700,
		lineHeight: 1.2,
		letterSpacing: 0.3,
		textTransform: 'uppercase',
	},
	headerLogo: { width: 102, height: 'auto', marginTop: 6 },

	body: { flex: 1, padding: '14px 40px 0' },

	studentInfo: {
		display: 'flex',
		flexWrap: 'wrap',
		columnGap: 44,
		rowGap: 4,
		marginBottom: 10,
		color: NAVY,
		fontSize: 13,
		fontWeight: 700,
		lineHeight: 1.4,
	},
	studentInfoName: { minWidth: 355 },
	studentInfoFull: { flexBasis: '100%' },

	partBadgeRow: { display: 'flex', alignItems: 'flex-start', gap: 14, margin: '12px 0 0', marginLeft: 2 },
	partBadge: {
		flex: '0 0 auto',
		marginTop: 2,
		padding: '4px 12px',
		border: `1.4px solid ${NAVY}`,
		borderRadius: 6,
		color: GOLD,
		fontFamily: SERIF,
		fontSize: 15,
		fontWeight: 400,
		letterSpacing: 1,
		whiteSpace: 'nowrap',
	},
	// Khối tiêu đề + hint của PART A: hint nằm cùng container với tiêu đề nên lề trái thẳng nhau (như mẫu),
	// không hardcode marginLeft.
	partATitleBlock: { flex: 1, minWidth: 0 },
	partTitle: {
		margin: 0,
		color: GOLD,
		fontFamily: SERIF,
		fontSize: 24,
		fontWeight: 400,
		lineHeight: 1.25,
		letterSpacing: 0.3,
		textTransform: 'uppercase',
	},
	// Tiêu đề "MY ACTION PLAN (SMART)" — căn giữa cả trang.
	sectionTitle: {
		margin: '14px 0 8px',
		color: GOLD,
		fontFamily: SERIF,
		fontSize: 24,
		fontWeight: 400,
		letterSpacing: 0.3,
		textAlign: 'center',
		textTransform: 'uppercase',
	},

	// ---- PART A ----
	// Hint nằm cùng container với tiêu đề PART A → lề trái tự thẳng nhau; chỉ giới hạn bề ngang để ngắt 2 dòng.
	partAHint: { margin: '6px 0 0', maxWidth: 320, color: NAVY, fontSize: 12, lineHeight: 1.35 },

	// Bố cục PART A: 2 cột chữ hai bên + khoảng trống ở giữa (flex, space-between) để chiều cao khối tự giãn
	// theo cột dài nhất. Ảnh vòng tròn + nhãn IKIGAI định vị tuyệt đối ĐÈ lên khoảng trống đó.
	// minHeight PHẢI đủ chứa sơ đồ: sơ đồ định vị absolute nên không tự đẩy chiều cao khối, nếu nội dung 4 ô
	// ngắn thì khối co lại và PART B tràn đè lên sơ đồ.
	// KHÔNG dùng transform: translateX(-50%) — html2canvas dựng sai transform khiến ảnh lệch phải + méo ngang;
	// căn giữa bằng `left` cố định (wrap rộng 638px, ảnh 248px → left 195).
	ikigaiWrap: {
		position: 'relative',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		minHeight: DIAGRAM_SIZE + 26,
		margin: `10px ${CONTENT_INDENT}px 0`,
	},
	// <span> định vị + <svg> tĩnh giãn kín — tránh lỗi html2canvas bake computed top/left vào <svg> absolute.
	ikigaiCircles: {
		position: 'absolute',
		left: DIAGRAM_LEFT,
		top: 6,
		width: DIAGRAM_SIZE,
		height: DIAGRAM_SIZE,
		zIndex: 0,
	},
	ikigaiSpacer: { flex: '0 0 auto', width: IKIGAI_SPACER },
	// 2 ô câu hỏi mỗi cột chạy theo luồng; ô trên có minHeight để ô dưới bắt đầu ~ ngang hàng 2 vòng dưới.
	ikigaiColumn: {
		position: 'relative',
		zIndex: 1,
		width: IKIGAI_COLUMN_WIDTH,
		display: 'flex',
		flexDirection: 'column',
	},
	ikigaiFieldTop: { minHeight: IKIGAI_FIELD_TOP_MIN_HEIGHT },

	partAFieldLabel: {
		margin: 0,
		color: GOLD,
		fontSize: 18,
		fontWeight: 400,
		lineHeight: 1.15,
		whiteSpace: 'nowrap',
	},
	partAFieldValue: {
		margin: '3px 0 0',
		color: NAVY,
		fontSize: 10.5,
		lineHeight: 1.24,
		whiteSpace: 'pre-wrap',
		overflowWrap: 'anywhere',
	},

	// html2canvas serialise <svg> định vị absolute rồi bê computed top/left vào ảnh → lệch. SVG cần đặt vị
	// trí thì bọc trong <span>, <svg> để tĩnh và giãn kín span bằng style này.
	iconGraphic: { display: 'block', width: '100%', height: '100%' },

	// Nhãn + icon 4 góc sơ đồ IKIGAI. Trùng khung với ảnh vòng tròn.
	ikigaiOverlay: {
		position: 'absolute',
		left: DIAGRAM_LEFT,
		top: 6,
		width: DIAGRAM_SIZE,
		height: DIAGRAM_SIZE,
		zIndex: 2,
	},
	ikigaiIcon: { position: 'absolute', width: 36, height: 36, color: '#fff' },
	ikigaiCenterLabel: {
		position: 'absolute',
		top: 98,
		left: 0,
		width: '100%',
		textAlign: 'center',
		color: '#fff',
		fontFamily: SANS,
		lineHeight: 1.3,
	},

	// ---- Lưới 2x2 PART B ----
	// Đường kẻ dọc + kẻ ngang phải LIỀN MẠCH như mẫu. Trước đây kẻ dọc là border của từng ô nên bị đứt ở
	// chỗ giao kẻ ngang (do marginTop của hàng dưới). Nay: kẻ dọc là 1 phần tử absolute chạy suốt chiều cao
	// khối; kẻ ngang là 1 phần tử full-width nằm giữa 2 hàng.
	fieldGrid: { position: 'relative', margin: `12px ${CONTENT_INDENT}px 0` },
	fieldVDivider: { position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: `1.4px solid ${NAVY}` },
	fieldHDivider: { borderTop: `1.4px solid ${NAVY}`, margin: '2px 0 12px' },
	fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr' },
	fieldCell: { padding: '0 22px 12px 0' },
	fieldCellRight: { padding: '0 0 12px 22px' },

	goalsHeader: {
		margin: '0 0 6px',
		color: NAVY,
		fontFamily: SERIF,
		fontSize: 15,
		fontWeight: 400,
		letterSpacing: 0.3,
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	goalsHeaderSubtitle: {
		display: 'block',
		marginTop: 2,
		fontSize: 12.5,
		fontWeight: 400,
		letterSpacing: 0,
		textTransform: 'none',
	},
	// marginBottom âm để kéo checklist lên sát nhãn (icon 40px làm hàng cao ~40px; checklist chỉ cần cách
	// nhãn ~6px giống khoảng cách tiêu đề↔checklist ở phần mục tiêu phía trên).
	strengthsRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 -8px' },
	strengthsIcon: { flex: '0 0 auto', width: 40, height: 40, display: 'block' },
	// Checklist của "MY STRENGTHS" / "AREAS FOR IMPROVEMENT" thụt vào cho thẳng hàng với nhãn (nhãn bắt đầu
	// sau icon 40px + gap 10px), không bám mép trái như checklist mục tiêu ở trên.
	strengthsBullets: { marginLeft: 40 },
	strengthsLabel: {
		margin: 0,
		color: NAVY,
		fontFamily: SANS,
		fontSize: 11.5,
		fontWeight: 700,
		letterSpacing: 0.4,
		textTransform: 'uppercase',
	},
	// Nội dung PART B hiển thị nguyên văn (giữ xuống dòng), không ép thành danh sách gạch đầu dòng.
	partBValue: {
		margin: 0,
		color: NAVY,
		fontSize: 11.5,
		lineHeight: 1.28,
		whiteSpace: 'pre-wrap',
		overflowWrap: 'anywhere',
	},

	// ---- Bảng kế hoạch hành động ----
	// html2canvas dựng `border-collapse: collapse` không đều: viền trong bị nhân đôi (2 ô kề nhau), viền
	// ngoài chỉ 1px. Nên dùng `separate`: mỗi ô CHỈ vẽ border-right + border-bottom, còn cạnh trên/trái là
	// của bảng → mọi đường lưới đúng 1px, vẽ đúng một lần.
	actionTable: {
		width: `calc(100% - ${CONTENT_INDENT * 2}px)`,
		margin: `0 ${CONTENT_INDENT}px 12px`,
		tableLayout: 'fixed',
		borderCollapse: 'separate',
		borderSpacing: 0,
		borderTop: `1px solid ${NAVY}`,
		borderLeft: `1px solid ${NAVY}`,
		fontSize: 11.5,
	},
	actionTableHeadCell: {
		width: '25%',
		padding: '6px 9px',
		borderRight: `1px solid ${NAVY}`,
		borderBottom: `1px solid ${NAVY}`,
		background: TABLE_HEAD_BG,
		color: NAVY,
		fontSize: 11.5,
		fontWeight: 700,
		textAlign: 'center',
		verticalAlign: 'middle',
		textTransform: 'uppercase',
	},
	actionTableCell: {
		padding: '6px 9px',
		borderRight: `1px solid ${NAVY}`,
		borderBottom: `1px solid ${NAVY}`,
		color: NAVY,
		textAlign: 'center',
		verticalAlign: 'top',
		overflowWrap: 'anywhere',
	},
	actionTableCellFirst: { fontWeight: 700 },

	// ---- Footer ----
	footer: {
		position: 'relative',
		overflow: 'hidden',
		padding: '18px 40px 20px',
		background: NAVY,
		color: '#fff',
		fontSize: 13.5,
		fontWeight: 700,
	},
	footerSkyline: { position: 'absolute', right: 0, bottom: 0, width: 300, height: 'auto', opacity: 0.9 },
});

/** Icon 36×36 trong 4 vòng ở góc sơ đồ IKIGAI (khung 248px) — thứ tự khớp PART_A_FIELDS. */
const IKIGAI_ICONS = [
	{ Icon: HeartIcon, pos: { left: 42, top: 34 } },
	{ Icon: ThumbUpIcon, pos: { right: 42, top: 34 } },
	{ Icon: GlobeIcon, pos: { left: 44, top: 176 } },
	{ Icon: CoinsIcon, pos: { right: 42, top: 174 } },
];

const ACTION_COLUMN_KEYS = [
	'idpcovan.actionPlan.column.actions',
	'idpcovan.actionPlan.column.smartOutcomes',
	'idpcovan.actionPlan.column.timeline',
	'idpcovan.actionPlan.column.checkpoints',
];

type IdpExportTemplateProps = {
	content: IdpCoVan.IContent;
	studentName?: string;
	studentCode?: string;
	program?: string;
	advisorName?: string | null;
};

/** Tách phần "(6 months – 1 year)" ở cuối nhãn ra dòng riêng. */
const splitParenSuffix = (label: string): { title: string; subtitle?: string } => {
	const match = label.match(/^(.*?)\s*(\([^)]*\))\s*$/);
	return match ? { title: match[1], subtitle: match[2] } : { title: label };
};

/** Nội dung PART B — hiển thị nguyên văn (giữ nguyên xuống dòng), không chuyển thành danh sách. */
const renderFieldValue = (value: string) => <p style={S.partBValue}>{value?.trim() ? value : '—'}</p>;

const IdpExportTemplate = forwardRef<HTMLDivElement, IdpExportTemplateProps>(
	({ content, studentName, studentCode, program, advisorName }, ref) => {
		const intl = useIntl();

		const goalsHeader = (labelKey: string) => {
			const { title, subtitle } = splitParenSuffix(intl.formatMessage({ id: labelKey }));
			return (
				<h3 className='idp-serif' style={S.goalsHeader}>
					{title}
					{subtitle && <span style={S.goalsHeaderSubtitle}>{subtitle}</span>}
				</h3>
			);
		};

		/** Một ô câu hỏi IKIGAI: nhãn Lora + đường ngoặc + nội dung. */
		const partAField = (name: keyof IdpCoVan.IContent, side: 'left' | 'right', row: 'top' | 'bottom') => {
			const raw = (content[name] as string) || '';
			// Cột phải: nhãn + nội dung thụt CONNECTOR_INDENT để đoạn ngang của đường ngoặc nằm dưới nhãn.
			const indent = side === 'right' ? { marginLeft: CONNECTOR_INDENT } : undefined;
			return (
				<div key={name} style={row === 'top' ? S.ikigaiFieldTop : undefined}>
					<h4 className='idp-serif' style={{ ...S.partAFieldLabel, ...indent }}>
						{intl.formatMessage({ id: `idpcovan.form.label.${name}` })}
					</h4>
					<Connector side={side} />
					<p style={{ ...S.partAFieldValue, ...indent }}>{raw.trim() ? raw : '—'}</p>
				</div>
			);
		};

		return (
			<div ref={ref} className='idp-export-root' style={S.page}>
				<style>{FONT_OVERRIDE_CSS}</style>
				<div style={S.header}>
					<GradientTitle
						className='idp-serif'
						style={S.headerTitle}
						text={intl.formatMessage({ id: 'idpcovan.detail.title' })}
					/>
					<img src={logoImg} alt='VinUniversity' style={S.headerLogo} />
				</div>

				<div style={S.body}>
					<div style={S.studentInfo}>
						<span style={S.studentInfoName}>
							{intl.formatMessage({ id: 'idpcovan.detail.studentName' })}: {studentName ?? '—'}
						</span>
						<span>
							{intl.formatMessage({ id: 'idpcovan.detail.studentId' })}: {studentCode ?? '—'}
						</span>
						<span style={S.studentInfoFull}>
							{intl.formatMessage({ id: 'idpcovan.detail.program' })}: {program ?? '—'}
						</span>
					</div>

					{/* PART A — IKIGAI */}
					<div style={S.partBadgeRow}>
						<span className='idp-serif' style={S.partBadge}>
							PART A
						</span>
						<div style={S.partATitleBlock}>
							<h2 className='idp-serif' style={S.partTitle}>
								{intl.formatMessage({ id: 'idpcovan.pdf.partATitle' })}
							</h2>
							<p style={S.partAHint}>{intl.formatMessage({ id: 'idpcovan.pdf.ikigaiHint' })}</p>
						</div>
					</div>

					<div style={S.ikigaiWrap}>
						<span style={S.ikigaiCircles}>
							<IkigaiCircles style={S.iconGraphic} />
						</span>

						<div style={S.ikigaiOverlay}>
							{IKIGAI_ICONS.map(({ Icon, pos }, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<span key={index} style={{ ...S.ikigaiIcon, ...pos }}>
									<Icon style={S.iconGraphic} />
								</span>
							))}
							<span style={S.ikigaiCenterLabel}>
								<span style={{ display: 'block', fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>IKIGAI</span>
								<span style={{ display: 'block', margin: '2px auto 0', maxWidth: 92, fontSize: 10.5 }}>
									{intl.formatMessage({ id: 'idpcovan.pdf.ikigaiIntersection' })}
								</span>
							</span>
						</div>

						<div style={S.ikigaiColumn}>
							{partAField(PART_A_FIELDS[0], 'left', 'top')}
							{partAField(PART_A_FIELDS[2], 'left', 'bottom')}
						</div>

						<div style={S.ikigaiSpacer} />

						<div style={S.ikigaiColumn}>
							{partAField(PART_A_FIELDS[1], 'right', 'top')}
							{partAField(PART_A_FIELDS[3], 'right', 'bottom')}
						</div>
					</div>

					{/* PART B — Goals / Strengths / Improvement */}
					<div style={S.partBadgeRow}>
						<span className='idp-serif' style={S.partBadge}>
							PART B
						</span>
						<h2 className='idp-serif' style={S.partTitle}>
							{intl.formatMessage({ id: 'idpcovan.pdf.partBTitle' })}
						</h2>
					</div>

					<div style={S.fieldGrid}>
						<div style={S.fieldVDivider} />

						<div style={S.fieldRow}>
							<div style={S.fieldCell}>
								{goalsHeader('idpcovan.form.label.shortTermGoals')}
								{renderFieldValue(content.shortTermGoals)}
							</div>
							<div style={S.fieldCellRight}>
								{goalsHeader('idpcovan.form.label.longTermGoals')}
								{renderFieldValue(content.longTermGoals)}
							</div>
						</div>

						<div style={S.fieldHDivider} />

						<div style={S.fieldRow}>
							<div style={S.fieldCell}>
								<div style={S.strengthsRow}>
									<img src={strengthsImg} alt='' style={S.strengthsIcon} />
									<h4 style={S.strengthsLabel}>{intl.formatMessage({ id: 'idpcovan.form.label.strengths' })}</h4>
								</div>
								<div style={S.strengthsBullets}>{renderFieldValue(content.strengths)}</div>
							</div>
							<div style={S.fieldCellRight}>
								<div style={S.strengthsRow}>
									<img src={improvementImg} alt='' style={S.strengthsIcon} />
									<h4 style={S.strengthsLabel}>
										{intl.formatMessage({ id: 'idpcovan.form.label.areasForImprovement' })}
									</h4>
								</div>
								<div style={S.strengthsBullets}>{renderFieldValue(content.areasForImprovement)}</div>
							</div>
						</div>
					</div>

					<h2 className='idp-serif' style={S.sectionTitle}>
						{intl.formatMessage({ id: 'idpcovan.form.step.actionPlan' })}
					</h2>
					<table style={S.actionTable}>
						<thead>
							<tr>
								{ACTION_COLUMN_KEYS.map((key) => (
									<th key={key} style={S.actionTableHeadCell}>
										{intl.formatMessage({ id: key })}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{(content.actionPlan ?? []).map((item, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<tr key={index}>
									<td style={{ ...S.actionTableCell, ...S.actionTableCellFirst }}>{item.action || ''}</td>
									<td style={S.actionTableCell}>{item.smartOutcome || ''}</td>
									<td style={S.actionTableCell}>{item.timelineAndSupport || ''}</td>
									<td style={S.actionTableCell}>
										{item.progressCheckpoint ? formatDate(item.progressCheckpoint) : ''}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* data-pdf-footer: exportIdpPdf tách dải này ra để luôn dán sát đáy trang cuối. */}
				<div data-pdf-footer style={S.footer}>
					{intl.formatMessage({ id: 'idpcovan.detail.endorsedBy' }, { name: advisorName ?? '—' })}
					<img src={skylineImg} alt='' style={S.footerSkyline} />
				</div>
			</div>
		);
	},
);

IdpExportTemplate.displayName = 'IdpExportTemplate';

export default IdpExportTemplate;
