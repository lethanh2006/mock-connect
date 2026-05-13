import ButtonExtend from '@/components/Table/ButtonExtend';
import { primaryColor } from '@/services/base/constant';
import { inputFormat } from '@/utils/utils';
import {
	ExportOutlined,
	FilterOutlined,
	FilterTwoTone,
	ImportOutlined,
	PlusCircleOutlined,
	ReloadOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import { AutoComplete, Button, Input, Popconfirm, Popover, Tooltip } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl } from 'umi';
import { EOperatorType } from '../constant';
import type { TFilter } from '../typing';
import { findFiltersInColumns, getSearchStorage, updateSearchStorage } from '../utils';
import { ColumnSettings } from './ColumnSettings';
import { useTableContext } from './TableContext';

export const TableHeader: React.FC = () => {
	const intl = useIntl();
	const {
		buttons,
		otherButtons,
		rowSelection,
		deleteMany,
		selectedIds,
		handleDeleteMany,
		hasFilter,
		finalColumns,
		filters,
		setFilters,
		setVisibleFilter,
		setVisibleImport,
		setVisibleExport,
		onCreate,
		onReload,
		loading,
		total,
		hideTotal,
		disableFilterModal,
		size,
	} = useTableContext();
	const {
		globalSearch = true,
		minimizeGlobalSearch = size === 'small',
		create: btnCreate = true,
		export: btnExport,
		filter: btnFilter = true,
		import: btnImport,
		reload: btnReload = true,
		columnSetting: btnColumnSetting = true,
	} = buttons || {};
	const [globalSearchText, setGlobalSearchText] = useState<string>('');
	const [globalOptions, setGlobalOptions] = useState<{ value: string }[]>([]);
	const searchInputRef = useRef<any>(null);
	const currentPath = window.location.pathname;
	const globalDataIndex = useMemo(() => `GLOBAL_SEARCH_${currentPath}`, [currentPath]);
	const canOpenModalFilter = btnFilter && hasFilter && disableFilterModal !== true;

	//#region Global Search Logic

	const searchableColumns = useMemo(() => {
		const flatColumns = finalColumns.map((item) => (item.children?.length ? [item, ...item.children] : [item])).flat();

		const seen = new Set<string>();
		return flatColumns
			.filter((item) => {
				const isDefaultSearchable = item?.filterType === 'string';
				const enableGlobalSearch = item?.enableGlobalSearch ?? isDefaultSearchable;
				return enableGlobalSearch && item?.dataIndex && item.dataIndex !== 'index';
			})
			.reduce(
				(result, item) => {
					const fieldKey = JSON.stringify(item.dataIndex);
					if (seen.has(fieldKey)) return result;
					seen.add(fieldKey);
					result.push({ field: item.dataIndex, title: item.title });
					return result;
				},
				[] as Array<{ field: any; title?: any }>,
			);
	}, [finalColumns]);

	const searchableFieldKeys = useMemo(
		() => new Set(searchableColumns.map((item) => JSON.stringify(item.field))),
		[searchableColumns],
	);

	const isGlobalSearchFilterGroup = useCallback(
		(filter?: TFilter<any>) => {
			if (!filter?.filters?.length) return false;
			if (filter.operator !== EOperatorType.OR) return false;

			// Global search identifies itself by matching all searchable columns with CONTAIN operator
			// and having the same value across all of them.
			const { filters: subFilters } = filter;
			if (subFilters.length !== searchableColumns.length) return false;

			let keyword: string | undefined;
			return subFilters.every((child) => {
				const fieldKey = JSON.stringify(child?.field);
				if (!searchableFieldKeys.has(fieldKey)) return false;
				if (child?.operator !== EOperatorType.CONTAIN) return false;
				const firstValue = child?.values?.[0];
				if (firstValue === undefined || firstValue === null) return false;

				const normalizedValue = `${firstValue}`.trim();
				if (!normalizedValue) return false;

				if (keyword === undefined) keyword = normalizedValue;
				return keyword === normalizedValue;
			});
		},
		[searchableFieldKeys, searchableColumns],
	);

	const currentGlobalSearchText = useMemo(() => {
		const globalFilter = (filters || []).find((item) => isGlobalSearchFilterGroup(item));
		if (!globalFilter?.filters?.length) return '';

		const value = globalFilter.filters?.[0]?.values?.[0];
		if (value === undefined || value === null) return '';
		return `${value}`.trim();
	}, [filters, isGlobalSearchFilterGroup]);

	useEffect(() => {
		setGlobalSearchText(currentGlobalSearchText);
	}, [currentGlobalSearchText]);

	const createGlobalSearchFilter = useCallback(
		(keyword: string): TFilter<any> => ({
			operator: EOperatorType.OR,
			readOnly: true,
			active: true,
			filters: searchableColumns.map((item) => ({
				field: item.field,
				operator: EOperatorType.CONTAIN,
				values: [keyword],
				readOnly: true,
				active: true,
			})),
		}),
		[searchableColumns],
	);

	const applyGlobalSearch = useCallback(
		(rawValue: string) => {
			const keyword = rawValue?.trim() ?? '';
			const remainFilters = (filters || []).filter((item) => !isGlobalSearchFilterGroup(item));

			if (!keyword || !searchableColumns.length) {
				setFilters?.(remainFilters);
				return;
			}

			searchableColumns.forEach((item) => {
				if (!item.field) return;
				const fieldName = Array.isArray(item.field) ? item.field.join('.') : String(item.field);
				if (fieldName) updateSearchStorage(fieldName, keyword);
			});

			setFilters?.([createGlobalSearchFilter(keyword), ...remainFilters]);
		},
		[filters, isGlobalSearchFilterGroup, searchableColumns, setFilters, createGlobalSearchFilter],
	);

	const debounceSearch = useMemo(() => debounce(applyGlobalSearch, 500), [applyGlobalSearch]);

	useEffect(() => {
		return () => {
			debounceSearch.cancel();
		};
	}, [debounceSearch]);

	const globalSearchPlaceholder = useMemo(() => {
		const labels = searchableColumns
			.map((item) => {
				if (typeof item.title === 'string' || typeof item.title === 'number') return `${item.title}`;
				if (Array.isArray(item.field)) return item.field.join('.');
				return item.field ? String(item.field) : '';
			})
			.filter(Boolean)
			.slice(0, 3)
			.join(', ');

		if (!labels)
			return intl.formatMessage({
				id: 'global.table.index.search.placeholder.default',
			});

		return intl.formatMessage(
			{
				id: 'global.table.index.search.placeholder',
			},
			{ fields: labels },
		);
	}, [intl, searchableColumns]);

	const globalSearchTooltip = useMemo(() => {
		const labels = searchableColumns
			.map((item) => {
				if (typeof item.title === 'string' || typeof item.title === 'number') return `${item.title}`;
				if (Array.isArray(item.field)) return item.field.join('.');
				return item.field ? String(item.field) : '';
			})
			.filter(Boolean)
			.slice(0, 5)
			.join(', ');

		if (!labels)
			return intl.formatMessage({
				id: 'global.table.index.search.tooltip.default',
			});

		return intl.formatMessage(
			{
				id: 'global.table.index.search.tooltip',
			},
			{ fields: labels },
		);
	}, [intl, searchableColumns]);

	useEffect(() => {
		const history = getSearchStorage(globalDataIndex);
		setGlobalOptions(history.map((val: string) => ({ value: val })));
	}, [globalDataIndex]);

	const handleGlobalSearchTrigger = useCallback(
		(value: string) => {
			debounceSearch.cancel();
			const keyword = value?.trim() || '';

			setGlobalSearchText(keyword);
			applyGlobalSearch(keyword);

			const history = getSearchStorage(globalDataIndex);
			setGlobalOptions(history.map((val: string) => ({ value: val, label: val })));

			if (keyword) {
				updateSearchStorage(globalDataIndex, keyword);
			}
			setTimeout(() => {
				searchInputRef.current?.blur();
			}, 0);
		},
		[globalDataIndex, applyGlobalSearch, debounceSearch],
	);

	const renderGlobalSearch = (minimized: boolean) => (
		<AutoComplete
			options={globalOptions}
			value={globalSearchText}
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
				autoFocus={minimized}
				style={
					minimized
						? { width: 250 }
						: globalSearchText
							? { borderColor: primaryColor, outline: '1px solid ' + primaryColor, borderRadius: 4 }
							: undefined
				}
				enterButton={
					!minimized ? (
						<Button
							loading={loading}
							icon={
								<Tooltip title={globalSearchTooltip}>
									<SearchOutlined />
								</Tooltip>
							}
						/>
					) : null
				}
				onSearch={handleGlobalSearchTrigger}
				onChange={(e) => {
					if (e.type === 'click') {
						debounceSearch.cancel();
						setGlobalSearchText('');
						handleGlobalSearchTrigger('');
					} else {
						const val = e.target.value;
						setGlobalSearchText(val);
						debounceSearch(val);
					}
				}}
			/>
		</AutoComplete>
	);

	const isMobile = useMediaQuery({ maxWidth: 767 });
	const isMinimize = minimizeGlobalSearch || isMobile;
	const canShowGlobalSearch = globalSearch && searchableColumns.length > 0;

	//#endregion

	return (
		<div className='header'>
			<div className='action no-print'>
				{btnCreate && (
					<ButtonExtend
						size={size}
						onClick={onCreate}
						icon={<PlusCircleOutlined />}
						className='btn-add'
						type='primary'
						notHideText
						tooltip={intl.formatMessage({ id: 'global.table.index.button.themmoi.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.themmoi' })}
					</ButtonExtend>
				)}

				{btnImport && (
					<ButtonExtend
						size={size}
						icon={<ImportOutlined />}
						onClick={() => setVisibleImport?.(true)}
						className='btn-import'
					>
						{intl.formatMessage({ id: 'global.table.index.button.nhapdulieu' })}
					</ButtonExtend>
				)}
				{btnExport && (
					<ButtonExtend
						size={size}
						icon={<ExportOutlined />}
						onClick={() => setVisibleExport?.(true)}
						className='btn-export'
					>
						{intl.formatMessage({ id: 'global.table.index.button.xuatdulieu' })}
						{selectedIds?.length && selectedIds?.length > 0 ? ` (${selectedIds?.length})` : ''}
					</ButtonExtend>
				)}

				{otherButtons}

				{rowSelection && deleteMany && selectedIds?.length ? (
					<Popconfirm
						title={intl.formatMessage({ id: 'global.table.index.button.xoa.title' }, { count: selectedIds?.length })}
						onConfirm={handleDeleteMany}
					>
						<ButtonExtend type='link' danger>
							{intl.formatMessage({ id: 'global.table.index.button.xoa' }, { count: selectedIds?.length })}
						</ButtonExtend>
					</Popconfirm>
				) : null}
			</div>

			<div className='extra no-print'>
				{canShowGlobalSearch ? (
					isMinimize ? (
						<Popover content={renderGlobalSearch(isMinimize)} trigger='click' placement='bottom'>
							<ButtonExtend
								className='btn-minimize-search'
								size={size}
								loading={loading}
								tooltip={globalSearchTooltip}
								icon={<SearchOutlined />}
								style={globalSearchText ? { borderColor: primaryColor, color: primaryColor } : undefined}
							/>
						</Popover>
					) : (
						renderGlobalSearch(isMinimize)
					)
				) : null}

				{canOpenModalFilter && (
					<ButtonExtend
						className='btn-filter'
						size={size}
						icon={
							findFiltersInColumns(finalColumns, filters)?.length ? (
								<FilterTwoTone twoToneColor={primaryColor} />
							) : (
								<FilterOutlined />
							)
						}
						onClick={() => setVisibleFilter?.(true)}
						tooltip={intl.formatMessage({ id: 'global.table.index.button.boloc.tooltip' })}
						style={findFiltersInColumns(finalColumns, filters)?.length ? { borderColor: primaryColor } : undefined}
					>
						{intl.formatMessage({ id: 'global.table.index.button.boloc' })}
					</ButtonExtend>
				)}

				{btnReload && (
					<ButtonExtend
						size={size}
						icon={<ReloadOutlined />}
						onClick={onReload}
						loading={loading}
						className='btn-reload'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.tailai.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.tailai' })}
					</ButtonExtend>
				)}

				{!hideTotal && (
					<Tooltip title={intl.formatMessage({ id: 'global.table.index.button.tongso.tooltip' })}>
						<div className={classNames({ total: true, small: size === 'small' })}>
							{intl.formatMessage({ id: 'global.table.index.button.tongso' })}:<span>{inputFormat(total || 0)}</span>
						</div>
					</Tooltip>
				)}
				{btnColumnSetting && <ColumnSettings />}
			</div>
		</div>
	);
};
