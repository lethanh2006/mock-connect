import { Namespaces } from '@/pages/TienIch/AuditLog/Modal';
import type { InputRef } from 'antd';
import _ from 'lodash';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { IColumn, TableBaseProps, TExternalConditionItem, TFilter } from '../typing';
import { getTableFingerprint, stringHash } from '../utils';

export interface IColumnSetting {
	key: string;
	visible: boolean;
	order?: number;
}

interface TableContextValue<T extends object = any> {
	// Trạng thái hiển thị Modal
	visibleFilter?: boolean;
	setVisibleFilter?: (visible: boolean) => void;
	visibleImport?: boolean;
	setVisibleImport?: (visible: boolean) => void;
	visibleExport?: boolean;
	setVisibleExport?: (visible: boolean) => void;

	// Trạng thái các cột
	finalColumns: IColumn<T>[];
	setFinalColumns?: React.Dispatch<React.SetStateAction<IColumn<T>[]>>;
	columns: IColumn<T>[]; // Columns gốc (chưa lọc hide)

	// Ref của ô nhập tìm kiếm
	searchInputRef?: React.RefObject<InputRef | null>;

	// Trạng thái resize cột
	columnsWidth: Record<string, number>;
	setColumnsWidth: React.Dispatch<React.SetStateAction<Record<string, number>>>;

	// Cấu hình hiển thị và thứ tự cột
	columnSettings: IColumnSetting[];
	setColumnSettings: React.Dispatch<React.SetStateAction<IColumnSetting[]>>;

	// Trạng thái bảng
	selectedIds?: (string | number)[];
	setSelectedIds?: (ids?: (string | number)[]) => void;
	loading?: boolean;
	total?: number;
	filters?: TFilter<T>[];
	hasFilter?: boolean;

	// Các hành động trên bảng
	handleDeleteMany?: () => void;
	onCreate?: () => void;
	onReload?: () => void;

	// Cấu hình bảng
	buttons?: TableBaseProps['buttons'];
	otherButtons?: React.ReactNode;
	rowSelection?: boolean;
	deleteMany?: boolean;
	hideTotal?: boolean;
	hideFilterColumn?: boolean;
	disableFilterModal?: boolean;
	syncExternalToColumnFilter?: boolean;
	columnSetting?: boolean;
	size?: 'small' | 'middle' | 'large';

	// Trạng thái modal form
	visibleForm?: boolean;
	setVisibleForm?: (visible: boolean) => void;
	isView?: boolean;
	edit?: boolean;
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
	modelName?: Namespaces;
	configKey?: string;
	modelImportName?: Namespaces;
	modelExportName?: Namespaces;
	params?: any;
	getData?: (params: any) => void;
	setFilters?: (filters: TFilter<T>[]) => void;
	externalConditions?: TExternalConditionItem<T>[];
}

export const TableContext = createContext<TableContextValue<any> | undefined>(undefined);

interface TableProviderProps<T extends object = any> {
	children: ReactNode;
	value: Omit<
		TableContextValue<T>,
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
		| 'columnSettings'
		| 'setColumnSettings'
		| 'searchInputRef'
	>;
}

let tableSequence = 0;
let lastPath = '';

const getTableSequence = (path: string) => {
	if (path !== lastPath) {
		lastPath = path;
		tableSequence = 0;
	}
	return ++tableSequence;
};

export const TableProvider = <T extends object = any>({ children, value: externalValue }: TableProviderProps<T>) => {
	const [visibleFilter, setVisibleFilter] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleExport, setVisibleExport] = useState(false);
	const [finalColumns, setFinalColumns] = useState<IColumn<T>[]>([]);
	const [instanceSeq] = useState(() => getTableSequence(window.location.pathname));

	const configStorageKey = useMemo(() => {
		const pathname = window.location.pathname.replace(/\//g, '_');

		// 1. ƯU TIÊN: Nếu có configKey (định danh thủ công), dùng để đảm bảo ổn định tuyệt đối (Dùng cho CỘT ĐỘNG)
		if (externalValue.configKey) {
			return `tableConfig_${pathname}_${stringHash(externalValue.configKey)}_manual`;
		}

		// 2. MẶC ĐỊNH: Dùng Model + Fingerprint (Vân tay cột)
		// Giúp phân biệt các bảng tĩnh khác nhau dựa trên nội dung cột mà không phụ thuộc thứ tự render
		const fingerprint = getTableFingerprint(externalValue.columns);
		const identifier = [externalValue.modelName, fingerprint].filter(Boolean).join('_');

		// 3. AN TOÀN: Vẫn cộng thêm instanceSeq để tách biệt 2 bảng giống hệt nhau (cùng model, cùng cột) trên 1 trang
		return `tableConfig_${pathname}_${stringHash(identifier)}_seq${instanceSeq}`;
	}, [externalValue.configKey, externalValue.modelName, externalValue.columns, instanceSeq]);

	const [columnsWidth, setColumnsWidth] = useState<Record<string, number>>(() => {
		try {
			const saved = localStorage.getItem(configStorageKey);
			return saved ? JSON.parse(saved).widths || {} : {};
		} catch (e) {
			return {};
		}
	});

	const [columnSettings, setColumnSettings] = useState<IColumnSetting[]>(() => {
		try {
			const saved = localStorage.getItem(configStorageKey);
			return saved ? JSON.parse(saved).columns || [] : [];
		} catch (e) {
			return [];
		}
	});

	useEffect(() => {
		const hasWidths = Object.keys(columnsWidth).length > 0;
		const hasSettings = columnSettings.length > 0;

		// Nếu không có gì để lưu và cũng chưa có gì trong storage thì không tạo mới
		if (!hasWidths && !hasSettings) {
			const existing = localStorage.getItem(configStorageKey);
			if (!existing) return;
		}

		const config = {
			widths: columnsWidth,
			columns: columnSettings,
		};
		localStorage.setItem(configStorageKey, JSON.stringify(config));
	}, [columnsWidth, columnSettings, configStorageKey]);

	// Dùng ref để giữ externalValue ổn định nếu content không đổi (tránh re-render khi parent truyền inline object)
	const externalValueRef = useRef(externalValue);
	if (!_.isEqual(externalValueRef.current, externalValue)) {
		externalValueRef.current = externalValue;
	}

	const searchInputRef = useRef<InputRef>(null);

	const contextValue: TableContextValue = useMemo(
		() => ({
			...externalValueRef.current,
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
			columnSettings,
			setColumnSettings,
			searchInputRef,
		}),
		[externalValueRef.current, visibleFilter, visibleImport, visibleExport, finalColumns, columnsWidth, columnSettings],
	);

	return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
};

export const useTableContext = () => {
	const context = useContext(TableContext);
	if (context === undefined) {
		throw new Error('useTableContext must be used within a TableProvider');
	}
	return context;
};
