import {
	Drawer,
	DrawerContent,
	Icon6DotGridVertical,
	IconMagnifyingglass,
	IconPlus,
	IconRotateArrow,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SearchInput,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader as TableHeaderEl,
	TableRow,
	TableSelectionCell,
	TableSortButton,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/Icons';
import PageCard from '@/components/PageCard';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { primaryColor } from '@/services/base/constant';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AutoComplete, Empty, Spin } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';
import { ColumnFilterPopover } from './components/ColumnFilterPopover';
import { ColumnSettings } from './components/ColumnSettings';
import { ResizableTableHead } from './components/ResizableTableHead';
import { TableProvider, useTableContext } from './components/TableContext';
import { TablePagination } from './components/TablePagination';
import { EOperatorType } from './constant/constant';
import { useApplyColumnSettings } from './hooks/useApplyColumnSettings';
import type { TableSortDirection } from './hooks/useTableColumns';
import ModalExpandable from './ModalExpandable';
import './style.less';
import type { IColumn, TableStaticProps, TFilter } from './typing';
import { updateSearchStorage } from './utils';

const alignStyle = (align?: string): React.CSSProperties | undefined =>
	align ? { textAlign: align as React.CSSProperties['textAlign'] } : undefined;

const isColumnLocked = (col: FlatColumn): boolean =>
	col.fixed === 'left' ||
	col.fixed === 'right' ||
	col.key === 'index' ||
	(col.dataIndex as string) === 'index' ||
	col.resizable !== false;

const getValueByDataIndex = (record: any, dataIndex: any) => (dataIndex ? _.get(record, dataIndex) : undefined);

const SortableTableRow: React.FC<{ id: string | number; children: React.ReactNode }> = ({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		cursor: 'grab',
		...(isDragging ? { background: '#fafafa' } : {}),
	};
	return (
		<TableRow ref={setNodeRef as any} style={style} {...attributes} {...listeners}>
			{children}
		</TableRow>
	);
};

type FlatColumn = IColumn<any> & { _sortDirection?: TableSortDirection; _hasFilter?: boolean; _isSortHandle?: boolean };

const TableStaticContent: React.FC<TableStaticProps> = (props) => {
	const intl = useIntl();
	const {
		Form,
		showEdit,
		setShowEdit,
		addStt,
		children,
		hasCreate,
		createDisabled,
		hasTotal,
		rowSortable,
		globalSearch = true,
	} = props;
	const {
		columnSettings,
		setColumnSettings,
		columnsWidth,
		setColumnsWidth,
		size,
		columnSetting = true,
	} = useTableContext();

	const { danhSach: dsPhanVung } = useModel('core.phanvungdulieu');
	const [globalSearchText, setGlobalSearchText] = useState<string>('');
	const [globalOptions, setGlobalOptions] = useState<{ value: string; label?: string }[]>([]);
	const [sort, setSort] = useState<{ [key: string]: 1 | -1 }>({});
	const [columnFilters, setColumnFilters] = useState<Record<string, { type: 'string' | 'select'; value: any }>>({});
	const [selectedIds, setSelectedIds] = useState<(string | number)[]>(props.selectedIds ?? []);

	useEffect(() => {
		if (props.selectedIds !== undefined) {
			setSelectedIds(props.selectedIds);
		}
	}, [props.selectedIds]);

	const searchInputRef = useRef<any>(null);
	const isResizingRef = useRef<boolean>(false);

	// dnd-kit sensors
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const globalDataIndex = useMemo(() => `TABLE_STATIC_GLOBAL_SEARCH_${window.location.pathname}`, []);

	const globalSearchColumns = useMemo(() => {
		const flattenColumns = (props.columns || [])
			.map((item: IColumn<any>) => (item.children?.length ? [item, ...item.children] : [item]))
			.flat();

		return flattenColumns.filter((item: IColumn<any>) => {
			const isDefaultSearchable = item?.filterType === 'string';
			const enableGlobalSearch = item?.enableGlobalSearch ?? isDefaultSearchable;
			return enableGlobalSearch && item?.dataIndex && item.dataIndex !== 'index' && item?.hide !== true;
		});
	}, [props.columns]);

	useEffect(() => {
		const history = JSON.parse(localStorage.getItem('dataTimKiem') || '{}')?.[globalDataIndex] || [];
		setGlobalOptions(history.map((val: string) => ({ value: val, label: val })));
	}, [globalDataIndex]);

	const globalSearchPlaceholder = useMemo(() => {
		const labels = globalSearchColumns
			.map((item: IColumn<any>) => {
				if (typeof item.title === 'string' || typeof item.title === 'number') return `${item.title}`;
				if (Array.isArray(item.dataIndex)) return item.dataIndex.join('.');
				return item.dataIndex ? String(item.dataIndex) : '';
			})
			.filter(Boolean)
			.slice(0, 3)
			.join(', ');

		if (!labels) return intl.formatMessage({ id: 'global.table.index.search.placeholder.default' });

		return intl.formatMessage({ id: 'global.table.index.search.placeholder' }, { fields: labels });
	}, [intl, globalSearchColumns]);

	const globalSearchTooltip = useMemo(() => {
		const labels = globalSearchColumns
			.map((item: IColumn<any>) => {
				if (typeof item.title === 'string' || typeof item.title === 'number') return `${item.title}`;
				if (Array.isArray(item.dataIndex)) return item.dataIndex.join('.');
				return item.dataIndex ? String(item.dataIndex) : '';
			})
			.filter(Boolean)
			.slice(0, 5)
			.join(', ');

		if (!labels) return intl.formatMessage({ id: 'global.table.index.search.tooltip.default' });

		return intl.formatMessage({ id: 'global.table.index.search.tooltip' }, { fields: labels });
	}, [intl, globalSearchColumns]);

	const handleGlobalSearchTrigger = useCallback(
		(value: string) => {
			const keyword = value?.trim() || '';
			setGlobalSearchText(keyword);

			if (keyword) updateSearchStorage(globalDataIndex, keyword);

			const history = JSON.parse(localStorage.getItem('dataTimKiem') || '{}')?.[globalDataIndex] || [];
			setGlobalOptions(history.map((val: string) => ({ value: val, label: val })));

			setTimeout(() => {
				searchInputRef.current?.blur();
			}, 0);
		},
		[globalDataIndex],
	);

	// Sorter click handler
	const handleSortClick = useCallback((col: FlatColumn) => {
		const fieldKey = Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string);
		if (!fieldKey) return;
		setSort((prev) => {
			const current = prev[fieldKey];
			if (!current) return { [fieldKey]: 1 };
			if (current === 1) return { [fieldKey]: -1 };
			return {};
		});
	}, []);

	// Column filter handlers
	const handleColumnSearch = useCallback((dataIndex: any, value: string) => {
		const key = Array.isArray(dataIndex) ? dataIndex.join('.') : String(dataIndex);
		setColumnFilters((prev) => {
			const next = { ...prev };
			if (!value) delete next[key];
			else next[key] = { type: 'string', value };
			return next;
		});
	}, []);

	const handleColumnFilter = useCallback((dataIndex: any, values: string[]) => {
		const key = Array.isArray(dataIndex) ? dataIndex.join('.') : String(dataIndex);
		setColumnFilters((prev) => {
			const next = { ...prev };
			if (!values || values.length === 0) delete next[key];
			else next[key] = { type: 'select', value: values };
			return next;
		});
	}, []);

	const getFilterColumn = useCallback(
		(dataIndex: any, operator?: EOperatorType, active?: boolean): TFilter<any> | undefined => {
			const key = Array.isArray(dataIndex) ? dataIndex.join('.') : String(dataIndex);
			const filter = columnFilters[key];
			if (!filter) return undefined;
			return {
				field: key,
				operator: filter.type === 'string' ? EOperatorType.CONTAIN : EOperatorType.INCLUDE,
				values: filter.type === 'string' ? [filter.value] : filter.value,
				active: true,
			} as any;
		},
		[columnFilters],
	);

	// Base columns processing with useApplyColumnSettings
	const { processedColumns } = useApplyColumnSettings({
		columns: props.columns || [],
		columnSettings,
		columnsWidth,
		setColumnsWidth,
		setColumnSettings,
	});

	// Build actualColumns with STT & drag handle
	const actualColumns: FlatColumn[] = useMemo(() => {
		const cols: FlatColumn[] = processedColumns.map((item: IColumn<any>) => {
			const fieldKey = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : (item.dataIndex as string);
			const sortDir = fieldKey && sort[fieldKey] ? (sort[fieldKey] === 1 ? 'asc' : 'desc') : false;
			const hasFilter =
				item.filterType === 'string' || item.filterType === 'select' || item.filterType === 'customselect';

			return {
				...item,
				_sortDirection: sortDir,
				_hasFilter: hasFilter,
				children: item.children?.map((child: IColumn<any>) => {
					const childKey = Array.isArray(child.dataIndex) ? child.dataIndex.join('.') : (child.dataIndex as string);
					const childSortDir = childKey && sort[childKey] ? (sort[childKey] === 1 ? 'asc' : 'desc') : false;
					const childHasFilter =
						child.filterType === 'string' || child.filterType === 'select' || child.filterType === 'customselect';
					return {
						...child,
						_sortDirection: childSortDir,
						_hasFilter: childHasFilter,
					};
				}),
			};
		});

		if (addStt) {
			cols.unshift({
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'index',
				align: 'center',
				width: 60,
				resizable: false,
				render: (val: string, rec: any) => {
					const phanVungHienTai = dsPhanVung?.find((item: any) => item?.ma === rec?.dataPartitionCode);
					const maMau = phanVungHienTai?.maMau ?? 'var(--color-primary)';

					return (
						<div className='ttCellWrapper'>
							<span>{val}</span>

							{phanVungHienTai?._id && (
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className='cornerTriangle'
											style={{ backgroundColor: maMau, top: size === 'small' ? -4 : -8 }}
										/>
									</TooltipTrigger>
									<TooltipContent>{phanVungHienTai?.name}</TooltipContent>
								</Tooltip>
							)}
						</div>
					);
				},
			} as any);
		}

		if (rowSortable && !cols.find((c: any) => c._isSortHandle)) {
			cols.unshift({
				width: 30,
				key: 'sort-handle',
				align: 'center',
				fixed: 'left',
				_isSortHandle: true,
				render: () => <Icon6DotGridVertical style={{ cursor: 'grab', color: '#999' }} />,
			} as any);
		}

		return cols;
	}, [processedColumns, sort, addStt, rowSortable, dsPhanVung, size, intl]);

	const hasGroupedColumns = actualColumns.some((c) => c.children?.length);
	const leafColumns: FlatColumn[] = useMemo(
		() => actualColumns.flatMap((c) => (c.children?.length ? (c.children as FlatColumn[]) : [c])),
		[actualColumns],
	);

	const effectiveRowSelection = props.rowSelection ?? !!props.otherProps?.rowSelection;

	const pinnedWidth = useMemo(
		() =>
			(effectiveRowSelection ? 56 : 0) +
			leafColumns.filter(isColumnLocked).reduce((sum, c) => sum + (c.width ?? 80), 0),
		[leafColumns, effectiveRowSelection],
	);
	const flexibleWidth = useMemo(
		() => leafColumns.filter((c) => !isColumnLocked(c)).reduce((sum, c) => sum + (c.width ?? 80), 0),
		[leafColumns],
	);
	const totalWidth = _.sum(leafColumns.map((item) => item.width ?? 80)) + (effectiveRowSelection ? 56 : 0);

	// Filter and Sort tableData in memory
	const tableData = useMemo(() => {
		let result = (props?.data ?? []).map((item: any, index: number) => ({
			...item,
			key: item?._id ?? String(index),
			index: index + 1,
			children:
				!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
					? item.children
					: undefined,
		}));

		// 1. Column filters
		Object.entries(columnFilters).forEach(([key, filter]) => {
			if (filter.type === 'string' && filter.value) {
				const kw = String(filter.value).trim().toLowerCase();
				result = result.filter((item) => {
					const val = getValueByDataIndex(item, key);
					return val?.toString()?.toLowerCase()?.includes(kw);
				});
			} else if (filter.type === 'select' && Array.isArray(filter.value) && filter.value.length > 0) {
				result = result.filter((item) => {
					const val = getValueByDataIndex(item, key);
					return filter.value.includes(String(val));
				});
			}
		});

		// 2. Global search
		const keyword = globalSearchText.trim().toLowerCase();
		if (globalSearch && keyword) {
			result = result.filter((record: any) =>
				globalSearchColumns.some((col: IColumn<any>) => {
					const value = getValueByDataIndex(record, col.dataIndex);
					return value?.toString()?.toLowerCase()?.includes(keyword);
				}),
			);
		}

		// 3. Sorting
		const sortKey = Object.keys(sort)[0];
		const sortOrder = sortKey ? sort[sortKey] : 0;
		if (sortKey && sortOrder !== 0) {
			const targetCol = (props.columns || []).find((c) =>
				Array.isArray(c.dataIndex) ? c.dataIndex.join('.') === sortKey : c.dataIndex === sortKey,
			);
			result.sort((a, b) => {
				const aVal = getValueByDataIndex(a, sortKey);
				const bVal = getValueByDataIndex(b, sortKey);
				if (targetCol?.customSort) {
					return targetCol.customSort(aVal, bVal) * sortOrder;
				}
				if (aVal === bVal) return 0;
				if (aVal === undefined || aVal === null) return 1;
				if (bVal === undefined || bVal === null) return -1;
				if (typeof aVal === 'string' && typeof bVal === 'string') {
					return aVal.localeCompare(bVal, 'vi', { numeric: true }) * sortOrder;
				}
				return aVal > bVal ? sortOrder : -sortOrder;
			});
		}

		return result;
	}, [
		props.data,
		props.hideChildrenRows,
		props.columns,
		columnFilters,
		globalSearch,
		globalSearchText,
		globalSearchColumns,
		sort,
	]);

	// Pagination
	const isPaginationEnabled = props.otherProps?.pagination !== false;
	const initialPageSize =
		typeof props.otherProps?.pagination === 'object' && props.otherProps?.pagination?.pageSize
			? props.otherProps.pagination.pageSize
			: 10;
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [currentLimit, setCurrentLimit] = useState<number>(initialPageSize);

	const pagedData = useMemo(() => {
		const base = isPaginationEnabled
			? tableData.slice((currentPage - 1) * currentLimit, currentPage * currentLimit)
			: tableData;
		const offset = isPaginationEnabled ? (currentPage - 1) * currentLimit : 0;
		return base.map((item: any, idx: number) => ({
			...item,
			index: offset + idx + 1,
		}));
	}, [tableData, currentPage, currentLimit, isPaginationEnabled]);

	useEffect(() => {
		if (currentPage > 1 && (currentPage - 1) * currentLimit >= tableData.length) {
			setCurrentPage(1);
		}
	}, [tableData.length, currentPage, currentLimit]);

	// Row Selection
	const currentPageKeys = useMemo(() => pagedData.map((r: any) => r.key), [pagedData]);
	const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
	const selectedOnPageCount = currentPageKeys.filter((k) => selectedSet.has(k)).length;
	const allCurrentSelected = currentPageKeys.length > 0 && selectedOnPageCount === currentPageKeys.length;
	const someCurrentSelected = selectedOnPageCount > 0 && !allCurrentSelected;

	const triggerSelectChange = (arr: (string | number)[], type: 'all' | 'multiple' | 'single' = 'multiple') => {
		setSelectedIds(arr);
		props.onSelectChange?.(arr);
		if (typeof props.otherProps?.rowSelection === 'object') {
			const selectedRows = tableData.filter((item) => arr.includes(item.key));
			props.otherProps.rowSelection.onChange?.(arr, selectedRows, { type });
		}
	};

	const toggleSelectAll = (checked: boolean) => {
		const next = new Set(selectedIds);
		currentPageKeys.forEach((k) => (checked ? next.add(k) : next.delete(k)));
		triggerSelectChange(Array.from(next), 'all');
	};

	const toggleSelectRow = (key: string | number, checked: boolean) => {
		const next = new Set(selectedIds);
		if (checked) next.add(key);
		else next.delete(key);
		triggerSelectChange(Array.from(next), 'single');
	};

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = tableData.findIndex((i: any) => i.key === active.id);
			const newIndex = tableData.findIndex((i: any) => i.key === over.id);
			if (props.onSortEnd) props.onSortEnd(tableData[oldIndex], newIndex);
		}
	};

	const renderColumnLabel = (col: FlatColumn) => {
		const isEnd = col.align === 'right';
		const titleNode = <span className='table-header-cell-title'>{col.title as any}</span>;

		return (
			<div className={isEnd ? 'table-header-cell-label align-end' : 'table-header-cell-label'}>
				{col.sortable ? (
					<TableSortButton
						direction={col._sortDirection ?? false}
						align={isEnd ? 'end' : 'start'}
						onClick={() => handleSortClick(col)}
						style={{ minWidth: 0 }}
					>
						{titleNode}
					</TableSortButton>
				) : (
					titleNode
				)}
				{col._hasFilter ? (
					<span className='table-header-cell-filter'>
						<ColumnFilterPopover
							column={col}
							getFilterColumn={getFilterColumn}
							onSearch={handleColumnSearch}
							onFilter={handleColumnFilter}
						/>
					</span>
				) : null}
			</div>
		);
	};

	const getColKey = useCallback((col: FlatColumn, fallbackIndex: number): string | number => {
		if (col.key !== undefined && col.key !== null) return String(col.key);
		if (col.dataIndex !== undefined && col.dataIndex !== null) {
			return Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : String(col.dataIndex);
		}
		return fallbackIndex;
	}, []);

	const { leftPinnedOffsets, rightPinnedOffsets } = useMemo(() => {
		const leftOffsets: Record<string | number, number> = {};
		const rightOffsets: Record<string | number, number> = {};

		let currentLeft = effectiveRowSelection ? 56 : 0;
		leafColumns.forEach((col, idx) => {
			if (col.fixed === 'left') {
				const key = getColKey(col, idx);
				leftOffsets[key] = currentLeft;
				currentLeft += col.width ?? 80;
			}
		});

		let currentRight = 0;
		for (let i = leafColumns.length - 1; i >= 0; i--) {
			const col = leafColumns[i];
			if (col.fixed === 'right') {
				const key = getColKey(col, i);
				rightOffsets[key] = currentRight;
				currentRight += col.width ?? 80;
			}
		}

		return { leftPinnedOffsets: leftOffsets, rightPinnedOffsets: rightOffsets };
	}, [leafColumns, effectiveRowSelection, getColKey]);

	const renderHeadCell = (col: FlatColumn, extraProps?: Record<string, any>) => {
		const resizeProps = (col as any).onHeaderCell?.(col) ?? {};
		const colWidthPx = col.width ?? 80;
		const locked = isColumnLocked(col);
		const colKey = getColKey(col, 0);

		const isPinnedLeft = col.fixed === 'left';
		const isPinnedRight = col.fixed === 'right';

		const pinnedHeadStyle: React.CSSProperties = isPinnedLeft
			? {
				position: 'sticky',
				left: leftPinnedOffsets[colKey] ?? 0,
				zIndex: 20,
				backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
			}
			: isPinnedRight
				? {
					position: 'sticky',
					right: rightPinnedOffsets[colKey] ?? 0,
					zIndex: 20,
					backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
				}
				: {};

		const headProps = locked
			? {
				width: colWidthPx,
				...resizeProps,
				resizable: !isPinnedLeft && !isPinnedRight && col.resizable !== false,
			}
			: {
				...resizeProps,
				width: flexibleWidth > 0 ? `calc((100% - ${pinnedWidth}px) * ${colWidthPx} / ${flexibleWidth})` : colWidthPx,
				minWidth: colWidthPx,
				resizable: false,
			};

		return (
			<ResizableTableHead
				key={colKey}
				truncate={false}
				style={{
					...alignStyle(col.align as any),
					...pinnedHeadStyle,
				}}
				className={classNames({
					'table-cell-pinned-left': isPinnedLeft,
					'table-cell-pinned-right': isPinnedRight,
				})}
				{...headProps}
				onResizeStart={() => {
					isResizingRef.current = true;
					document.body.style.userSelect = 'none';
				}}
				onResizeStop={() => {
					isResizingRef.current = false;
					document.body.style.userSelect = '';
				}}
				{...extraProps}
			>
				{renderColumnLabel(col)}
			</ResizableTableHead>
		);
	};

	const renderTable = () => (
		<Table style={{ width: `max(${props.scroll?.x ?? totalWidth}px, 100%)`, tableLayout: 'fixed' }} density='compact'>
			<colgroup>
				{effectiveRowSelection && <col style={{ width: 56, minWidth: 56 }} />}
				{leafColumns.map((col, idx) => {
					const locked = isColumnLocked(col);
					const colWidthPx = col.width ?? 80;
					const widthStyle = locked
						? { width: colWidthPx, minWidth: colWidthPx }
						: {
							width:
								flexibleWidth > 0
									? `calc((100% - ${pinnedWidth}px) * ${colWidthPx} / ${flexibleWidth})`
									: colWidthPx,
							minWidth: colWidthPx,
						};
					return <col key={getColKey(col, idx)} style={widthStyle} />;
				})}
			</colgroup>

			<TableHeaderEl>
				{hasGroupedColumns ? (
					<>
						<TableRow>
							{effectiveRowSelection && (
								<TableSelectionCell
									rowSpan={2}
									pinned='left'
									checked={allCurrentSelected}
									indeterminate={someCurrentSelected}
									onCheckedChange={toggleSelectAll}
									label={intl.formatMessage({ id: 'global.table.index.chontatca', defaultMessage: 'Chọn tất cả' })}
								/>
							)}
							{actualColumns.map((col, colIdx) =>
								col.children?.length ? (
									<TableHead
										key={(col.key as any) ?? colIdx}
										colSpan={col.children.length}
										style={{
											...alignStyle(col.align as any),
											...(col.fixed === 'right'
												? {
													position: 'sticky',
													right:
														rightPinnedOffsets[
														getColKey(col.children[col.children.length - 1] as FlatColumn, colIdx)
														] ?? 0,
													zIndex: 21,
													backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
												}
												: col.fixed === 'left'
													? {
														position: 'sticky',
														left: leftPinnedOffsets[getColKey(col.children[0] as FlatColumn, colIdx)] ?? 0,
														zIndex: 21,
														backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
													}
													: {}),
										}}
									>
										{col.title as any}
									</TableHead>
								) : (
									renderHeadCell(col, { rowSpan: 2 })
								),
							)}
						</TableRow>
						<TableRow>
							{actualColumns.flatMap((col) =>
								col.children?.length ? col.children.map((child) => renderHeadCell(child as FlatColumn)) : [],
							)}
						</TableRow>
					</>
				) : (
					<TableRow>
						{effectiveRowSelection && (
							<TableSelectionCell
								pinned='left'
								checked={allCurrentSelected}
								indeterminate={someCurrentSelected}
								onCheckedChange={toggleSelectAll}
								label={intl.formatMessage({ id: 'global.table.index.chontatca', defaultMessage: 'Chọn tất cả' })}
							/>
						)}
						{actualColumns.map((col) => renderHeadCell(col))}
					</TableRow>
				)}
			</TableHeaderEl>

			<TableBody>
				{props.loading ? (
					<TableRow>
						<TableCell
							colSpan={leafColumns.length + (effectiveRowSelection ? 1 : 0)}
							style={{ textAlign: 'center', padding: 32 }}
						>
							<Spin />
						</TableCell>
					</TableRow>
				) : tableData.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={leafColumns.length + (effectiveRowSelection ? 1 : 0)}
							style={{ textAlign: 'center', padding: 32 }}
						>
							<Empty
								style={{ marginTop: 32, marginBottom: 32 }}
								description={props.emptyText ?? intl.formatMessage({ id: 'global.table.index.empty' })}
								image={size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined}
							/>
						</TableCell>
					</TableRow>
				) : (
					pagedData.map((record: any, index: number) => {
						const rowProps = props.otherProps?.onRow ? props.otherProps.onRow(record, index) : undefined;
						const rowContent = (
							<>
								{effectiveRowSelection && (
									<TableSelectionCell
										pinned='left'
										checked={selectedSet.has(record.key)}
										onCheckedChange={(checked) => toggleSelectRow(record.key, checked)}
										label={intl.formatMessage(
											{ id: 'global.table.index.chondong', defaultMessage: 'Chọn dòng {index}' },
											{ index: index + 1 },
										)}
									/>
								)}
								{leafColumns.map((col: any, colIndex: number) => {
									const cellProps = col.onCell ? col.onCell(record, index) : undefined;
									if (cellProps?.colSpan === 0 || cellProps?.rowSpan === 0) {
										return null;
									}

									const colKey = getColKey(col, colIndex);
									const isSpanning = (cellProps?.colSpan ?? 1) > 1;
									const isPinnedLeft = !isSpanning && col.fixed === 'left';
									const isPinnedRight = !isSpanning && col.fixed === 'right';

									const pinnedStyle: React.CSSProperties = isPinnedLeft
										? {
											position: 'sticky',
											left: leftPinnedOffsets[colKey] ?? 0,
											zIndex: 2,
											backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
										}
										: isPinnedRight
											? {
												position: 'sticky',
												right: rightPinnedOffsets[colKey] ?? 0,
												zIndex: 2,
												backgroundColor: 'var(--color-bg-container, var(--ds-bg-mortared, #ffffff))',
											}
											: {};

									const cellStyle: React.CSSProperties = {
										...alignStyle(col.align as any),
										...pinnedStyle,
										...cellProps?.style,
									};

									return (
										<TableCell
											key={colKey}
											colSpan={cellProps?.colSpan}
											rowSpan={cellProps?.rowSpan}
											style={cellStyle}
											className={classNames(cellProps?.className, {
												'table-cell-pinned-left': isPinnedLeft,
												'table-cell-pinned-right': isPinnedRight,
											})}
											onClick={cellProps?.onClick}
											truncate={false}
										>
											{col.render
												? col.render(col.dataIndex ? getValueByDataIndex(record, col.dataIndex) : record, record, index)
												: col.dataIndex
													? getValueByDataIndex(record, col.dataIndex)
													: null}
										</TableCell>
									);
								})}
							</>
						);

						return rowSortable ? (
							<SortableTableRow key={record.key} id={record.key}>
								{rowContent}
							</SortableTableRow>
						) : (
							<TableRow key={record.key} {...rowProps} style={{ ...rowProps?.style }}>
								{rowContent}
							</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);

	const isMobile = useMediaQuery({ maxWidth: 767 });
	const isMinimize = size === 'small' || isMobile;
	const canShowGlobalSearch = globalSearch && globalSearchColumns.length > 0;

	const renderGlobalSearch = (minimized: boolean) => (
		<AutoComplete
			className='global-search-wrapper no-print'
			options={globalOptions}
			value={globalSearchText}
			size={size}
			onSelect={handleGlobalSearchTrigger}
			onChange={(val) => setGlobalSearchText(val)}
		>
			<SearchInput
				ref={searchInputRef}
				variant='tiled'
				className='global-search'
				size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium'}
				clearable
				value={globalSearchText}
				placeholder={globalSearchPlaceholder}
				autoFocus={minimized}
				title={globalSearchTooltip}
				style={
					minimized
						? { width: 250 }
						: globalSearchText
							? { borderColor: primaryColor, outline: '1px solid ' + primaryColor, borderRadius: 4 }
							: undefined
				}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleGlobalSearchTrigger((e.target as HTMLInputElement).value);
				}}
				onClear={() => {
					setGlobalSearchText('');
					handleGlobalSearchTrigger('');
				}}
				onChange={(e) => {
					setGlobalSearchText(e.target.value);
				}}
			/>
		</AutoComplete>
	);

	const tableContainerStyle: React.CSSProperties = useMemo(() => {
		const s: any = {};
		if (props.scroll?.y) {
			s['--table-scroll-max-height'] = typeof props.scroll.y === 'number' ? `${props.scroll.y}px` : props.scroll.y;
		}
		return s;
	}, [props.scroll?.y]);

	const mainContent = (
		<div className='table-base' style={tableContainerStyle}>
			<div className='header'>
				{children}
				<div className='action no-print'>
					{hasCreate && (
						<ButtonExtend
							onClick={() => {
								if (setShowEdit) setShowEdit(true);
							}}
							icon={<IconPlus />}
							className='btn-add'
							type='primary'
							disabled={createDisabled}
							size={size}
							tooltip={intl.formatMessage({ id: 'global.tablestatic.button.themmoi.tooltip' })}
						>
							{intl.formatMessage({ id: 'global.tablestatic.button.themmoi' })}
						</ButtonExtend>
					)}
					{props.otherButtons}

					{!!props.onReload ? (
						<ButtonExtend
							size={size}
							icon={<IconRotateArrow />}
							onClick={() => (props.onReload ? props.onReload() : null)}
							loading={props.loading}
							className='btn-reload'
							tooltip={intl.formatMessage({ id: 'global.tablestatic.button.tailai.tooltip' })}
						>
							{intl.formatMessage({ id: 'global.tablestatic.button.tailai' })}
						</ButtonExtend>
					) : null}

					{props.otherTextButtons}
				</div>

				<div className='extra no-print'>
					{columnSetting && <ColumnSettings />}

					{canShowGlobalSearch ? (
						isMinimize ? (
							<Popover>
								<PopoverTrigger asChild>
									<ButtonExtend
										className='btn-minimize-search no-print'
										size={size}
										tooltip={globalSearchTooltip}
										icon={<IconMagnifyingglass />}
										style={globalSearchText ? { borderColor: primaryColor, color: primaryColor } : undefined}
									/>
								</PopoverTrigger>
								<PopoverContent align='end' style={{ padding: 8, width: 280 }}>
									{renderGlobalSearch(isMinimize)}
								</PopoverContent>
							</Popover>
						) : (
							renderGlobalSearch(isMinimize)
						)
					) : null}

					{hasTotal ? (
						<Tooltip>
							<TooltipTrigger asChild>
								{props.totalComponent || (
									<div className={classNames({ total: true, small: size === 'small' })}>
										{intl.formatMessage({ id: 'global.tablestatic.button.tongso' })}:
										<span>{tableData?.length ?? props.data?.length ?? 0}</span>
									</div>
								)}
							</TooltipTrigger>
							<TooltipContent>{intl.formatMessage({ id: 'global.tablestatic.button.tongso.tooltip' })}</TooltipContent>
						</Tooltip>
					) : null}

					{props.otherExtra}
				</div>
			</div>

			{rowSortable ? (
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={pagedData.map((item: any) => item.key)} strategy={verticalListSortingStrategy}>
						{renderTable()}
					</SortableContext>
				</DndContext>
			) : (
				renderTable()
			)}

			{isPaginationEnabled && (
				<TablePagination
					page={currentPage}
					limit={currentLimit}
					total={tableData.length}
					onPageChange={(nextPage) => {
						setCurrentPage(nextPage);
						if (typeof props.otherProps?.pagination === 'object') {
							props.otherProps.pagination.onChange?.(nextPage, currentLimit);
						}
					}}
					onLimitChange={(nextLimit) => {
						setCurrentLimit(nextLimit);
						setCurrentPage(1);
						if (typeof props.otherProps?.pagination === 'object') {
							props.otherProps.pagination.onShowSizeChange?.(1, nextLimit);
						}
					}}
				/>
			)}
		</div>
	);

	return (
		<>
			{props.title === undefined ? (
				mainContent
			) : (
				<PageCard
					level={props.cardProps?.level}
					showIndicator={props.cardProps?.showIndicator}
					title={props.title || false}
					extra={props.cardExtra}
					bordered={props.border ?? props.bordered}
				>
					{mainContent}
				</PageCard>
			)}

			{Form && (
				<>
					{props?.formType === 'Drawer' ? (
						<Drawer
							direction='right'
							open={showEdit}
							onOpenChange={(open) => {
								if (!open && setShowEdit) setShowEdit(false);
							}}
						>
							<DrawerContent
								style={{
									width:
										typeof props?.widthDrawer === 'number'
											? `${props.widthDrawer}px`
											: props?.widthDrawer === 'full'
												? '100vw'
												: '520px',
									maxWidth: '100vw',
								}}
							>
								<Form
									onCancel={() => {
										if (setShowEdit) setShowEdit(false);
									}}
									{...props.formProps}
								/>
							</DrawerContent>
						</Drawer>
					) : (
						<ModalExpandable
							width={props?.widthDrawer}
							onCancel={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							styles={{ body: { padding: 0 } }}
							open={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</ModalExpandable>
					)}
				</>
			)}
		</>
	);
};

const TableStaticData: React.FC<TableStaticProps> = (props) => {
	return (
		<TableProvider
			value={{
				configKey: props.configKey,
				title: props.title,
				size: props.size ?? props.otherProps?.size,
				columns: props.columns,
				columnSetting: props.columnSetting,
			}}
		>
			<TableStaticContent {...props} />
		</TableProvider>
	);
};

export default TableStaticData;
