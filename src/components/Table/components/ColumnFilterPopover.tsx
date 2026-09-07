import { IconFilter, IconMagnifyingglass, Popover, PopoverContent, PopoverTrigger, SearchInput, SelectPopover } from '@/components/Icons';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import { EOperatorType } from '../constant';
import '../style.less';
import type { IColumn, TFilter } from '../typing';

export interface ColumnFilterPopoverProps {
	column: IColumn<any>;
	getFilterColumn: (dataIndex: any, operator?: EOperatorType, active?: boolean) => TFilter<any> | undefined;
	onSearch: (dataIndex: any, value: string) => void;
	onFilter: (dataIndex: any, values: string[]) => void;
}

const StringFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onSearch }) => {
	const intl = useIntl();
	const [open, setOpen] = useState(false);
	const filterColumn = getFilterColumn(column.dataIndex, EOperatorType.CONTAIN, true);
	const currentValue = (filterColumn?.values?.[0] as string | undefined) ?? '';
	const [draft, setDraft] = useState(currentValue);

	useEffect(() => {
		if (open) setDraft(currentValue);
	}, [open, currentValue]);

	const submit = (value: string) => {
		onSearch(column.dataIndex, value);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button type='button' className='column-filter-trigger-button' onClick={(e) => e.stopPropagation()}>
					<IconMagnifyingglass className={currentValue ? 'text-primary' : undefined} />
				</button>
			</PopoverTrigger>
			<PopoverContent align='start' style={{ width: 240, padding: 8 }} onClick={(e) => e.stopPropagation()}>
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
					onKeyDown={(e) => {
						if (e.key === 'Enter') submit(draft);
					}}
					onClear={() => submit('')}
				/>
			</PopoverContent>
		</Popover>
	);
};

const SelectFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onFilter }) => {
	const filterColumn = getFilterColumn(column.dataIndex, EOperatorType.INCLUDE, true);
	const currentValues = ((filterColumn?.values ?? []) as (string | number)[]).map(String);

	const options = (column.filterData ?? []).map((item) =>
		typeof item === 'string' ? { value: item, label: item } : { value: String(item.value), label: item.label },
	);

	return (
		<SelectPopover
			mode='multiple'
			options={options}
			value={currentValues}
			onValueChange={(values) => onFilter(column.dataIndex, values)}
		>
			<button type='button' className='column-filter-trigger-button' onClick={(e) => e.stopPropagation()}>
				<IconFilter className={currentValues.length ? 'text-primary' : undefined} />
			</button>
		</SelectPopover>
	);
};

const CustomSelectFilterPopover: React.FC<ColumnFilterPopoverProps> = ({ column, getFilterColumn, onFilter }) => {
	const [open, setOpen] = useState(false);
	const filterColumn = getFilterColumn(column.dataIndex, EOperatorType.INCLUDE, true);
	const currentValues = filterColumn?.values ?? [];

	if (!column.filterCustomSelect) return null;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button type='button' className='column-filter-trigger-button' onClick={(e) => e.stopPropagation()}>
					<IconFilter className={currentValues.length ? 'text-primary' : undefined} />
				</button>
			</PopoverTrigger>
			<PopoverContent align='start' style={{ width: 300, padding: 8 }} onClick={(e) => e.stopPropagation()}>
				{React.cloneElement(column.filterCustomSelect, {
					value: currentValues,
					onChange: (value: any) => {
						onFilter(column.dataIndex, Array.isArray(value) ? value : value ? [value] : []);
						setOpen(false);
					},
					style: { width: '100%' },
				})}
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
