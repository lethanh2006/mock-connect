import { EOperatorType } from '../constant';
import type { TFilter } from '../typing';

type FindFilterOptions = {
	excludeExternal?: boolean;
};

type UpdateFilterOptions = {
	skipReadOnlyExternal?: boolean;
	skipExternal?: boolean;
};

const normalizeFieldValue = (field: any) => (Array.isArray(field) ? field.join('.') : field);

export const isExternalFilterNode = (filter?: TFilter<any>) => filter?.source === 'external';

export const isSameFilterField = (filterField: any, fieldName: any): boolean => {
	const normalizedFilterField = normalizeFieldValue(filterField);
	const normalizedFieldName = normalizeFieldValue(fieldName);

	if (normalizedFilterField === undefined || normalizedFieldName === undefined) return false;
	return JSON.stringify(normalizedFilterField) === JSON.stringify(normalizedFieldName);
};

export const findFilterInTree = (
	filterList: TFilter<any>[] | undefined,
	fieldName: any,
	operator?: EOperatorType,
	active?: boolean,
	options?: FindFilterOptions,
): TFilter<any> | undefined => {
	if (!Array.isArray(filterList) || !filterList.length) return undefined;

	for (const item of filterList) {
		if (options?.excludeExternal === true && isExternalFilterNode(item)) continue;

		if (
			isSameFilterField(item?.field, fieldName) &&
			(operator === undefined || item.operator === operator) &&
			(active === undefined || item.active === undefined || item.active === active)
		) {
			return item;
		}

		if (Array.isArray(item.filters) && item.filters.length) {
			const nestedFilter = findFilterInTree(item.filters, fieldName, operator, active, options);
			if (nestedFilter) return nestedFilter;
		}
	}

	return undefined;
};

export const updateFiltersByField = (
	filterList: TFilter<any>[] | undefined,
	fieldName: any,
	updater: (filter: TFilter<any>) => TFilter<any> | null,
	options?: UpdateFilterOptions,
): { filters: TFilter<any>[]; matched: boolean } => {
	if (!Array.isArray(filterList) || !filterList.length) {
		return { filters: [], matched: false };
	}

	let matched = false;
	const nextFilters: TFilter<any>[] = [];

	for (const filter of filterList) {
		if (options?.skipExternal === true && isExternalFilterNode(filter)) {
			nextFilters.push(filter);
			continue;
		}

		let nextFilter: TFilter<any> | null = filter;

		if (Array.isArray(filter.filters) && filter.filters.length) {
			const nestedResult = updateFiltersByField(filter.filters, fieldName, updater, options);
			if (nestedResult.matched) matched = true;

			if (nestedResult.filters.length) {
				nextFilter = { ...filter, filters: nestedResult.filters };
			} else {
				// Nếu nhóm không còn điều kiện con thì loại bỏ nhóm rỗng
				nextFilter = filter.field ? { ...filter, filters: [] } : null;
			}
		}

		if (nextFilter && isSameFilterField(nextFilter.field, fieldName)) {
			const isBlockedByExternal = options?.skipExternal === true && isExternalFilterNode(nextFilter);
			const isBlockedByReadOnlyExternal =
				options?.skipReadOnlyExternal === true &&
				nextFilter.readOnly === true &&
				isExternalFilterNode(nextFilter);

			if (!isBlockedByExternal && !isBlockedByReadOnlyExternal) {
				nextFilter = updater(nextFilter);
				matched = true;
			}
		}

		if (nextFilter) nextFilters.push(nextFilter);
	}

	return { filters: nextFilters, matched };
};
