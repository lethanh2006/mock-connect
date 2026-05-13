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

export const reAddMetadata = (
	filters: TFilter<any>[],
	columns: IColumn<any>[],
	searchableFieldKeys: Set<string>,
	totalSearchableColumns: number,
	inheritedReadOnly?: boolean,
): TFilter<any>[] => {
	if (!filters || !Array.isArray(filters)) return [];

	return filters.map((filter) => {
		const nextFilter = { ...filter, active: filter.active ?? true };
		const isGlobal = isGlobalSearchFilter(nextFilter, searchableFieldKeys, totalSearchableColumns);

		// Tự động nhận diện ReadOnly theo cột (Ưu tiên cấu hình thủ công)
		if (nextFilter.field) {
			const col = columns.find(
				(c) => (Array.isArray(c.dataIndex) ? c.dataIndex.join('.') : c.dataIndex) === nextFilter.field,
			);
			
			if (col?.readOnly !== undefined) {
				// Nếu có cấu hình readOnly (true/false) cụ thể ở cột, ưu tiên tuyệt đối
				nextFilter.readOnly = col.readOnly;
			} else if (col?.handleFilter) {
				// Nếu không cấu hình readOnly nhưng có handleFilter, mặc định khóa
				nextFilter.readOnly = true;
			} else if (isGlobal || inheritedReadOnly || nextFilter.source === 'external') {
				// Nếu thuộc nhóm Global Search hoặc nguồn bên ngoài, mặc định khóa
				nextFilter.readOnly = true;
			} else {
				// Các trường hợp còn lại đảm bảo không bị dính cờ readOnly cũ
				delete nextFilter.readOnly;
			}
		} else {
			// Xử lý cho Nhóm (Group)
			if (isGlobal || inheritedReadOnly || nextFilter.source === 'external') {
				nextFilter.readOnly = true;
				if (Array.isArray(nextFilter.filters)) {
					nextFilter.filters = nextFilter.filters.map((sub) => ({ ...sub, readOnly: true, active: true }));
				}
			}
		}

		// Đệ quy cho nhóm
		if (Array.isArray(nextFilter.filters)) {
			nextFilter.filters = reAddMetadata(
				nextFilter.filters,
				columns,
				searchableFieldKeys,
				totalSearchableColumns,
				nextFilter.readOnly, // Truyền trạng thái khóa xuống con
			);
		}

		return nextFilter;
	});
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

export const stripMetadata = (filters: TFilter<any>[] = []): TFilter<any>[] => {
	if (!Array.isArray(filters)) return [];

	return filters.map((filter) => {
		const { active, readOnly, source, ...rest } = filter;
		const nextFilter: TFilter<any> = { ...rest };

		if (Array.isArray(filter.filters)) {
			nextFilter.filters = stripMetadata(filter.filters);
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

export const isGlobalSearchFilter = (filter: TFilter<any>, searchableFieldKeys: Set<string>, totalSearchableColumns: number) => {
	if (!filter?.filters?.length) return false;
	if (filter.operator !== 'or') return false;

	const { filters: subFilters } = filter;
	if (subFilters.length !== totalSearchableColumns) return false;

	let keyword: string | undefined;
	return subFilters.every((child) => {
		const fieldKey = JSON.stringify(child?.field);
		if (!searchableFieldKeys.has(fieldKey)) return false;
		if (child?.operator !== 'contain') return false;
		const firstValue = child?.values?.[0];
		if (firstValue === undefined || firstValue === null) return false;

		const normalizedValue = `${firstValue}`.trim();
		if (!normalizedValue) return false;

		if (keyword === undefined) keyword = normalizedValue;
		return keyword === normalizedValue;
	});
};
