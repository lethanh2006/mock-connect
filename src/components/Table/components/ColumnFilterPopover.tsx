import {
	Button,
	Checkbox,
	IconFilter,
	IconMagnifyingglass,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SearchInput,
} from '@/components/Icons';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import { EOperatorType } from '../constant';
import './style.less';
import '../style.less';
import type { IColumn, TFilter } from '../typing';

export interface ColumnFilterPopoverProps {
	column: IColumn<any>;
	getFilterColumn: (dataIndex: any, operator?: EOperatorType, active?: boolean) => TFilter<any> | undefined;
	onSearch: (dataIndex: any, value: string) => void;
	onFilter: (dataIndex: any, values: string[]) => void;
}

const FilterFooter: React.FC<{ onReset: () => void; onApply: () => void }> = ({ onReset, onApply }) => {
	const intl = useIntl();
	return (
		<div className='column-filter-footer'>
			<Button size='xs' variant='outline' className='column-filter-footer-btn' onClick={onReset}>
				{intl.formatMessage({ id: 'global.table.customfilter.button.xoa', defaultMessage: 'Bỏ lọc' })}
			</Button>
			<Button size='xs' variant='default' className='column-filter-footer-btn' onClick={onApply}>
				{intl.formatMessage({ id: 'global.table.columnSetting.apply', defaultMessage: 'Áp dụng' })}
			</Button>
		</div>
	);
};

const FilterTrigger: React.FC<{ active?: boolean; icon?: React.ReactNode }> = ({ active, icon }) => (
	<PopoverTrigger asChild>
		<button type='button' className='column-filter-trigger-button' onClick={(e) => e.stopPropagation()}>
			{icon || <IconFilter className={active ? 'text-primary' : undefined} />}
		</button>
	</PopoverTrigger>
);

const StringFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onSearch }) => {
	const intl = useIntl();
	const [open, setOpen] = useState(false);
	const currentValue = (getFilterColumn(column.dataIndex, EOperatorType.CONTAIN, true)?.values?.[0] as string) ?? '';
	const [draft, setDraft] = useState(currentValue);

	useEffect(() => {
		if (open) setDraft(currentValue);
	}, [open, currentValue]);

	const submit = (val: string) => {
		onSearch(column.dataIndex, val);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<FilterTrigger active={!!currentValue} icon={<IconMagnifyingglass className={currentValue ? 'text-primary' : undefined} />} />
			<PopoverContent align='start' className='column-filter-popover-content' onClick={(e) => e.stopPropagation()}>
				<SearchInput
					autoFocus
					clearable
					variant='tiled'
					placeholder={intl.formatMessage(
						{ id: 'global.table.index.search.placeholder.short' },
						{ field: column.title as any },
					)}
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && submit(draft)}
					onClear={() => setDraft('')}
				/>
				<FilterFooter onReset={() => { setDraft(''); submit(''); }} onApply={() => submit(draft)} />
			</PopoverContent>
		</Popover>
	);
};

const SelectFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onFilter }) => {
	const intl = useIntl();
	const [open, setOpen] = useState(false);
	const currentValues = useMemo(
		() => ((getFilterColumn(column.dataIndex, EOperatorType.INCLUDE, true)?.values ?? []) as any[]).map(String),
		[column.dataIndex, getFilterColumn],
	);
	const [draft, setDraft] = useState<string[]>(currentValues);
	const [kw, setKw] = useState('');

	const options = useMemo(
		() =>
			(column.filterData ?? []).map((i) =>
				typeof i === 'string' ? { value: i, label: i } : { value: String(i.value), label: i.label },
			),
		[column.filterData],
	);

	useEffect(() => {
		if (open) {
			setDraft(currentValues);
			setKw('');
		}
	}, [open, currentValues]);

	const filtered = useMemo(() => {
		const k = kw.trim().toLowerCase();
		return k ? options.filter((o) => o.label.toLowerCase().includes(k)) : options;
	}, [options, kw]);

	const toggle = (val: string) =>
		setDraft((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<FilterTrigger active={currentValues.length > 0} />
			<PopoverContent align='start' className='column-filter-popover-content' onClick={(e) => e.stopPropagation()}>
				{options.length > 5 && (
					<SearchInput
						autoFocus
						clearable
						variant='tiled'
						size='small'
						placeholder={intl.formatMessage({ id: 'global.table.customfilter.tim', defaultMessage: 'Tìm kiếm' })}
						value={kw}
						onChange={(e) => setKw(e.target.value)}
						onClear={() => setKw('')}
						className='column-filter-search-input'
					/>
				)}
				<div className='column-filter-options-list'>
					{filtered.length === 0 ? (
						<div className='column-filter-empty'>
							{intl.formatMessage({ id: 'global.table.index.empty', defaultMessage: 'Không có dữ liệu' })}
						</div>
					) : (
						filtered.map((opt) => (
							<div
								key={opt.value}
								onClick={() => toggle(opt.value)}
								className={`column-filter-option-item ${draft.includes(opt.value) ? 'is-checked' : ''}`}
							>
								<span className='column-filter-option-label' title={opt.label}>
									{opt.label}
								</span>
								<Checkbox
									size='sm'
									checked={draft.includes(opt.value)}
									onCheckedChange={() => toggle(opt.value)}
									onClick={(e) => e.stopPropagation()}
									className='column-filter-option-checkbox'
								/>
							</div>
						))
					)}
				</div>
				<FilterFooter
					onReset={() => { setDraft([]); onFilter(column.dataIndex, []); setOpen(false); }}
					onApply={() => { onFilter(column.dataIndex, draft); setOpen(false); }}
				/>
			</PopoverContent>
		</Popover>
	);
};

const CustomSelectFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onFilter }) => {
	const [open, setOpen] = useState(false);
	const values = getFilterColumn(column.dataIndex, EOperatorType.INCLUDE, true)?.values ?? [];
	const [draft, setDraft] = useState<any[]>(values);

	useEffect(() => {
		if (open) setDraft(values);
	}, [open, values]);

	if (!column.filterCustomSelect) return null;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<FilterTrigger active={values.length > 0} />
			<PopoverContent align='start' className='column-filter-popover-content custom-select' onClick={(e) => e.stopPropagation()}>
				{React.cloneElement(column.filterCustomSelect, {
					value: draft,
					onChange: (val: any) => setDraft(Array.isArray(val) ? val : val ? [val] : []),
					style: { width: '100%' },
				})}
				<FilterFooter
					onReset={() => { setDraft([]); onFilter(column.dataIndex, []); setOpen(false); }}
					onApply={() => { onFilter(column.dataIndex, draft); setOpen(false); }}
				/>
			</PopoverContent>
		</Popover>
	);
};

/** Thay thế `filterDropdown`/`filterIcon` built-in của antd Table cho header cell của vinuni `<Table>`. */
export const ColumnFilterPopover: React.FC<ColumnFilterPopoverProps> = (props) => {
	switch (props.column.filterType) {
		case 'string':
			return <StringFilterPopover {...props} />;
		case 'select':
			return <SelectFilterPopover {...props} />;
		case 'customselect':
			return <CustomSelectFilterPopover {...props} />;
		default:
			return null;
	}
};
