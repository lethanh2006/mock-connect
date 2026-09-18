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
	Select as VinSelect,
	SelectContent,
	SelectionIndicator,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/Icons';
import classNames from 'classnames';
import { useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';

export type MySelectValue = string | number | boolean;
export type MySelectOption = {
	label: ReactNode;
	value: MySelectValue | null;
	disabled?: boolean;
	/** Chỉ dùng làm React key khi liệt kê option (nhánh Select đơn giản) — không dùng để so khớp
	 * value. antd cho phép `key` khác `value`, ví dụ khi value không unique hoặc không phải string. */
	key?: string | number | null;
};

/**
 * Wrapper Select dùng chung, giữ API gần nhất với antd `Select` để các phân hệ pull code base này
 * về dùng lại không phải sửa chỗ gọi (chỉ đổi `import { Select } from 'antd'` thành
 * `import Select from '@/components/MySelect'`). Cắm thẳng vào Form.Item được vì value/onChange
 * theo đúng convention Form.Item bơm vào (không cần adapter như Checkbox/SegmentedControl).
 *
 * vinui có 2 field Select rời nhau, component này tự chọn loại theo prop truyền vào:
 * - Không `mode='multiple'` và không `showSearch` → dùng thẳng `Select`/`SelectTrigger` gốc của
 *   vinui (radix, chỉ chọn 1, không search). Nếu có `allowClear` thì đè thêm 1 icon X tuyệt đối
 *   lên trigger gốc (radix không có sẵn nút xóa) thay vì đổi hẳn sang nhánh dưới.
 * - `mode='multiple'` hoặc `showSearch` → dùng `SelectPopover` (có sẵn ô search + chế độ
 *   multiple/single), nhưng nó không tự vẽ ô field/tag/nút xóa nên trigger phải tự dựng bằng
 *   `inputVariants` (cùng token với Input/SelectTrigger để đồng bộ giao diện).
 *
 * Props antd Select đã hỗ trợ: options (kèm `key` riêng cho React list-key, khác `value`), value,
 * onChange (kèm tham số 2 `option` như antd), mode, showSearch, allowClear, placeholder, disabled,
 * size, className, style, loading, notFoundContent, optionFilterProp. `value`/`options[].value`
 * nhận cả string/number/boolean/null (tự ánh xạ 2 chiều qua chuỗi nội bộ để tương thích radix,
 * không bị ép hết về string khi bắn ra ngoài).
 *
 * `optionFilterProp`: nhánh search/multiple không dùng `SelectPopover` có sẵn của vinui nữa (nó
 * khóa cứng lọc theo `label`) mà tự dựng bằng `Command`/`CommandItem` — cùng primitive
 * `SelectPopover` dùng bên trong — chỉ khác là `CommandItem` được gán `value` (chuỗi để cmdk lọc)
 * lấy từ field do `optionFilterProp` chỉ định thay vì luôn luôn là `label`. Mặc định vẫn lọc theo
 * `label` khi không truyền, giống hệt hành vi cũ.
 *
 * Props antd Select CỐ Ý KHÔNG hỗ trợ (dùng đến thì phải mở rộng file này trước, đừng đoán mò):
 * - `filterOption` (hàm lọc tùy ý): mới hỗ trợ chọn field qua `optionFilterProp`, chưa hỗ trợ hàm
 *   lọc tùy biến hoàn toàn.
 * - `labelInValue`, `tokenSeparators`, `maxTagCount`, `tagRender`: chưa có nhu cầu dùng.
 * - `dropdownRender`, `popupClassName`, `open`/`onDropdownVisibleChange`: chưa expose các control
 *   này ra ngoài.
 * - `onSearch` (server-side search): vẫn tự lọc client-side trên `options` truyền vào, không có
 *   callback báo từ khoá đang gõ ra ngoài.
 * - mode `'tags'` (tự thêm option mới khi gõ): chỉ hỗ trợ `'multiple'`.
 */
export type MySelectProps = {
	options?: MySelectOption[];
	value?: MySelectValue | MySelectValue[] | null;
	onChange?: (value: any, option?: MySelectOption | MySelectOption[]) => void;
	mode?: 'multiple';
	showSearch?: boolean;
	allowClear?: boolean;
	placeholder?: string;
	disabled?: boolean;
	loading?: boolean;
	/** antd cho phép truyền hẳn 1 component (icon, nút "Tạo mới"...), không chỉ text. */
	notFoundContent?: ReactNode;
	/** Field trong option dùng để lọc khi gõ tìm kiếm (mặc định 'label'). Chỉ nhận field có giá trị
	 * string/number/boolean trên option — không hỗ trợ hàm lọc tùy biến. */
	optionFilterProp?: string;
	size?: 'small' | 'middle' | 'large';
	className?: string;
	style?: CSSProperties;
};

// radix Select chỉ nhận value dạng string — options antd có thể dùng number/boolean/null
// (vd TableReceiver.tsx dùng value 0/1). Ánh xạ 2 chiều qua chuỗi để giữ được kiểu gốc khi bắn onChange.
const NULL_VALUE = '__null__';
const toKey = (value: MySelectValue | null): string => (value === null || value === undefined ? NULL_VALUE : String(value));

type InternalOption = { key: string; label: ReactNode; filterValue: string; disabled?: boolean };

/**
 * Popover chọn giá trị có search, tự dựng bằng Command/CommandItem thay vì SelectPopover có sẵn
 * của vinui (component đó khóa cứng lọc theo label) — để hỗ trợ optionFilterProp lọc theo field
 * tùy ý. Giao diện/cấu trúc mượn lại y hệt bên trong SelectPopover (Popover + PopoverBar +
 * CommandSearchInput + CommandList + SelectionIndicator).
 */
const SelectSearchPopover = ({
	options,
	mode,
	selectedKeys,
	onToggle,
	searchPlaceholder,
	emptyLabel,
	children,
}: {
	options: InternalOption[];
	mode: 'single' | 'multiple';
	selectedKeys: string[];
	onToggle: (key: string) => void;
	searchPlaceholder?: string;
	emptyLabel?: ReactNode;
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
				className='w-auto p-0'
				style={{ minWidth: 'var(--radix-popover-trigger-width)', maxHeight: 320 }}
			>
				<Command surface={false} className='flex h-full flex-col overflow-hidden p-0'>
					<PopoverBar className='pb-ds-sp-8'>
						<CommandSearchInput
							size='medium'
							value={search}
							onValueChange={setSearch}
							placeholder={searchPlaceholder}
							className='w-full'
						/>
					</PopoverBar>
					<div className='min-h-0 flex-1'>
						<CommandList className='h-full max-h-none overflow-y-auto pt-(--popover-bar-height) pb-ds-sp-8'>
							<CommandEmpty className='px-ds-sp-16 py-ds-sp-24 text-center font-sans text-[16px] leading-[24px] text-ds-content-secondary'>
								{emptyLabel ?? 'Không có kết quả'}
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
										<SelectionIndicator shape={isSingle ? 'radio' : 'checkbox'} checked={selectedKeys.includes(opt.key)} />
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

const Select = ({
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
	size,
	className,
	style,
}: MySelectProps) => {
	const isMultiple = mode === 'multiple';
	const fieldSize = size === 'small' ? 'sm' : 'default';
	const isDisabled = disabled || loading;

	// Map key(string) -> value gốc, để bắn lại đúng kiểu dữ liệu (number/boolean/string) qua onChange.
	const keyToValue = new Map<string, MySelectValue | null>(options.map((opt) => [toKey(opt.value), opt.value]));
	// antd Select bắn onChange(value, option) — giữ tham số 2 này để chỗ nào đang đọc option chọn không bị vỡ.
	const keyToOption = new Map<string, MySelectOption>(options.map((opt) => [toKey(opt.value), opt]));

	if (!isMultiple && !showSearch) {
		const currentKey = value !== undefined && value !== null ? toKey(value as MySelectValue) : undefined;
		const hasValue = currentKey !== undefined;

		const selectField = (
			<VinSelect
				value={currentKey}
				onValueChange={(key) => onChange?.(keyToValue.get(key) ?? null, keyToOption.get(key))}
				disabled={isDisabled}
			>
				<SelectTrigger
					size={fieldSize}
					className={classNames('w-full', className, allowClear && hasValue && 'pr-9')}
					style={allowClear ? undefined : style}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position={options.length ? undefined : 'popper'}>
					{options.length ? (
						options.map((opt) => (
							<SelectItem key={opt.key ?? toKey(opt.value)} value={toKey(opt.value)} disabled={opt.disabled}>
								{opt.label}
							</SelectItem>
						))
					) : (
						<SelectItem value='__empty__' disabled>
							{notFoundContent ?? 'Không có dữ liệu'}
						</SelectItem>
					)}
				</SelectContent>
			</VinSelect>
		);

		// radix Select không có sẵn nút xóa trong trigger — allowClear=true thì đè thêm 1 icon X tuyệt
		// đối lên trên trigger gốc thay vì đổi hẳn sang SelectPopover (giữ đúng UX "không search" của antd).
		if (!allowClear) return selectField;
		return (
			<div className='relative inline-block w-full' style={style}>
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

	const getFilterValue = (opt: MySelectOption): string => {
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
		? ((value as MySelectValue[]) ?? []).map((v) => toKey(v))
		: value !== undefined && value !== null
			? [toKey(value as MySelectValue)]
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
						keys.map((k) => keyToOption.get(k)).filter(Boolean) as MySelectOption[],
					);
				}}
				searchPlaceholder={placeholder}
				emptyLabel={notFoundContent}
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
				const nextKey = selectedKeys[0] === key ? null : key;
				onChange?.(nextKey === null ? null : (keyToValue.get(nextKey) ?? null), nextKey ? keyToOption.get(nextKey) : undefined);
			}}
			searchPlaceholder={placeholder}
			emptyLabel={notFoundContent}
		>
			{trigger}
		</SelectSearchPopover>
	);
};

export default Select;
