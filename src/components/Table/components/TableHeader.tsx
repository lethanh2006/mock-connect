import ButtonExtend from '@/components/Table/ButtonExtend';
import { primaryColor } from '@/services/base/constant';
import { inputFormat } from '@/utils/utils';
import {
	IconDownload,
	IconFilter,
	IconMagnifyingglass,
	IconPlus,
	IconRotateArrow,
	IconUpload,
	Popover,
	PopoverContent,
	PopoverTrigger,
	SearchInput,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/Icons';
import { AutoComplete, Popconfirm } from 'antd';
import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useIntl } from 'umi';
import type { TFilter } from '../typing';
import {
	buildGlobalSearchFilter,
	findFiltersInColumns,
	getGlobalSearchKeyword,
	getSearchStorage,
	getStandaloneSearchableFields,
	isGlobalSearchFilter,
	updateSearchStorage,
} from '../utils';
import { ColumnSettings } from './ColumnSettings';
import { useTableContext } from './TableContext';

export const TableHeader: React.FC = () => {
	const intl = useIntl();
	const {
		buttons,
		otherButtons,
		otherTextButtons,
		otherExtra,
		rowSelection,
		deleteMany,
		selectedIds,
		handleDeleteMany,
		hasFilter,
		columns: rawColumns,
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

	const targetColumns = useMemo(() => rawColumns || finalColumns || [], [rawColumns, finalColumns]);

	const searchableColumns = useMemo(() => {
		const flatColumns = targetColumns.map((item) => (item.children?.length ? [item, ...item.children] : [item])).flat();

		const seen = new Set<string>();
		return flatColumns
			.filter((item) => {
				const isDefaultSearchable = item?.filterType === 'string';
				const enableGlobalSearch = item?.enableGlobalSearch ?? isDefaultSearchable;
				return enableGlobalSearch && item?.dataIndex && item.dataIndex !== 'index' && item?.hide !== true;
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
	}, [targetColumns]);

	const searchableFieldKeys = useMemo(
		() => new Set(searchableColumns.map((item) => JSON.stringify(item.field))),
		[searchableColumns],
	);

	const currentGlobalSearchText = useMemo(() => {
		const globalFilter = (filters || []).find((item) => isGlobalSearchFilter(item, searchableFieldKeys));
		return getGlobalSearchKeyword(globalFilter, searchableFieldKeys) ?? '';
	}, [filters, searchableFieldKeys]);

	useEffect(() => {
		setGlobalSearchText(currentGlobalSearchText);
	}, [currentGlobalSearchText]);

	const createGlobalSearchFilter = useCallback(
		(keyword: string, excludedFields: any[] = []): TFilter<any> | undefined =>
			buildGlobalSearchFilter(
				keyword,
				searchableColumns.map((item) => item.field),
				excludedFields,
			),
		[searchableColumns],
	);

	const applyGlobalSearch = useCallback(
		(rawValue: string) => {
			const keyword = rawValue?.trim() ?? '';
			const remainFilters = (filters || []).filter((item) => !isGlobalSearchFilter(item, searchableFieldKeys));
			const excludedFields = getStandaloneSearchableFields(remainFilters, searchableFieldKeys);

			if (!keyword || !searchableColumns.length) {
				setFilters?.(remainFilters);
				return;
			}

			searchableColumns.forEach((item) => {
				if (!item.field) return;
				const fieldName = Array.isArray(item.field) ? item.field.join('.') : String(item.field);
				if (fieldName) updateSearchStorage(fieldName, keyword);
			});

			const nextGlobalSearch = createGlobalSearchFilter(keyword, excludedFields);
			setFilters?.(nextGlobalSearch ? [nextGlobalSearch, ...remainFilters] : remainFilters);
		},
		[filters, searchableColumns, searchableFieldKeys, setFilters, createGlobalSearchFilter],
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
			<SearchInput
				ref={searchInputRef}
				variant='tiled'
				className={classNames('global-search', { 'has-value': !!globalSearchText })}
				size={size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium'}
				clearable
				value={globalSearchText}
				placeholder={globalSearchPlaceholder}
				autoFocus={minimized}
				title={globalSearchTooltip}
				autoComplete='off'
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleGlobalSearchTrigger((e.target as HTMLInputElement).value);
				}}
				onClear={() => {
					debounceSearch.cancel();
					handleGlobalSearchTrigger('');
				}}
				onChange={(e) => {
					const val = e.target.value;
					setGlobalSearchText(val);
					debounceSearch(val);
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
						icon={<IconPlus />}
						className='btn-add'
						type='primary'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.themmoi.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.themmoi' })}
					</ButtonExtend>
				)}

				{btnImport && (
					<ButtonExtend
						size={size}
						icon={<IconUpload />}
						onClick={() => setVisibleImport?.(true)}
						className='btn-import'
					>
						{intl.formatMessage({ id: 'global.table.index.button.nhapdulieu' })}
					</ButtonExtend>
				)}
				{btnExport && (
					<ButtonExtend
						size={size}
						icon={<IconDownload />}
						onClick={() => setVisibleExport?.(true)}
						className='btn-export'
					>
						{intl.formatMessage({ id: 'global.table.index.button.xuatdulieu' })}
						{/* {selectedIds?.length && selectedIds?.length > 0 ? ` (${selectedIds?.length})` : ''} */}
					</ButtonExtend>
				)}

				{otherButtons}

				{btnReload && (
					<ButtonExtend
						size={size}
						icon={<IconRotateArrow />}
						onClick={onReload}
						loading={loading}
						className='btn-reload'
						tooltip={intl.formatMessage({ id: 'global.table.index.button.tailai.tooltip' })}
					>
						{intl.formatMessage({ id: 'global.table.index.button.tailai' })}
					</ButtonExtend>
				)}

				{otherTextButtons}

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
				{btnColumnSetting && <ColumnSettings />}

				{canOpenModalFilter && (
					<ButtonExtend
						className='btn-filter'
						size={size}
						icon={<IconFilter />}
						onClick={() => setVisibleFilter?.(true)}
						tooltip={intl.formatMessage({ id: 'global.table.index.button.boloc.tooltip' })}
						style={findFiltersInColumns(targetColumns, filters)?.length ? { borderColor: primaryColor } : undefined}
					>
						{intl.formatMessage({ id: 'global.table.index.button.boloc' })}
					</ButtonExtend>
				)}

				{canShowGlobalSearch ? (
					isMinimize ? (
						<Popover>
							<PopoverTrigger asChild>
								<ButtonExtend
									className='btn-minimize-search'
									size={size}
									loading={loading}
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

				{!hideTotal && (
					<Tooltip>
						<TooltipTrigger asChild>
							<div className={classNames({ total: true, small: size === 'small' })}>
								{intl.formatMessage({ id: 'global.table.index.button.tongso' })}:<span>{inputFormat(total || 0)}</span>
							</div>
						</TooltipTrigger>
						<TooltipContent>{intl.formatMessage({ id: 'global.table.index.button.tongso.tooltip' })}</TooltipContent>
					</Tooltip>
				)}

				{otherExtra}
			</div>
		</div>
	);
};
