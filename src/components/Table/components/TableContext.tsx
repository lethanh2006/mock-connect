import { Namespaces } from '@/pages/TienIch/AuditLog/Modal';
import type { InputRef } from 'antd';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import type { IColumn, TableBaseProps, TFilter } from '../typing';

interface TableContextValue {
	// Trạng thái hiển thị Modal
	visibleFilter: boolean;
	setVisibleFilter: (visible: boolean) => void;
	visibleImport: boolean;
	setVisibleImport: (visible: boolean) => void;
	visibleExport: boolean;
	setVisibleExport: (visible: boolean) => void;

	// Trạng thái các cột
	finalColumns: IColumn<any>[];
	setFinalColumns: React.Dispatch<React.SetStateAction<IColumn<any>[]>>;
	columns: IColumn<any>[]; // Columns gốc (chưa lọc hide)

	// Ref của ô nhập tìm kiếm
	searchInputRef: React.RefObject<InputRef | null>;

	// Trạng thái resize cột
	columnsWidth: Record<string, number>;
	setColumnsWidth: React.Dispatch<React.SetStateAction<Record<string, number>>>;

	// Trạng thái bảng
	selectedIds?: (string | number)[];
	setSelectedIds: (ids?: (string | number)[]) => void;
	loading: boolean;
	total: number;
	filters: TFilter<any>[];
	hasFilter: boolean;

	// Các hành động trên bảng
	handleDeleteMany: () => void;
	onCreate: () => void;
	onReload: () => void;

	// Cấu hình bảng
	buttons?: TableBaseProps['buttons'];
	otherButtons?: React.ReactNode;
	rowSelection?: boolean;
	deleteMany?: boolean;
	hideTotal?: boolean;
	hideFilterColumn?: boolean;
	size?: 'small' | 'middle' | 'large';

	// Trạng thái modal form
	visibleForm: boolean;
	setVisibleForm: (visible: boolean) => void;
	isView: boolean;
	edit: boolean;
	Form?: React.FC;
	title?: React.ReactNode;
	widthDrawer?: number | 'full';
	maskCloseableForm?: boolean;
	destroyModal?: boolean;
	formType?: 'Modal' | 'Drawer';
	modalTitle?: string;
	showModalTitle?: boolean;
	formProps?: any;

	// Cấu hình các modal
	modelName: Namespaces;
	modelImportName?: Namespaces;
	modelExportName?: Namespaces;
	params?: any;
	getData?: (params: any) => void;
	setFilters: (filters: TFilter<any>[]) => void;
}

export const TableContext = createContext<TableContextValue | undefined>(undefined);

interface TableProviderProps {
	children: ReactNode;
	value: Omit<
		TableContextValue,
		| 'visibleFilter'
		| 'setVisibleFilter'
		| 'visibleImport'
		| 'setVisibleImport'
		| 'visibleExport'
		| 'setVisibleExport'
		| 'finalColumns'
		| 'setFinalColumns'
		| 'columnsWidth'
		| 'setColumnsWidth'
		| 'searchInputRef'
	>;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children, value: externalValue }) => {
	const [visibleFilter, setVisibleFilter] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleExport, setVisibleExport] = useState(false);
	const [finalColumns, setFinalColumns] = useState<IColumn<any>[]>([]);
	const storageKey = `columnsWidth_${externalValue.modelName}`;
	const [columnsWidth, setColumnsWidth] = useState<Record<string, number>>(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			return saved ? JSON.parse(saved) : {};
		} catch (e) {
			return {};
		}
	});

	useEffect(() => {
		if (Object.keys(columnsWidth).length > 0) {
			localStorage.setItem(storageKey, JSON.stringify(columnsWidth));
		}
	}, [columnsWidth, storageKey]);

	const searchInputRef = useRef<InputRef>(null);
	const contextValue: TableContextValue = {
		...externalValue,
		visibleFilter,
		setVisibleFilter,
		visibleImport,
		setVisibleImport,
		visibleExport,
		setVisibleExport,
		finalColumns,
		setFinalColumns,
		columnsWidth,
		setColumnsWidth,
		searchInputRef,
	};

	return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
	const context = useContext(TableContext);
	if (context === undefined) {
		throw new Error('useTableContext must be used within a TableProvider');
	}
	return context;
};
