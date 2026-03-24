import type { QueryCondition, TExternalConditionItem } from '../typing';

/**
 * Bình thường hóa externalConditions về 3 thành phần rời rạc (Conditions, Labels, ValueLabels) để dùng nội bộ.
 */
export const normalizeExternalConditions = <T extends object>(input?: TExternalConditionItem<T>[]) => {
	const out = {
		conditions: {} as QueryCondition<T>,
		labels: {} as Record<string, string>,
		valueLabels: {} as Record<string, Record<string, string>>,
	};

	if (!input || !Array.isArray(input)) return out;

	input.forEach((item) => {
		const { field, value, operator, label, valueLabel } = item;
		const fieldKey = String(field);

		// Gom conditions
		if (operator && operator !== '$eq') {
			out.conditions[fieldKey as keyof T] = { [operator]: value } as any;
		} else {
			out.conditions[fieldKey as keyof T] = value;
		}

		// Gom labels
		if (label) out.labels[fieldKey] = label;

		// Gom value labels
		if (valueLabel && typeof valueLabel === 'object') {
			out.valueLabels[fieldKey] = valueLabel as Record<string, string>;
		} else if (typeof valueLabel === 'string') {
			out.valueLabels[fieldKey] = { [String(value)]: valueLabel };
		}
	});

	return out;
};
