import _ from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useIntl } from 'umi';
import { useTableContext } from '../components/TableContext';
import { EOperatorType } from '../constant';
import type { IColumn, TFilter } from '../typing';
import { applyColumnStringSearch, sanitizeFilterValues } from '../utils';
import { findFilterInTree, isExternalFilterNode, isSameFilterField, updateFiltersByField } from '../utils/filterTree';
import { useApplyColumnSettings } from './useApplyColumnSettings';

interface UseTableColumnsProps {
	columns: IColumn<any>[];
	sort: any;
	addStt?: boolean;
	dsPhanVung?: any[];
}

export type TableSortDirection = 'asc' | 'desc' | false;

export const useTableColumns = ({ columns, sort, addStt, dsPhanVung }: UseTableColumnsProps) => {
	const intl = useIntl();
	const {
		filters,
		setFilters,
		setFinalColumns,
		size,
		columnsWidth,
		setColumnsWidth,
		hideFilterColumn,
		columnSettings,
		setColumnSettings,
		syncExternalToColumnFilter,
	} = useTableContext();
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

	//#region Lấy hướng sắp xếp hiện tại của cột
	const getSortDirection = useCallback(
		(dataIndex: any): TableSortDirection => {
			const type = typeof dataIndex;
			const value = _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'));
			return value === 1 ? 'asc' : value === -1 ? 'desc' : false;
		},
		[sort],
	);
	//#endregion

	//#region Lấy các thuộc tính tìm kiếm của cột
	const handleSearch = useCallback(
		(dataIndex: any, value: string) => {
			if (searchableFieldKeys.has(JSON.stringify(dataIndex))) {
				setFilters?.(applyColumnStringSearch(filters ?? [], dataIndex, value, searchableFieldKeys));
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

			const column = columns.find((col: IColumn<any>) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex));
			if (column?.handleFilter) column.handleFilter(value);
		},
		[columns, filters, setFilters, shouldSyncExternalToColumnFilter, searchableFieldKeys],
	);
	//#endregion

	//#region Lấy các thuộc tính lọc của cột
	const handleFilter = useCallback(
		(dataIndex: any, values: string[]) => {
			const updateFilterOptions = {
				skipReadOnlyExternal: true,
				skipExternal: !shouldSyncExternalToColumnFilter,
			};
			const sanitizedValues = sanitizeFilterValues(values);

			if (!sanitizedValues.length) {
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
						values: sanitizedValues,
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
							values: sanitizedValues,
							readOnly,
							source: 'table',
						},
					]);
				}
			}

			const column = columns.find((col: IColumn<any>) => JSON.stringify(col.dataIndex) === JSON.stringify(dataIndex));
			if (column?.handleFilter) column.handleFilter(sanitizedValues);
		},
		[columns, filters, setFilters, shouldSyncExternalToColumnFilter],
	);
	//#endregion

	const { processedColumns, onResize } = useApplyColumnSettings({
		columns: useMemo(() => {
			return columns.map((item: IColumn<any>) => ({
				...item,
				_sortDirection: item.sortable ? getSortDirection(item.dataIndex) : false,
				_hasFilter: !hideFilterColumn && !!item.filterType,
				children: item.children?.map((child: IColumn<any>) => ({
					...child,
					_sortDirection: child.sortable ? getSortDirection(child.dataIndex) : false,
					_hasFilter: !hideFilterColumn && !!child.filterType,
				})),
			}));
		}, [columns, getSortDirection, hideFilterColumn]),
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
				resizable: false,
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

	return { finalColumns, handleFilter, handleSearch, getFilterColumn, onResize };
};
