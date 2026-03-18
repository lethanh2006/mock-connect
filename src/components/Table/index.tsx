import { useModel } from 'umi';
import { useCallback, useMemo } from 'react';
import { TableBaseContent } from './components/TableBaseContent';
import { TableProvider } from './components/TableContext';
import './style.less';
import type { TableBaseProps, TFilter } from './typing';
import { markExternalFilters, normalizeFilters, splitFiltersBySource, stripFilterSource } from './utils';

const TableBase = (props: TableBaseProps) => {
	const model = useModel(props.modelName) as any;
	const modelFilters: TFilter<any>[] = model?.filters ?? [];
	const canSyncExternalFilters = typeof props.onExternalFiltersChange === 'function';
	const externalFilters = useMemo(
		() => markExternalFilters(props.externalFilters ?? [], { forceReadOnly: !canSyncExternalFilters }),
		[props.externalFilters, canSyncExternalFilters],
	);

	const { tableFilters } = useMemo(() => splitFiltersBySource(modelFilters), [modelFilters]);

	const filters = useMemo<TFilter<any>[]>(
		() => normalizeFilters([...(externalFilters ?? []), ...(tableFilters ?? [])]),
		[externalFilters, tableFilters],
	);

	const handleSetFilters = useCallback(
		(nextFilters: TFilter<any>[] = []) => {
			const normalizedNextFilters = normalizeFilters(nextFilters);
			const {
				tableFilters: nextTableFilters,
				externalFilters: nextExternalFilters,
			} = splitFiltersBySource(normalizedNextFilters);

			model?.setFilters?.(nextTableFilters);

			if (props.onExternalFiltersChange) {
				props.onExternalFiltersChange(stripFilterSource(nextExternalFilters));
			}
		},
		[model, props.onExternalFiltersChange],
	);

	const getData = props.getData ?? model?.getModel;
	const hasFilter =
		props.columns?.filter((item) => item.filterType)?.length ||
		(props.externalFilters && props.externalFilters.length > 0);
	const {
		visibleForm,
		setVisibleForm,
		setEdit,
		setRecord,
		setIsView,
		selectedIds,
		setSelectedIds,
		total,
		loading,
		isView,
		edit,
		deleteManyModel,
	} = model;

	const handleDeleteMany = () => {
		if (deleteManyModel && selectedIds?.length)
			deleteManyModel(selectedIds, () => getData(props.params))
				.then(() => setSelectedIds(undefined))
				.catch((er: any) => console.log(er));
	};

	const onCreate = () => {
		setRecord({});
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const onReload = () => (props.onReload ? props.onReload(props.params) : getData(props.params));

	return (
		<TableProvider
			value={{
				selectedIds,
				setSelectedIds,
				loading,
				total,
				filters,
				hasFilter: !!hasFilter,
				handleDeleteMany,
				onCreate,
				onReload,
				buttons: props.buttons,
				otherButtons: props.otherButtons,
				rowSelection: props.rowSelection,
				deleteMany: props.deleteMany,
				hideTotal: props.hideTotal,
				hideFilterColumn: props.hideFilterColumn,
				size: props.otherProps?.size,
				visibleForm,
				setVisibleForm,
				isView,
				edit,
				Form: props.Form,
				title: props.title,
				widthDrawer: props.widthDrawer,
				maskCloseableForm: props.maskCloseableForm,
				destroyModal: props.destroyModal,
				formType: props.formType,
				modalTitle: props.modalTitle,
				showModalTitle: props.showModalTitle,
				formProps: props.formProps,
				modelName: props.modelName,
				configKey: props.configKey,
				modelImportName: props.modelImportName,
				modelExportName: props.modelExportName,
				params: props.params,
				getData,
				setFilters: handleSetFilters,
				columns: props.columns || [],
				disableFilterModal: props.disableFilterModal,
				syncExternalToColumnFilter: props.syncExternalToColumnFilter,
			}}
		>
			<TableBaseContent {...props} />
		</TableProvider>
	);
};

export default TableBase;
