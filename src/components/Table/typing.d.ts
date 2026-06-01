import { Namespaces } from '@/pages/TienIch/AuditLog/Modal';
import { TableProps } from 'antd';
import type { ColumnType } from 'antd/lib/table';
import React, { JSX } from 'react';
import { PageCardProps } from '../PageCard/typing';
import { type EOperatorType } from './constant/constant';

export interface IColumn<T> extends Omit<ColumnType<T>, 'dataIndex' | 'width' | 'children'> {
	/** Ẩn hoàn toàn cột (không hiện trong table, không hiện trong menu cấu hình) */
	hide?: boolean;

	/** Ẩn mặc định (không hiện trong table lần đầu, nhưng có trong menu cấu hình để bật lại) */
	initialHide?: boolean;

	children?: IColumn<T>[];

	/** Cho phép sắp xếp hay ko, thường chỉ nên cho sắp xêp các trường: Mã, tên (ngắn), số lượng, ngày */
	sortable?: boolean;

	/** Data để filter với trường họp chọn filterType là 'select' */
	filterData?: string[] | TDataOption[];

	/** Các loại filter, đối với
	 * - 'customselect' thì phải có 'filterCustomSelect'
	 * - 'select' thì phải có 'filterData' */
	filterType?: 'string' | 'number' | 'date' | 'datetime' | 'select' | 'customselect';

	/** JSX Element trả về 1 mảng value, thường là id */
	filterCustomSelect?: JSX.Element;

	handleFilter?: (value: any) => void;

	/** Bắt buộc phải có để dùng custom Filter hoặc Import dữ liệu
	 * Có thể filter 'string' với các trường populated
	 */
	dataIndex?: keyof T | 'index' | [keyof T, string];

	/** Bắt buộc phải có
	 * Lưu ý: độ rộng phải fit tương đối với nội dung của column, ko để quá rộng, hẹp
	 * Phải check cả ở mobile view
	 */
	width: number;

	/** CHỈ DÙNG TRONG TABLE STATIC
	 * Hàm sort tùy chỉnh (có thể dùng để sắp xếp họ tên theo AB)
	 */
	customSort?: (value1: any, value2: any) => number;

	minWidth?: number;
	maxWidth?: number;
	resizable?: boolean;
	/** Cho phép tìm kiếm global hay ko (Mặc định: true với filterType = string | select) */
	enableGlobalSearch?: boolean;
	/** Khóa bộ lọc của cột này ở giao diện (luôn là read-only) */
	readOnly?: boolean;
}

export type TDataOption = {
	label: string;
	value: string | number;
};

export type TableBaseProps<T extends object = any> = {
	/** Tên model */
	modelName: Namespaces;

	/** Key cố định để lưu cấu hình (dùng khi bảng có cấu trúc cột thay đổi động) */
	configKey?: string;

	/** Import dùng model khác? */
	modelImportName?: Namespaces;
	/** Export dùng model khác? */
	modelExportName?: Namespaces;

	Form?: React.FC;
	formType?: 'Modal' | 'Drawer';
	columns: IColumn<T>[];
	title?: React.ReactNode;
	widthDrawer?: number | 'full';

	/** Title cho modal Thêm mới, chỉnh sửa (nên dùng thay cho dùng card trong Form) */
	modalTitle?: string;

	/** Hàm getData tùy chỉnh, nếu ko có thì 'getModel' của model sẽ là mặc định */
	getData?: (params: any) => void;

	/**
	 * Bộ lọc được truyền từ giao diện bên ngoài TableBase.
	 * Các filter này sẽ hiển thị trong TableBase và Modal Filter.
	 */
	externalFilters?: TFilter<T>[];

	/**
	 * Điều kiện lọc bổ sung từ bên ngoài (Gom 3 thành 1).
	 * Dùng để hiển thị trạng thái lọc trong Modal Filter và đồng bộ dữ liệu.
	 */
	externalConditions?: TExternalConditionItem<T>[];

	onExternalFiltersChange?: (filters: TFilter<any>[]) => void;

	/** Ẩn/khóa toàn bộ Modal Filter (vẫn có thể dùng filter theo cột nếu được bật) */
	disableFilterModal?: boolean;

	/**
	 * Có đồng bộ external filter ra filter theo cột hay không.
	 * - true: Giá trị external có thể hiển thị ở filter cột (mặc định)
	 * - false: Filter cột chỉ dùng state nội bộ của table
	 */
	syncExternalToColumnFilter?: boolean;

	/** Tham số phụ thuộc để getData được gọi */
	dependencies?: any[];

	/** Tham số truyền vào getData */
	params?: any;

	/** Query riêng cho export (definition, xlsx) */
	exportParam?: Record<string, any>;

	/** Query riêng cho import (definition, template, validate, insert) */
	importParam?: Record<string, any>;

	/** Các nội dung hiển thị trên header, bên cạnh button thêm mới */
	children?: React.ReactNode;

	border?: boolean;

	/** Tùy chọn các nút mặc định */
	buttons?: {
		/** Được thêm mới ko? Mặc định: Có */
		create?: boolean;
		/** Được nhập dữ liệu ko? Mặc định: Không */
		import?: boolean;
		/** Được xuất dữ liệu ko? Mặc định: Không */
		export?: boolean;
		/** Có ô tìm kiếm global ko? Mặc định: Có */
		globalSearch?: boolean;
		/** Thu nhỏ ô tìm kiếm global ko? (Hiện icon, click hiện popover) */
		minimizeGlobalSearch?: boolean;
		/** Được lọc tùy chỉnh ko? Mặc định: Có */
		filter?: boolean;
		/** Có nút tải lại ko? Mặc định: Có */
		reload?: boolean;
		/** Có nút cấu hình cột ko? Mặc định: Có */
		columnSetting?: boolean;
	};

	/** Danh sách các nút khác bên cạnh Thêm mới */
	otherButtons?: JSX.Element[];

	/** Biến lưu dữ liệu trong model, Mặc định: danhSach */
	dataState?: string;

	otherProps?: TableProps<any>;

	/** Click vào mask để đóng form ko? Mặc định: Không */
	maskCloseableForm?: boolean;

	noCleanUp?: boolean;

	rowSelection?: boolean;
	/** View antd Row Selection */
	detailRow?: any;

	/** Cho phép xóa nhiều, đi kèm với props `rowSelection` */
	deleteMany?: boolean;

	hideTotal?: boolean;
	pageable?: boolean;
	hideCard?: boolean;

	/** Text hiển thị khi ko có dữ liệu */
	emptyText?: string;

	/** Ko cần thiết */
	scroll?: { x?: number; y?: number };

	formProps?: any;

	/** Có destroy Modal sau khi thêm mới, chỉnh sửa ko? Mặc định: Không */
	destroyModal?: boolean;

	/** Có thêm cột STT ko? Mặc định: Có */
	addStt?: boolean;

	/** Có hiển thị thị kéo thả sắp xêp hàng ko? Mặc định: Không */
	rowSortable?: boolean;

	/**
	 * Sự kiện khi hàng được kéo đến vị trí mới
	 * @param record Record ứng với hàng được kéo thả
	 * @param newIndex Vị trí mới được kéo đến: 0 -> (limit-1)
	 * @returns
	 */
	onSortEnd?: (record: any, newIndex: number) => void;

	hideChildrenRows?: boolean;
	hideFilterColumn?: boolean;

	/** Có hiển thị modal title không? Mặc định: `Không` */
	showModalTitle?: boolean;

	/** Modal title thay thế, mặc định `Thêm mới`, `Chỉnh sửa`, `Chi tiết` + title */
	modalTitle?: React.ReactNode;

	/** Hàm reload dữ liệu
	 * @default getData
	 */
	onReload?: (params?: any) => void;

	/** Action custom khi click nút thêm mới.
	 * Nếu truyền prop này, TableBase sẽ gọi hàm thay vì tự mở form modal mặc định.
	 */
	onCreateClick?: () => void;

	cardExtra?: React.ReactNode;
	/** Cấp độ của PageCard bao quanh Table (1, 2, 3) */
	cardProps?: PageCardProps;
};

export type TFilter<T> = {
	field?: keyof T | [keyof T, string];
	operator?: EOperatorType;
	values?: (string | number | boolean)[];
	active?: boolean;
	filters?: TFilter<T>[];
	logicOperator?: 'or' | 'and';
	readOnly?: boolean;
	source?: 'table' | 'external' | 'system';
};

export type RowFilterProps = {
	name: string | number;
	formOwner: FormInstance;
	parentPath?: (string | number)[];
	allowGrouping?: boolean;
	level?: number;
	onRemove?: () => void;
	forceReadOnly?: boolean;
};

/**
 * Đại diện cho một điều kiện lọc từ bên ngoài truyền vào TableBase.
 * @template T Kiểu dữ liệu của bản ghi trong bảng.
 *
 * @example
 * // Trường hợp dùng mapping object
 * {
 *   field: 'active',
 *   label: 'Trạng thái',
 *   value: true,
 *   valueLabel: { true: 'Đang hoạt động', false: 'Ngừng hoạt động' }
 * }
 *
 * @example
 * // Trường hợp dùng nhãn trực tiếp (khi đã biết nhãn từ Select)
 * {
 *   field: 'phongBanId',
 *   label: 'Phòng ban',
 *   value: 'kt',
 *   valueLabel: 'Kế toán'
 * }
 */
export type TExternalConditionItem<T extends object> = {
	/** Tên trường cần lọc (Dựa trên kiểu dữ liệu T) */
	field: keyof T | string;
	/** Nhãn hiển thị của trường (Dùng trong Modal Filter) */
	label?: string;
	/** Giá trị lọc */
	value: any;
	/**
	 * Toán tử lọc (MongoDB style)
	 * @default '$eq'
	 * Các toán tử hỗ trợ: '$eq', '$ne', '$in', '$nin', '$gt', '$gte', '$lt', '$lte', '$like', '$regex', '$exist', '$not'
	 */
	operator?: keyof ConditionCriteria<T>;

	/**
	 * Nhãn hiển thị cho giá trị lọc (Dùng để hiển thị trong Modal Filter thay cho giá trị thô).
	 * - Dạng `string`: Dùng khi đã có sẵn nhãn (VD: lấy từ `Select.label`).
	 *   Ví dụ: `valueLabel: 'Kế toán'`.
	 * - Dạng `object`: Dùng khi muốn định nghĩa bộ quy tắc tra cứu (VD: cho Boolean, Enum).
	 *   Ví dụ: `valueLabel: { true: 'Có', false: 'Không' }`.
	 * - Nếu không truyền: Hệ thống tự tìm nhãn từ `columns.filterData` hoặc hiển thị giá trị thô.
	 */
	valueLabel?: string | Record<string, string>;
};

export type ConditionCriteria<T> = {
	/** Giá trị nằm trong danh sách */
	$in?: T[];
	/** Giá trị không nằm trong danh sách */
	$nin?: T[];
	/** Bằng giá trị */
	$eq?: T;
	/** Khác giá trị */
	$ne?: T;
	/** Lớn hơn giá trị */
	$gt?: T;
	/** Lớn hơn hoặc bằng giá trị */
	$gte?: T;
	/** Nhỏ hơn giá trị */
	$lt?: T;
	/** Nhỏ hơn hoặc bằng giá trị */
	$lte?: T;
	/** Trường tồn tại hay không */
	$exist?: boolean;
	/** Chứa chuỗi hoặc khớp biểu thức chính quy (RegExp) */
	$like?: string | RegExp;
	/** Khớp biểu thức chính quy (RegExp) */
	$regex?: string | RegExp;
	/** Phủ định điều kiện con bên trong */
	$not?: ConditionCriteria<T>;
};

export type QueryCondition<E extends object = any> = {
	[P in keyof E]?: E[P] | ConditionCriteria<E[P]>;
};

export type TableStaticProps = Pick<
	TableBaseProps,
	| 'emptyText'
	| 'columns'
	| 'configKey'
	| 'title'
	| 'Form'
	| 'formProps'
	| 'addStt'
	| 'children'
	| 'otherProps'
	| 'formType'
	| 'widthDrawer'
	| 'rowSortable'
	| 'onSortEnd'
	| 'hideChildrenRows'
	| 'onReload'
	| 'otherButtons'
	| 'scroll'
> & {
	data: any[];
	loading?: boolean;
	resizable?: boolean;
	dataPartitionCode?: string;
	showEdit?: boolean;
	setShowEdit?: (vi: boolean) => void;

	hasCreate?: boolean;
	hasTotal?: boolean;
	totalComponent?: React.ReactNode;
	/** Có nút cấu hình cột ko? Mặc định: Có */
	columnSetting?: boolean;
	size?: 'small' | 'middle';
};

// IMPORT HEADER

export type TImportHeader = {
	field: string;
	label: string;
	required: boolean;
	type: TImportDataType;
};

export type TImportDataType = 'String' | 'Number' | 'Boolean' | 'Date';

export type TImportResponse = {
	error: boolean;
	validate?: TImportRowResponse[];
};

export type TImportRowResponse = {
	index: number;
	rowIndex: number;
	row: { row: number };
	rowErrors?: string[];
};

// EXPORT FIELD

export type TExportField = {
	_id: string;
	label: string;
	fields: string[];
	labels: string[];
	required: boolean;
	type: string;
	children?: TExportField[];
	selected?: boolean;
	disableImport?: boolean;
};
