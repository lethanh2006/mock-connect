import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { IColumn } from '../typing';
import { getColumnKey } from '../utils';

interface UseApplyColumnSettingsProps {
	columns: IColumn<any>[];
	columnSettings: Array<{ key: string; visible: boolean }>;
	columnsWidth: Record<string, number>;
	setColumnsWidth: React.Dispatch<React.SetStateAction<Record<string, number>>>;
	setColumnSettings: React.Dispatch<React.SetStateAction<Array<{ key: string; visible: boolean }>>>;
}

export const useApplyColumnSettings = ({
	columns,
	columnSettings,
	columnsWidth,
	setColumnsWidth,
	setColumnSettings,
}: UseApplyColumnSettingsProps) => {
	const rafRef = useRef<number | null>(null);

	const onResize = useCallback(
		(key: string, newWidth: number) => {
			if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
			rafRef.current = window.requestAnimationFrame(() => {
				setColumnsWidth((prev) => {
					if (prev[key] === newWidth) return prev;
					return {
						...prev,
						[key]: newWidth,
					};
				});
			});
		},
		[setColumnsWidth],
	);

	// Tạo danh sách cột đã được bổ sung key và resize info
	const baseProcessedColumns = useMemo(() => {
		return columns.map((item, index) => {
			const { resizable = true, minWidth, maxWidth } = item;
			const key = getColumnKey(item, index);
			const width = columnsWidth[key] || item.width;
			const baseWidth = item.width;

			const handleResize = (e: React.SyntheticEvent, { size: s }: any) => {
				onResize(key, s.width);
			};

			const processedItem: IColumn<any> = {
				...item,
				key,
				width,
				onHeaderCell: (column: any) => ({
					width: column.width,
					minWidth: minWidth ?? (resizable ? baseWidth * 0.8 : undefined),
					maxWidth: maxWidth ?? (resizable ? baseWidth * 1.2 : undefined),
					onColumnResize: handleResize,
					resizable: resizable,
					onDoubleClick: () => {
						if (resizable) {
							setColumnsWidth((prev) => {
								const newWidths = { ...prev };
								delete newWidths[key];
								return newWidths;
							});
						}
					},
				}),
			};

			if (item.children) {
				processedItem.children = item.children.map((child, cIndex) => {
					const { resizable = true, minWidth, maxWidth } = child;
					const childKey = getColumnKey(child, cIndex);
					const childWidth = columnsWidth[childKey] || child.width;
					const baseChildWidth = child.width;

					const handleChildResize = (e: React.SyntheticEvent, { size: s }: any) => {
						onResize(childKey, s.width);
					};

					return {
						...child,
						key: childKey,
						width: childWidth,
						onHeaderCell: (column: any) => ({
							width: column.width,
							minWidth: minWidth ?? (resizable ? baseChildWidth * 0.8 : undefined),
							maxWidth: maxWidth ?? (resizable ? baseChildWidth * 1.2 : undefined),
							onColumnResize: handleChildResize,
							resizable: resizable,
							onDoubleClick: () => {
								if (resizable) {
									setColumnsWidth((prev) => {
										const newWidths = { ...prev };
										delete newWidths[childKey];
										return newWidths;
									});
								}
							},
						}),
					};
				});
			}

			return processedItem;
		});
	}, [columns, columnsWidth, onResize, setColumnsWidth]);

	// Đồng bộ settings (ẩn/hiện, thứ tự) khi danh sách columns thay đổi
	useEffect(() => {
		// Chỉ lấy những cột không bị ẩn hoàn toàn (hide !== true)
		const visibleInSettingsColumns = baseProcessedColumns.filter((col) => col.hide !== true);
		const currentKeys = visibleInSettingsColumns.map((col) => col.key as string);
		let updatedSettings = [...columnSettings];
		let hasChange = false;

		// Thêm các cột mới chưa có trong settings
		currentKeys.forEach((key) => {
			if (!updatedSettings.find((s) => s.key === key)) {
				const colDef = visibleInSettingsColumns.find((col) => col.key === key);
				// Mặc định ẩn nếu hide === true HOẶC initialHide === true
				const isDefaultVisible = colDef?.hide !== true && colDef?.initialHide !== true;
				updatedSettings.push({ key, visible: isDefaultVisible });
				hasChange = true;
			}
		});

		// Loại bỏ các cột không còn tồn tại trong columns hoặc đã bị đổi thành hide: true
		const filteredSettings = updatedSettings.filter((s) => currentKeys.includes(s.key));
		if (filteredSettings.length !== updatedSettings.length) {
			updatedSettings = filteredSettings;
			hasChange = true;
		}

		if (hasChange) {
			setColumnSettings(updatedSettings);
		}
	}, [baseProcessedColumns, columnSettings, setColumnSettings]);

	// Lọc và sắp xếp columns dựa trên settings hiện tại
	const processedColumns = useMemo(() => {
		// Loại bỏ vĩnh viễn các cột có hide === true
		const availableColumns = baseProcessedColumns.filter((col) => col.hide !== true);

		if (!columnSettings?.length) return availableColumns;

		return columnSettings
			.filter((s) => s.visible !== false)
			.map((s) => availableColumns.find((col) => col.key === s.key))
			.filter(Boolean) as IColumn<any>[];
	}, [baseProcessedColumns, columnSettings]);

	return { processedColumns, onResize };
};
