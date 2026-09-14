import { getPublicAssetPath } from '@/utils/path';
import { Fragment, forwardRef, useLayoutEffect, useRef, useState, type MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import { formatTransferGroupTitle, type TCourse, type TSemester, type TTranscriptData } from './data';

type Props = {
	data: TTranscriptData;
	className?: string;
};

/** Một khối học kỳ trên trang (có thể là một phần môn học) */
type TPageBlock = {
	semester: TSemester;
	courses: TCourse[];
	/** Index môn đầu trong sem.courses (để không lặp title ghi chú khi sang trang) */
	courseStartIndex?: number;
	/** Hiện tên kỳ + cột (false nếu tiếp tục kỳ từ trang trước) */
	showHead: boolean;
	/** Hiện dòng GPA (chỉ ở phần cuối học kỳ) */
	showFoot: boolean;
};

/** Một lát legend trên 1 trang — hai cột pack độc lập, cắt được giữa trang */
type TLegendSlice = {
	creditFrom: number;
	creditTo: number;
	showAuth: boolean;
	showScale: boolean;
	notationFrom: number;
	notationTo: number;
};

type TLegendPending = {
	creditFrom: number;
	auth: boolean;
	scale: boolean;
	notationFrom: number;
	notationTotal: number;
};

type TPage = {
	blocks: TPageBlock[];
	showStudent: boolean;
	/** Tổng kết + chữ ký */
	showClosingSummary: boolean;
	/** END OF TRANSCRIPT + CREDIT / NOTATIONS */
	showClosingLegend: boolean;
	legendSlice?: TLegendSlice;
};

type TMeasure = {
	usable: number;
	student: number;
	closingSummary: number;
	closingLegend: number;
	legendPartH: number[];
	creditsTitleH: number;
	creditParaH: number[];
	notationTitleH: number;
	notationRowH: number[];
	/** chiều cao từng học kỳ đầy đủ */
	semesters: number[];
	/** chiều cao phần đầu (title + thead) ước từ (full - foot - rows) */
	semHead: number[];
	semFoot: number[];
	row: number[];
};

const ALL_LEGEND_PARTS = [0, 1, 2, 3];
const CREDIT_PARA_COUNT = 4;
const FOOTER_H = 40;
const GAP = 4;
/** Đệm thêm cho GPA foot — đo thường thấp hơn thực tế (gap EN/VI, padding) */
const FOOT_PAD = 8;
/** Trừ đáy trang dùng được — tránh footer / italic bị overflow:hidden cắt chữ */
const USABLE_SAFE_BOTTOM = 28;
/** Khi kéo legend lên chỗ trống — luôn chừa khe trên footer */
const FILL_SAFE_BOTTOM = 28;
/** Ước lượng dòng/đoạn thường thấp hơn thực tế */
const UNIT_FIT_PAD = 8;
/** Không mở đầu mục Credits/Notation nếu chỗ trống chỉ đủ nhét title (bị footer cắt) */
const MIN_CREDITS_START = 140;
const MIN_NOTATION_START = 140;

function semIndex(semesters: TSemester[], title: string): number {
	return semesters.findIndex((s) => s.title === title);
}

function emptySlice(): TLegendSlice {
	return { creditFrom: 0, creditTo: 0, showAuth: false, showScale: false, notationFrom: 0, notationTo: 0 };
}

function sliceIsEmpty(s?: TLegendSlice) {
	if (!s) return true;
	return s.creditFrom >= s.creditTo && !s.showAuth && !s.showScale && s.notationFrom >= s.notationTo;
}

function hasLegendPending(p: TLegendPending) {
	return p.creditFrom < CREDIT_PARA_COUNT || p.auth || p.scale || p.notationFrom < p.notationTotal;
}

function makeLegendPending(notationTotal: number): TLegendPending {
	return { creditFrom: 0, auth: true, scale: true, notationFrom: 0, notationTotal };
}

function sliceHeight(s: TLegendSlice | undefined, m: TMeasure) {
	if (!s || sliceIsEmpty(s)) return 0;
	let left = 0;
	if (s.creditTo > s.creditFrom) {
		if (s.creditFrom === 0) left += m.creditsTitleH || 0;
		for (let i = s.creditFrom; i < s.creditTo; i += 1) left += m.creditParaH[i] || 24;
	}
	if (s.showAuth) left += m.legendPartH[1] || 0;
	if (s.showScale) left += m.legendPartH[2] || 0;
	let right = 0;
	if (s.notationTo > s.notationFrom) {
		if (s.notationFrom === 0) right += m.notationTitleH || 0;
		for (let i = s.notationFrom; i < s.notationTo; i += 1) right += m.notationRowH[i] || 22;
	}
	return Math.max(left, right) + GAP;
}

function concatSlices(a?: TLegendSlice, b?: TLegendSlice): TLegendSlice | undefined {
	if (!a || sliceIsEmpty(a)) return b;
	if (!b || sliceIsEmpty(b)) return a;
	const aCredit = a.creditTo > a.creditFrom;
	const bCredit = b.creditTo > b.creditFrom;
	const aNote = a.notationTo > a.notationFrom;
	const bNote = b.notationTo > b.notationFrom;
	return {
		creditFrom: aCredit && bCredit ? Math.min(a.creditFrom, b.creditFrom) : aCredit ? a.creditFrom : b.creditFrom,
		creditTo: Math.max(aCredit ? a.creditTo : 0, bCredit ? b.creditTo : 0),
		showAuth: a.showAuth || b.showAuth,
		showScale: a.showScale || b.showScale,
		notationFrom: aNote && bNote ? Math.min(a.notationFrom, b.notationFrom) : aNote ? a.notationFrom : b.notationFrom,
		notationTo: Math.max(aNote ? a.notationTo : 0, bNote ? b.notationTo : 0),
	};
}

function estimatePageUsed(page: TPage, m: TMeasure, semesters: TSemester[]): number {
	let used = page.showStudent ? m.student + GAP : 0;
	for (const b of page.blocks) {
		const si = semIndex(semesters, b.semester.title);
		const head = b.showHead ? m.semHead[si] || 48 : 0;
		const foot = b.showFoot ? (m.semFoot[si] || 36) + FOOT_PAD : 0;
		const row = Math.max(24, m.row[si] || 32);
		used += head + b.courses.length * row + foot + GAP;
	}
	if (page.showClosingSummary) used += m.closingSummary + GAP;
	if (page.showClosingLegend) used += sliceHeight(page.legendSlice, m);
	return used;
}

function firstCreditsNeed(m: TMeasure) {
	return Math.max(
		MIN_CREDITS_START,
		(m.creditsTitleH || 36) + (m.creditParaH[0] || 48) + FILL_SAFE_BOTTOM + UNIT_FIT_PAD,
	);
}

function firstNotationNeed(m: TMeasure) {
	return Math.max(
		MIN_NOTATION_START,
		(m.notationTitleH || 36) + (m.notationRowH[0] || 28) + FILL_SAFE_BOTTOM + UNIT_FIT_PAD,
	);
}

/** Pack 2 cột độc lập: trái credits→auth→scale, phải từng dòng notation */
function takeLegendSlice(space: number, pending: TLegendPending, m: TMeasure, force = false): TLegendSlice | null {
	if (!hasLegendPending(pending) || (space < 20 && !force)) return null;

	const slice: TLegendSlice = {
		creditFrom: pending.creditFrom,
		creditTo: pending.creditFrom,
		showAuth: false,
		showScale: false,
		notationFrom: pending.notationFrom,
		notationTo: pending.notationFrom,
	};

	const startingBoth = pending.creditFrom === 0 && pending.notationFrom === 0;
	if (startingBoth && !force && space < Math.max(firstCreditsNeed(m), firstNotationNeed(m))) return null;

	const canStartCredits = pending.creditFrom !== 0 || force || space >= firstCreditsNeed(m);
	const canStartNotations =
		pending.notationFrom !== 0 ||
		force ||
		(space >= firstNotationNeed(m) && (pending.creditFrom !== 0 || canStartCredits));

	let leftH = 0;
	if (canStartCredits && pending.creditFrom < CREDIT_PARA_COUNT) {
		leftH = pending.creditFrom === 0 ? m.creditsTitleH || 0 : 0;
		for (let i = pending.creditFrom; i < CREDIT_PARA_COUNT; i += 1) {
			const ph = m.creditParaH[i] || 24;
			if (leftH + ph + UNIT_FIT_PAD > space) break;
			leftH += ph;
			slice.creditTo = i + 1;
		}
		if (slice.creditTo === pending.creditFrom) leftH = 0;
	}

	const creditsDone = pending.creditFrom >= CREDIT_PARA_COUNT || slice.creditTo >= CREDIT_PARA_COUNT;
	if (creditsDone && pending.auth && leftH + (m.legendPartH[1] || 0) <= space) {
		slice.showAuth = true;
		leftH += m.legendPartH[1] || 0;
	}
	if (creditsDone && (slice.showAuth || !pending.auth) && pending.scale && leftH + (m.legendPartH[2] || 0) <= space) {
		slice.showScale = true;
	}

	if (canStartNotations && pending.notationFrom < pending.notationTotal) {
		const rightSpace = Math.max(space, leftH);
		let rightH = pending.notationFrom === 0 ? m.notationTitleH || 0 : 0;
		for (let i = pending.notationFrom; i < pending.notationTotal; i += 1) {
			const rh = m.notationRowH[i] || 22;
			if (rightH + rh + UNIT_FIT_PAD > rightSpace) break;
			rightH += rh;
			slice.notationTo = i + 1;
		}
	}

	if (sliceIsEmpty(slice) && force) {
		if (pending.creditFrom < CREDIT_PARA_COUNT) slice.creditTo = pending.creditFrom + 1;
		else if (pending.auth) slice.showAuth = true;
		else if (pending.scale) slice.showScale = true;
		if (pending.notationFrom < pending.notationTotal) slice.notationTo = pending.notationFrom + 1;
	}

	if (sliceIsEmpty(slice)) return null;

	pending.creditFrom = slice.creditTo;
	if (slice.showAuth) pending.auth = false;
	if (slice.showScale) pending.scale = false;
	pending.notationFrom = slice.notationTo;
	return slice;
}

function mainLeftover(main: HTMLElement): number {
	const last = main.lastElementChild as HTMLElement | null;
	if (!last) return main.clientHeight;
	const layoutH = last.offsetHeight;
	const screenH = last.getBoundingClientRect().height;
	const scale = layoutH > 0 && screenH > 0 ? screenH / layoutH : 1;
	const gap = main.getBoundingClientRect().bottom - last.getBoundingClientRect().bottom;
	return Math.max(0, Math.round(gap / scale));
}

function sliceColHeights(s: TLegendSlice | undefined, m: TMeasure) {
	let left = 0;
	let right = 0;
	if (!s) return { left, right };
	if (s.creditTo > s.creditFrom) {
		if (s.creditFrom === 0) left += m.creditsTitleH || 0;
		for (let i = s.creditFrom; i < s.creditTo; i += 1) left += m.creditParaH[i] || 24;
	}
	if (s.showAuth) left += m.legendPartH[1] || 0;
	if (s.showScale) left += m.legendPartH[2] || 0;
	if (s.notationTo > s.notationFrom) {
		if (s.notationFrom === 0) right += m.notationTitleH || 0;
		for (let i = s.notationFrom; i < s.notationTo; i += 1) right += m.notationRowH[i] || 22;
	}
	return { left, right };
}

function pullLegendIntoLeftover(pages: TPage[], m: TMeasure, root: HTMLElement): TPage[] | null {
	const pageEls = Array.from(root.querySelectorAll<HTMLElement>('[data-print-page="true"]'));
	if (pageEls.length !== pages.length) return null;

	const nextPages = pages.map((p) => ({
		...p,
		blocks: [...p.blocks],
		legendSlice: p.legendSlice ? { ...p.legendSlice } : undefined,
	}));
	let changed = false;

	for (let i = 0; i < nextPages.length - 1; i += 1) {
		const cur = nextPages[i];
		const nxt = nextPages[i + 1];
		if (nxt.showClosingSummary || nxt.blocks.some((b) => b.courses.length > 0)) continue;
		if (!nxt.legendSlice || sliceIsEmpty(nxt.legendSlice)) continue;

		const main = pageEls[i].querySelector('.tr-page-main') as HTMLElement | null;
		if (!main) continue;
		let leftover = Math.max(0, mainLeftover(main) - FILL_SAFE_BOTTOM);
		if (leftover < FILL_SAFE_BOTTOM) continue;

		if (!cur.legendSlice) cur.legendSlice = emptySlice();
		const c = cur.legendSlice;
		const n = nxt.legendSlice;
		const startNeed = Math.max(firstCreditsNeed(m), firstNotationNeed(m));
		if (sliceIsEmpty(c) && leftover < startNeed) continue;
		let { left: leftH, right: rightH } = sliceColHeights(c, m);

		const tryGrow = (side: 'left' | 'right', h: number) => {
			const oldMax = Math.max(leftH, rightH);
			const nextLeft = side === 'left' ? leftH + h : leftH;
			const nextRight = side === 'right' ? rightH + h : rightH;
			const grow = Math.max(0, Math.max(nextLeft, nextRight) - oldMax);
			if (grow + FILL_SAFE_BOTTOM > leftover) return false;
			leftover -= grow;
			leftH = nextLeft;
			rightH = nextRight;
			return true;
		};

		const pullRight = () => {
			if (n.notationFrom >= n.notationTo) return false;
			const starting = c.notationFrom >= c.notationTo && n.notationFrom === 0;
			if (starting) {
				if (leftover < firstNotationNeed(m)) return false;
				// Không để title Notation một mình khi Credits còn chưa lên trang này
				if (c.creditFrom >= c.creditTo && n.creditFrom === 0) return false;
			}
			const idx = n.notationFrom;
			const title = starting ? m.notationTitleH || 0 : 0;
			const h = title + (m.notationRowH[idx] || 22);
			if (!tryGrow('right', h + UNIT_FIT_PAD)) return false;
			if (c.notationFrom >= c.notationTo) c.notationFrom = idx;
			c.notationTo = idx + 1;
			n.notationFrom += 1;
			changed = true;
			return true;
		};

		const pullLeft = () => {
			if (n.creditFrom < n.creditTo) {
				const starting = c.creditFrom >= c.creditTo && n.creditFrom === 0;
				if (starting && leftover < firstCreditsNeed(m)) return false;
				const idx = n.creditFrom;
				const title = starting ? m.creditsTitleH || 0 : 0;
				const h = title + (m.creditParaH[idx] || 24);
				if (!tryGrow('left', h + UNIT_FIT_PAD)) return false;
				if (c.creditFrom >= c.creditTo) c.creditFrom = idx;
				c.creditTo = idx + 1;
				n.creditFrom += 1;
				changed = true;
				return true;
			}
			if (!c.showAuth && n.showAuth && c.creditTo >= CREDIT_PARA_COUNT) {
				const h = m.legendPartH[1] || 80;
				if (!tryGrow('left', h + UNIT_FIT_PAD)) return false;
				c.showAuth = true;
				n.showAuth = false;
				changed = true;
				return true;
			}
			if (!c.showScale && n.showScale && c.creditTo >= CREDIT_PARA_COUNT && (c.showAuth || !n.showAuth)) {
				const h = m.legendPartH[2] || 40;
				if (!tryGrow('left', h + UNIT_FIT_PAD)) return false;
				c.showScale = true;
				n.showScale = false;
				changed = true;
				return true;
			}
			return false;
		};

		let guard = 0;
		while (guard < 50) {
			guard += 1;
			// Cột ngắn hơn được lấp trước — page 4 đang trống bên phải thì kéo Notation lên cạnh Credits
			const pulled = rightH <= leftH ? pullRight() || pullLeft() : pullLeft() || pullRight();
			if (!pulled) break;
		}

		cur.showClosingLegend = !sliceIsEmpty(c);
		nxt.showClosingLegend = !sliceIsEmpty(n);
		if (sliceIsEmpty(n)) nxt.legendSlice = undefined;
	}

	if (!changed) return null;
	return nextPages.filter((p) => p.blocks.length > 0 || p.showClosingSummary || p.showClosingLegend);
}

function trimLegendOverflow(page: TPage, m: TMeasure, overflow: number): { saved: number; tail?: TLegendSlice } {
	const s = page.legendSlice;
	if (!s || sliceIsEmpty(s) || overflow <= 0) return { saved: 0 };
	const tail: TLegendSlice = emptySlice();
	let saved = 0;
	while (saved < overflow && !sliceIsEmpty(s)) {
		const { left, right } = sliceColHeights(s, m);
		if (right >= left && s.notationTo > s.notationFrom) {
			const rowIdx = s.notationTo - 1;
			s.notationTo -= 1;
			saved += m.notationRowH[rowIdx] || 22;
			if (tail.notationFrom >= tail.notationTo) {
				tail.notationFrom = rowIdx;
				tail.notationTo = rowIdx + 1;
			} else {
				tail.notationFrom = Math.min(tail.notationFrom, rowIdx);
				tail.notationTo = Math.max(tail.notationTo, rowIdx + 1);
			}
			if (s.notationTo <= s.notationFrom && s.notationFrom === 0) saved += m.notationTitleH || 0;
			continue;
		}
		if (s.showScale) {
			s.showScale = false;
			tail.showScale = true;
			saved += m.legendPartH[2] || 0;
			continue;
		}
		if (s.showAuth) {
			s.showAuth = false;
			tail.showAuth = true;
			saved += m.legendPartH[1] || 0;
			continue;
		}
		if (s.creditTo > s.creditFrom) {
			const idx = s.creditTo - 1;
			s.creditTo -= 1;
			saved += m.creditParaH[idx] || 24;
			if (tail.creditFrom >= tail.creditTo) {
				tail.creditFrom = idx;
				tail.creditTo = idx + 1;
			} else {
				tail.creditFrom = Math.min(tail.creditFrom, idx);
				tail.creditTo = Math.max(tail.creditTo, idx + 1);
			}
			if (s.creditTo <= s.creditFrom && s.creditFrom === 0) saved += m.creditsTitleH || 0;
			continue;
		}
		break;
	}
	if (sliceIsEmpty(s)) {
		page.legendSlice = undefined;
		page.showClosingLegend = false;
	}
	return { saved, tail: sliceIsEmpty(tail) ? undefined : tail };
}

/** GPA foot bị pack nhầm vào trang đầy → overflow:hidden cắt mất; tách sang trang sau */
function peelOverflowFoots(pages: TPage[], m: TMeasure, semesters: TSemester[]): TPage[] {
	for (let pi = 0; pi < pages.length; pi += 1) {
		const page = pages[pi];
		let used = estimatePageUsed(page, m, semesters);
		let guard = 0;
		while (used > m.usable && guard < 20) {
			guard += 1;
			// Overflow vì legend — đẩy legend sang trang sau, không tách GPA khỏi kỳ
			if (page.legendSlice && !sliceIsEmpty(page.legendSlice)) {
				const { saved, tail } = trimLegendOverflow(page, m, used - m.usable);
				if (tail) {
					if (pi + 1 < pages.length) {
						pages[pi + 1].legendSlice = concatSlices(tail, pages[pi + 1].legendSlice);
						pages[pi + 1].showClosingLegend = true;
					} else {
						pages.push({
							blocks: [],
							showStudent: false,
							showClosingSummary: false,
							showClosingLegend: true,
							legendSlice: tail,
						});
					}
				}
				if (saved > 0) {
					used -= saved;
					continue;
				}
			}
			let bi = -1;
			for (let i = page.blocks.length - 1; i >= 0; i -= 1) {
				if (page.blocks[i].showFoot) {
					bi = i;
					break;
				}
			}
			if (bi < 0) break;

			const b = page.blocks[bi];
			const si = semIndex(semesters, b.semester.title);
			const footH = (m.semFoot[si] || 36) + FOOT_PAD + GAP;
			b.showFoot = false;

			const footBlock: TPageBlock = {
				semester: b.semester,
				courses: [],
				showHead: false,
				showFoot: true,
			};
			if (!b.courses.length && !b.showHead) {
				page.blocks.splice(bi, 1);
			}

			const next = pi + 1 < pages.length ? pages[pi + 1] : null;
			const nextIsLegendOnly = Boolean(
				next && next.showClosingLegend && !next.blocks.some((blk) => blk.courses.length > 0),
			);
			if (next && !nextIsLegendOnly) {
				next.blocks.unshift(footBlock);
			} else {
				pages.splice(pi + 1, 0, {
					blocks: [footBlock],
					showStudent: false,
					showClosingSummary: false,
					showClosingLegend: false,
				});
			}
			used -= footH;
		}
	}
	return pages;
}

function ensureSemesterFoots(pages: TPage[], semesters: TSemester[]): TPage[] {
	const shown = new Set<string>();
	pages.forEach((p) =>
		p.blocks.forEach((b) => {
			if (b.showFoot) shown.add(b.semester.title);
		}),
	);

	for (const sem of semesters) {
		if (shown.has(sem.title)) continue;

		/** Gắn GPA vào khối môn cuối của kỳ (cùng trang — tận dụng khoảng trống) */
		let attached = false;
		for (let pi = pages.length - 1; pi >= 0 && !attached; pi -= 1) {
			const blocks = pages[pi].blocks;
			for (let bi = blocks.length - 1; bi >= 0; bi -= 1) {
				const b = blocks[bi];
				if (b.semester.title === sem.title && b.courses.length > 0) {
					b.showFoot = true;
					attached = true;
					break;
				}
			}
		}

		if (!attached) {
			const footBlock: TPageBlock = {
				semester: sem,
				courses: [],
				showHead: false,
				showFoot: true,
			};
			/** Không gắn GPA vào trang chỉ có chú thích (legend) */
			let insertAt = pages.length;
			let placed = false;
			for (let pi = pages.length - 1; pi >= 0; pi -= 1) {
				const p = pages[pi];
				const legendOnly = Boolean(p.showClosingLegend && !p.blocks.some((b) => b.courses.length > 0));
				if (legendOnly) {
					insertAt = pi;
					continue;
				}
				p.blocks.push(footBlock);
				placed = true;
				break;
			}
			if (!placed) {
				pages.splice(insertAt, 0, {
					blocks: [footBlock],
					showStudent: false,
					showClosingSummary: false,
					showClosingLegend: false,
				});
			}
		}
		shown.add(sem.title);
	}

	return pages;
}

function packPages(semesters: TSemester[], m: TMeasure, notationCount: number): TPage[] {
	if (!semesters.length) {
		const slice: TLegendSlice = {
			creditFrom: 0,
			creditTo: CREDIT_PARA_COUNT,
			showAuth: true,
			showScale: true,
			notationFrom: 0,
			notationTo: notationCount,
		};
		return [{ blocks: [], showStudent: true, showClosingSummary: true, showClosingLegend: true, legendSlice: slice }];
	}

	const pages: TPage[] = [];
	let si = 0;
	let courseOffset = 0;
	let isFirst = true;
	let guard = 0;
	let pendingSummary = false;
	let pendingLegend: TLegendPending | null = null;
	/** GPA foot còn treo vì trang trước không đủ chỗ */
	let pendingFootSem: TSemester | null = null;
	let pendingFootIdx = -1;

	while (
		(si < semesters.length || pendingFootSem || pendingSummary || (pendingLegend && hasLegendPending(pendingLegend))) &&
		guard < 500
	) {
		guard += 1;
		const blocks: TPageBlock[] = [];
		let used = isFirst ? m.student + GAP : 0;
		const usable = m.usable;

		/** Ưu tiên gắn footer kỳ còn thiếu */
		if (pendingFootSem && pendingFootIdx >= 0) {
			const foot = (m.semFoot[pendingFootIdx] || 36) + FOOT_PAD;
			if (used + foot + GAP <= usable || blocks.length === 0) {
				blocks.push({
					semester: pendingFootSem,
					courses: [],
					showHead: false,
					showFoot: true,
				});
				used += foot + GAP;
				pendingFootSem = null;
				pendingFootIdx = -1;
			}
		}

		while (si < semesters.length) {
			const sem = semesters[si];
			const coursesLeft = sem.courses.slice(courseOffset);
			if (!coursesLeft.length) {
				// Hết môn nhưng chưa có foot → giữ pending; không bỏ qua kỳ khác khi còn foot treo
				if (!pendingFootSem) {
					pendingFootSem = sem;
					pendingFootIdx = si;
					si += 1;
					courseOffset = 0;
				} else if (pendingFootSem.title === sem.title) {
					si += 1;
					courseOffset = 0;
				}
				break;
			}

			const isLastSem = si === semesters.length - 1;
			const showHead = courseOffset === 0;
			const head = showHead ? m.semHead[si] || 48 : 0;
			const foot = (m.semFoot[si] || 36) + FOOT_PAD;
			const row = Math.max(24, m.row[si] || 32);
			const space = usable - used;

			/** Đủ chỗ kết thúc cả kỳ (môn còn lại + GPA foot) */
			const finishH = head + coursesLeft.length * row + foot + GAP;
			if (finishH <= space) {
				blocks.push({ semester: sem, courses: coursesLeft, courseStartIndex: courseOffset, showHead, showFoot: true });
				used += finishH;
				pendingFootSem = null;
				pendingFootIdx = -1;
				si += 1;
				courseOffset = 0;
				if (isLastSem) break;
				continue;
			}

			/**
			 * Cắt môn. Không kết thúc kỳ nếu thiếu chỗ cho foot.
			 * Luôn để ≥1 môn (+ foot) sang trang sau khi cần.
			 */
			let nFit = Math.floor((space - head - GAP) / row);
			if (nFit < 1) {
				if (blocks.length === 0) nFit = 1;
				else break;
			}
			nFit = Math.min(nFit, coursesLeft.length);

			// Sắp lấy hết môn: bắt buộc đủ chỗ cho foot, không thì để lại ≥1 môn
			if (nFit >= coursesLeft.length) {
				const need = head + coursesLeft.length * row + foot + GAP;
				if (need > space) {
					nFit = coursesLeft.length - 1;
					while (nFit > 0 && head + nFit * row + GAP > space) nFit -= 1;
					if (nFit < 1) {
						if (blocks.length > 0) break;
						// Trang trống: nếu còn >1 môn thì lấy 1 môn không foot; nếu đúng 1 môn cuối thì để cả môn+foot trang này nếu có thể
						if (coursesLeft.length > 1) nFit = 1;
						else if (head + row + foot + GAP <= space) {
							nFit = 1;
						} else {
							break;
						}
					}
				}
			}

			const isEndOfSem = courseOffset + nFit >= sem.courses.length;
			const canFoot = isEndOfSem && head + nFit * row + foot + GAP <= space;

			if (isEndOfSem && !canFoot) {
				// Không được kết thúc kỳ tại đây
				nFit = Math.min(nFit, Math.max(0, coursesLeft.length - 1));
				while (nFit > 0 && head + nFit * row + GAP > space) nFit -= 1;
				if (nFit < 1) {
					if (blocks.length > 0) break;
					if (coursesLeft.length > 1) nFit = 1;
					else break;
				}
				blocks.push({
					semester: sem,
					courses: coursesLeft.slice(0, nFit),
					courseStartIndex: courseOffset,
					showHead,
					showFoot: false,
				});
				used += head + nFit * row + GAP;
				courseOffset += nFit;
				// Nếu vô tình hết môn vẫn chưa foot → đánh dấu pending
				if (courseOffset >= sem.courses.length) {
					pendingFootSem = sem;
					pendingFootIdx = si;
					si += 1;
					courseOffset = 0;
				}
				break;
			}

			blocks.push({
				semester: sem,
				courses: coursesLeft.slice(0, nFit),
				courseStartIndex: courseOffset,
				showHead,
				showFoot: canFoot,
			});
			used += head + nFit * row + (canFoot ? foot : 0) + GAP;

			if (canFoot) {
				pendingFootSem = null;
				pendingFootIdx = -1;
				si += 1;
				courseOffset = 0;
				if (isLastSem) break;
			} else {
				courseOffset += nFit;
				if (courseOffset >= sem.courses.length) {
					pendingFootSem = sem;
					pendingFootIdx = si;
					si += 1;
					courseOffset = 0;
				}
				break;
			}
		}

		// Sau vòng môn: nếu còn pending foot và còn chỗ thì gắn ngay
		if (pendingFootSem && pendingFootIdx >= 0) {
			const foot = (m.semFoot[pendingFootIdx] || 36) + FOOT_PAD;
			if (used + foot + GAP <= usable) {
				blocks.push({
					semester: pendingFootSem,
					courses: [],
					showHead: false,
					showFoot: true,
				});
				used += foot + GAP;
				pendingFootSem = null;
				pendingFootIdx = -1;
			}
		}

		const done = si >= semesters.length && courseOffset === 0 && !pendingFootSem;
		if (done && !pendingSummary && !pendingLegend) {
			pendingSummary = true;
			pendingLegend = makeLegendPending(notationCount);
		}

		let showClosingSummary = false;
		let legendSlice: TLegendSlice | undefined;

		if (pendingSummary) {
			const need = m.closingSummary + GAP;
			if (used + need <= usable) {
				showClosingSummary = true;
				used += need;
				pendingSummary = false;
			}
		}

		if (!pendingSummary && pendingLegend && hasLegendPending(pendingLegend)) {
			const space = Math.max(0, usable - used);
			legendSlice = takeLegendSlice(space, pendingLegend, m) || undefined;
			used += sliceHeight(legendSlice, m);
		}

		/** Trang riêng cho phần closing còn lại */
		if (
			!blocks.length &&
			(pendingSummary || (pendingLegend && hasLegendPending(pendingLegend))) &&
			!showClosingSummary &&
			sliceIsEmpty(legendSlice)
		) {
			if (pendingSummary) {
				showClosingSummary = true;
				used += m.closingSummary + GAP;
				pendingSummary = false;
			}
			if (pendingLegend && hasLegendPending(pendingLegend)) {
				const space = Math.max(0, usable - used);
				legendSlice = takeLegendSlice(space, pendingLegend, m, true) || undefined;
				used += sliceHeight(legendSlice, m);
			}
		}

		const showClosingLegend = !sliceIsEmpty(legendSlice);

		/** Trang trống nhưng còn GPA foot treo → bắt buộc gắn */
		if (!blocks.length && pendingFootSem) {
			blocks.push({
				semester: pendingFootSem,
				courses: [],
				showHead: false,
				showFoot: true,
			});
			pendingFootSem = null;
			pendingFootIdx = -1;
		}

		pages.push({
			blocks,
			showStudent: isFirst,
			showClosingSummary,
			showClosingLegend,
			legendSlice,
		});
		isFirst = false;

		if (
			!blocks.length &&
			!showClosingSummary &&
			!showClosingLegend &&
			!pendingFootSem &&
			!(pendingLegend && hasLegendPending(pendingLegend))
		) {
			si += 1;
			courseOffset = 0;
		}
	}

	const cleaned = pages.filter((p) => p.blocks.length > 0 || p.showClosingSummary || p.showClosingLegend);
	return peelOverflowFoots(ensureSemesterFoots(cleaned, semesters), m, semesters);
}

const BiLabel = ({ en, vi }: { en: string; vi: string }) => (
	<span className='bi-label'>
		<span className='bi-en'>{en}</span>
		<span className='bi-vi'>{vi}</span>
	</span>
);

/** Điểm quy đổi (T) / học lại (R) superscript */
const GradeCell = ({ grade }: { grade: string }) => {
	let rest = String(grade);
	const suffixes: string[] = [];
	while (true) {
		const m = rest.match(/^(.*)(\([TR]\))$/i);
		if (!m) break;
		suffixes.unshift(m[2]);
		rest = m[1];
	}
	if (!suffixes.length) return <>{grade}</>;
	return (
		<>
			{rest}
			{suffixes.map((s) => (
				<sup key={s} className='grade-retake'>
					{s}
				</sup>
			))}
		</>
	);
};

const SemesterBlock = ({
	sem,
	courses,
	courseStartIndex = 0,
	showHead,
	showFoot,
}: {
	sem: TSemester;
	courses: TCourse[];
	courseStartIndex?: number;
	showHead: boolean;
	showFoot: boolean;
}) => (
	<section className={`tr-semester${showHead ? '' : ' tr-semester-continue'}`}>
		{showHead ? (
			<div className='tr-sem-head'>
				<span className='tr-sem-title'>
					<span className='tr-sem-title-en'>{sem.title}</span>
					{sem.titleVi ? <span className='tr-sem-title-vi'> ({sem.titleVi})</span> : null}
				</span>
				{sem.badges?.length ? (
					<span className='tr-sem-badges'>
						{sem.badges.map((b) => (
							<span key={b} className='tr-sem-badge'>
								★ {b}
							</span>
						))}
					</span>
				) : null}
			</div>
		) : null}
		{courses.length || showHead ? (
			<table className='tr-course-table'>
				{showHead ? (
					<thead>
						<tr>
							<th className='col-code'>
								<BiLabel en='Code' vi='Mã' />
							</th>
							<th className='col-name'>
								<BiLabel en='Course Name' vi='Tên học phần' />
							</th>
							<th className='col-credit-attempted'>
								<BiLabel en='Credit Attempted' vi='Tín chỉ học phần' />
							</th>
							<th className='col-credit-earned'>
								<BiLabel en='Credit Earned' vi='Tín chỉ tích lũy' />
							</th>
							<th className='col-grade'>
								<BiLabel en='Grade' vi='Điểm' />
							</th>
						</tr>
					</thead>
				) : null}
				{courses.length ? (
					<tbody>
						{courses.map((c, i) => {
							const note = c.note?.trim();
							const absIdx = courseStartIndex + i;
							const prevNote = absIdx > 0 ? sem.courses[absIdx - 1]?.note?.trim() || '' : '';
							// Title chỉ 1 lần / nhóm trong cả kỳ (không lặp khi sang trang)
							const showGroupHead = !!note && (absIdx === 0 || prevNote !== note);

							return (
								<Fragment key={`${sem.title}-${c.code}-${c.nameEn}-${absIdx}`}>
									{showGroupHead ? (
										<tr className='tr-course-group'>
											<td colSpan={5} className='tr-course-group-title'>
												{(() => {
													const { en, vi } = formatTransferGroupTitle(note);
													return (
														<>
															<span className='course-en'>{en}</span>
															{vi ? <span className='course-vi'>{vi}</span> : null}
														</>
													);
												})()}
											</td>
										</tr>
									) : null}
									<tr>
										<td className='col-code'>{c.code}</td>
										<td className='col-name'>
											<span className='course-en'>{c.nameEn}</span>
											<span className='course-vi'>{c.nameVi}</span>
										</td>
										<td className='col-credit-attempted'>{Number(c.creditAttempted).toFixed(1)}</td>
										<td className='col-credit-earned'>{Number(c.creditEarned).toFixed(1)}</td>
										<td className='col-grade'>
											<GradeCell grade={c.grade} />
										</td>
									</tr>
								</Fragment>
							);
						})}
					</tbody>
				) : null}
			</table>
		) : null}
		{showFoot ? (
			<div className='tr-sem-foot'>
				<div className='tr-sem-gpa'>
					<span className='bi-en'>GPA: {Number(sem.gpa).toFixed(2)}</span>
					<span className='bi-vi'>Trung bình chung học kỳ: {Number(sem.gpa).toFixed(2)}</span>
				</div>
				<div className='tr-sem-credit'>
					<span className='bi-en'>Credit Earned: {sem.creditEarned}</span>
					<span className='bi-vi'>Số tín chỉ tích lũy: {sem.creditEarned}</span>
				</div>
			</div>
		) : null}
	</section>
);

const normDisplay = (s?: string) =>
	(s || '')
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ');

/** Chỉ ngành Bác sĩ Y khoa mới ẩn Degree (chỉ hiện Program) */
const isBacSiYKhoa = (...values: Array<string | undefined>) =>
	values.some((value) => {
		const n = normDisplay(value);
		return n.includes('bac si y khoa') || n.includes('medical doctor') || n === 'md';
	});

const StudentBlock = ({ s }: { s: TTranscriptData['student'] }) => {
	const hasProgram = !!(s.program || s.programVi);
	const hasConcentration = !!(s.concentration || s.concentrationVi);
	const hasMinor = !!(s.minor || s.minorVi);
	const showDegree = !!(s.degree || s.degreeVi) && !isBacSiYKhoa(s.degree, s.degreeVi, s.program, s.programVi);

	return (
		<>
			<header className='tr-header'>
				<h1 className='tr-title'>UNOFFICIAL ACADEMIC TRANSCRIPT</h1>
				<img className='tr-logo-img' src={getPublicAssetPath('/logo-full.svg')} alt='Logo' width={210} height={40} />
			</header>
			<section className='tr-student'>
				<div className='tr-student-col'>
					<div className='tr-field'>
						<span className='tr-field-label'>
							<span className='bi-en'>Full Name:</span>
							<span className='bi-vi'>Họ và tên:</span>
						</span>
						<span className='tr-field-value'>
							<span className='bi-en'>{s.fullName}</span>
							<span className='bi-vi'>{s.fullNameVi}</span>
						</span>
					</div>
					<div className='tr-field'>
						<span className='tr-field-label'>
							<span className='bi-en'>Student ID:</span>
							<span className='bi-vi'>Mã số sinh viên:</span>
						</span>
						<span className='tr-field-value'>
							<span className='bi-en'>{s.studentId}</span>
							<span className='bi-vi'>{s.studentId}</span>
						</span>
					</div>
					<div className='tr-field'>
						<span className='tr-field-label'>
							<span className='bi-en'>Date Of Birth:</span>
							<span className='bi-vi'>Ngày tháng năm sinh:</span>
						</span>
						<span className='tr-field-value'>
							<span className='bi-en'>{s.dateOfBirth}</span>
							<span className='bi-vi'>{s.dateOfBirth}</span>
						</span>
					</div>
					<div className='tr-field'>
						<span className='tr-field-label'>
							<span className='bi-en'>Gender:</span>
							<span className='bi-vi'>Giới tính:</span>
						</span>
						<span className='tr-field-value'>
							<span className='bi-en'>{s.gender}</span>
							<span className='bi-vi'>{s.genderVi}</span>
						</span>
					</div>
				</div>
				<div className='tr-student-col'>
					{showDegree ? (
						<div className='tr-field'>
							<span className='tr-field-label'>
								<span className='bi-en'>Degree:</span>
								<span className='bi-vi'>Văn bằng:</span>
							</span>
							<span className='tr-field-value'>
								<span className='bi-en'>{s.degree}</span>
								<span className='bi-vi'>{s.degreeVi}</span>
							</span>
						</div>
					) : null}
					{hasProgram ? (
						<div className='tr-field'>
							<span className='tr-field-label'>
								<span className='bi-en'>Program:</span>
								<span className='bi-vi'>Chương trình:</span>
							</span>
							<span className='tr-field-value'>
								<span className='bi-en'>{s.program}</span>
								<span className='bi-vi'>{s.programVi}</span>
							</span>
						</div>
					) : null}
					{hasConcentration ? (
						<div className='tr-field'>
							<span className='tr-field-label'>
								<span className='bi-en'>Concentration:</span>
								<span className='bi-vi'>Chuyên ngành:</span>
							</span>
							<span className='tr-field-value'>
								<span className='bi-en'>{s.concentration}</span>
								<span className='bi-vi'>{s.concentrationVi}</span>
							</span>
						</div>
					) : null}
					{hasMinor ? (
						<div className='tr-field'>
							<span className='tr-field-label'>
								<span className='bi-en'>Minor:</span>
								<span className='bi-vi'>Chuyên ngành phụ:</span>
							</span>
							<span className='tr-field-value'>
								<span className='bi-en'>{s.minor}</span>
								<span className='bi-vi'>{s.minorVi}</span>
							</span>
						</div>
					) : null}
				</div>
			</section>
			<hr className='tr-rule' />
		</>
	);
};

const ClosingBlock = ({
	data,
	showSummary = true,
	legendParts,
	legendSlice,
}: {
	data: TTranscriptData;
	showSummary?: boolean;
	legendParts?: number[];
	legendSlice?: TLegendSlice;
}) => {
	const { summary, notations, creditNote, durationNote, authentication, gradeScale } = data;
	const creditParas = [creditNote.en, creditNote.vi, durationNote.en, durationNote.vi];
	let slice = legendSlice;
	if (!slice && legendParts?.length) {
		const hasCredits = legendParts.includes(0);
		const hasNotations = legendParts.includes(3);
		slice = {
			creditFrom: hasCredits ? 0 : CREDIT_PARA_COUNT,
			creditTo: hasCredits ? CREDIT_PARA_COUNT : CREDIT_PARA_COUNT,
			showAuth: legendParts.includes(1),
			showScale: legendParts.includes(2),
			notationFrom: hasNotations ? 0 : notations.length,
			notationTo: hasNotations ? notations.length : notations.length,
		};
	}
	if (!showSummary && sliceIsEmpty(slice)) return null;

	const showCredits = Boolean(slice && slice.creditTo > slice.creditFrom);
	const showNotations = Boolean(slice && slice.notationTo > slice.notationFrom);
	const showLegend = Boolean(slice && !sliceIsEmpty(slice));

	return (
		<div className={`tr-closing${showLegend ? ' tr-closing-with-legend' : ''}`}>
			{showSummary ? (
				<>
					<div className='tr-closing-row' data-measure='closing-summary-inner'>
						<div className='tr-totals'>
							<div className='tr-total-item'>
								<span className='bi-en'>Credit Earned: {summary.creditsEarned}</span>
								<span className='bi-vi'>Số tín chỉ tích lũy: {summary.creditsEarned}</span>
							</div>
							<div className='tr-total-item'>
								<span className='bi-en'>CGPA: {Number(summary.cgpa).toFixed(2)}</span>
								<span className='bi-vi'>Trung bình chung tích lũy: {Number(summary.cgpa).toFixed(2)}</span>
							</div>
						</div>
					</div>
					<div className='tr-end'>
						<span className='tr-end-en'>END OF TRANSCRIPT</span>
						<span className='bi-vi'>Kết thúc bảng điểm</span>
						<span className='tr-end-rules' aria-hidden />
					</div>
				</>
			) : null}

			{showLegend && slice ? (
				<div className='tr-legend' data-measure='closing-legend-inner'>
					<div className='tr-legend-col'>
						{showCredits ? (
							<div data-measure='legend-part' data-legend-part='0'>
								{slice.creditFrom === 0 ? (
									<div className='tr-legend-title' data-measure='credits-title'>
										CREDITS AND DURATION OF TRAINING
										<span className='tr-legend-title-vi'>Số tín chỉ và thời gian đào tạo</span>
									</div>
								) : null}
								{creditParas.map((text, i) =>
									i >= slice.creditFrom && i < slice.creditTo ? (
										<p
											key={`credit-p-${i}`}
											className={i % 2 === 0 ? 'tr-legend-en' : 'tr-legend-vi'}
											data-measure='credit-para'
											data-para={i}
										>
											{text}
										</p>
									) : null,
								)}
							</div>
						) : null}

						{slice.showAuth ? (
							<div className='tr-auth' data-measure='legend-part' data-legend-part='1'>
								<div className='tr-legend-title'>
									{authentication.titleEn}
									<span className='tr-legend-title-vi'>{authentication.titleVi}</span>
								</div>
								<ul className='tr-auth-list'>
									{authentication.items.map((item) => (
										<li key={item.en}>
											<span className='tr-legend-en'>{item.en}</span>
											<span className='tr-legend-vi'>/{item.vi}</span>
										</li>
									))}
								</ul>
							</div>
						) : null}

						{slice.showScale ? (
							<div data-measure='legend-part' data-legend-part='2'>
								<div className='tr-legend-title'>
									GRADING SCALE
									<span className='tr-legend-title-vi'>Thang điểm đánh giá</span>
								</div>
								<table className='tr-grade-scale'>
									<tbody>
										<tr>
											<th>
												<span className='bi-en'>Letter Grade</span>
												<span className='bi-vi'>Điểm chữ</span>
											</th>
											{gradeScale.letters.map((g) => (
												<td key={g}>{g}</td>
											))}
										</tr>
										<tr>
											<th>
												<span className='bi-en'>4.0 Scale</span>
												<span className='bi-vi'>Thang 4.0</span>
											</th>
											{gradeScale.points.map((p, i) => (
												<td key={`${p}-${i}`}>{p}</td>
											))}
										</tr>
									</tbody>
								</table>
							</div>
						) : null}
					</div>
					<div className='tr-legend-col'>
						{showNotations ? (
							<div data-measure='legend-part' data-legend-part='3'>
								{slice.notationFrom === 0 ? (
									<div className='tr-legend-title' data-measure='notation-title'>
										SPECIAL GRADE NOTATION
										<span className='tr-legend-title-vi'>Các điểm đặc biệt</span>
									</div>
								) : null}
								<table className='tr-notations-table'>
									<tbody>
										{notations.map((n, i) =>
											i >= slice.notationFrom && i < slice.notationTo ? (
												<tr key={n.code} data-measure='notation-row'>
													<td className='nt-code'>{n.code}</td>
													<td className='nt-mean'>
														<span className='bi-en'>{n.en}</span>
														<span className='bi-vi'>{n.vi}</span>
													</td>
												</tr>
											) : null,
										)}
									</tbody>
								</table>
							</div>
						) : null}
					</div>
				</div>
			) : null}
		</div>
	);
};

const TranscriptSheet = forwardRef<HTMLDivElement, Props>(({ data, className }, ref) => {
	const [pages, setPages] = useState<TPage[] | null>(null);
	const measureRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const measureCache = useRef<TMeasure | null>(null);
	const { student: s, summary, semesters } = data;

	const setSheetRef = (node: HTMLDivElement | null) => {
		sheetRef.current = node;
		if (typeof ref === 'function') ref(node);
		else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = node;
	};

	useLayoutEffect(() => {
		let cancelled = false;

		const run = async () => {
			try {
				await document.fonts?.ready;
			} catch {
				/* ignore */
			}
			if (cancelled) return;

			// Chờ thêm một nhịp ngắn (150ms) để đảm bảo style CSS/Less đã được inject và tính toán xong layout
			await new Promise((resolve) => setTimeout(resolve, 150));
			if (cancelled) return;

			const host = measureRef.current;
			if (!host) return;

			const main = host.querySelector('.tr-page-main') as HTMLElement | null;
			const studentEl = host.querySelector('[data-measure="student"]') as HTMLElement | null;
			const closingSummaryEl = host.querySelector('[data-measure="closing-summary"]') as HTMLElement | null;
			const closingLegendEl = host.querySelector('[data-measure="closing-legend"]') as HTMLElement | null;
			const legendPartEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="legend-part"]'));
			const creditsTitleEl = host.querySelector<HTMLElement>('[data-measure="credits-title"]');
			const creditParaEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="credit-para"]'));
			const notationTitleEl = host.querySelector<HTMLElement>('[data-measure="notation-title"]');
			const notationRowEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="notation-row"]'));
			const semEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="semester"]'));
			const footEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="sem-foot"]'));
			const headEls = Array.from(host.querySelectorAll<HTMLElement>('[data-measure="sem-head-table"]'));

			const usable = main?.clientHeight || 1000;
			const student = studentEl?.offsetHeight || 220;
			const closingSummary = closingSummaryEl?.offsetHeight || 140;
			const closingLegend = closingLegendEl?.offsetHeight || 300;
			const legendPartH = ALL_LEGEND_PARTS.map((i) => {
				const el = legendPartEls.find((node) => Number(node.dataset.legendPart) === i);
				return el?.offsetHeight || Math.round(closingLegend / ALL_LEGEND_PARTS.length) || 80;
			});
			const creditsTitleH = creditsTitleEl?.offsetHeight || 36;
			const creditParaH = Array.from({ length: CREDIT_PARA_COUNT }, (_, i) => {
				const el = creditParaEls.find((node) => Number(node.dataset.para) === i);
				return el?.offsetHeight || 28;
			});
			const notationTitleH = notationTitleEl?.offsetHeight || 36;
			const notationRowH = notationRowEls.length
				? notationRowEls.map((el) => el.offsetHeight || 22)
				: Array.from({ length: Math.max(1, data.notations.length) }, () => 22);

			const semHeights = semEls.map((el) => el.offsetHeight);
			const semFoot = footEls.map((el) => el.offsetHeight);
			const semHead = headEls.map((el) => el.offsetHeight);
			const row = semEls.map((el, i) => {
				const rows = Array.from(el.querySelectorAll<HTMLElement>('tbody tr'));
				if (rows.length) {
					const avg = rows.reduce((sum, r) => sum + r.offsetHeight, 0) / rows.length;
					return Math.max(24, Math.round(avg));
				}
				const n = semesters[i]?.courses.length || 1;
				const body = Math.max(0, (semHeights[i] || 0) - (semHead[i] || 0) - (semFoot[i] || 0));
				return Math.max(28, Math.round(body / n));
			});

			if (!cancelled) {
				try {
					const measure: TMeasure = {
						usable: Math.max(400, usable - USABLE_SAFE_BOTTOM),
						student,
						closingSummary,
						closingLegend,
						legendPartH,
						creditsTitleH,
						creditParaH,
						notationTitleH,
						notationRowH,
						semesters: semHeights,
						semHead,
						semFoot,
						row,
					};
					measureCache.current = measure;
					setPages(packPages(semesters, measure, data.notations.length));
				} catch (err) {
					console.error(err);
					setPages([
						{
							blocks: semesters.map((sem) => ({
								semester: sem,
								courses: sem.courses,
								showHead: true,
								showFoot: true,
							})),
							showStudent: true,
							showClosingSummary: true,
							showClosingLegend: true,
							legendSlice: {
								creditFrom: 0,
								creditTo: CREDIT_PARA_COUNT,
								showAuth: true,
								showScale: true,
								notationFrom: 0,
								notationTo: data.notations.length,
							},
						},
					]);
				}
			}
		};

		run();
		return () => {
			cancelled = true;
		};
	}, [semesters, data]);

	useLayoutEffect(() => {
		if (!pages || !measureCache.current || !sheetRef.current) return;
		const filled = pullLegendIntoLeftover(pages, measureCache.current, sheetRef.current);
		if (filled) setPages(filled);
	}, [pages]);

	const total = pages?.length ?? 1;

	const measureBlock = (
		<div ref={measureRef} className='transcript-measure-host' aria-hidden>
			<div className='transcript-a4-page'>
				<div className='tr-page-inner'>
					<div className='tr-page-main'>
						<div data-measure='student'>
							<StudentBlock s={s} />
						</div>
						{semesters.map((sem) => (
							<section className='tr-semester' data-measure='semester' key={`m-${sem.title}`}>
								<div data-measure='sem-head-table'>
									<div className='tr-sem-head'>
										<span className='tr-sem-title'>
											<span className='tr-sem-title-en'>{sem.title}</span>
											{sem.titleVi ? <span className='tr-sem-title-vi'> ({sem.titleVi})</span> : null}
										</span>
										{sem.badges?.length ? (
											<span className='tr-sem-badges'>
												{sem.badges.map((b) => (
													<span key={b} className='tr-sem-badge'>
														★ {b}
													</span>
												))}
											</span>
										) : null}
									</div>
									<table className='tr-course-table'>
										<thead>
											<tr>
												<th className='col-code'>
													<BiLabel en='Code' vi='Mã' />
												</th>
												<th className='col-name'>
													<BiLabel en='Course Name' vi='Tên học phần' />
												</th>
												<th className='col-credit-attempted'>
													<BiLabel en='Credit Attempted' vi='Tín chỉ học phần' />
												</th>
												<th className='col-credit-earned'>
													<BiLabel en='Credit Earned' vi='Tín chỉ tích lũy' />
												</th>
												<th className='col-grade'>
													<BiLabel en='Grade' vi='Điểm' />
												</th>
											</tr>
										</thead>
									</table>
								</div>
								<table className='tr-course-table'>
									<tbody>
										{sem.courses.map((c, idx) => (
											<tr key={c.code} data-measure={idx === 0 ? 'row' : undefined}>
												<td className='col-code'>{c.code}</td>
												<td className='col-name'>
													<span className='course-en'>{c.nameEn}</span>
													<span className='course-vi'>{c.nameVi}</span>
												</td>
												<td className='col-credit-attempted'>{Number(c.creditAttempted).toFixed(1)}</td>
												<td className='col-credit-earned'>{Number(c.creditEarned).toFixed(1)}</td>
												<td className='col-grade'>
													<GradeCell grade={c.grade} />
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<div className='tr-sem-foot' data-measure='sem-foot'>
									<div className='tr-sem-gpa'>
										<span className='bi-en'>GPA: {Number(sem.gpa).toFixed(2)}</span>
										<span className='bi-vi'>Trung bình chung học kỳ: {Number(sem.gpa).toFixed(2)}</span>
									</div>
									<div className='tr-sem-credit'>
										<span className='bi-en'>Earned: {sem.creditEarned}</span>
										<span className='bi-vi'>Số tín chỉ tích lũy: {sem.creditEarned}</span>
									</div>
								</div>
							</section>
						))}
					</div>
					<footer className='tr-page-footer' style={{ height: FOOTER_H }}>
						<div className='tr-issue'>
							<span className='bi-en'>Date of Issue</span>
						</div>
						<div className='tr-page-no'>0/0</div>
					</footer>
				</div>
			</div>
			<div className='transcript-a4-page transcript-measure-closing'>
				<div className='tr-page-inner'>
					<div className='tr-page-main'>
						<div data-measure='closing-summary'>
							<ClosingBlock data={data} showSummary legendParts={[]} />
						</div>
						<div data-measure='closing-legend'>
							<ClosingBlock data={data} showSummary={false} legendParts={ALL_LEGEND_PARTS} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className={`transcript-doc ${className ?? ''}`.trim()} ref={setSheetRef}>
			{typeof document !== 'undefined' ? createPortal(measureBlock, document.body) : measureBlock}

			{pages?.map((page, idx) => {
				const pageNo = idx + 1;
				return (
					<div className='transcript-a4-page' key={`page-${pageNo}`} data-page={pageNo} data-print-page='true'>
						<div className='tr-watermark' aria-hidden />
						<div className='tr-page-inner'>
							<div className='tr-page-main'>
								{page.showStudent ? <StudentBlock s={s} /> : null}
								<div className='tr-body'>
									{page.blocks.map((b, bi) => (
										<SemesterBlock
											key={`${pageNo}-${b.semester.title}-${bi}`}
											sem={b.semester}
											courses={b.courses}
											courseStartIndex={b.courseStartIndex}
											showHead={b.showHead}
											showFoot={b.showFoot}
										/>
									))}
								</div>
								{(page.showClosingSummary || page.showClosingLegend) && (
									<ClosingBlock data={data} showSummary={page.showClosingSummary} legendSlice={page.legendSlice} />
								)}
							</div>
							<footer className='tr-page-footer'>
								<div className='tr-issue'>
									<span className='bi-en'>Date of Issue: {summary.dateOfIssueEn}</span>
									<span className='bi-vi'>Ngày cấp: {summary.dateOfIssueVi}</span>
								</div>
								<div className='tr-page-no'>
									{pageNo}/{total}
								</div>
							</footer>
						</div>
					</div>
				);
			})}
		</div>
	);
});

TranscriptSheet.displayName = 'TranscriptSheet';

export default TranscriptSheet;
