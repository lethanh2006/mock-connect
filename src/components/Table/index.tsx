import { useCallback, useMemo } from 'react';
import { useModel } from 'umi';
import { TableBaseContent } from './components/TableBaseContent';
import { TableProvider } from './components/TableContext';
import './style.less';
import type { TableBaseProps, TFilter } from './typing';
import {
	markExternalFilters,
	normalizeExternalConditions,
	normalizeFilters,
	reAddMetadata,
	splitFiltersBySource,
	stripFilterSource,
	stripMetadata,
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

	const searchableColumns = useMemo(() => {
		const flatColumns =
			props.columns?.map((item) => (item.children?.length ? [item, ...item.children] : [item])).flat() ?? [];
		const seen = new Set<string>();
		return flatColumns
			.filter((item) => {
				const isDefaultSearchable = item?.filterType === 'string';
				const enableGlobalSearch = item?.enableGlobalSearch ?? isDefaultSearchable;
				return enableGlobalSearch && item?.dataIndex && item.dataIndex !== 'index';
			})
			.reduce((result, item) => {
				const fieldKey = JSON.stringify(item.dataIndex);
				if (seen.has(fieldKey)) return result;
				seen.add(fieldKey);
				result.push(item.dataIndex);
				return result;
			}, [] as any[]);
	}, [props.columns]);

	const searchableFieldKeys = useMemo(
		() => new Set(searchableColumns.map((k) => JSON.stringify(k))),
		[searchableColumns],
	);

	const filters = useMemo<TFilter<T>[]>(() => {
		const normalized = normalizeFilters([...(externalFilters ?? []), ...(tableFilters ?? [])]);
		return reAddMetadata(normalized, props.columns ?? [], searchableFieldKeys, searchableColumns.length);
	}, [externalFilters, tableFilters, props.columns, searchableFieldKeys, searchableColumns]);

	const { externalFilters: activeExternalFilters } = useMemo(() => splitFiltersBySource(filters), [filters]);

	const handleSetFilters = useCallback(
		(nextFilters: TFilter<T>[] = []) => {
			const normalizedNextFilters = normalizeFilters(nextFilters);
			const { tableFilters: nextTableFilters, externalFilters: nextExternalFilters } =
				splitFiltersBySource(normalizedNextFilters);

			// Strip metadata before syncing to model (URL)
			model?.setFilters?.(stripMetadata(nextTableFilters));

			if (props.onExternalFiltersChange) {
				props.onExternalFiltersChange(stripFilterSource(stripMetadata(nextExternalFilters)));
			}
		},
		[model, props.onExternalFiltersChange],
	);

	const mergeExternalConditions = useCallback(
		(params: any) => {
			if (!externalRawConditions || Object.keys(externalRawConditions).length === 0) return params;

			const normalizedParams = params && typeof params === 'object' && !Array.isArray(params) ? params : {};

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
			return model?.getModel?.(mergeExternalConditions(params), stripMetadata(activeExternalFilters));
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
