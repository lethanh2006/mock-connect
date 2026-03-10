import { MenuOutlined } from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, ConfigProvider, Space, Table, type PaginationProps } from 'antd';
import { ResizableTitle } from './ResizableTitle';
import type { FilterValue } from 'antd/lib/table/interface';
import _ from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { useIntl, useModel } from 'umi';
import ModalExport from '../Export';
import ModalFilter from '../Filter/ModalFilter';
import { useTableColumns } from '@/components/Table/hooks/useTableColumns';
import ModalImport from '../Import';
import type { IColumn, TableBaseProps, TFilter } from '../typing';
import { useTableContext } from './TableContext';
import { TableFormModal } from './TableFormModal';
import { TableHeader } from './TableHeader';

export const TableBaseContent = (props: TableBaseProps) => {
	const intl = useIntl();
	const { modelName, dependencies = [], params, rowSortable, title } = props;
	const model = useModel(modelName) as any;
	const { page, limit, setPage, setLimit, condition, sort, setSort, setFilters, initFilter } = model;
	const { danhSach: dsPhanVung } = useModel('core.phanvungdulieu');
	const filters: TFilter<any>[] = model?.filters;
	const getData = props.getData ?? model?.getModel;
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
	} = useTableContext();

	const { handleFilter, handleSearch, finalColumns } = useTableColumns({
		columns: props.columns,
		sort,
		addStt: props.addStt,
		dsPhanVung,
	});

	const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
	const sensors = useSensors(sensor);
	const lastResizeEndTimeRef = useRef<number>(0);
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
		[model?.[props.dataState || 'danhSach'], page, limit, props.pageable, props.hideChildrenRows]
	);

	useEffect(() => {
		setPage(1);
	}, [JSON.stringify(filters ?? [])]);

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
		getData(params);
	}, [...dependencies, filters, condition, sort]);

	useEffect(() => {
		return () => {
			if (props.noCleanUp !== true) {
				setFilters?.(initFilter);
				setSelectedIds?.(undefined);
			}
		};
	}, []);

	const actualColumns = useMemo(() => {
		const cols = [...finalColumns];
		if (rowSortable && !cols.find((c: any) => c._isSortHandle))
			cols.unshift({
				width: 30,
				key: 'sort-handle',
				align: 'center',
				fixed: 'left',
				_isSortHandle: true,
				render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
			} as any);
		return cols;
	}, [finalColumns, rowSortable]);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = tableData.findIndex((i) => i.key === active.id);
			const newIndex = tableData.findIndex((i) => i.key === over.id);
			if (props.onSortEnd) props.onSortEnd(tableData[oldIndex], newIndex);
		}
	};

	const SortableRow = useMemo(() => {
		return (componentProps: any) => {
			const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
				id: componentProps['data-row-key'],
			});
			const style = {
				...componentProps.style,
				transform: CSS.Transform.toString(transform),
				transition,
				cursor: 'grab',
				...(isDragging ? { background: '#fafafa' } : {}),
			};
			return <tr {...componentProps} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
		};
	}, []);

	const ResizableHeaderCell = useMemo(() => {
		return (componentProps: any) => (
			<ResizableTitle
				{...componentProps}
				onResizeStart={(e: any) => {
					isResizingRef.current = true;
					document.body.style.userSelect = 'none';
					const titleEl = (e.target as HTMLElement)?.closest('th')?.querySelector('.ant-table-column-title');
					if (titleEl) {
						(titleEl as HTMLElement).style.pointerEvents = 'none';
					}
				}}
				onResizeStop={(e: any) => {
					isResizingRef.current = false;
					document.body.style.userSelect = '';
					const titleEl = (e.target as HTMLElement)?.closest('th')?.querySelector('.ant-table-column-title');
					if (titleEl) {
						(titleEl as HTMLElement).style.pointerEvents = '';
					}
					lastResizeEndTimeRef.current = Date.now();
				}}
			/>
		);
	}, []);

	const onChange = (pagination: PaginationProps, fil: Record<string, FilterValue | null>, sorter: any) => {
		// Skip sort if triggered within 300ms after resize (avoid resize->sort on mouseup)
		const skipSort = sorter?.field && Date.now() - lastResizeEndTimeRef.current < 300;
		if (skipSort) {
			fil = {}; // Also skip filters
		}

		const allColumns = finalColumns
			.map((col: IColumn<any>) => {
				if (col.children?.length) return [col, ...col.children];
				else return [col];
			})
			.flat();
		Object.entries(fil).map(([field, values]) => {
			// Field từ table => nếu dataIndex là Array => field1.subfield
			const dataIndex = field.includes('.') ? field.split('.') : field;
			const col = allColumns.find((item: IColumn<any>) => JSON.stringify(item.dataIndex) === JSON.stringify(dataIndex));
			if (col?.handleFilter) {
				col.handleFilter(values?.[0] as any);
				if (col?.filterType === 'string') {
					handleSearch(dataIndex, values?.[0] as any);
				} else if (col?.filterType === 'select') {
					handleFilter(dataIndex, values as any);
				}
			} else if (col?.filterType === 'select') {
				handleFilter(dataIndex, values as any);
			} else if (col?.filterType === 'string') {
				handleSearch(dataIndex, values?.[0] as any);
			} else if (col?.filterType === 'customselect') {
				handleFilter(dataIndex, values as any);
			}
		});

		// Only apply sort if not within resize window
		if (!skipSort) {
			const { order, field } = sorter;
			const orderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : undefined;
			if (sorter && setSort) setSort({ [Array.isArray(field) ? field.join('.') : field]: orderValue });
		}

		const { current, pageSize } = pagination;
		setPage(current);
		setLimit(pageSize);
	};

	const renderTable = () => {
		const totalWidth = _.sum(actualColumns.map((item: any) => item.width ?? 80)) + (props?.rowSelection ? 40 : 0);

		return (
			<Table
				scroll={{ x: totalWidth ?? props.scroll?.x ?? 'max-content', ...props.scroll }}
				rowSelection={
					props?.rowSelection
						? {
							type: 'checkbox',
							selectedRowKeys: selectedIds ?? [],
							preserveSelectedRowKeys: true,
							onChange: (selectedRowKeys) => setSelectedIds?.(selectedRowKeys as (string | number)[]),
							columnWidth: 40,
							fixed: 'left',
							...props.detailRow,
						}
						: undefined
				}
				loading={loading}
				bordered={props.border ?? true}
				pagination={{
					current: page,
					pageSize: limit,
					position: ['bottomRight'],
					total,
					showSizeChanger: true,
					pageSizeOptions: ['5', '10', '25', '50', '100'],
					showTotal: (tongSo: number) => (
						<Space>
							{props?.rowSelection ? (
								<>
									<span>
										{intl.formatMessage({ id: 'global.table.index.dachon' })}: {selectedIds?.length ?? 0}
									</span>
									{selectedIds && selectedIds.length > 0 ? (
										<span>
											(
											<a href='#!' onClick={() => setSelectedIds?.(undefined)}>
												{intl.formatMessage({ id: 'global.table.index.bochon' })}
											</a>
											)
										</span>
									) : null}
								</>
							) : null}
							<span>
								{intl.formatMessage({ id: 'global.table.index.tongso' })}: {tongSo}
							</span>
						</Space>
					),
				}}
				onChange={onChange}
				dataSource={tableData}
				columns={actualColumns as any[]}
				components={{
					...(rowSortable ? { body: { row: SortableRow } } : {}),
					header: { cell: ResizableHeaderCell },
				}}
				tableLayout='fixed'
				{...props?.otherProps}
			/>
		);
	};

	const mainContent = (
		<div className='table-base'>
			{props.children}

			<TableHeader />

			<ConfigProvider>
				{rowSortable ? (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={tableData.map((item) => item.key)} strategy={verticalListSortingStrategy}>
							{renderTable()}
						</SortableContext>
					</DndContext>
				) : (
					renderTable()
				)}
			</ConfigProvider>
		</div>
	);



	return (
		<>
			{props.hideCard ? (
				mainContent
			) : (
				<Card className='table-base-card' title={props.title || false} variant={props.border ? 'outlined' : 'borderless'} extra={props.cardExtra}>
					{mainContent}
				</Card>
			)}

			<TableFormModal />

			{buttons?.filter !== false && hasFilter ? <ModalFilter /> : null}

			{buttons?.import ? (
				<ModalImport
					visible={visibleImport ?? false}
					modelName={props.modelImportName ?? modelName}
					onCancel={() => setVisibleImport?.(false)}
					onOk={() => getData(params)}
					titleTemplate={title ? `Biểu mẫu ${title}.xlsx` : undefined}
					extendData={params}
				/>
			) : null}

			{buttons?.export ? (
				<ModalExport
					visible={visibleExport ?? false}
					modelName={props.modelExportName ?? modelName}
					onCancel={() => setVisibleExport?.(false)}
					fileName={`Danh sách ${title ?? 'dữ liệu'}.xlsx`}
					condition={params}
				/>
			) : null}
		</>
	);
};
