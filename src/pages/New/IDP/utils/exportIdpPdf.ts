import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/** Chụp ở 2x cho nét chữ 11.5px vẫn sắc khi in. */
const CAPTURE_SCALE = 2;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Template bám sát mẫu VinUni là bản thiết kế gói gọn đúng 1 trang A4; nội dung IDP cỡ điển hình chỉ nhỉnh
 * hơn một trang vài phần trăm. Tràn dưới 13% thì thu nhỏ cho vừa 1 trang thay vì đẩy phần đuôi sang trang 2.
 */
const ONE_PAGE_TOLERANCE = 1.13;
/** Cắt trang không được non hơn tỉ lệ này, tránh bỏ trống nửa trang chỉ để né một khối dài. */
const MIN_PAGE_FILL_RATIO = 0.5;
/**
 * Lề trắng trên/dưới mỗi trang. Trang đầu không có lề trên: dải navy của header là thiết kế tràn viền,
 * đẩy nó xuống 10mm sẽ thành một vệt trắng lạc lõng phía trên. Dải footer cũng tràn viền nên dán sát đáy.
 */
const PAGE_MARGIN_MM = 10;

/**
 * Các khối được phép làm mốc ngắt trang — đáy của chúng luôn là ranh giới "sạch" giữa hai phần nội dung.
 * CỐ Ý không có h2/h3/h4: ngắt ngay dưới một tiêu đề là chỗ tệ nhất, tiêu đề nằm trơ cuối trang còn nội
 * dung của nó sang trang sau. Bỏ chúng đi thì mốc hợp lệ gần nhất lùi về khối nội dung phía trước.
 */
const PAGE_BREAK_SELECTOR = 'tr, p, ul, table';

/** Dải "Cố vấn học tập xác nhận" — tách khỏi phần thân để dán sát đáy trang cuối thay vì trôi lửng giữa trang. */
const FOOTER_SELECTOR = '[data-pdf-footer]';

const FONTS_LINK_ID = 'idp-export-fonts';
const FONTS_HREF =
	'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap';

/**
 * Nạp Lora + Montserrat (đúng font bản mẫu VinUni) trước khi capture — phải đợi link stylesheet load xong
 * rồi `document.fonts.ready` mới thực sự chờ đúng font tải xong, tránh trường hợp @font-face chưa kịp
 * đăng ký nên `fonts.ready` trả về ngay lập tức.
 */
const ensureExportFontsLoaded = () =>
	new Promise<void>((resolve) => {
		const existing = document.getElementById(FONTS_LINK_ID) as HTMLLinkElement | null;
		if (existing) {
			if (existing.dataset.loaded === 'true') return resolve();
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => resolve(), { once: true });
			return;
		}

		const link = document.createElement('link');
		link.id = FONTS_LINK_ID;
		link.rel = 'stylesheet';
		link.href = FONTS_HREF;
		link.onload = () => {
			link.dataset.loaded = 'true';
			resolve();
		};
		// Không chặn export nếu không tải được font — sẽ rơi về fallback Georgia/Segoe UI.
		link.onerror = () => resolve();
		document.head.appendChild(link);
	});

let fontFaceCssCache: string | undefined;

/**
 * Google Fonts phục vụ CSS từ origin khác nên `sheet.cssRules` của nó luôn ném SecurityError,
 * không copy @font-face sang bản clone bằng CSSOM được — fetch thẳng file CSS (Google trả
 * `Access-Control-Allow-Origin: *`) để nhúng vào clone. Hỏng thì trả chuỗi rỗng, rơi về font fallback.
 */
const getFontFaceCss = async (): Promise<string> => {
	if (fontFaceCssCache !== undefined) return fontFaceCssCache;

	try {
		const res = await fetch(FONTS_HREF);
		fontFaceCssCache = res.ok ? await res.text() : '';
	} catch {
		fontFaceCssCache = '';
	}

	return fontFaceCssCache;
};

/**
 * Mọi vị trí được phép cắt trang, quy về px trên canvas — đo trên DOM thật trước khi chụp (bản clone của
 * html2canvas có cùng style nội tuyến nên layout y hệt). Dò pixel trắng không dùng được ở đây: bảng kế
 * hoạch hành động có viền chạy dọc suốt nên không dòng pixel nào trong bảng là trắng hoàn toàn.
 *
 * Mốc lấy ở hai mức. Mức khối (`PAGE_BREAK_SELECTOR`) là ranh giới đẹp nhất nhưng quá thưa: một ô nội
 * dung 1000 ký tự là MỘT thẻ <p> cao hơn nửa trang, nên cả trang chỉ có vài mốc và trang bị bỏ trống tới
 * 55%. Mức DÒNG lấp chỗ đó: `Range.getClientRects()` trả về đúng một rect cho mỗi line box của text node,
 * nên luôn có mốc sát mép trang và không bao giờ cắt ngang thân một dòng chữ.
 */
const collectPageBreakOffsets = (node: HTMLElement, scale: number): number[] => {
	const nodeTop = node.getBoundingClientRect().top;
	const offsets = new Set<number>();
	const pushBottom = (bottom: number) => offsets.add(Math.round((bottom - nodeTop) * scale));

	node.querySelectorAll(PAGE_BREAK_SELECTOR).forEach((element) => pushBottom(element.getBoundingClientRect().bottom));

	const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
	const range = document.createRange();

	for (let textNode = walker.nextNode(); textNode; textNode = walker.nextNode()) {
		if (!textNode.nodeValue?.trim()) continue;

		range.selectNodeContents(textNode);
		Array.from(range.getClientRects()).forEach((rect) => {
			if (rect.height > 0) pushBottom(rect.bottom);
		});
	}

	return Array.from(offsets).sort((a, b) => a - b);
};

/**
 * Cắt đúng mép A4 rất dễ chém ngang một dòng chữ hoặc một hàng của bảng, nên lùi về mốc ngắt khối gần
 * nhất còn nằm trong trang. Không có mốc nào đủ gần (một khối dài hơn cả trang) thì cắt đúng mép như cũ.
 */
const findSliceHeight = (breakOffsets: number[], offsetY: number, usableHeightPx: number): number => {
	const pageBottom = offsetY + usableHeightPx;
	const minBottom = offsetY + usableHeightPx * MIN_PAGE_FILL_RATIO;
	const candidates = breakOffsets.filter((offset) => offset > minBottom && offset <= pageBottom);

	// Làm tròn xuống px nguyên: canvas.height cắt phần thập phân, để lẻ sẽ lệch dần và làm nhoè ảnh khi cắt.
	return candidates.length ? Math.floor(candidates[candidates.length - 1] - offsetY) : usableHeightPx;
};

/**
 * Vẽ một dải ngang của canvas gốc lên trang PDF hiện tại, tại toạ độ y (mm) chỉ định.
 * `buffer` được tái sử dụng giữa các lần gọi — đổi `height` là canvas tự xoá sạch nội dung cũ.
 */
const drawCanvasBand = (
	pdf: jsPDF,
	source: HTMLCanvasElement,
	buffer: HTMLCanvasElement,
	sourceY: number,
	bandHeight: number,
	destY: number,
	pxToMm: number,
) => {
	buffer.height = bandHeight;

	const context = buffer.getContext('2d');
	context?.clearRect(0, 0, buffer.width, bandHeight);
	context?.drawImage(source, 0, sourceY, source.width, bandHeight, 0, 0, source.width, bandHeight);

	pdf.addImage(buffer.toDataURL('image/png'), 'PNG', 0, destY, A4_WIDTH_MM, bandHeight * pxToMm, undefined, 'FAST');
};

/**
 * Chụp `node` thành 1 canvas cao rồi cắt thành nhiều trang A4 — nội dung IDP dài ngắn
 * thất thường (text tự do + tối đa 10 dòng action plan) nên không thể giả định 1 trang cố định
 * như bản in CCT (src/pages/CCT/MyCCT/index.tsx).
 */
/**
 * Đợi mọi <img> trong node tải xong trước khi chụp — template có 3 ảnh trang trí (vòng tròn IKIGAI, logo,
 * skyline). html2canvas tự chờ ảnh của bản clone, nhưng ảnh webpack bundle đôi khi chưa decode kịp ở lần
 * chụp đầu nên vẽ ra khung trắng; ép chờ ở DOM gốc cho chắc.
 */
const waitForImages = (node: HTMLElement) =>
	Promise.all(
		Array.from(node.querySelectorAll('img')).map((img) => {
			if (img.complete && img.naturalWidth > 0) return undefined;
			return new Promise<void>((resolve) => {
				img.addEventListener('load', () => resolve(), { once: true });
				img.addEventListener('error', () => resolve(), { once: true });
			});
		}),
	);

export const exportNodeToPdf = async (node: HTMLElement, filename: string) => {
	await ensureExportFontsLoaded();
	await document.fonts.ready;
	await waitForImages(node);

	const fontFaceCss = await getFontFaceCss();
	const breakOffsets = collectPageBreakOffsets(node, CAPTURE_SCALE);
	const footer = node.querySelector(FOOTER_SELECTOR);
	const footerTop = footer
		? (footer.getBoundingClientRect().top - node.getBoundingClientRect().top) * CAPTURE_SCALE
		: undefined;

	const canvas = await html2canvas(node, {
		backgroundColor: '#ffffff',
		scale: CAPTURE_SCALE,
		useCORS: true,
		logging: false,
		// html2canvas không chụp DOM thật: nó clone document sang một iframe rồi ĐO LẠI layout trong đó, và bản
		// clone không chắc nhận được stylesheet nạp bằng <link> (kể cả link Google Fonts). Template in đã dùng
		// style nội tuyến nên không phụ thuộc điều đó, chỉ còn @font-face là phải bơm tay vào clone.
		onclone: async (clonedDocument) => {
			if (fontFaceCss) {
				const style = clonedDocument.createElement('style');
				style.textContent = fontFaceCss;
				clonedDocument.head.appendChild(style);
			}

			// Font trong clone chỉ ảnh hưởng phép ĐO (nét chữ vẫn vẽ bằng font của document gốc), nhưng đo
			// bằng font fallback thì ngắt dòng và bề rộng ô lệch — đợi font sẵn sàng rồi html2canvas mới đo.
			await clonedDocument.fonts.ready;
		},
	});

	const pxToMm = A4_WIDTH_MM / canvas.width;
	const pageHeightPx = Math.floor(A4_HEIGHT_MM / pxToMm);

	const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

	if (canvas.height <= pageHeightPx * ONE_PAGE_TOLERANCE) {
		const scale = Math.min(1, A4_HEIGHT_MM / (canvas.height * pxToMm));
		const imageWidth = A4_WIDTH_MM * scale;
		const imageHeight = canvas.height * pxToMm * scale;

		pdf.addImage(
			canvas.toDataURL('image/png'),
			'PNG',
			(A4_WIDTH_MM - imageWidth) / 2,
			0,
			imageWidth,
			imageHeight,
			undefined,
			'FAST',
		);
		pdf.save(filename);
		return;
	}

	const pageCanvas = document.createElement('canvas');
	pageCanvas.width = canvas.width;

	// Phần thân được cắt trang bình thường; dải footer để riêng, luôn dán sát đáy trang cuối cùng.
	const bodyHeightPx = footerTop === undefined ? canvas.height : Math.floor(footerTop);
	const footerHeightPx = canvas.height - bodyHeightPx;

	let offsetY = 0;
	let isFirstPage = true;

	const startPage = () => {
		if (!isFirstPage) pdf.addPage('a4', 'portrait');
		isFirstPage = false;
	};

	while (offsetY < bodyHeightPx) {
		// Trang đầu bắt đầu bằng dải header tràn viền nên không chừa lề trên; các trang sau đều có lề trên.
		const marginTopMm = isFirstPage ? 0 : PAGE_MARGIN_MM;
		const usableHeightPx = Math.floor((A4_HEIGHT_MM - marginTopMm - PAGE_MARGIN_MM) / pxToMm);
		const remainingHeight = bodyHeightPx - offsetY;
		const sliceHeight =
			remainingHeight <= usableHeightPx ? remainingHeight : findSliceHeight(breakOffsets, offsetY, usableHeightPx);

		startPage();
		drawCanvasBand(pdf, canvas, pageCanvas, offsetY, sliceHeight, marginTopMm, pxToMm);
		offsetY += sliceHeight;

		if (offsetY >= bodyHeightPx && footerHeightPx > 0) {
			const footerHeightMm = footerHeightPx * pxToMm;

			// Thân của trang cuối đã chiếm hết chỗ thì đẩy footer sang một trang mới, vẫn nằm sát đáy.
			if (marginTopMm + sliceHeight * pxToMm + footerHeightMm > A4_HEIGHT_MM) pdf.addPage('a4', 'portrait');
			drawCanvasBand(pdf, canvas, pageCanvas, bodyHeightPx, footerHeightPx, A4_HEIGHT_MM - footerHeightMm, pxToMm);
		}
	}

	pdf.save(filename);
};
