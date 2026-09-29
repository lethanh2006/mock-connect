import {
	Command,
	CommandEmpty,
	CommandItem,
	CommandList,
	CommandSearchInput,
	IconChervolDown,
	IconRotateArrow,
	IconXmarkCircleFill,
	inputVariants,
	Popover,
	PopoverBar,
	PopoverContent,
	PopoverTrigger,
	Select,
	SelectContent,
	SelectionIndicator,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/Icons';
import classNames from 'classnames';
import { useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { useIntl } from 'umi';

export type VinSelectValue = string | number | boolean;

export type VinSelectOption = {
	label: ReactNode;
	value: VinSelectValue | null;
	disabled?: boolean;
	/** Chỉ dùng làm React key khi value không unique hoặc không phải string. */
	key?: string | number | null;
};

export type VinSelectProps = {
	options?: VinSelectOption[];
	value?: VinSelectValue | VinSelectValue[] | null;
	onChange?: (value: any, option?: VinSelectOption | VinSelectOption[]) => void;
	mode?: 'multiple';
	showSearch?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	disabled?: boolean;
	loading?: boolean;
	notFoundContent?: ReactNode;
	/** Field trong option dùng để lọc khi gõ tìm kiếm. Mặc định lọc theo label. */
	optionFilterProp?: string;
	/** Server-side search — có prop này thì tự tắt filter client-side, options coi như đã được caller
	 * tự lọc sẵn theo từ khoá. */
	onSearch?: (value: string) => void;
	/** Có `onSearch` vẫn lọc tại chỗ theo label trong lúc chờ server (giống antd `showSearch` + `onSearch`).
	 * Mặc định: tắt. */
	localFilter?: boolean;
	/** `false`: bấm lại lựa chọn đang chọn KHÔNG bỏ chọn (giống antd Select single). Mặc định: `true`. */
	allowDeselect?: boolean;
	/** `sm`/`small` cao 36px, còn lại cao 44px. */
	size?: 'sm' | 'default' | 'small' | 'middle' | 'large';
	className?: string;
	style?: CSSProperties;
};

const NULL_VALUE = '__null__';
const toKey = (value: VinSelectValue | null | undefined): string =>
	value === null || value === undefined ? NULL_VALUE : String(value);

type InternalOption = { key: string; label: ReactNode; filterValue: string; disabled?: boolean };

const SelectSearchPopover = ({
	options,
	mode,
	selectedKeys,
	onToggle,
	searchPlaceholder,
	emptyLabel,
	onSearch,
	localFilter,
	children,
}: {
	options: InternalOption[];
	mode: 'single' | 'multiple';
	selectedKeys: string[];
	onToggle: (key: string) => void;
	searchPlaceholder?: string;
	emptyLabel?: ReactNode;
	onSearch?: (value: string) => void;
	localFilter?: boolean;
	children: ReactNode;
}) => {
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);
	const isSingle = mode === 'single';

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				align='start'
				className='h-80 w-auto p-0'
				style={{ minWidth: 'var(--radix-popover-trigger-width)' }}
			>
				<Command
					surface={false}
					shouldFilter={!onSearch || !!localFilter}
					className='flex h-full flex-col overflow-hidden p-0'
				>
					<PopoverBar className='pb-ds-sp-8'>
						<CommandSearchInput
							size='medium'
							value={search}
							onValueChange={(val) => {
								setSearch(val);
								onSearch?.(val);
							}}
							placeholder={searchPlaceholder}
							className='w-full'
						/>
					</PopoverBar>
					<div className='min-h-0 flex-1'>
						<CommandList className='h-full max-h-none overflow-y-auto pt-(--popover-bar-height) pb-ds-sp-8'>
							<CommandEmpty className='px-ds-sp-16 py-ds-sp-24 text-center font-sans text-[16px] leading-[24px] text-ds-content-secondary'>
								{emptyLabel}
							</CommandEmpty>
							{options.map((opt) => (
								<CommandItem
									key={opt.key}
									variant='cell'
									value={opt.filterValue}
									disabled={opt.disabled}
									onSelect={() => {
										onToggle(opt.key);
										if (isSingle) setOpen(false);
									}}
									trailing={
										<SelectionIndicator
											shape={isSingle ? 'radio' : 'checkbox'}
											checked={selectedKeys.includes(opt.key)}
										/>
									}
								>
									{opt.label}
								</CommandItem>
							))}
						</CommandList>
					</div>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

/**
 * Select dùng chung. Không search và không chọn nhiều thì dùng Select gốc của @vinuni/ui.
 * `showSearch` hoặc `mode='multiple'` thì mở popover có ô tìm kiếm.
 * Radix chỉ nhận value dạng string nên number / boolean / null được ánh xạ 2 chiều.
 */
const VinSelect = ({
	options = [],
	value,
	onChange,
	mode,
	showSearch,
	allowClear,
	placeholder,
	disabled,
	loading,
	notFoundContent,
	optionFilterProp,
	onSearch,
	localFilter,
	allowDeselect = true,
	size = 'default',
	className,
	style,
}: VinSelectProps) => {
	const intl = useIntl();
	const isMultiple = mode === 'multiple';
	const fieldSize = size === 'sm' || size === 'small' ? 'sm' : 'default';
	const isDisabled = disabled || loading;
	const emptyLabel = notFoundContent ?? intl.formatMessage({ id: 'global.title.khongcodulieu' });
	const stretch = style?.width == null && !className?.includes('field-w-') && !className?.includes('field-fill');

	const keyToValue = new Map<string, VinSelectValue | null>(options.map((opt) => [toKey(opt.value), opt.value]));
	const keyToOption = new Map<string, VinSelectOption>(options.map((opt) => [toKey(opt.value), opt]));

	if (!isMultiple && !showSearch) {
		const currentKey = value !== undefined && value !== null && !Array.isArray(value) ? toKey(value) : undefined;
		const hasValue = currentKey !== undefined;

		const selectField = (
			<Select
				value={currentKey}
				onValueChange={(key) => onChange?.(keyToValue.get(key) ?? null, keyToOption.get(key))}
				disabled={isDisabled}
			>
				<SelectTrigger
					size={fieldSize}
					className={classNames(stretch && 'w-full', !allowClear && className, allowClear && hasValue && 'pr-9')}
					style={allowClear ? { width: '100%' } : style}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position='popper' align='start'>
					{options.length ? (
						options.map((opt) => (
							<SelectItem key={opt.key ?? toKey(opt.value)} value={toKey(opt.value)} disabled={opt.disabled}>
								{opt.label}
							</SelectItem>
						))
					) : (
						<SelectItem value='__empty__' disabled>
							{emptyLabel}
						</SelectItem>
					)}
				</SelectContent>
			</Select>
		);

		if (!allowClear) return selectField;

		return (
			<div className={classNames('relative inline-block', stretch && 'w-full', className)} style={style}>
				{selectField}
				{hasValue && !isDisabled ? (
					<IconXmarkCircleFill
						size={fieldSize === 'sm' ? 16 : 20}
						className='absolute top-1/2 right-9 z-10 -translate-y-1/2 cursor-pointer text-ds-content-tertiary'
						onClick={(e) => {
							e.stopPropagation();
							onChange?.(null);
						}}
					/>
				) : null}
			</div>
		);
	}

	const getFilterValue = (opt: VinSelectOption): string => {
		const raw = optionFilterProp ? (opt as Record<string, unknown>)[optionFilterProp] : undefined;
		if (raw !== undefined) return String(raw);
		return typeof opt.label === 'string' ? opt.label : String(opt.value ?? '');
	};

	const internalOptions: InternalOption[] = options.map((opt) => ({
		key: toKey(opt.value),
		label: opt.label,
		filterValue: getFilterValue(opt),
		disabled: opt.disabled,
	}));

	const selectedKeys = isMultiple
		? ((Array.isArray(value) ? value : []) as VinSelectValue[]).map((v) => toKey(v))
		: value !== undefined && value !== null && !Array.isArray(value)
			? [toKey(value)]
			: [];
	const selectedLabels = options.filter((opt) => selectedKeys.includes(toKey(opt.value))).map((opt) => opt.label);
	const hasValue = selectedLabels.length > 0;

	const handleClear = (e: MouseEvent) => {
		e.stopPropagation();
		onChange?.(isMultiple ? [] : null);
	};

	const trigger = (
		<button
			type='button'
			data-slot='select-trigger'
			data-field-state={isDisabled ? 'disable' : undefined}
			disabled={isDisabled}
			style={style}
			className={classNames(
				inputVariants(),
				'flex items-center justify-between gap-2 pr-3',
				stretch && 'w-full',
				fieldSize === 'sm' && 'h-9 text-[14px]',
				className,
			)}
		>
			<span className={classNames('truncate text-left', !hasValue && 'text-ds-content-secondary')}>
				{hasValue ? selectedLabels.join(', ') : placeholder}
			</span>
			<span className='flex shrink-0 items-center gap-1 text-ds-content-tertiary'>
				{allowClear && hasValue && !isDisabled ? (
					<IconXmarkCircleFill size={fieldSize === 'sm' ? 16 : 20} className='cursor-pointer' onClick={handleClear} />
				) : null}
				{loading ? (
					<IconRotateArrow size={fieldSize === 'sm' ? 16 : 20} className='animate-spin' />
				) : (
					<IconChervolDown size={fieldSize === 'sm' ? 16 : 20} />
				)}
			</span>
		</button>
	);

	if (isMultiple) {
		return (
			<SelectSearchPopover
				options={internalOptions}
				mode='multiple'
				selectedKeys={selectedKeys}
				onToggle={(key) => {
					const keys = selectedKeys.includes(key) ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key];
					onChange?.(
						keys.map((k) => keyToValue.get(k) ?? null),
						keys.map((k) => keyToOption.get(k)).filter(Boolean) as VinSelectOption[],
					);
				}}
				searchPlaceholder={placeholder}
				emptyLabel={emptyLabel}
				onSearch={onSearch}
				localFilter={localFilter}
			>
				{trigger}
			</SelectSearchPopover>
		);
	}

	return (
		<SelectSearchPopover
			options={internalOptions}
			mode='single'
			selectedKeys={selectedKeys}
			onToggle={(key) => {
				if (!allowDeselect && selectedKeys[0] === key) return;
				const nextKey = selectedKeys[0] === key ? null : key;
				onChange?.(
					nextKey === null ? null : (keyToValue.get(nextKey) ?? null),
					nextKey ? keyToOption.get(nextKey) : undefined,
				);
			}}
			searchPlaceholder={placeholder}
			emptyLabel={emptyLabel}
			onSearch={onSearch}
			localFilter={localFilter}
		>
			{trigger}
		</SelectSearchPopover>
	);
};

export default VinSelect;
