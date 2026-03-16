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
import { Button, Input, Popconfirm, Tooltip } from 'antd';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'umi';
import { EOperatorType } from '../constant';
import type { TFilter } from '../typing';
import { findFiltersInColumns } from '../utils';
import { updateSearchStorage } from '../utils';
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
		size,
	} = useTableContext();
	const [globalSearchText, setGlobalSearchText] = useState<string>('');

	const searchableColumns = useMemo(() => {
		const flatColumns = finalColumns
			.map((item) => (item.children?.length ? [item, ...item.children] : [item]))
			.flat();

		const seen = new Set<string>();
		return flatColumns
			.filter((item) => item?.filterType === 'string' && item?.dataIndex && item.dataIndex !== 'index')
			.reduce((result, item) => {
				const fieldKey = JSON.stringify(item.dataIndex);
				if (seen.has(fieldKey)) return result;
				seen.add(fieldKey);
				result.push({ field: item.dataIndex, title: item.title });
				return result;
			}, [] as Array<{ field: any; title?: any }>);
	}, [finalColumns]);

	const searchableFieldKeys = useMemo(
		() => new Set(searchableColumns.map((item) => JSON.stringify(item.field))),
		[searchableColumns],
	);

	const isGlobalSearchFilterGroup = useCallback(
		(filter?: TFilter<any>) => {
			if (!filter?.filters?.length) return false;
			if (filter.operator !== EOperatorType.OR) return false;

			const hasGlobalMarker =
				filter.readOnly === true || filter.filters.every((item) => item?.readOnly === true);
			if (!hasGlobalMarker) return false;

			let keyword: string | undefined;
			return filter.filters.every((child) => {
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
		[searchableFieldKeys],
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
			active: true,
			operator: EOperatorType.OR,
			readOnly: true,
			filters: searchableColumns.map((item) => ({
				active: true,
				field: item.field,
				operator: EOperatorType.CONTAIN,
				values: [keyword],
				readOnly: true,
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

	const canShowGlobalSearch = buttons?.globalSearch !== false && searchableColumns.length > 0;

	return (
		<div className='header'>
			<div className='action no-print'>
				{buttons?.create !== false ? (
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
				) : null}

				{buttons?.import ? (
					<ButtonExtend
						size={size}
						icon={<ImportOutlined />}
						onClick={() => setVisibleImport?.(true)}
						className='btn-import'
					>
						{intl.formatMessage({ id: 'global.table.index.button.nhapdulieu' })}
					</ButtonExtend>
				) : null}
				{buttons?.export ? (
					<ButtonExtend
						size={size}
						icon={<ExportOutlined />}
						onClick={() => setVisibleExport?.(true)}
						className='btn-export'
					>
						{intl.formatMessage({ id: 'global.table.index.button.xuatdulieu' })}{' '}
						{selectedIds?.length && selectedIds?.length > 0 ? `(${selectedIds?.length})` : ''}
					</ButtonExtend>
				) : null}

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

			<div className='extra  no-print'>
				{canShowGlobalSearch ? (
					<Input.Search
						className='global-search'
						size={size}
						allowClear
						value={globalSearchText}
						placeholder={globalSearchPlaceholder}
						enterButton={
							<Button
								icon={
									<Tooltip title={globalSearchTooltip}>
										<SearchOutlined className='global-search-tooltip-icon' />
									</Tooltip>
								}
							/>
						}
						onChange={(e) => {
							const nextValue = e.target.value;
							setGlobalSearchText(nextValue);
							if (!nextValue) applyGlobalSearch('');
						}}
						onSearch={(value) => {
							setGlobalSearchText(value);
							applyGlobalSearch(value);
						}}
					/>
				) : null}

				{buttons?.reload !== false ? (
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
				) : null}

				{buttons?.filter !== false && hasFilter ? (
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
						style={
							findFiltersInColumns(finalColumns, filters)?.length
								? {
										borderColor: primaryColor,
										borderWidth: '1px',
										borderStyle: 'solid',
									}
								: undefined
						}
					>
						{intl.formatMessage({ id: 'global.table.index.button.boloc' })}
					</ButtonExtend>
				) : null}

				{!hideTotal ? (
					<Tooltip title={intl.formatMessage({ id: 'global.table.index.button.tongso.tooltip' })}>
						<div className={classNames({ total: true, small: size === 'small' })}>
							{intl.formatMessage({ id: 'global.table.index.button.tongso' })}:<span>{inputFormat(total || 0)}</span>
						</div>
					</Tooltip>
				) : null}

				<ColumnSettings />
			</div>
		</div>
	);
};
