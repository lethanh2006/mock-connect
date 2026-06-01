import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Input, Space } from 'antd';
import type { SortOrder } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { JSX, useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import type { IColumn, TDataOption, TFilter } from '../typing';
import { applyColumnStringSearch, updateSearchStorage } from '../utils';
import { findFilterInTree, isExternalFilterNode, isSameFilterField, updateFiltersByField } from '../utils/filterTree';
import { useApplyColumnSettings } from './useApplyColumnSettings';

interface UseTableColumnsProps {
	columns: IColumn<any>[];
	sort: any;
	addStt?: boolean;
	dsPhanVung?: any[];
}

export const useTableColumns = ({ columns, sort, addStt, dsPhanVung }: UseTableColumnsProps) => {
	const intl = useIntl();
	const {
		searchInputRef,
		filters,
		setFilters,
		setFinalColumns,
		buttons,
		hasFilter,
		setVisibleFilter,
		size,
		columnsWidth,
		setColumnsWidth,
		hideFilterColumn,
		columnSettings,
		setColumnSettings,
		disableFilterModal,
		syncExternalToColumnFilter,
	} = useTableContext();
	const canOpenModalFilter = false;
	// buttons?.filter !== false && hasFilter && disableFilterModal !== true;
	const shouldSyncExternalToColumnFilter = syncExternalToColumnFilter !== false;
	const isExternalFilter = isExternalFilterNode;

	const searchableFieldKeys = useMemo(() => {
		const flatColumns = columns.map((item) => (item.children?.length ? [item, ...item.children] : [item])).flat();
		const seen = new Set<string>();
		const keys = new Set<string>();

		flatColumns.forEach((item) => {
			const isDefaultSearchable = item?.filterType === 'string';
			const enableGlobalSearch = item?.enableGlobalSearch ?? isDefaultSearchable;
			if (!enableGlobalSearch || !item?.dataIndex || item.dataIndex === 'index') return;

			const fieldKey = JSON.stringify(item.dataIndex);
			if (seen.has(fieldKey)) return;
			seen.add(fieldKey);
			keys.add(fieldKey);
		});

		return keys;
	}, [columns]);

	/**
	 * Lấy quy tắc lọc hiện tại của cột
	 */
	const getFilterColumn = useCallback(
		(fieldName: any, operator?: EOperatorType, active?: boolean, options?: { excludeExternal?: boolean }) =>
			findFilterInTree(filters, fieldName, operator, active, {
				excludeExternal: options?.excludeExternal === true || !shouldSyncExternalToColumnFilter,
			}),
		[filters, shouldSyncExternalToColumnFilter],
	);

	//#region Lấy các thuộc tính sắp xếp của cột
	const getCondValue = useCallback(
		(dataIndex: any) => {
			const type = typeof dataIndex;
			return _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
		},
		[sort],
	);

	const getSortValue = useCallback(
		(dataIndex: any): SortOrder => {
			const value = getCondValue(dataIndex);
			return value === 1 ? 'ascend' : value === -1 ? 'descend' : null;
		},
		[getCondValue],
	);

	const getSort = useCallback(
		(dataIndex: any): Partial<IColumn<unknown>> => ({
			sorter: true,
			sortDirections: ['ascend', 'descend'],
			sortOrder: getSortValue(dataIndex),
		}),
		[getSortValue],
	);
	//#endregion

	//#region Lấy các thuộc tính tìm kiếm của cột
	const handleSearch = useCallback(
		(dataIndex: any, value: string, confirm?: () => void) => {
			if (searchableFieldKeys.has(JSON.stringify(dataIndex))) {
				setFilters?.(applyColumnStringSearch(filters ?? [], dataIndex, value, searchableFieldKeys));
				if (confirm) confirm();
				return;
			}

			const updateFilterOptions = {
				skipReadOnlyExternal: true,
				skipExternal: !shouldSyncExternalToColumnFilter,
			};

			if (!value) {
				const { filters: tempFilters, matched } = updateFiltersByField(
					filters,
					dataIndex,
					() => null,
					updateFilterOptions,
				);

				if (matched) {
					setFilters?.(tempFilters);
				} else {
					const fallbackFilters = (filters ?? []).filter(
						(item: TFilter<any>) => !isSameFilterField(item.field, dataIndex) || isExternalFilter(item),
					);
					setFilters?.(fallbackFilters);
				}
			} else {
				const column = columns.find((col: IColumn<any>) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex));
				const readOnly = !!column?.handleFilter;

				const { filters: tempFilters, matched } = updateFiltersByField(
					filters,
					dataIndex,
					(item) => ({
						...item,
						active: true,
						operator: EOperatorType.CONTAIN,
						values: [value],
						readOnly,
					}),
					updateFilterOptions,
				);

				if (matched) {
					setFilters?.(tempFilters);
				} else {
					setFilters?.([
						...(filters ?? []),
						{
							active: true,
							field: dataIndex,
							operator: EOperatorType.CONTAIN,
							values: [value],
							readOnly,
							source: 'table',
						},
					]);
				}
			}
			if (confirm) confirm();
		},
		[columns, filters, setFilters, shouldSyncExternalToColumnFilter, searchableFieldKeys],
	);

	const getColumnSearchProps = useCallback(
		(dataIndex: any, columnTitle: any): Partial<IColumn<unknown>> => {
			const filterColumn = getFilterColumn(dataIndex, EOperatorType.CONTAIN, true);
			const currentFilterValue = filterColumn?.values?.[0] as string | undefined;

			return {
				filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
					const options = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
						(value: string) => ({
							value,
							label: value,
						}),
					);
					const selectedValue = selectedKeys?.[0];
					const inputValue =
						selectedValue !== undefined && selectedValue !== null
							? (selectedValue as string)
							: (currentFilterValue ?? '');

					return (
						<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
							<AutoComplete
								options={options}
								onSelect={(value: string) => {
									setSelectedKeys([value]);
									handleSearch(dataIndex, value, confirm);
								}}
							>
								<Input.Search
									placeholder={intl.formatMessage(
										{ id: 'global.table.index.search.placeholder.short' },
										{ field: columnTitle },
									)}
									allowClear
									enterButton
									value={inputValue}
									onChange={(e) => {
										if (e.type === 'click') {
											setSelectedKeys([]);
											confirm();
										} else {
											setSelectedKeys(e.target.value ? [e.target.value] : []);
										}
									}}
									onSearch={(value) => {
										if (value) updateSearchStorage(dataIndex, value);
										handleSearch(dataIndex, value, confirm);
									}}
									ref={searchInputRef}
								/>
							</AutoComplete>

							{canOpenModalFilter ? (
								<div>
									{intl.formatMessage({ id: 'global.table.filterdropdown.xemthem' })}{' '}
									<a
										onClick={() => {
											setVisibleFilter?.(true);
											confirm();
										}}
									>
										{intl.formatMessage({ id: 'global.table.filterdropdown.boloc' })}
									</a>
								</div>
							) : null}
						</div>
					);
				},

				filteredValue: filterColumn?.values ?? [],
				filterIcon: () => {
					const values = getFilterColumn(dataIndex, undefined, true)?.values;
					const filtered = values && values[0];
					return <SearchOutlined className={filtered ? 'text-primary' : undefined} />;
				},
				filterDropdownProps: {
					onOpenChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
				},
			};
		},
		[getFilterColumn, handleSearch, searchInputRef, canOpenModalFilter, intl, setVisibleFilter],
	);
	//#endregion

	//#region Lấy các thuộc tính lọc của cột
	const handleFilter = useCallback(
		(dataIndex: any, values: string[]) => {
			const updateFilterOptions = {
				skipReadOnlyExternal: true,
				skipExternal: !shouldSyncExternalToColumnFilter,
			};

			if (!values || !values.length) {
				const { filters: tempFilters, matched } = updateFiltersByField(
					filters,
					dataIndex,
					() => null,
					updateFilterOptions,
				);

				if (matched) {
					setFilters?.(tempFilters);
				} else {
					const fallbackFilters = (filters ?? []).filter(
						(item: TFilter<any>) => !isSameFilterField(item.field, dataIndex) || isExternalFilter(item),
					);
					setFilters?.(fallbackFilters);
				}
			} else {
				const column = columns.find((col: IColumn<any>) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex));
				const readOnly = !!column?.handleFilter;

				const { filters: tempFilters, matched } = updateFiltersByField(
					filters,
					dataIndex,
					(item) => ({
						...item,
						active: true,
						operator: EOperatorType.INCLUDE,
						values,
						readOnly,
					}),
					updateFilterOptions,
				);

				if (matched) {
					setFilters?.(tempFilters);
				} else {
					setFilters?.([
						...(filters ?? []),
						{
							field: dataIndex,
							active: true,
							operator: EOperatorType.INCLUDE,
							values,
							readOnly,
							source: 'table',
						},
					]);
				}
			}
		},
		[columns, filters, setFilters, shouldSyncExternalToColumnFilter],
	);

	const getFilterColumnProps = useCallback(
		(dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
			const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
			return {
				filters: filterData?.map((item: string | TDataOption) =>
					typeof item === 'string'
						? { key: item, value: item, text: item }
						: { key: item.value, value: item.value, text: item.label },
				),
				filteredValue: filterColumn?.values ?? [],
				filterSearch: true,
			};
		},
		[getFilterColumn],
	);
	//#endregion

	const getColumnSelectProps = useCallback(
		(dataIndex: any, filterCustomSelect?: JSX.Element): Partial<IColumn<unknown>> => {
			if (!filterCustomSelect) return {};
			const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);

			return {
				filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
					<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
						<Space size={0}>
							<div style={{ width: 300 }}>
								{React.cloneElement(filterCustomSelect, {
									value: selectedKeys,
									onChange: (value: any) => setSelectedKeys(Array.isArray(value) ? value : [value]),
									style: { width: '100%' },
								})}
							</div>
							<Button
								type='primary'
								icon={<FilterOutlined />}
								onClick={() => {
									handleFilter(dataIndex, selectedKeys as string[]);
									confirm();
								}}
							/>
						</Space>
						{canOpenModalFilter ? (
							<div>
								{intl.formatMessage({ id: 'global.table.filterdropdown.xemthem' })}{' '}
								<a
									onClick={() => {
										setVisibleFilter?.(true);
										confirm();
									}}
								>
									{intl.formatMessage({ id: 'global.table.filterdropdown.boloc' })}
								</a>
							</div>
						) : null}
					</div>
				),
				filteredValue: filterColumn?.values ?? [],
			};
		},
		[getFilterColumn, handleFilter, canOpenModalFilter, intl, setVisibleFilter],
	);
	//#endregion

	const { processedColumns, onResize } = useApplyColumnSettings({
		columns: useMemo(() => {
			return columns.map((item: IColumn<any>) => ({
				...item,
				...(item.sortable && getSort(item.dataIndex)),
				...(!hideFilterColumn &&
					(item.filterType === 'string'
						? getColumnSearchProps(item.dataIndex, item.title)
						: item.filterType === 'select'
							? getFilterColumnProps(item.dataIndex, item.filterData)
							: item.filterType === 'customselect'
								? getColumnSelectProps(item.dataIndex, item.filterCustomSelect)
								: undefined)),
				children: item.children?.map((child: IColumn<any>) => ({
					...child,
					...(child.sortable && getSort(child.dataIndex)),
					...(!hideFilterColumn &&
						(child.filterType === 'string'
							? getColumnSearchProps(child.dataIndex, child.title)
							: child.filterType === 'select'
								? getFilterColumnProps(child.dataIndex, child.filterData)
								: child.filterType === 'customselect'
									? getColumnSelectProps(child.dataIndex, child.filterCustomSelect)
									: undefined)),
				})),
			}));
		}, [columns, getSort, getColumnSearchProps, getFilterColumnProps, getColumnSelectProps, hideFilterColumn]),
		columnSettings,
		columnsWidth,
		setColumnsWidth,
		setColumnSettings,
	});

	const finalColumns = useMemo(() => {
		let final = [...processedColumns];
		final = final?.filter((item: IColumn<any>) => item?.hide !== true);
		if (addStt !== false)
			final.unshift({
				title: intl.formatMessage({ id: 'global.table.column.tt' }),
				dataIndex: 'index',
				key: 'index',
				align: 'center',
				width: 60,
				render: (val, rec) => {
					const phanVungHienTai = dsPhanVung?.find((it: any) => it?.ma === rec?.dataPartitionCode);
					const maMau = phanVungHienTai?.maMau ?? 'var(--color-primary)';

					return (
						<div className='ttCellWrapper'>
							<span>{val}</span>

							{phanVungHienTai?._id && (
								<div
									className='cornerTriangle'
									style={{ backgroundColor: maMau, top: size === 'small' ? -4 : -8 }}
									title={phanVungHienTai?.name}
								/>
							)}
						</div>
					);
				},
			});

		return final;
	}, [processedColumns, addStt, dsPhanVung, intl, size]);

	const lastFinalColumnsRef = React.useRef<IColumn<any>[]>([]);
	useEffect(() => {
		if (!_.isEqual(lastFinalColumnsRef.current, finalColumns)) {
			lastFinalColumnsRef.current = finalColumns;
			setFinalColumns?.(finalColumns);
		}
	}, [finalColumns, setFinalColumns]);

	return { finalColumns, handleFilter, handleSearch, onResize };
};
