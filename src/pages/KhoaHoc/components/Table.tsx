import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExport from '@/components/Table/Export';
import ModalImport from '@/components/Table/Import';
import ModalCustomFilter from '@/components/Table/ModalCustomFilter';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn, TDataOption, TFilter, TableBaseProps } from '@/components/Table/typing';
import { primaryColor } from '@/services/base/constant';
import { inputFormat } from '@/utils/utils';
import {
	CloseOutlined,
	ExportOutlined,
	FilterOutlined,
	FilterTwoTone,
	ImportOutlined,
	MenuOutlined,
	PlusCircleOutlined,
	ReloadOutlined,
	SearchOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	ConfigProvider,
	Drawer,
	Empty,
	Input,
	Modal,
	Popconfirm,
	Space,
	Table,
	Tooltip,
	type InputRef,
	type PaginationProps,
} from 'antd';
import type { FilterValue, SortOrder } from 'antd/lib/table/interface';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import type { SortEnd, SortableContainerProps } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { useModel } from 'umi';
import '@/components/Table/style.less';

const TableBase = (props: TableBaseProps) => {
	const { modelName, Form, title, dependencies = [], params, buttons, widthDrawer, destroyModal } = props;
	const model = useModel(modelName);
	const {
		visibleForm,
		setVisibleForm,
		setEdit,
		setRecord,
		setIsView,
		selectedIds,
		setSelectedIds,
		page,
		limit,
		total,
		setPage,
		setLimit,
		condition,
		loading,
		sort,
		setSort,
		setFilters,
		setCondition,
		deleteManyModel,
	} = model;
	const filters: TFilter<any>[] = model?.filters;
	const getData = props.getData ?? model?.getModel;
	const hasFilter = props.columns?.filter((item) => item.filterType)?.length;
	const [finalColumns, setColumns] = useState<IColumn<any>[]>([]);
	const [visibleFilter, setVisibleFilter] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visibleExport, setVisibleExport] = useState(false);
	const searchInputRef = useRef<InputRef>(null);

	useEffect(() => {
		setPage(1);
	}, [JSON.stringify(filters ?? [])]);

	useEffect(() => {
		getData(params);
	}, [...dependencies, filters, condition, sort]);

	useEffect(() => {
		return () => {
			if (props.noCleanUp !== true) {
				// setCondition(undefined);
				setFilters(undefined);
				setSelectedIds(undefined);
				// setSort(undefined);
			}
		};
	}, []);

	/**
	 * Get current filter rule in column
	 * @date 2023-04-13
	 */
	const getFilterColumn = (fieldName: any, operator?: EOperatorType, active?: boolean) => {
		return filters?.find(
			(item) =>
				item.field === fieldName &&
				(operator === undefined || item.operator === operator) &&
				(active === undefined || item.active === active),
		);
	};

	const getFilterColumnSpecial = (fieldName: any) => {
		return filters?.find((item: any) => `${item?.field ?? ''}.${item?.values?.[0]?.ma ?? ''}` === fieldName);
	};

	const getSearchColumn = (fieldName: any) => {
		return condition?.$and?.find((item: any) => item?.thongTinKhaiBao?.$elemMatch?.ma === fieldName);
	};

	//#region Get Sort Column Props
	const getCondValue = (dataIndex: any) => {
		const type = typeof dataIndex;
		return _.get(sort, type === 'string' ? dataIndex : dataIndex?.join('.'), []);
	};

	const getSortValue = (dataIndex: any): SortOrder => {
		const value = getCondValue(dataIndex);
		return value === 1 ? 'ascend' : value === -1 ? 'descend' : null;
	};

	const getSort = (dataIndex: any): Partial<IColumn<unknown>> => ({
		sorter: true,
		sortDirections: ['ascend', 'descend'],
		sortOrder: getSortValue(dataIndex),
	});
	//#endregion

	//#region Get Search Column Props
	const handleSearch = (dataIndex: any, value: string, confirm?: () => void) => {
		const specialFilter = finalColumns?.find((item) => item.dataIndex === dataIndex)?.specialFilter;
		const dataIndexFinal = dataIndex?.replace('thongTinKhaiBao.', '');
		if (!value) {
			if (specialFilter) {
				const value$and =
					condition?.$and?.filter((item: any) => item?.thongTinKhaiBao?.$elemMatch?.ma !== dataIndexFinal) ?? [];

				setCondition({
					...condition,
					$and: value$and?.length ? value$and : undefined,
				});
			} else {
				// Remove filter of this column
				const tempFilters = filters?.filter((item) => item.field !== dataIndex);
				setFilters(tempFilters);
			}
		} else {
			if (specialFilter) {
				const isHaveCondition = condition?.$and?.find(
					(item: any) => item?.thongTinKhaiBao?.$elemMatch?.ma === dataIndexFinal,
				);
				setCondition({
					...condition,
					$and: isHaveCondition
						? condition?.$and?.map((item: any) => {
								if (item?.thongTinKhaiBao?.$elemMatch?.ma === dataIndexFinal)
									return {
										thongTinKhaiBao: {
											$elemMatch: {
												ma: dataIndexFinal,
												value: {
													$regex: value,
													$options: 'i',
												},
											},
										},
									};
								return item;
						  })
						: [
								...(condition?.$and ?? []),
								{
									thongTinKhaiBao: {
										$elemMatch: {
											ma: dataIndexFinal,
											value: {
												$regex: value,
												$options: 'i',
											},
										},
									},
								},
						  ],
				});
			} else {
				const filter = getFilterColumn(dataIndex);
				let tempFilters: any = [...(filters ?? [])];
				if (filter)
					// Udpate current filter
					tempFilters = tempFilters.map((item: any) =>
						item.field === dataIndex
							? {
									...item,
									active: true,
									operator: EOperatorType.CONTAIN,
									values: [value],
							  }
							: item,
					);
				// Add new filter rule for this column
				else
					tempFilters.push({
						active: true,
						field: dataIndex,
						operator: EOperatorType.CONTAIN,
						values: [value],
					});
				setFilters(tempFilters);
			}
		}
		if (confirm) confirm();
	};

	const getColumnSearchProps = (dataIndex: any, columnTitle: any): Partial<IColumn<unknown>> => {
		const specialFilter = finalColumns?.find((item) => item.dataIndex === dataIndex)?.specialFilter;
		const filterColumn = specialFilter
			? getSearchColumn(dataIndex?.replace('thongTinKhaiBao.', ''))
			: getFilterColumn(dataIndex, EOperatorType.CONTAIN, true);

		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
				return (
					<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
						<Input.Search
							autoFocus
							placeholder={`Tìm ${columnTitle}`}
							allowClear
							enterButton
							value={selectedKeys[0]}
							onChange={(e) => {
								if (e.type === 'click') {
									setSelectedKeys([]);
									confirm();
								} else {
									setSelectedKeys(e.target.value ? [e.target.value] : []);
								}
							}}
							onSearch={(value) => handleSearch(dataIndex, value, confirm)}
							ref={searchInputRef}
						/>
						{buttons?.filter !== false && hasFilter ? (
							<div>
								Xem thêm{' '}
								<a
									onClick={() => {
										setVisibleFilter(true);
										confirm();
									}}
								>
									Bộ lọc tùy chỉnh
								</a>
							</div>
						) : null}
					</div>
				);
			},
			filteredValue:
				specialFilter &&
				getSearchColumn(dataIndex?.replace('thongTinKhaiBao.', ''))?.thongTinKhaiBao?.$elemMatch?.value?.$regex
					? [getSearchColumn(dataIndex?.replace('thongTinKhaiBao.', ''))?.thongTinKhaiBao?.$elemMatch?.value?.$regex]
					: filterColumn?.values ?? [],
			filterIcon: () => {
				const values = specialFilter
					? [getSearchColumn(dataIndex?.replace('thongTinKhaiBao.', ''))?.thongTinKhaiBao?.$elemMatch?.value?.$regex]
					: getFilterColumn(dataIndex, undefined, true)?.values;
				const filtered = values && values[0];
				return <SearchOutlined className={filtered ? 'text-primary' : undefined} />;
			},
			onFilterDropdownVisibleChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
		};
	};
	//#endregion

	//#region Get Filter Column Props

	const handleFilter = (dataIndex: any, values: string[]) => {
		const specialFilter = finalColumns?.find((item) => item.dataIndex === dataIndex)?.specialFilter;

		const dataIndexFinal = specialFilter ? 'thongTinKhaiBao' : dataIndex;

		if (!values || !values.length) {
			// Remove filter of this column
			const tempFilters = filters?.filter((item) => item.field !== dataIndexFinal);
			setFilters(tempFilters);
		} else {
			const filter = specialFilter ? getFilterColumnSpecial(dataIndexFinal) : getFilterColumn(dataIndexFinal);
			let tempFilters: any = [...(filters ?? [])];

			if (filter)
				// Udpate current filter
				tempFilters = tempFilters.map((item: any) =>
					item.field === dataIndexFinal
						? {
								...item,
								active: true,
								operator: EOperatorType.INCLUDE,
								values: specialFilter
									? values?.map((ele) => ({
											ma: dataIndex?.replace('thongTinKhaiBao.', ''),
											value: ele,
									  }))
									: values,
						  }
						: item,
				);
			// Add new filter rule for this column
			else
				tempFilters.push({
					active: true,
					field: dataIndexFinal,
					operator: EOperatorType.INCLUDE,
					values: specialFilter
						? values?.map((item) => ({
								ma: dataIndex?.replace('thongTinKhaiBao.', ''),
								value: item,
						  }))
						: values,
				});
			setFilters(tempFilters);
		}
	};

	const getFilterColumnProps = (dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		const specialFilter = finalColumns?.find((item) => item.dataIndex === dataIndex)?.specialFilter;
		const filterColumn = specialFilter
			? getFilterColumnSpecial(dataIndex)
			: getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);

		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			filteredValue: filterColumn?.values?.map((item: any) => {
				if (!specialFilter) return item;
				else return item?.value ?? '';
			}),
			filterSearch: true,
		};
	};
	//#endregion

	const getColumnSelectProps = (dataIndex: any, filterCustomSelect?: JSX.Element): Partial<IColumn<unknown>> => {
		if (!filterCustomSelect) return {};
		const filterColumn = getFilterColumn(dataIndex, EOperatorType.INCLUDE, true);
		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
				<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
					<Space size={0}>
						<div style={{ width: 300 }}>
							{React.cloneElement(filterCustomSelect, {
								value: selectedKeys,
								onChange: (value: any) => setSelectedKeys(Array.isArray(value) ? value : [value]),
								style: { width: '100%' },
							})}
						</div>
						<Button
							type='primary'
							icon={<FilterOutlined />}
							onClick={() => {
								handleFilter(dataIndex, selectedKeys as string[]);
								confirm();
							}}
						/>
					</Space>
					{buttons?.filter !== false && hasFilter ? (
						<div>
							Xem thêm{' '}
							<a
								onClick={() => {
									setVisibleFilter(true);
									confirm();
								}}
							>
								Bộ lọc tùy chỉnh
							</a>
						</div>
					) : null}
				</div>
			),
			filteredValue: filterColumn?.values ?? [],
		};
	};

	//#region Get Table Columns

	const getColumns = () => {
		let final: IColumn<any>[] = props.columns.map((item) => ({
			...item,
			...(item.sortable && getSort(item.dataIndex)),
			...(item.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title)
				: item.filterType === 'select'
				? getFilterColumnProps(item.dataIndex, item.filterData)
				: item.filterType === 'customselect'
				? getColumnSelectProps(item.dataIndex, item.filterCustomSelect)
				: undefined),
			children: item.children?.map((child) => ({
				...child,
				...(child.sortable && getSort(child.dataIndex)),
				...(child.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, child.title)
					: child.filterType === 'select'
					? getFilterColumnProps(child.dataIndex, child.filterData)
					: item.filterType === 'customselect'
					? getColumnSelectProps(item.dataIndex, item.filterCustomSelect)
					: undefined),
			})),
		}));

		final = final?.filter((item) => item?.hide !== true);
		if (props.addStt !== false)
			final.unshift({
				title: 'TT',
				dataIndex: 'index',
				align: 'center',
				width: 50,
			});

		setColumns(final);
	};

	useEffect(() => {
		getColumns();
	}, [JSON.stringify(filters), sort, ...props.columns]);

	//#region Get Drag Sortable column
	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

	const SortableItem = SortableElement((props1: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props1} />);
	const SortableBody = SortableContainer((props1: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<tbody {...props1} />
	));

	if (props.rowSortable)
		finalColumns.unshift({
			title: '',
			width: 30,
			align: 'center',
			render: () => <DragHandle />,
		});

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const record = model?.[props.dataState || 'danhSach']?.[oldIndex];
			if (props.onSortEnd) props.onSortEnd(record, newIndex);
		}
	};

	const DraggableContainer = (props1: SortableContainerProps) => (
		<SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props1} />
	);

	const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = restProps['data-row-key'];
		return <SortableItem index={index ?? 0} {...restProps} />;
	};
	//#endregion

	//#endregion

	/**
	 * On Table Changed
	 * @date 2023-04-13
	 */
	const onChange = (pagination: PaginationProps, fil: Record<string, FilterValue | null>, sorter: any) => {
		// Handle Filter in columns
		Object.entries(fil).map(([field, values]) => {
			const col = finalColumns.find((item) => item.dataIndex === field);
			if (col?.filterType === 'select') handleFilter(field, values as any);
			else if (col?.filterType === 'string') handleSearch(field, values?.[0] as any);
			else if (col?.filterType === 'customselect') handleFilter(field, values as any);
		});

		const { order, field } = sorter;
		const orderValue = order === 'ascend' ? 1 : order === 'descend' ? -1 : undefined;
		if (sorter && setSort) setSort({ [Array.isArray(field) ? field.join('.') : field]: orderValue });

		// thay đổi từ phân trang || filter
		const { current, pageSize } = pagination;
		setPage(current);
		setLimit(pageSize);
	};

	const handleDeleteMany = () => {
		if (deleteManyModel && selectedIds?.length)
			deleteManyModel(selectedIds, () => getData(params))
				.then(() => setSelectedIds(undefined))
				.catch((er: any) => console.log(er));
	};

	const mainContent = (
		<div className='table-base'>
			{props.children}

			<div className='header'>
				<div className='action'>
					{buttons?.create !== false ? (
						<ButtonExtend
							size={props?.otherProps?.size}
							onClick={() => {
								setRecord({});
								setEdit(false);
								setIsView(false);
								setVisibleForm(true);
							}}
							icon={<PlusCircleOutlined />}
							type='primary'
							notHideText
							tooltip='Thêm mới dữ liệu'
						>
							Thêm mới
						</ButtonExtend>
					) : null}

					{buttons?.import ? (
						<ButtonExtend icon={<ImportOutlined />} onClick={() => setVisibleImport(true)}>
							Nhập dữ liệu
						</ButtonExtend>
					) : null}
					{buttons?.export ? (
						<ButtonExtend icon={<ExportOutlined />} onClick={() => setVisibleExport(true)}>
							Xuất dữ liệu {selectedIds?.length > 0 ? `(${selectedIds.length})` : ''}
						</ButtonExtend>
					) : null}

					{props.otherButtons}

					{props.rowSelection && props.deleteMany && selectedIds?.length ? (
						<Popconfirm title={`Xác nhận xóa ${selectedIds?.length} mục đã chọn?`} onConfirm={handleDeleteMany}>
							<ButtonExtend type='link' danger>
								Xóa {selectedIds?.length} mục
							</ButtonExtend>
						</Popconfirm>
					) : null}
				</div>

				<div className='extra'>
					{buttons?.reload !== false ? (
						<ButtonExtend
							icon={<ReloadOutlined />}
							onClick={() => getData(params)}
							loading={loading}
							tooltip='Tải lại dữ liệu'
						>
							Tải lại
						</ButtonExtend>
					) : null}

					{buttons?.filter !== false && hasFilter ? (
						<ButtonExtend
							icon={filters?.length ? <FilterTwoTone twoToneColor={primaryColor} /> : <FilterOutlined />}
							onClick={() => setVisibleFilter(true)}
							tooltip='Áp dụng bộ lọc tùy chỉnh'
						>
							Bộ lọc tùy chỉnh
						</ButtonExtend>
					) : null}

					{!props?.hideTotal ? (
						<Tooltip title='Tổng số dữ liệu'>
							<div className='total'>
								Tổng số:
								<span>{inputFormat(total || 0)}</span>
							</div>
						</Tooltip>
					) : null}
				</div>
			</div>

			<ConfigProvider
				renderEmpty={() => (
					<Empty style={{ marginTop: 32, marginBottom: 32 }} description={props.emptyText ?? 'Không có dữ liệu'} />
				)}
			>
				<Table
					scroll={{
						x: _.sum(finalColumns.map((item) => item.width ?? 80)),
						scrollToFirstRowOnChange: true,
						...props.scroll,
					}}
					rowSelection={
						props?.rowSelection
							? {
									type: 'checkbox',
									selectedRowKeys: selectedIds ?? [],
									preserveSelectedRowKeys: true,
									onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
									columnWidth: 40,
									...props.detailRow,
							  }
							: undefined
					}
					loading={loading}
					bordered={props.border || true}
					pagination={{
						current: page,
						pageSize: limit,
						position: ['bottomRight'],
						total,
						showSizeChanger: true,
						pageSizeOptions: ['5', '10', '25', '50', '100'],
						showTotal: (tongSo: number) => (
							<Space>
								{props?.rowSelection ? (
									<>
										<span>Đã chọn: {selectedIds?.length ?? 0}</span>
										{selectedIds?.length > 0 ? (
											<span>
												(<a onClick={() => setSelectedIds(undefined)}>Bỏ chọn tất cả</a>)
											</span>
										) : null}
									</>
								) : null}
								<span>Tổng số: {tongSo}</span>
							</Space>
						),
					}}
					onChange={onChange}
					dataSource={model?.[props.dataState || 'danhSach']?.map((item: any, index: number) => ({
						...item,
						index: index + 1 + (page - 1) * limit * (props.pageable === false ? 0 : 1),
						key: item?._id ?? index,
						children:
							!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
								? item.children
								: undefined,
					}))}
					columns={finalColumns as any[]}
					components={
						props.rowSortable
							? {
									body: {
										wrapper: DraggableContainer,
										row: DraggableBodyRow,
									},
							  }
							: undefined
					}
					{...props.otherProps}
				/>
			</ConfigProvider>
		</div>
	);

	return (
		<>
			{props.hideCard ? (
				mainContent
			) : (
				<Card title={title || false} bordered={props.border || false}>
					{mainContent}
				</Card>
			)}

			{Form && (
				<>
					{props.formType === 'Drawer' ? (
						<Drawer
							className={widthDrawer === 'full' ? 'drawer-full' : ''}
							maskClosable={props.maskCloseableForm || false}
							width={widthDrawer !== 'full' ? widthDrawer : undefined}
							footer={false}
							bodyStyle={{ padding: 0 }}
							visible={visibleForm}
							destroyOnClose={destroyModal || false}
						>
							<Form title={title ?? ''} {...props.formProps} />
							<CloseOutlined
								onClick={() => setVisibleForm(false)}
								style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }}
							/>
						</Drawer>
					) : (
						<Modal
							className={widthDrawer === 'full' ? 'modal-full' : ''}
							maskClosable={props.maskCloseableForm || false}
							width={widthDrawer !== 'full' ? widthDrawer : undefined}
							onCancel={() => setVisibleForm(false)}
							footer={false}
							bodyStyle={{ padding: 0 }}
							visible={visibleForm}
							destroyOnClose={destroyModal || false}
						>
							<Form title={title ?? ''} {...props.formProps} />
						</Modal>
					)}
				</>
			)}

			{buttons?.filter !== false && hasFilter ? (
				<ModalCustomFilter
					visible={visibleFilter}
					setVisible={setVisibleFilter}
					columns={finalColumns}
					filters={filters}
					setFilters={setFilters}
				/>
			) : null}

			{buttons?.import ? (
				<ModalImport
					visible={visibleImport}
					modelName={props.modelImportName ?? modelName}
					onCancel={() => setVisibleImport(false)}
					onOk={() => getData(params)}
					titleTemplate={title ? `Biểu mẫu ${title}.xlsx` : undefined}
					extendData={params}
				/>
			) : null}

			{buttons?.export ? (
				<ModalExport
					visible={visibleExport}
					modelName={props.modelExportName ?? modelName}
					onCancel={() => setVisibleExport(false)}
					fileName={`Danh sách ${title ?? 'dữ liệu'}.xlsx`}
					condition={params}
				/>
			) : null}
		</>
	);
};

export default TableBase;
