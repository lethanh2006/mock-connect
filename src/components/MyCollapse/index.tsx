import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/Icons';
import classNames from 'classnames';
import { useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Wrapper Collapse theo API antd (bản `items`, khuyến nghị dùng trong antd v5 — không hỗ trợ bản
 * cũ `<Collapse><Collapse.Panel>` con-cái), dựng trên Accordion (Radix) có sẵn của vinui.
 *
 * Props antd Collapse ĐÃ hỗ trợ: items (key/label/children/extra/disabled), activeKey/
 * defaultActiveKey (string hoặc string[] đều nhận), onChange, accordion (chỉ mở 1 panel — map
 * sang Radix type='single' collapsible, mặc định type='multiple'), bordered, className, style.
 *
 * Props antd Collapse CỐ Ý KHÔNG hỗ trợ (dùng đến thì mở rộng file này trước, đừng đoán mò):
 * - `size`, `expandIconPosition`, `collapsible` ('header'/'icon'/'disabled' theo từng panel),
 *   `ghost`, `destroyInactivePanel`, `forceRender` per-item: chưa có nhu cầu dùng.
 * - `expandIcon` (custom icon render): AccordionTrigger của vinui tự vẽ chevron cố định, không có
 *   prop thay icon khác.
 *
 * `extra`: cùng lưu ý như antd thật — nội dung `extra` nằm TRONG button trigger (cả header đều
 * clickable để expand/collapse), nên nút/link bên trong `extra` phải tự `e.stopPropagation()`
 * trong onClick, nếu không click vào sẽ vừa chạy hành động vừa đóng/mở panel.
 */
export interface MyCollapseItem {
	key: string;
	label: ReactNode;
	children: ReactNode;
	extra?: ReactNode;
	disabled?: boolean;
}

export interface MyCollapseProps {
	items: MyCollapseItem[];
	activeKey?: string | string[];
	defaultActiveKey?: string | string[];
	onChange?: (key: string | string[]) => void;
	/** Chỉ mở được 1 panel tại 1 thời điểm (giống antd `accordion`). Mặc định: false (mở nhiều panel). */
	accordion?: boolean;
	/** Mặc định: true, giống antd. */
	bordered?: boolean;
	className?: string;
	style?: CSSProperties;
}

const toArray = (value?: string | string[]): string[] | undefined => {
	if (value === undefined) return undefined;
	return Array.isArray(value) ? value : [value];
};

export const Collapse = ({
	items,
	activeKey,
	defaultActiveKey,
	onChange,
	accordion = false,
	bordered = true,
	className,
	style,
}: MyCollapseProps) => {
	const [innerValue, setInnerValue] = useState<string[]>(() => toArray(defaultActiveKey) ?? []);
	const isControlled = activeKey !== undefined;

	if (accordion) {
		const currentValue = isControlled ? toArray(activeKey)?.[0] ?? '' : innerValue[0] ?? '';
		return (
			<Accordion
				type='single'
				collapsible
				value={currentValue}
				onValueChange={(next: string) => {
					if (!isControlled) setInnerValue(next ? [next] : []);
					onChange?.(next);
				}}
				className={classNames(!bordered && 'border-0', className)}
				style={style}
			>
				{items.map((item) => (
					<AccordionItem key={item.key} value={item.key} disabled={item.disabled}>
						<AccordionTrigger>
							<span className='flex flex-1 items-center justify-between gap-2'>
								<span>{item.label}</span>
								{item.extra}
							</span>
						</AccordionTrigger>
						<AccordionContent>{item.children}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		);
	}

	const currentValue = isControlled ? toArray(activeKey) ?? [] : innerValue;
	return (
		<Accordion
			type='multiple'
			value={currentValue}
			onValueChange={(next: string[]) => {
				if (!isControlled) setInnerValue(next);
				onChange?.(next);
			}}
			className={classNames(!bordered && 'border-0', className)}
			style={style}
		>
			{items.map((item) => (
				<AccordionItem key={item.key} value={item.key} disabled={item.disabled}>
					<AccordionTrigger>
						<span className='flex flex-1 items-center justify-between gap-2'>
							<span>{item.label}</span>
							{item.extra}
						</span>
					</AccordionTrigger>
					<AccordionContent>{item.children}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
};

export default Collapse;
