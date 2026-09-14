import { getChuongTrinhHienTai } from '@/services/DaoTao/ChuongTrinhDaoTao';
import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, message } from 'antd';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import type { TTranscriptData } from './data';
import { mapToTranscriptData } from './mapToTranscriptData';
import './style.less';
import TranscriptSheet from './TranscriptSheet';

/** ~96dpi */
const A4_W_PX = 794;
const A4_H_PX = 1123;

const waitForPages = async (root: HTMLElement, tries = 80) => {
	for (let t = 0; t < tries; t++) {
		const pages = Array.from(root.querySelectorAll<HTMLElement>('.transcript-a4-page[data-print-page="true"]'));
		if (pages.length) return pages;
		await new Promise((r) => setTimeout(r, 80));
	}
	return [] as HTMLElement[];
};

const ensureFonts = async (doc: Document = document) => {
	try {
		if (doc.fonts?.load) {
			await Promise.allSettled([
				doc.fonts.load('400 12px Montserrat'),
				doc.fonts.load('700 12px Montserrat'),
				doc.fonts.load('700 21px Lora'),
				doc.fonts.load('400 36px Licorice'),
			]);
		}
		await doc.fonts?.ready;
	} catch {
		/* FontFaceSet.load reject NetworkError khi file font 404 — không phải mất mạng */
	}
};

/** Gỡ @page trong CSS inline — tránh A5/A4 từ module khác đè khổ A4 dọc */
const stripPageAtRules = (css: string) => css.replace(/@page\b[^{]*\{[^}]*\}/gi, '');

/**
 * Nhúng CSS đã load sẵn (cssRules), không gắn lại <link> để iframe fetch.
 * Copy <link> hay gọi print() khi stylesheet/font lỗi → Chrome báo NetworkError dù máy vẫn online.
 */
const collectDocumentStylesHtml = () => {
	const fromSheets = Array.from(document.styleSheets)
		.map((sheet) => {
			try {
				const text = Array.from(sheet.cssRules)
					.map((rule) => rule.cssText)
					.join('\n');
				return text ? `<style>${stripPageAtRules(text)}</style>` : '';
			} catch {
				return '';
			}
		})
		.filter(Boolean)
		.join('\n');

	if (fromSheets) return fromSheets;

	return Array.from(document.querySelectorAll('style'))
		.map((node) => `<style>${stripPageAtRules(node.textContent || '')}</style>`)
		.join('\n');
};

const waitForImages = (doc: Document) =>
	Promise.all(
		Array.from(doc.images).map((img) =>
			img.complete
				? Promise.resolve()
				: new Promise<void>((resolve) => {
						img.onload = () => resolve();
						img.onerror = () => resolve();
					}),
		),
	);

const waitForStyleSheets = (doc: Document) =>
	Promise.all(
		Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(
			(link) =>
				new Promise<void>((resolve) => {
					const el = link as HTMLLinkElement;
					if (el.sheet) {
						resolve();
						return;
					}
					el.onload = () => resolve();
					el.onerror = () => resolve();
					window.setTimeout(() => resolve(), 3000);
				}),
		),
	);

/** Ép khổ trang in: width × height (dọc). Chrome hay bỏ qua `A4 portrait`. */
const PRINT_PAGE_CSS = `
@page { size: 210mm 297mm; margin: 0; }
@media print {
	@page { size: 210mm 297mm; margin: 0; }
}
html, body {
	margin: 0 !important;
	padding: 0 !important;
	width: auto !important;
	height: auto !important;
	overflow: visible !important;
	background: #fff !important;
	-webkit-print-color-adjust: exact !important;
	print-color-adjust: exact !important;
}
.transcript-print-root,
.transcript-doc {
	display: block !important;
	flex-direction: unset !important;
	margin: 0 !important;
	padding: 0 !important;
	gap: 0 !important;
	width: 210mm !important;
	height: auto !important;
	overflow: visible !important;
	transform: none !important;
}
.transcript-a4-page {
	display: block !important;
	position: relative !important;
	box-sizing: border-box !important;
	width: 210mm !important;
	height: 297mm !important;
	min-width: 210mm !important;
	min-height: 297mm !important;
	max-width: 210mm !important;
	max-height: 297mm !important;
	margin: 0 !important;
	box-shadow: none !important;
	overflow: hidden !important;
	page-break-after: always !important;
	break-after: page !important;
	page-break-inside: avoid !important;
	break-inside: avoid !important;
	-webkit-print-color-adjust: exact !important;
	print-color-adjust: exact !important;
}
.transcript-a4-page:last-child {
	page-break-after: auto !important;
	break-after: auto !important;
}
`;

const printPagesAsPdf = async (pageHtmlList: string[], documentTitle: string) => {
	if (!pageHtmlList.length) throw new Error('No pages');

	const iframe = document.createElement('iframe');
	iframe.setAttribute('title', documentTitle);
	// Không để 0×0 — Chrome dễ gộp hết thành 1 trang khi layout trong iframe ẩn
	Object.assign(iframe.style, {
		position: 'fixed',
		left: '0',
		top: '0',
		width: '210mm',
		height: '297mm',
		border: '0',
		opacity: '0',
		pointerEvents: 'none',
		zIndex: '-1',
	});
	document.body.appendChild(iframe);

	const idoc = iframe.contentDocument;
	const iwin = iframe.contentWindow;
	if (!idoc || !iwin) {
		iframe.remove();
		throw new Error('Print frame unavailable');
	}

	const baseHref = document.baseURI || `${window.location.origin}/`;
	const safeTitle = documentTitle.replace(/[<>&"]/g, '');

	idoc.open();
	idoc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<base href="${baseHref.replace(/"/g, '')}" />
<title>${safeTitle}</title>
${collectDocumentStylesHtml()}
<style id="transcript-print-page">${PRINT_PAGE_CSS}</style>
</head>
<body>
<div class="transcript-print-root transcript-doc">${pageHtmlList.join('')}</div>
</body>
</html>`);
	idoc.close();

	await waitForStyleSheets(idoc);
	await ensureFonts(idoc);
	await waitForImages(idoc);

	// Gắn lại rule khổ trang SAU khi link CSS load (tránh bị đè → PDF nằm dọc / xoay 90°)
	const prev = idoc.getElementById('transcript-print-page');
	prev?.remove();
	const override = idoc.createElement('style');
	override.id = 'transcript-print-page';
	override.textContent = PRINT_PAGE_CSS;
	idoc.head?.appendChild(override);

	await new Promise((r) => setTimeout(r, 250));

	await new Promise<void>((resolve, reject) => {
		let settled = false;
		const finish = () => {
			if (settled) return;
			settled = true;
			iwin.removeEventListener('afterprint', finish);
			iframe.remove();
			resolve();
		};

		iwin.addEventListener('afterprint', finish);
		window.setTimeout(finish, 60_000);

		try {
			iwin.focus();
			// DOM types: print() is void. Chrome actually returns a Promise that may reject NetworkError.
			void Promise.resolve(iwin.print() as unknown).catch(() => undefined);
		} catch (e) {
			const msg = e instanceof Error ? e.message : String(e);
			if (/network/i.test(msg)) return;
			finish();
			reject(e);
		}
	});
};

const pagesToHtml = (pageEls: HTMLElement[]) => pageEls.map((el) => el.outerHTML);

type Props = {
	open: boolean;
	onFinish: () => void;
	sinhVienSsoId: string;
	maKhoaNganh: string;
	kqhkList?: KetQuaHocKy.IRecord[];
	diemList?: LopHocPhan.IDiemHpSvHk[];
	/** true: mở modal xem trước, tải PDF khi người dùng bấm */
	preview?: boolean;
};

const ModalBangDiemTranscript = ({
	open,
	onFinish,
	sinhVienSsoId,
	maKhoaNganh,
	kqhkList = [],
	diemList = [],
	preview = false,
}: Props) => {
	const intl = useIntl();
	const { record: sinhVien } = useModel('sinhvien.sinhvien');

	const [data, setData] = useState<TTranscriptData | null>(null);
	const [exporting, setExporting] = useState(false);
	const [scale, setScale] = useState(0.9);
	const [pageCount, setPageCount] = useState(1);
	/** Kích thước layout thật của transcript-doc (chưa scale) */
	const [contentSize, setContentSize] = useState({ w: A4_W_PX, h: A4_H_PX });

	const captureRef = useRef<HTMLDivElement>(null);
	const captureWrapRef = useRef<HTMLDivElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const exportingRef = useRef(false);

	useEffect(() => {
		if (!open || !sinhVienSsoId || !maKhoaNganh) return;
		let cancelled = false;
		setData(null);
		exportingRef.current = false;
		setExporting(false);
		setPageCount(1);

		getChuongTrinhHienTai(maKhoaNganh)
			.then((res) => {
				const payload = res?.data?.data ?? res?.data;
				if (payload && typeof payload === 'object' && (payload.ma || payload.tenTiengAnh || payload.ten)) {
					return payload as ChuongTrinhDaoTao.IRecord;
				}
				return undefined;
			})
			.catch(() => undefined)
			.then((chuongTrinhDaoTao) => {
				if (cancelled) return;
				const mapped = mapToTranscriptData({
					sinhVien,
					maKhoaNganh,
					kqhkList,
					diemList,
					chuongTrinhDaoTao: chuongTrinhDaoTao || null,
				});
				setData(mapped.data);
			})
			.catch((e) => {
				console.error(e);
				message.error(intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2.loi' }));
				onFinish();
			});

		return () => {
			cancelled = true;
		};
	}, [open, sinhVienSsoId, maKhoaNganh, kqhkList, diemList, sinhVien?._id]);

	const updateScale = useCallback(() => {
		const stage = stageRef.current;
		const root = captureRef.current;
		if (!stage || !root) return;

		const pages = root.querySelectorAll<HTMLElement>('.transcript-a4-page[data-print-page="true"]');
		setPageCount(Math.max(pages.length, 1));

		// Đo đúng toàn bộ nội dung (mọi trang + gap), tránh host thấp làm overflow cắt mất trang
		const w = Math.max(root.scrollWidth, root.offsetWidth, pages[0]?.offsetWidth || 0, A4_W_PX);
		const h = Math.max(root.scrollHeight, root.offsetHeight, A4_H_PX);
		setContentSize({ w, h });

		const availableW = Math.max(stage.clientWidth - 40, 240);
		setScale(Math.max(0.5, Math.min(availableW / w, 1.25)));
	}, []);

	useLayoutEffect(() => {
		if (!open || !preview || !data) return;

		updateScale();
		const root = captureRef.current;
		const stage = stageRef.current;
		const ro = new ResizeObserver(() => updateScale());
		if (root) ro.observe(root);
		if (stage) ro.observe(stage);

		const mo = new MutationObserver(() => updateScale());
		if (root) mo.observe(root, { childList: true, subtree: true, attributes: true });

		window.addEventListener('resize', updateScale);
		const t = window.setTimeout(updateScale, 200);

		return () => {
			ro.disconnect();
			mo.disconnect();
			window.removeEventListener('resize', updateScale);
			window.clearTimeout(t);
		};
	}, [open, preview, data, updateScale]);

	const exportPdf = useCallback(async () => {
		const root = captureRef.current;
		const wrap = captureWrapRef.current;
		if (!root || !wrap || !data || exportingRef.current) return;

		exportingRef.current = true;
		setExporting(true);
		wrap.classList.add('is-capturing');
		const hide = message.loading(intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2.dangtao' }), 0);

		try {
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			await ensureFonts();

			const pageEls = await waitForPages(root);
			if (!pageEls.length) throw new Error('No pages');

			const title = `Academic_Transcript_${data.student.studentId}`;
			await printPagesAsPdf(pagesToHtml(pageEls), title);
			message.success(
				intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2.thanhcong' }, { 0: pageEls.length }),
			);
			if (!preview) onFinish();
		} catch (e) {
			console.error(e);
			message.error(intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2.loi' }));
			if (!preview) onFinish();
		} finally {
			wrap.classList.remove('is-capturing');
			hide();
			setExporting(false);
			exportingRef.current = false;
		}
	}, [data, intl, onFinish, preview]);

	useEffect(() => {
		if (!open || !data || preview || exportingRef.current) return;
		const t = window.setTimeout(() => {
			exportPdf();
		}, 300);
		return () => window.clearTimeout(t);
	}, [open, data, preview, exportPdf]);

	if (!open) return null;

	const sheet = data ? <TranscriptSheet ref={captureRef} data={data} /> : null;

	if (!preview) {
		return (
			<div className='bang-diem-transcript-page' style={{ position: 'fixed', left: -99999, top: 0 }} aria-hidden>
				<div className='transcript-print-source' ref={captureWrapRef}>
					{sheet}
				</div>
			</div>
		);
	}

	const hostW = Math.round(contentSize.w * scale);
	const hostH = Math.round(contentSize.h * scale);

	return (
		<Modal
			open={open}
			onCancel={onFinish}
			width={Math.min(1120, typeof window !== 'undefined' ? window.innerWidth - 24 : 1120)}
			style={{ top: 12, paddingBottom: 0, maxWidth: '98vw' }}
			centered={false}
			destroyOnClose
			maskClosable={!exporting}
			closable={!exporting}
			className='transcript-preview-modal'
			title={intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2' })}
			footer={[
				<Button key='close' onClick={onFinish} disabled={exporting}>
					{intl.formatMessage({ id: 'global.button.dong' })}
				</Button>,
				<Button
					key='download'
					type='primary'
					icon={<DownloadOutlined />}
					loading={exporting || !data}
					disabled={!data}
					onClick={() => exportPdf()}
				>
					{intl.formatMessage({ id: 'ketquahoctap.ketquahocky.xuatbangdiemv2.taipdf' })}
				</Button>,
			]}
		>
			<Spin spinning={!data || exporting}>
				<div className='preview-stage' ref={stageRef}>
					<div className='a4-badge'>A4 · {pageCount}</div>
					<div className='preview-scale-host' style={{ width: hostW, height: hostH }}>
						<div
							className='preview-scale-inner'
							ref={captureWrapRef}
							style={{
								width: contentSize.w,
								height: contentSize.h,
								transform: `scale(${scale})`,
								transformOrigin: 'top left',
							}}
						>
							{sheet}
						</div>
					</div>
				</div>
			</Spin>
		</Modal>
	);
};

export default ModalBangDiemTranscript;
