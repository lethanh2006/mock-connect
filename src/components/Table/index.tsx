import { useModel } from 'umi';
import { useCallback, useMemo } from 'react';
import { TableBaseContent } from './components/TableBaseContent';
import { TableProvider } from './components/TableContext';
import './style.less';
import type { TableBaseProps, TFilter } from './typing';
import {
	markExternalFilters,
	normalizeExternalConditions,
	normalizeFilters,
	splitFiltersBySource,
	stripFilterSource,
} from './utils';

const TableBase = <T extends object = any>(props: TableBaseProps<T>) => {
	const model = useModel(props.modelName) as any;
	const modelFilters: TFilter<T>[] = model?.filters ?? [];

	// Normalize and extract raw conditions for API/dependencies
	const { conditions: externalRawConditions } = useMemo(
		() => normalizeExternalConditions(props.externalConditions),
		[props.externalConditions],
	);

	const canSyncExternalFilters = typeof props.onExternalFiltersChange === 'function';
	const externalFilters = useMemo(
		() => markExternalFilters(props.externalFilters ?? [], { forceReadOnly: !canSyncExternalFilters }),
		[props.externalFilters, canSyncExternalFilters],
	);

	const { tableFilters } = useMemo(() => splitFiltersBySource(modelFilters), [modelFilters]);

	const filters = useMemo<TFilter<T>[]>(
		() => normalizeFilters([...(externalFilters ?? []), ...(tableFilters ?? [])]),
		[externalFilters, tableFilters],
	);

	const { externalFilters: activeExternalFilters } = useMemo(
		() => splitFiltersBySource(filters),
		[filters],
	);

	const handleSetFilters = useCallback(
		(nextFilters: TFilter<T>[] = []) => {
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

	const mergeExternalConditions = useCallback(
		(params: any) => {
			if (!externalRawConditions || Object.keys(externalRawConditions).length === 0) return params;

			const normalizedParams =
				params && typeof params === 'object' && !Array.isArray(params) ? params : {};

			return {
				...externalRawConditions,
				...normalizedParams,
			};
		},
		[externalRawConditions],
	);

	const getData = useCallback(
		(params: any) => {
			if (props.getData) return props.getData(params);
			return model?.getModel?.(mergeExternalConditions(params), activeExternalFilters);
		},
		[props.getData, model, mergeExternalConditions, activeExternalFilters],
	);
	const hasExternalConditions = !!(props.externalConditions && props.externalConditions.length > 0);
	const hasFilter =
		props.columns?.filter((item) => item.filterType)?.length ||
		(props.externalFilters && props.externalFilters.length > 0) ||
		hasExternalConditions;
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
		if (props.onCreateClick) {
			props.onCreateClick();
			return;
		}

		setRecord({});
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const onReload = () => (props.onReload ? props.onReload(props.params) : getData(props.params));

	return (
		<TableProvider<T>
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
				externalConditions: props.externalConditions,
			}}
		>
			<TableBaseContent {...props} />
		</TableProvider>
	);
};

export default TableBase;
