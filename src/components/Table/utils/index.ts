import React from 'react';
import type { IColumn } from '../typing';

export { normalizeExternalConditions } from './conditions';
export {
	applyColumnStringSearch,
	buildGlobalSearchFilter,
	findFiltersInColumns,
	findGlobalSearchFilter,
	getGlobalSearchKeyword,
	getStandaloneSearchableFields,
	isGlobalSearchFilter,
	markExternalFilters,
	normalizeFilters,
	reAddMetadata,
	splitFiltersBySource,
	stripFilterSource,
	stripMetadata,
} from './filters';

export const updateSearchStorage = (dataIndex: string, value: string) => {
	if (!value || !value.trim()) return;
	const savedSearchValues = JSON.parse(localStorage.getItem('dataTimKiem') || '{}');
	const currentSearchValues = savedSearchValues[dataIndex] || [];

	const uniqueValues = currentSearchValues.filter((item: string) => item.toLowerCase() !== value.toLowerCase());
	const newValues = [value, ...uniqueValues].slice(0, 10);

	savedSearchValues[dataIndex] = newValues;
	localStorage.setItem('dataTimKiem', JSON.stringify(savedSearchValues));
};

export const getSearchStorage = (dataIndex: string) => {
	const saved = JSON.parse(localStorage.getItem('dataTimKiem') || '{}');
	return saved[dataIndex] || [];
};

// Hàm hỗ trợ trích lọc nội dung text từ ReactNode (như Tooltip, Tag, v.v.)
const extractText = (node: any): string => {
	if (!node) return '';
	if (typeof node === 'string' || typeof node === 'number') return String(node);
	if (Array.isArray(node)) return node.map(extractText).join('');
	if (React.isValidElement(node)) {
		const props = node.props as any;
		if (props.children) return extractText(props.children);
		if (props.title) return extractText(props.title);
	}
	return '';
};

// Tạo key duy nhất cho column dựa trên key, dataIndex hoặc kết hợp title
export const getColumnKey = (item: IColumn<any>, index: number) => {
	if (item.key) return String(item.key);

	// Trích xuất text từ title để làm part của key giúp tăng độ duy nhất
	let titleText = '';
	if (typeof item.title !== 'function') {
		titleText = extractText(item.title);
	}
	const titleHash = titleText ? stringHash(titleText) : '';

	if (item.dataIndex) {
		const baseKey = Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : String(item.dataIndex);
		// Kết hợp dataIndex với titleHash để phân biệt các cột dùng chung dataIndex nhưng khác tiêu đề
		return titleHash ? `${baseKey}_${titleHash}` : baseKey;
	}

	if (titleText) {
		// Nếu có title rõ ràng, dùng hash của title để đảm bảo tính ổn định (không phụ thuộc index)
		return `col_${titleHash}`;
	}

	// Cuối cùng nếu không có gì để định danh, mới dùng index
	return `col_idx_${index}`;
};

// Merge cấu hình cột hiện tại với danh sách cột mới từ code.
export const mergeColumnSettings = (
	currentSettings: Array<{ key: string; visible: boolean }>,
	newColumns: IColumn<any>[],
): Array<{ key: string; visible: boolean }> => {
	if (!currentSettings || currentSettings.length === 0) {
		return newColumns
			.filter((col) => col.hide !== true)
			.map((col, index) => ({
				key: getColumnKey(col, index),
				visible: col.initialHide !== true,
			}));
	}

	const availableColumns = newColumns.filter((col) => col.hide !== true);
	const availableKeys = availableColumns.map((col, index) => getColumnKey(col, index));

	// 1. Lọc bỏ các cột không còn tồn tại trong code và loại bỏ các Key trùng lặp (nếu lướt bị cache lỗi)
	const seenResultKeys = new Set<string>();
	const result = currentSettings.filter((s) => {
		if (!availableKeys.includes(s.key)) return false;
		if (seenResultKeys.has(s.key)) return false;
		seenResultKeys.add(s.key);
		return true;
	});

	const resultKeys = new Set(result.map((s) => s.key));

	// 2. Chèn các cột mới vào đúng vị trí tương đối
	availableColumns.forEach((col, index) => {
		const key = getColumnKey(col, index);
		if (resultKeys.has(key)) return;

		// Tìm vị trí để chèn: Thử tìm hàng xóm phía trước (prev)
		let inserted = false;
		for (let i = index - 1; i >= 0; i--) {
			const prevKey = availableKeys[i];
			const targetIndex = result.findIndex((s) => s.key === prevKey);
			if (targetIndex !== -1) {
				result.splice(targetIndex + 1, 0, { key, visible: col.initialHide !== true });
				inserted = true;
				break;
			}
		}

		// Nếu không tìm thấy hàng xóm phía trước, thử tìm hàng xóm phía sau (next)
		if (!inserted) {
			for (let i = index + 1; i < availableKeys.length; i++) {
				const nextKey = availableKeys[i];
				const targetIndex = result.findIndex((s) => s.key === nextKey);
				if (targetIndex !== -1) {
					result.splice(targetIndex, 0, { key, visible: col.initialHide !== true });
					inserted = true;
					break;
				}
			}
		}

		// Cuối cùng nếu vẫn không tìm thấy (bảng trống hoặc toàn cột mới), đẩy vào cuối
		if (!inserted) {
			result.push({ key, visible: col.initialHide !== true });
		}

		resultKeys.add(key);
	});

	return result;
};

// Hàm hash chuỗi đơn giản để tạo mã ngắn gọn (8 ký tự)
export const stringHash = (str: string): string => {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash).toString(16).padStart(8, '0');
};

// Tạo "vân tay" của bảng dựa trên cấu trúc các cột (key/dataIndex)
export const getTableFingerprint = (columns: IColumn<any>[]): string => {
	if (!columns || !Array.isArray(columns)) return 'empty';
	const columnIds = columns.map((col, index) => {
		if (col.key) return String(col.key);
		if (col.dataIndex) return Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : String(col.dataIndex);
		return `col_${index}`;
	});
	return columnIds.join('|');
};
