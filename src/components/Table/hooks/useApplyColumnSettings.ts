import React, { useCallback, useMemo, useRef } from 'react';
import type { IColumn } from '../typing';

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

	const processedColumns = useMemo(() => {
		const handleResize =
			(item: IColumn<any>) =>
			(e: React.SyntheticEvent, { size: s }: any) => {
				const key = String(
					item.key ??
						(Array.isArray(item.dataIndex) ? item.dataIndex.join('.') : ((item.dataIndex as string) ?? item.title)),
				);
				onResize(key, s.width);
			};

		let final: IColumn<any>[] = columns.map((item) => {
			const { resizable = true, dataIndex, title, minWidth, maxWidth } = item;
			const key = String(
				item.key ?? (Array.isArray(dataIndex) ? dataIndex.join('.') : ((dataIndex as string) ?? title)),
			);
			const width = columnsWidth[key] || item.width;

			const baseWidth = item.width;
			const resizableProps = {
				width,
				onHeaderCell: (column: any) => ({
					width: column.width,
					minWidth: minWidth ?? (resizable ? baseWidth * 0.8 : undefined),
					maxWidth: maxWidth ?? (resizable ? baseWidth * 1.2 : undefined),
					onColumnResize: handleResize(item),
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

			return {
				...item,
				...resizableProps,
				children: item.children?.map((child) => {
					const { resizable = true, dataIndex, title, minWidth, maxWidth } = child;
					const childKey = String(
						child.key ?? (Array.isArray(dataIndex) ? dataIndex.join('.') : ((dataIndex as string) ?? title)),
					);
					const childWidth = columnsWidth[childKey] || child.width;
					const baseChildWidth = child.width;

					return {
						...child,
						width: childWidth,
						onHeaderCell: (column: any) => ({
							width: column.width,
							minWidth: minWidth ?? (resizable ? baseChildWidth * 0.8 : undefined),
							maxWidth: maxWidth ?? (resizable ? baseChildWidth * 1.2 : undefined),
							onColumnResize: handleResize(child),
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
				}),
			};
		});

		// Sync settings
		const currentKeys = final.map((col) =>
			String(
				col.key ?? (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : ((col.dataIndex as string) ?? col.title)),
			),
		);
		let updatedSettings = [...columnSettings];
		let hasChange = false;

		// Thêm cột mới
		currentKeys.forEach((key) => {
			if (!updatedSettings.find((s) => s.key === key)) {
				const colDef = final.find(
					(col) =>
						String(
							col.key ??
								(Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : ((col.dataIndex as string) ?? col.title)),
						) === key,
				);
				updatedSettings.push({ key, visible: colDef?.hide !== true });
				hasChange = true;
			}
		});

		// Xóa cột không còn tồn tại
		updatedSettings = updatedSettings.filter((s) => currentKeys.includes(s.key));
		if (updatedSettings.length !== columnSettings.length) hasChange = true;

		if (hasChange) {
			setTimeout(() => setColumnSettings(updatedSettings), 0);
		}

		// Sắp xếp và ẩn hiện theo settings
		final = updatedSettings
			.filter((s) => s.visible !== false)
			.map((s) =>
				final.find(
					(col) =>
						String(
							col.key ??
								(Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : ((col.dataIndex as string) ?? col.title)),
						) === s.key,
				),
			)
			.filter(Boolean) as IColumn<any>[];

		return final;
	}, [columns, columnsWidth, columnSettings, onResize, setColumnsWidth, setColumnSettings]);

	return { processedColumns, onResize };
};
