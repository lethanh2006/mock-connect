import { type IColumn, type TFilter } from '../typing';

/**
 * Chuẩn hóa dữ liệu bộ lọc từ form trước khi gửi lên table context hoặc backend.
 */
export const normalizeFilters = (filters: any[]): TFilter<any>[] => {
	if (!filters || !Array.isArray(filters)) return [];

	const result: TFilter<any>[] = [];

	filters.forEach((f) => {
		if (!f || f.active === false) return;

		const logicOp = f.operator;
		if (logicOp === 'and' || logicOp === 'or' || (f.filters && Array.isArray(f.filters))) {
			const normalizedSubFilters = normalizeFilters(f.filters || []);
			if (normalizedSubFilters.length === 0) return;

			result.push({
				operator: logicOp || 'and',
				filters: normalizedSubFilters,
				active: true,
				values: [],
				readOnly: f.readOnly,
				source: f.source,
			});
			return;
		}

		if (f.field) {
			result.push({
				field: f.field,
				operator: f.operator,
				values: Array.isArray(f.values) ? f.values : f.values !== undefined ? [f.values] : [],
				active: true,
				readOnly: f.readOnly,
				source: f.source,
			});
		}
	});

	return result;
};

export const markExternalFilters = (
	filters: TFilter<any>[] = [],
	options?: { forceReadOnly?: boolean },
): TFilter<any>[] => {
	if (!Array.isArray(filters)) return [];

	return filters.map((filter) => {
		const nextFilter: TFilter<any> = {
			...filter,
			source: 'external',
			...(options?.forceReadOnly ? { readOnly: true } : {}),
		};

		if (Array.isArray(filter?.filters)) {
			nextFilter.filters = markExternalFilters(filter.filters, options);
		}

		return nextFilter;
	});
};

const splitFilterNodeBySource = (
	filter: TFilter<any>,
): {
	tableFilter?: TFilter<any>;
	externalFilter?: TFilter<any>;
} => {
	if (!filter) return {};

	if (Array.isArray(filter.filters) && filter.filters.length > 0) {
		const tableChildren: TFilter<any>[] = [];
		const externalChildren: TFilter<any>[] = [];

		filter.filters.forEach((childFilter) => {
			const { tableFilter, externalFilter } = splitFilterNodeBySource(childFilter);
			if (tableFilter) tableChildren.push(tableFilter);
			if (externalFilter) externalChildren.push(externalFilter);
		});

		const groupBaseFilter: TFilter<any> = { ...filter };
		delete groupBaseFilter.filters;
		delete groupBaseFilter.source;

		return {
			tableFilter: tableChildren.length ? { ...groupBaseFilter, filters: tableChildren } : undefined,
			externalFilter: externalChildren.length
				? { ...groupBaseFilter, filters: externalChildren, source: 'external' }
				: undefined,
		};
	}

	if (filter.source === 'external') {
		return { externalFilter: { ...filter, source: 'external' } };
	}

	return { tableFilter: { ...filter } };
};

export const splitFiltersBySource = (
	filters: TFilter<any>[] = [],
): {
	tableFilters: TFilter<any>[];
	externalFilters: TFilter<any>[];
} => {
	if (!Array.isArray(filters) || !filters.length) {
		return {
			tableFilters: [],
			externalFilters: [],
		};
	}

	const tableFilters: TFilter<any>[] = [];
	const externalFilters: TFilter<any>[] = [];

	filters.forEach((filter) => {
		const { tableFilter, externalFilter } = splitFilterNodeBySource(filter);
		if (tableFilter) tableFilters.push(tableFilter);
		if (externalFilter) externalFilters.push(externalFilter);
	});

	return {
		tableFilters,
		externalFilters,
	};
};

export const stripFilterSource = (filters: TFilter<any>[] = []): TFilter<any>[] => {
	if (!Array.isArray(filters)) return [];

	return filters.map((filter) => {
		const nextFilter: TFilter<any> = { ...filter };
		delete nextFilter.source;

		if (Array.isArray(nextFilter.filters)) {
			nextFilter.filters = stripFilterSource(nextFilter.filters);
		}

		return nextFilter;
	});
};

export const findFiltersInColumns = (columns: IColumn<unknown>[], filters?: any[]): any[] => {
	if (!filters?.length) return [];

	return filters
		.map((filter): any => {
			// Support both filters and filtes (legacy typo).
			const filterArray = filter.filters || filter.filtes;
			if (filterArray && Array.isArray(filterArray)) {
				return {
					filters: findFiltersInColumns(columns, filterArray),
					logicOperator: filter.operator || filter.logicOperator || 'and',
					active: true,
				};
			}

			const field = JSON.stringify(filter.field);
			const column = columns.find((col) => JSON.stringify(col.dataIndex) === field);

			if (column) {
				return {
					field: filter.field,
					operator: filter.operator,
					values: filter.values || [],
					active: true,
				};
			}

			return null;
		})
		.filter(Boolean);
};
