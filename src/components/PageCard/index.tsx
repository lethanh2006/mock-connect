import {
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ScrollEdgeEffect,
	useResolvedTheme,
	Card as VinCard,
} from '@vinuni/ui';
import { Spin } from 'antd';
import React, { useLayoutEffect, useRef, useState } from 'react';
import './style.less';
import { PageCardProps } from './typing';

// margin-top của .page-card-header bị style.less ghi đè về 0 (xem .page-card .page-card-header) —
// placeholderHeight phải khớp giá trị THẬT đang render, không phải 8px gốc trong custom_vinuni.less.
// margin-bottom giữ nguyên 16px + 8px bù thêm dưới đây — chỉ header khi stickyHeader mới đo qua
// getBoundingClientRect() rồi cộng placeholder, không phải toàn bộ khoảng cách thật giữa title và
// card nội dung (khác cách trình duyệt tính flow height ở chế độ thường) nên cần cộng tay đúng phần
// còn thiếu; chế độ không sticky không đi qua hằng số này nên không bị ảnh hưởng.
const PAGE_CARD_HEADER_MARGIN_TOP = 0;
const PAGE_CARD_HEADER_MARGIN_BOTTOM = 16 + 8;

// getBoundingClientRect() trả về line-box, không phải mực chữ thật — dấu tiếng Việt dưới baseline
// có thể tràn ra ngoài line-box vài pixel. Chỉ cộng vào shellHeight (vùng tô màu của shell fixed),
// không cộng vào placeholderHeight (khoảng chừa chỗ trong luồng thường) để không ảnh hưởng vị trí
// nội dung bên dưới.
const PAGE_CARD_HEADER_PAINT_EXTRA = 6;

const PageCard: React.FC<PageCardProps> = ({
	className,
	children,
	title,
	extra,
	cardExtra,
	loading = false,
	style,
	styles,
	size,
	level = 1,
	showIndicator = false,
	bordered = false,
	hideInnerCard = false,
	stickyHeader = true,
	subtitle,
	headerType,
	...rest
}) => {
	const extraContent = extra ?? cardExtra;
	const hasTitle = Boolean(title && title !== true);
	const hasHeader = hasTitle || Boolean(extraContent) || Boolean(subtitle);

	// Level 1: Page Title (card-big-title, 24px)
	// Level 2: Section Title (highlight, 18px)
	// Level 3: Sub-section Title (normal, 18px, indicator nhỏ hơn)
	// Level 4: Standard Card (title nằm trong Card)
	const isLevel4 = level === 4;

	// title/section title phải expose qua heading thật cho accessibility
	// tree, không phải div thường. Level 1 = h1 (page title), Level 2 = h2 (section), Level 3/4 = h3
	// (sub-section/card title) — style vẫn do .page-card-title/[data-slot='card-title'] quyết định,
	// đổi tag không đổi giao diện (xem margin reset ở style.less để không lệch phép đo stickyHeader).
	const HeadingTag = (level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3') as 'h1' | 'h2' | 'h3';

	const containerRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const placeholderRef = useRef<HTMLDivElement>(null);
	const [scrolled, setScrolled] = useState(false);
	const [rect, setRect] = useState({ left: 0, width: 0, capHeight: 0, shellHeight: 0, placeholderHeight: 0 });
	const [bgColor, setBgColor] = useState('');
	const resolvedTheme = useResolvedTheme();

	// stickyHeader ghim header bằng position: fixed đo bằng JS, không dùng CSS position: sticky —
	// DOM còn tàn dư wrapper của ProLayout khai overflow khác visible dù không cuộn thật, khiến
	// sticky bị neo nhầm chỗ. position: fixed chỉ phụ thuộc transform/filter của tổ tiên (không có
	// trong chuỗi layout hiện tại của app).
	useLayoutEffect(() => {
		if (!stickyHeader) return;
		const container = containerRef.current;
		const header = headerRef.current;
		const placeholder = placeholderRef.current;
		if (!container || !header || !placeholder) return;

		// Đi ngược lên cây DOM từ container để lấy màu nền KHÔNG trong suốt đầu tiên, thay vì đoán
		// tên token màu. Tách riêng khỏi measure() vì getComputedStyle khá tốn và màu nền hiếm khi
		// đổi — chỉ chạy lại lúc mount/resize/đổi theme, không chạy mỗi frame cuộn.
		const detectBgColor = () => {
			let node: HTMLElement | null = container;
			while (node) {
				const bg = getComputedStyle(node).backgroundColor;
				if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
					setBgColor(bg);
					return;
				}
				node = node.parentElement;
			}
		};
		detectBgColor();

		// Đo lại mỗi frame cuộn (rAF-throttled) để capHeight tự sửa nếu có gì đó phía trên container
		// làm xê dịch layout sau khi mount — ResizeObserver chỉ bắt khi phần tử đang quan sát tự đổi
		// kích cỡ, không bắt được khi bị đẩy dịch vị trí bởi thứ khác. So sánh giá trị cũ/mới trước
		// khi setState để không ép render lại mỗi frame khi không có gì đổi (trường hợp phổ biến khi
		// cuộn dọc thuần túy).
		const measure = () => {
			const c = container.getBoundingClientRect();
			const h = header.getBoundingClientRect();
			// + scrollY để quy về khoảng cách tính từ đầu trang (không đổi theo cuộn), vì measure()
			// có thể chạy giữa lúc trang đang cuộn dở.
			const capHeight = c.top + window.scrollY;
			const next = {
				left: c.left,
				width: c.width,
				capHeight,
				shellHeight: capHeight + h.height + PAGE_CARD_HEADER_PAINT_EXTRA,
				placeholderHeight: PAGE_CARD_HEADER_MARGIN_TOP + h.height + PAGE_CARD_HEADER_MARGIN_BOTTOM,
			};
			setRect((prev) =>
				prev.left === next.left &&
				prev.width === next.width &&
				prev.capHeight === next.capHeight &&
				prev.shellHeight === next.shellHeight &&
				prev.placeholderHeight === next.placeholderHeight
					? prev
					: next,
			);
			setScrolled((prev) => {
				const next = placeholder.getBoundingClientRect().top < 0;
				return prev === next ? prev : next;
			});
		};
		measure();
		// Font 'Inter' tải bất đồng bộ — nếu chưa xong lúc đo lần đầu, font thay thế tạm thời có
		// metrics khác, đo hụt chiều cao thật.
		document.fonts?.ready.then(measure);

		let ticking = false;
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				measure();
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true, capture: true });

		const resizeObserver = new ResizeObserver(() => {
			measure();
			detectBgColor();
		});
		resizeObserver.observe(container);
		resizeObserver.observe(header);
		window.addEventListener('resize', measure);
		return () => {
			window.removeEventListener('scroll', onScroll, { capture: true });
			resizeObserver.disconnect();
			window.removeEventListener('resize', measure);
		};
	}, [stickyHeader, resolvedTheme]);

	// card-big-title áp cho cả Level 1 và Level 3 (khớp bản antd trước khi migrate) — Level 3 nhận
	// thêm class 'normal' (levelClass) để override cỡ chữ nhỏ hơn/màu xanh, nhưng dùng chung cỡ và
	// vị trí indicator với Level 1 qua class card-big-title chung.
	const baseClasses = `${level === 1 || level === 3 ? 'card-big-title' : ''} ${isLevel4 ? '' : 'card-borderless'}`;
	const levelClass = level === 2 ? 'highlight' : level === 3 ? 'normal' : isLevel4 ? 'standard' : '';

	const canToggleIndicator = !isLevel4;
	const indicatorClass = canToggleIndicator && showIndicator === true ? 'has-indicator' : '';

	// Level 1–3: title nằm ngoài card. Subtitle đi cùng khối title để extra vẫn ở bên phải.
	const outerTitleBlock = (title || subtitle) && (
		<div className='page-card-title-block'>
			{title ? (
				<HeadingTag className='page-card-title' data-slot='card-title'>
					{title}
				</HeadingTag>
			) : null}
			{subtitle ? (
				<div className='page-card-subtitle' data-slot='card-description'>
					{subtitle}
				</div>
			) : null}
		</div>
	);

	// Level 4 (Standard): title nằm TRONG Card, dùng Card/CardHeader của @vinuni/ui.
	if (isLevel4) {
		const cardClasses = ['page-card', 'page-card-standard', levelClass, indicatorClass, className]
			.filter(Boolean)
			.join(' ');

		const cardBody = (
			<>
				{hasHeader && (
					<CardHeader style={styles?.header} data-header-type={headerType ?? 'default'}>
						{(hasTitle || subtitle) && (
							<div className='page-card-title-block'>
								{hasTitle && (
									<CardTitle role='heading' aria-level={3}>
										{title}
									</CardTitle>
								)}
								{subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
							</div>
						)}
						{extraContent && (
							<CardAction>
								{headerType === 'action' ? (
									<div className='page-card-header-action-content'>{extraContent}</div>
								) : (
									extraContent
								)}
							</CardAction>
						)}
					</CardHeader>
				)}
				<CardContent className={hideInnerCard ? 'p-0' : undefined} style={styles?.body}>
					{children}
				</CardContent>
			</>
		);

		return (
			<VinCard className={cardClasses} size={size === 'small' ? 'sm' : undefined} style={style} {...rest}>
				{/* Spin của antd bọc thêm 2 lớp div thường (.ant-spin-nested-loading/.ant-spin-container),
				không phải flex — chèn giữa Card và CardHeader/CardContent sẽ phá chuỗi flex:1 mà
				ModalExpandable/style.less dựa vào để giãn Card full-screen (footer bị đẩy lên trên,
				để trống khoảng lớn phía dưới). Chỉ bọc Spin khi thực sự có loading, mặc định (loading=false)
				giữ CardHeader/CardContent làm con trực tiếp của Card. */}
				{loading ? (
					<Spin spinning style={{ width: '100%' }}>
						{cardBody}
					</Spin>
				) : (
					cardBody
				)}
			</VinCard>
		);
	}

	// Level 1-3: title nằm NGOÀI Card (Page/Section Title).
	const containerClasses = ['page-card', 'page-card-outer', baseClasses, levelClass, indicatorClass, className]
		.filter(Boolean)
		.join(' ');

	return (
		<div ref={containerRef} className={containerClasses} style={style} {...rest}>
			<Spin spinning={loading} style={{ width: '100%' }}>
				{hasHeader && (
					<>
						<div
							className={`page-card-header-shell ${stickyHeader ? 'page-card-header-shell-sticky' : ''}`}
							style={{
								backgroundColor: bgColor || undefined,
							}}
						>
							<div
								ref={headerRef}
								className='page-card-header page-card-header-fixed'
								data-slot='page-card-header'
								data-scrolled={scrolled}
							>
								{outerTitleBlock}
								{extraContent && (
									<div className='page-card-action' data-slot='card-action'>
										{extraContent}
									</div>
								)}
								<ScrollEdgeEffect edge='top' theme='grounded' className='page-card-scroll-edge' />
							</div>
						</div>
						{/* {stickyHeader && (
							<div
								ref={placeholderRef}
								className='page-card-header-placeholder'
								style={{ height: '60px' }}
								aria-hidden
							/>
						)} */}
					</>
				)}
				<div className={`page-card-body ${stickyHeader ? 'page-card-body-sticky' : ''}`}>{children}</div>
			</Spin>
		</div>
	);
};

export default PageCard;

// Card đơn giản có tiêu đề (khóa cứng level=4 "Standard") — điểm dùng chung cho mọi nơi cần
// "Card + title + content" thay vì tự dựng Card/CardHeader/CardTitle/CardContent của @vinuni/ui
// mỗi nơi 1 kiểu. Card gốc của @vinuni/ui được import ở trên dưới tên VinCard để tránh trùng tên
// với export này.
export const Card: React.FC<Omit<PageCardProps, 'level'>> = (props) => <PageCard {...props} level={4} />;
