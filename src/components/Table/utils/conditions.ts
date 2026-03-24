import type { QueryCondition, TExternalConditionItem } from '../typing';

/**
 * Bình thường hóa externalConditions về 3 thành phần rời rạc (Conditions, Labels, ValueLabels) để dùng nội bộ.
 */
/**
 * Chuẩn hóa mảng externalConditions (Unified Filter) về 3 thành phần rời rạc (Conditions, Labels, ValueLabels) để dùng nội bộ.
 * Hỗ trợ gộp nhiều toán tử trên cùng một trường dữ liệu.
 * 
 * @template T Kiểu dữ liệu bản ghi.
 * @param input Mảng các điều kiện lọc từ bên ngoài.
 * @returns Object chứa conditions (MongoDB style), labels và valueLabels đã được chuẩn hóa.
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
		const op = operator || '$eq';

		// Gom conditions
		// Nếu field đã tồn tại, ta gộp điều kiện
		if (op === '$eq') {
			// Nếu là $eq, ta ghi đè trực tiếp hoặc gán vào object nếu đã có operator khác
			const existing = out.conditions[fieldKey as keyof T];
			if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
				(out.conditions[fieldKey as keyof T] as any).$eq = value;
			} else {
				out.conditions[fieldKey as keyof T] = value;
			}
		} else {
			const existing = out.conditions[fieldKey as keyof T];
			if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
				(out.conditions[fieldKey as keyof T] as any)[op] = value;
			} else if (existing !== undefined && typeof existing !== 'object') {
				// Chuyển giá trị scalar cũ sang $eq nếu bắt đầu có operator mới
				out.conditions[fieldKey as keyof T] = { $eq: existing, [op]: value } as any;
			} else {
				out.conditions[fieldKey as keyof T] = { [op]: value } as any;
			}
		}

		// Gom labels (Ghi đè cái sau cùng nếu trùng field)
		if (label) out.labels[fieldKey] = label;

		// Gom value labels (Merge hoặc ghi đè)
		if (valueLabel) {
			if (typeof valueLabel === 'object') {
				out.valueLabels[fieldKey] = { ...(out.valueLabels[fieldKey] || {}), ...(valueLabel as any) };
			} else if (typeof valueLabel === 'string') {
				out.valueLabels[fieldKey] = { ...(out.valueLabels[fieldKey] || {}), [String(value)]: valueLabel };
			}
		}
	});

	return out;
};
