import ButtonExtend from '@/components/Table/ButtonExtend';
import { primaryColor } from '@/services/base/constant';
import { MenuOutlined, PlusCircleOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AutoComplete, Button, Card, ConfigProvider, Drawer, Empty, Input, Table, Tooltip, type InputRef } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useIntl, useModel } from 'umi';
import { ColumnSettings } from './components/ColumnSettings';
import { ResizableTitle } from './components/ResizableTitle';
import { TableProvider, useTableContext } from './components/TableContext';
import { useApplyColumnSettings } from './hooks/useApplyColumnSettings';
import ModalExpandable from './ModalExpandable';
import './style.less';
import type { IColumn, TableStaticProps, TDataOption } from './typing';
import { updateSearchStorage } from './utils';

const getValueByDataIndex = (record: any, dataIndex: any) => {
	if (Array.isArray(dataIndex)) return _.get(record, dataIndex);
	return _.get(record, dataIndex);
};

const TableStaticContent: React.FC<TableStaticProps> = (props) => {
	const intl = useIntl();
	const {
		Form,
		showEdit,
		setShowEdit,
		addStt,
		data,
		children,
		hasCreate,
		hasTotal,
		rowSortable,
		resizable,
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
	const [searchText, setSearchText] = useState<string>('');
	const [searchedColumn, setSearchedColumn] = useState<any>();
	const [globalSearchText, setGlobalSearchText] = useState<string>('');
	const [globalOptions, setGlobalOptions] = useState<{ value: string; label?: string }[]>([]);
	const [total, setTotal] = useState<number>();
	const searchInputRef = useRef<InputRef>(null);

	// dnd-kit: sensors
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

	const globalDataIndex = useMemo(() => `TABLE_STATIC_GLOBAL_SEARCH_${window.location.pathname}`, []);

	const globalSearchColumns = useMemo(() => {
		const flattenColumns = props.columns
			?.map((item: IColumn<any>) => (item.children?.length ? [item, ...item.children] : [item]))
			.flat();

		return (
			flattenColumns?.filter(
				(item: IColumn<any>) => item?.filterType === 'string' && item?.dataIndex && item.dataIndex !== 'index',
			) ?? []
		);
	}, [props.columns]);

	// State cho tableData để sortable
	const tableData = useMemo(() => {
		const rawData = (props?.data ?? []).map((item: any, index: number) => ({
			...item,
			key: item?._id ?? String(index),
			index: index + 1,
			children:
				!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
					? item.children
					: undefined,
		}));

		const keyword = globalSearchText.trim().toLowerCase();

		if (!globalSearch || !keyword) return rawData;

		return rawData.filter((record: any) =>
			globalSearchColumns.some((col: IColumn<any>) => {
				const value = getValueByDataIndex(record, col.dataIndex);
				return value?.toString?.().toLowerCase?.().includes(keyword);
			}),
		);
	}, [props.data, props.hideChildrenRows, globalSearch, globalSearchText, globalSearchColumns]);

	useEffect(() => {
		setTotal(data?.length);
		setSearchText('');
		setSearchedColumn(undefined);
		setGlobalSearchText('');
	}, [data?.length]);

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

	const handleSearch = useCallback((confirm: any, dataIndex: any) => {
		confirm();
		setSearchedColumn(dataIndex);
	}, []);

	const getColumnSearchProps = useCallback(
		(dataIndex: any, columnTitle: any, render: any): Partial<IColumn<unknown>> => ({
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
				const searchOptions = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
					(value: string) => ({ value, label: value }),
				);

				return (
					<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
						<AutoComplete
							options={searchOptions}
							onSelect={(value: string) => {
								setSelectedKeys([value]);
								handleSearch(confirm, dataIndex);
							}}
						>
							<Input.Search
								placeholder={intl.formatMessage(
									{ id: 'global.table.index.search.placeholder.short' },
									{ field: columnTitle },
								)}
								allowClear
								enterButton
								value={selectedKeys[0]}
								onChange={(e) => {
									if (e.type === 'click') {
										setSelectedKeys([]);
										confirm();
									} else {
										setSelectedKeys(e.target.value ? [e.target.value] : []);
									}
								}}
								onSearch={(value: string) => {
									if (value) updateSearchStorage(dataIndex, value);
									handleSearch(confirm, dataIndex);
								}}
								ref={searchInputRef}
							/>
						</AutoComplete>
					</div>
				);
			},

			filterIcon: (filtered: boolean) => <SearchOutlined className={filtered ? 'text-primary' : undefined} />,
			onFilter: (value: any, record: any) =>
				typeof dataIndex === 'string'
					? record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
					: typeof dataIndex === 'object'
						? record[dataIndex[0]][dataIndex?.[1]]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
						: '',
			onFilterDropdownVisibleChange: (vis: boolean) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),

			render: (text: any, record: any) =>
				render ? (
					render(text, record)
				) : searchedColumn === dataIndex ? (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					/>
				) : (
					text
				),
		}),
		[handleSearch, searchText, searchedColumn],
	);

	const getFilterColumnProps = useCallback((dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			onFilter: (value: any, record: any) => record[dataIndex]?.indexOf(value) === 0,
			filterSearch: true,
		};
	}, []);

	const baseColumns = useMemo(() => {
		return props.columns?.map((item: IColumn<any>) => ({
			...item,
			resizable: item.resizable ?? resizable, // Apply default resizable if provided
			...(item?.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title, item.render)
				: item?.filterType === 'select'
					? getFilterColumnProps(item.dataIndex, item.filterData)
					: undefined),
			...(item?.sortable && {
				sorter: (a: any, b: any) => {
					const aValue = _.get(a, item?.dataIndex ?? '', undefined);
					const bValue = _.get(b, item?.dataIndex ?? '', undefined);
					return item.customSort ? item.customSort(aValue, bValue) : aValue > bValue ? 1 : -1;
				},
			}),
			children: item.children?.map((child: IColumn<any>) => ({
				...child,
				resizable: child.resizable ?? resizable,
				...(child?.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, item.title, item.render)
					: child?.filterType === 'select'
						? getFilterColumnProps(child.dataIndex, child.filterData)
						: undefined),
				...(child?.sortable && {
					sorter: (a: any, b: any) =>
						child.customSort
							? child.customSort(a[child.dataIndex as string], b[child.dataIndex as string])
							: a[child.dataIndex as string] > b[child.dataIndex as string]
								? 1
								: -1,
				}),
			})),
		}));
	}, [props.columns, resizable, getColumnSearchProps, getFilterColumnProps]);

	const { processedColumns } = useApplyColumnSettings({
		columns: baseColumns,
		columnSettings,
		columnsWidth,
		setColumnsWidth,
		setColumnSettings,
	});

	const displayedColumns = useMemo(() => {
		const cols = [...processedColumns];
		if (addStt)
			cols.unshift({
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'index',
				align: 'center',
				width: 60,
				render: (val: string, rec: any) => {
					const phanVungHienTai = dsPhanVung?.find((item: any) => item?.ma === rec?.dataPartitionCode);
					const maMau = phanVungHienTai?.maMau ?? 'var(--color-primary)';

					return (
						<div className='ttCellWrapper'>
							<span>{val}</span>

							{phanVungHienTai?._id && (
								<Tooltip title={phanVungHienTai?.name}>
									<div className='cornerTriangle' style={{ backgroundColor: maMau, top: size === 'small' ? -4 : -8 }} />
								</Tooltip>
							)}
						</div>
					);
				},
			} as any);

		//#region Get Drag Sortable column
		if (rowSortable)
			cols.unshift({
				width: 30,
				align: 'center',
				fixed: 'left',
				render: () => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />,
			} as any);

		return cols;
	}, [processedColumns, addStt, rowSortable, dsPhanVung, size, intl]);

	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = tableData.findIndex((i: any) => i.key === active.id);
			const newIndex = tableData.findIndex((i: any) => i.key === over.id);
			if (props.onSortEnd) props.onSortEnd(tableData[oldIndex], newIndex);
		}
	};

	// dnd-kit: SortableRow component
	const SortableRow = (rowProps: any) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
			id: rowProps['data-row-key'],
		});
		const style = {
			...rowProps.style,
			transform: CSS.Transform.toString(transform),
			transition,
			cursor: 'grab',
			...(isDragging ? { background: '#fafafa' } : {}),
		};
		return <tr {...rowProps} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
	};

	const renderTable = () => {
		const totalWidth = _.sum(displayedColumns.map((item: any) => item.width ?? 80));
		return (
			<Table
				columns={displayedColumns as any[]}
				dataSource={tableData}
				rowKey='key'
				onChange={(pagination, filters, sorter, extra) => {
					setTotal(extra.currentDataSource.length ?? pagination.total);
				}}
				loading={props?.loading}
				size={size ?? props.size}
				scroll={{
					x: totalWidth ?? props.otherProps?.scroll?.x ?? 'max-content',
					...props.scroll,
					...props.otherProps?.scroll,
				}}
				bordered
				components={{
					...(rowSortable ? { body: { row: SortableRow } } : {}),
					header: { cell: ResizableTitle },
				}}
				tableLayout='fixed'
				{...props?.otherProps}
			/>
		);
	};

	const mainContent = (
		<div className='table-base'>
			<div className='header'>
				{children}
				<div className='action'>
					{hasCreate && (
						<ButtonExtend
							onClick={() => {
								if (setShowEdit) setShowEdit(true);
							}}
							icon={<PlusCircleOutlined />}
							type='primary'
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
							icon={<ReloadOutlined />}
							onClick={() => (props.onReload ? props.onReload() : null)}
							loading={props.loading}
							className='btn-reload'
							tooltip={intl.formatMessage({ id: 'global.tablestatic.button.tailai.tooltip' })}
						>
							{intl.formatMessage({ id: 'global.tablestatic.button.tailai' })}
						</ButtonExtend>
					) : null}

					{props.otherExtra}
				</div>

				<div className='extra'>
					{columnSetting && <ColumnSettings />}

					{globalSearch && globalSearchColumns.length ? (
						<AutoComplete
							options={globalOptions}
							value={globalSearchText}
							size={size}
							onSelect={handleGlobalSearchTrigger}
							onChange={(val) => setGlobalSearchText(val)}
						>
							<Input.Search
								ref={searchInputRef}
								className='global-search'
								size={size}
								allowClear
								value={globalSearchText}
								placeholder={globalSearchPlaceholder}
								style={
									globalSearchText
										? {
												width: 260,
												borderColor: primaryColor,
												outline: '1px solid ' + primaryColor,
												borderRadius: 4,
											}
										: { width: 260 }
								}
								enterButton={
									<Button
										size={size}
										icon={
											<Tooltip title={globalSearchTooltip}>
												<SearchOutlined />
											</Tooltip>
										}
									/>
								}
								onSearch={handleGlobalSearchTrigger}
								onChange={(e) => {
									if (e.type === 'click') {
										setGlobalSearchText('');
										handleGlobalSearchTrigger('');
									} else {
										const val = e.target.value;
										setGlobalSearchText(val);
									}
								}}
							/>
						</AutoComplete>
					) : null}

					{hasTotal ? (
						<Tooltip title={intl.formatMessage({ id: 'global.tablestatic.button.tongso.tooltip' })}>
							<div className={classNames({ total: true, small: size === 'small' })}>
								{intl.formatMessage({ id: 'global.tablestatic.button.tongso' })}:
								<span style={{ fontSize: 15 }}>{total ?? tableData?.length ?? props.data?.length ?? 0}</span>
							</div>
						</Tooltip>
					) : null}
				</div>
			</div>

			<ConfigProvider
				renderEmpty={() => (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={props.emptyText ?? intl.formatMessage({ id: 'global.table.index.empty' })}
						image={size === 'small' ? Empty.PRESENTED_IMAGE_SIMPLE : undefined}
					/>
				)}
			>
				{rowSortable ? (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<SortableContext items={tableData.map((item: any) => item.key)} strategy={verticalListSortingStrategy}>
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
			{props.title === undefined ? (
				mainContent
			) : (
				<Card title={props.title || false} variant='borderless' className='card-borderless card-big-title'>
					<Card>{mainContent}</Card>
				</Card>
			)}

			{Form && (
				<>
					{props?.formType === 'Drawer' ? (
						<Drawer
							width={props?.widthDrawer}
							onClose={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
							open={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</Drawer>
					) : (
						<ModalExpandable
							width={props?.widthDrawer}
							onCancel={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
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
				size: props.size,
				columns: props.columns,
				columnSetting: props.columnSetting,
			}}
		>
			<TableStaticContent {...props} />
		</TableProvider>
	);
};

export default TableStaticData;
