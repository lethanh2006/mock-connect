import PageCard from '@/components/PageCard';
import { useTableColumns } from '@/components/Table/hooks/useTableColumns';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Icon6DotGridVertical,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader as TableHeaderEl,
	TableRow,
	TableSelectionCell,
	TableSortButton,
} from '@/components/Icons';
import { Empty, Spin } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react';
import { useIntl, useModel } from 'umi';
import ModalExport from '../Export';
import ModalFilter from '../Filter/ModalFilter';
import type { TableSortDirection } from '../hooks/useTableColumns';
import ModalImport from '../Import';
import type { IColumn, TableBaseProps } from '../typing';
import { ColumnFilterPopover } from './ColumnFilterPopover';
import { ResizableTableHead } from './ResizableTableHead';
import { useTableContext } from './TableContext';
import { TableFormModal } from './TableFormModal';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';

type FlatColumn = IColumn<any> & { _sortDirection?: TableSortDirection; _hasFilter?: boolean; _isSortHandle?: boolean };

/** `TableHead`/`TableCell` của vinuni đặt cứng `text-align` qua class CSS (thắng thuộc tính HTML `align`), nên phải canh lề bằng style inline. */
const alignStyle = (align?: string): React.CSSProperties | undefined =>
	align ? { textAlign: align as React.CSSProperties['textAlign'] } : undefined;

/**
 * Cột pin (fixed) hoặc cho phép kéo giãn tay (resizable, mặc định true — xem
 * useApplyColumnSettings) phải giữ đúng width đã cấu hình để không phá tính năng
 * kéo giãn. Chỉ cột khai báo rõ `resizable: false` mới được co giãn theo tỷ lệ.
 */
const isColumnLocked = (col: FlatColumn): boolean =>
	col.fixed === 'left' || col.fixed === 'right' || col.key === 'index' || (col.dataIndex as string) === 'index' || col.resizable !== false;

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

export const TableBaseContent = (props: TableBaseProps) => {
	const intl = useIntl();
	const { modelName, dependencies = [], params, rowSortable, title } = props;
	const model = useModel(modelName) as any;
	const { page, limit, setPage, setLimit, condition, sort, setSort, setFilters, initFilter } = model;
	const { danhSach: dsPhanVung } = useModel('core.phanvungdulieu');
	const {
		visibleImport,
		setVisibleImport,
		visibleExport,
		setVisibleExport,
		selectedIds,
		loading,
		total,
		buttons,
		hasFilter,
		setSelectedIds,
		filters,
		disableFilterModal,
		externalConditions,
		getData,
	} = useTableContext();

	const filtersDependency = JSON.stringify(filters ?? []);
	const externalConditionsDependency = JSON.stringify(externalConditions ?? {});
	const previousFiltersDependencyRef = useRef(filtersDependency);

	const { handleFilter, handleSearch, getFilterColumn, finalColumns } = useTableColumns({
		columns: props.columns,
		sort,
		addStt: props.addStt,
		dsPhanVung,
	});

	const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
	const sensors = useSensors(sensor);
	const isResizingRef = useRef(false);

	const tableData: any[] = useMemo(
		() =>
			model?.[props.dataState || 'danhSach']?.map((item: any, index: number) => ({
				...item,
				index: index + 1 + (page - 1) * limit * (props.pageable === false ? 0 : 1),
				key: item?._id ?? index,
				children:
					!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
						? item.children
						: undefined,
			})) || [],
		[model?.[props.dataState || 'danhSach'], page, limit, props.pageable, props.hideChildrenRows],
	);

	useEffect(() => {
		// Block text selection during resize
		const handleSelectStart = (e: Event) => {
			if (isResizingRef.current) {
				e.preventDefault();
			}
		};

		document.addEventListener('selectstart', handleSelectStart, true);
		return () => document.removeEventListener('selectstart', handleSelectStart, true);
	}, []);

	useEffect(() => {
		const filtersChanged = previousFiltersDependencyRef.current !== filtersDependency;
		if (filtersChanged) {
			previousFiltersDependencyRef.current = filtersDependency;
			if (page !== 1) {
				setPage(1);
				return;
			}
		}

		getData?.(params);
	}, [...dependencies, page, limit, filtersDependency, externalConditionsDependency, condition, sort]);

	useEffect(() => {
		return () => {
			if (props.noCleanUp !== true) {
				setFilters?.(initFilter);
				setSelectedIds?.(undefined);
			}
		};
	}, []);

	const actualColumns: FlatColumn[] = useMemo(() => {
		const cols = [...finalColumns];
		if (rowSortable && !cols.find((c: any) => c._isSortHandle))
			cols.unshift({
				width: 30,
				key: 'sort-handle',
				align: 'center',
				fixed: 'left',
				_isSortHandle: true,
				render: () => <Icon6DotGridVertical style={{ cursor: 'grab', color: '#999' }} />,
			} as any);
		return cols;
	}, [finalColumns, rowSortable]);

	const hasGroupedColumns = actualColumns.some((c) => c.children?.length);
	const leafColumns: FlatColumn[] = useMemo(
		() => actualColumns.flatMap((c) => (c.children?.length ? (c.children as FlatColumn[]) : [c])),
		[actualColumns],
	);

	/**
	 * Cột pin/resizable giữ nguyên width cấu hình; các cột còn lại chia nhau phần
	 * không gian dư ra theo đúng tỷ lệ width đã khai báo (để bảng lấp đầy 100% mà
	 * không làm co giãn/xô lệch các cột pin).
	 */
	const pinnedWidth = useMemo(
		() =>
			(props?.rowSelection ? 56 : 0) +
			leafColumns.filter(isColumnLocked).reduce((sum, c) => sum + (c.width ?? 80), 0),
		[leafColumns, props?.rowSelection],
	);
	const flexibleWidth = useMemo(
		() => leafColumns.filter((c) => !isColumnLocked(c)).reduce((sum, c) => sum + (c.width ?? 80), 0),
		[leafColumns],
	);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = tableData.findIndex((i) => i.key === active.id);
			const newIndex = tableData.findIndex((i) => i.key === over.id);
			if (props.onSortEnd) props.onSortEnd(tableData[oldIndex], newIndex);
		}
	};

	//#region Chọn dòng (rowSelection)
	const currentPageKeys = useMemo(() => tableData.map((r) => r.key), [tableData]);
	const selectedSet = useMemo(() => new Set(selectedIds ?? []), [selectedIds]);
	const selectedOnPageCount = currentPageKeys.filter((k) => selectedSet.has(k)).length;
	const allCurrentSelected = currentPageKeys.length > 0 && selectedOnPageCount === currentPageKeys.length;
	const someCurrentSelected = selectedOnPageCount > 0 && !allCurrentSelected;

	const toggleSelectAll = (checked: boolean) => {
		const next = new Set(selectedIds ?? []);
		currentPageKeys.forEach((k) => (checked ? next.add(k) : next.delete(k)));
		setSelectedIds?.(Array.from(next));
	};

	const toggleSelectRow = (key: string | number, checked: boolean) => {
		const next = new Set(selectedIds ?? []);
		if (checked) next.add(key);
		else next.delete(key);
		setSelectedIds?.(Array.from(next));
	};
	//#endregion

	//#region Sắp xếp
	const handleSortClick = (col: FlatColumn) => {
		const fieldKey = Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string);
		if (!fieldKey) return;
		const direction = col._sortDirection ?? false;
		const next: TableSortDirection = direction === false ? 'asc' : direction === 'asc' ? 'desc' : false;
		if (next === false) setSort?.({});
		else setSort?.({ [fieldKey]: next === 'asc' ? 1 : -1 });
	};
	//#endregion

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
							onSearch={handleSearch}
							onFilter={handleFilter}
						/>
					</span>
				) : null}
			</div>
		);
	};

	const renderHeadCell = (col: FlatColumn, extraProps?: Record<string, any>) => {
		const resizeProps = (col as any).onHeaderCell?.(col) ?? {};
		const colWidthPx = col.width ?? 80;
		const locked = isColumnLocked(col);
		// Cột resizable/pin: dùng nguyên resizeProps (giữ tính năng kéo giãn tay).
		// Cột co giãn theo tỷ lệ: đè width bằng calc() và tắt resizable để ResizableTableHead render đúng nhánh không kéo tay.
		const headProps = locked
			? {
				width: colWidthPx,
				...resizeProps,
			}
			: {
				...resizeProps,
				width:
					flexibleWidth > 0
						? `calc((100% - ${pinnedWidth}px) * ${colWidthPx} / ${flexibleWidth})`
						: colWidthPx,
				minWidth: colWidthPx,
				resizable: false,
			};
		return (
			<ResizableTableHead
				key={col.key as any}
				pinned={col.fixed === 'left' ? 'left' : col.fixed === 'right' ? 'right' : undefined}
				truncate={false}
				style={alignStyle(col.align as any)}
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

	const totalWidth = _.sum(leafColumns.map((item) => item.width ?? 80)) + (props?.rowSelection ? 56 : 0);

	const renderTable = () => (
		<Table style={{ width: `max(${props.scroll?.x ?? totalWidth}px, 100%)`, tableLayout: 'fixed' }} density='compact'>
			<TableHeaderEl>
				{hasGroupedColumns ? (
					<>
						<TableRow>
							{props?.rowSelection && (
								<TableSelectionCell
									rowSpan={2}
									pinned='left'
									checked={allCurrentSelected}
									indeterminate={someCurrentSelected}
									onCheckedChange={toggleSelectAll}
									label={intl.formatMessage({ id: 'global.table.index.chontatca', defaultMessage: 'Chọn tất cả' })}
								/>
							)}
							{actualColumns.map((col) =>
								col.children?.length ? (
									<TableHead key={col.key as any} colSpan={col.children.length} style={alignStyle(col.align as any)}>
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
						{props?.rowSelection && (
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
				{loading ? (
					<TableRow>
						<TableCell
							colSpan={leafColumns.length + (props?.rowSelection ? 1 : 0)}
							style={{ textAlign: 'center', padding: 32 }}
						>
							<Spin />
						</TableCell>
					</TableRow>
				) : tableData.length === 0 ? (
					<TableRow>
						<TableCell
							colSpan={leafColumns.length + (props?.rowSelection ? 1 : 0)}
							style={{ textAlign: 'center', padding: 32 }}
						>
							<Empty />
						</TableCell>
					</TableRow>
				) : (
					tableData.map((record, index) => {
						const rowContent = (
							<>
								{props?.rowSelection && (
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
								{leafColumns.map((col, colIndex) => (
									<TableCell
										key={(col.key as any) ?? colIndex}
										style={alignStyle(col.align as any)}
										pinned={col.fixed === 'left' ? 'left' : col.fixed === 'right' ? 'right' : undefined}
										truncate={false}
									>
										{col.render
											? col.render(
													col.dataIndex ? _.get(record, col.dataIndex as any) : record,
													record,
													index,
											  )
											: col.dataIndex
												? _.get(record, col.dataIndex as any)
												: null}
									</TableCell>
								))}
							</>
						);

						return rowSortable ? (
							<SortableTableRow key={record.key} id={record.key}>
								{rowContent}
							</SortableTableRow>
						) : (
							<TableRow key={record.key}>{rowContent}</TableRow>
						);
					})
				)}
			</TableBody>
		</Table>
	);

	const paginationExtra = (
		<span className='table-pagination-extra'>
			{props?.rowSelection ? (
				<>
					<span>
						{intl.formatMessage({ id: 'global.table.index.dachon' })}: {selectedIds?.length ?? 0}
					</span>
					{selectedIds && selectedIds.length > 0 ? (
						<span>
							(
							<a
								href='#!'
								onClick={(e) => {
									e.preventDefault();
									setSelectedIds?.(undefined);
								}}
							>
								{intl.formatMessage({ id: 'global.table.index.bochon' })}
							</a>
							)
						</span>
					) : null}
				</>
			) : null}
			{/* Ẩn tổng số ở phân trang bên dưới (đã hiển thị trên thanh công cụ) */}
			{false && (
				<span>
					{intl.formatMessage({ id: 'global.table.index.tongso' })}: {total ?? 0}
				</span>
			)}
		</span>
	);

	const mainContent = (
		<div className='table-base'>
			{props.children}

			<TableHeader />

			{rowSortable ? (
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={tableData.map((item) => item.key)} strategy={verticalListSortingStrategy}>
						{renderTable()}
					</SortableContext>
				</DndContext>
			) : (
				renderTable()
			)}

			{props.pageable !== false && (
				<TablePagination
					page={page}
					limit={limit}
					total={total ?? 0}
					onPageChange={setPage}
					onLimitChange={(nextLimit) => {
						setLimit(nextLimit);
						setPage(1);
					}}
					extra={paginationExtra}
				/>
			)}
		</div>
	);

	return (
		<>
			{props.hideCard ? (
				mainContent
			) : (
				<PageCard
					level={props.cardProps?.level}
					showIndicator={props.cardProps?.showIndicator}
					title={props.title || false}
					extra={props.cardExtra}
					bordered={props.border}
				>
					{mainContent}
				</PageCard>
			)}

			<TableFormModal />

			{buttons?.filter !== false && hasFilter && disableFilterModal !== true ? <ModalFilter /> : null}

			{buttons?.import ? (
				<ModalImport
					visible={visibleImport ?? false}
					modelName={props.modelImportName ?? modelName}
					onCancel={() => setVisibleImport?.(false)}
					onOk={() => getData?.(params)}
					titleTemplate={
						title
							? intl.formatMessage({ id: 'global.table.index.import.titleTemplate' }, { title: title as any })
							: undefined
					}
					extendData={props.importParam ?? params}
				/>
			) : null}

			{buttons?.export ? (
				<ModalExport
					visible={visibleExport ?? false}
					modelName={props.modelExportName ?? modelName}
					onCancel={() => setVisibleExport?.(false)}
					fileName={intl.formatMessage(
						{ id: 'global.table.index.export.fileName' },
						{ title: (title ?? intl.formatMessage({ id: 'global.table.index.export.defaultTitle' })) as any },
					)}
					condition={props.params}
					otherQuery={props.exportParam ?? props.params}
					filters={filters}
				/>
			) : null}
		</>
	);
};
