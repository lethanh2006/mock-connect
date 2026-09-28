import { SegmentedControl, SegmentedControlItem } from '@/components/Icons';
import classNames from 'classnames';
import type { CSSProperties, ReactNode } from 'react';
import './style.less';

export type SegmentedRawOption = string | number;
export type SegmentedLabeledOption = {
	label?: ReactNode;
	value: string | number | boolean;
	icon?: ReactNode;
	disabled?: boolean;
	className?: string;
	title?: string;
};
export type SegmentedOption = SegmentedRawOption | SegmentedLabeledOption;

export interface MySegmentedProps {
	options: SegmentedOption[];
	value?: string | number | boolean;
	defaultValue?: string | number | boolean;
	onChange?: (value: any) => void;
	disabled?: boolean;
	size?: 'small' | 'middle' | 'large';
	block?: boolean;
	className?: string;
	style?: CSSProperties;
}

const toKey = (val: string | number | boolean | undefined | null): string => {
	if (val === undefined || val === null) return '';
	return String(val);
};

export const Segmented = ({
	options = [],
	value,
	defaultValue,
	onChange,
	disabled,
	size = 'middle',
	block = false,
	className,
	style,
}: MySegmentedProps) => {
	// Map từ string key nội bộ sang giá trị gốc (boolean/number/string)
	const valueMap = new Map<string, any>();

	const normalizedOptions = options.map((opt) => {
		if (typeof opt === 'string' || typeof opt === 'number') {
			const key = String(opt);
			valueMap.set(key, opt);
			return {
				key,
				value: key,
				label: opt,
				disabled: false,
				title: undefined,
			};
		}
		const key = toKey(opt.value);
		valueMap.set(key, opt.value);
		return {
			key,
			value: key,
			label: opt.label,
			icon: opt.icon,
			disabled: opt.disabled,
			title: opt.title,
			className: opt.className,
		};
	});

	const vinSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';
	const currentValue = value !== undefined ? toKey(value) : undefined;
	const currentDefaultValue = defaultValue !== undefined ? toKey(defaultValue) : undefined;

	return (
		<SegmentedControl
			className={classNames('my-segmented', block && 'my-segmented-block', className)}
			style={{
				width: block ? '100%' : 'fit-content',
				...style,
			}}
			size={vinSize}
			value={currentValue}
			defaultValue={currentDefaultValue}
			onValueChange={(selectedKey) => {
				if (selectedKey && valueMap.has(selectedKey)) {
					onChange?.(valueMap.get(selectedKey));
				}
			}}
		>
			{normalizedOptions.map((opt) => {
				const hasIcon = Boolean(opt.icon);
				const hasLabel = Boolean(opt.label);

				return (
					<SegmentedControlItem
						key={opt.key}
						value={opt.value}
						disabled={disabled || opt.disabled}
						title={opt.title}
						className={opt.className}
					>
						{hasIcon && hasLabel ? (
							<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
								{opt.icon}
								<span>{opt.label}</span>
							</span>
						) : hasIcon ? (
							opt.icon
						) : (
							opt.label
						)}
					</SegmentedControlItem>
				);
			})}
		</SegmentedControl>
	);
};

export default Segmented;
