import React, { useCallback, useMemo, useRef } from 'react';
import type { IColumn } from '../typing';
import { getColumnKey, mergeColumnSettings } from '../utils';

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
					maxWidth: maxWidth ?? (resizable ? baseWidth * 1.5 : undefined),
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
							maxWidth: maxWidth ?? (resizable ? baseChildWidth * 1.5 : undefined),
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

	// Lọc và sắp xếp columns dựa trên settings hiện tại
	const processedColumns = useMemo(() => {
		const availableColumns = baseProcessedColumns.filter((col) => col.hide !== true);
		const mergedSettings = mergeColumnSettings(columnSettings, columns);

		return mergedSettings
			.map((s) => {
				const col = availableColumns.find((c) => c.key === s.key);
				if (col && s.visible !== false) return col;
				return null;
			})
			.filter(Boolean) as IColumn<any>[];
	}, [baseProcessedColumns, columnSettings, columns]);

	return { processedColumns, onResize };
};
