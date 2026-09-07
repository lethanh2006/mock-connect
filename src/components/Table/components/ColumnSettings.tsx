import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Icon6DotGridVertical, IconGear, Popover, PopoverContent, PopoverTrigger, Separator } from '@vinuni/ui';
import { Popconfirm } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import ButtonExtend from '../ButtonExtend';
import '../style.less';
import { IColumn } from '../typing';
import { getColumnKey, mergeColumnSettings } from '../utils';
import { IColumnSetting, useTableContext } from './TableContext';

interface SortableItemProps {
	id: string;
	label: string;
	visible: boolean;
	onToggle: (id: string) => void;
}

const SortableItem = ({ id, label, visible, onToggle }: SortableItemProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={isDragging ? 'column-settings-item is-dragging' : 'column-settings-item'}
		>
			<Icon6DotGridVertical {...attributes} {...listeners} className='column-settings-handle' size={16} />
			<label className='column-settings-checkbox-label'>
				<Checkbox size='sm' checked={visible} onCheckedChange={() => onToggle(id)} />
				<span className='column-settings-label'>{label}</span>
			</label>
		</div>
	);
};

export const ColumnSettings: React.FC = () => {
	const intl = useIntl();
	const { columnSettings, setColumnSettings, setColumnsWidth, columns, size } = useTableContext();
	const [visible, setVisible] = React.useState(false);
	const [tempSettings, setTempSettings] = React.useState<IColumnSetting[]>(columnSettings);
	const [shouldResetWidths, setShouldResetWidths] = React.useState(false);

	// Sync tempSettings khi mở Popover - Trộn giữa settings đã lưu và cột thực tế từ code
	React.useEffect(() => {
		if (visible) {
			const finalTempSettings = mergeColumnSettings(columnSettings, columns);
			setTempSettings(finalTempSettings);
			setShouldResetWidths(false);
		}
	}, [visible, columnSettings, columns]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setTempSettings((items: IColumnSetting[]) => {
				const oldIndex = items.findIndex((i: IColumnSetting) => i.key === active.id);
				const newIndex = items.findIndex((i: IColumnSetting) => i.key === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const toggleVisibility = (key: string) => {
		setTempSettings((items: IColumnSetting[]) =>
			items.map((item: IColumnSetting) => (item.key === key ? { ...item, visible: !item.visible } : item)),
		);
	};

	const resetSettings = () => {
		const defaultSettings: IColumnSetting[] = columns
			.map((col: IColumn<any>, idx: number) => ({
				key: getColumnKey(col, idx),
				visible: col.initialHide !== true,
				hide: col.hide,
			}))
			.filter((item: any) => item.hide !== true)
			.map(({ hide, ...rest }: any) => rest);

		setTempSettings(defaultSettings);
		setShouldResetWidths(true);
	};

	const handleApply = () => {
		setColumnSettings(tempSettings);
		if (shouldResetWidths) {
			setColumnsWidth({});
		}
		setVisible(false);
	};

	return (
		<Popover open={visible} onOpenChange={setVisible}>
			<PopoverTrigger asChild>
				<ButtonExtend
					className='no-print'
					icon={<IconGear />}
					size={size}
					tooltip={intl.formatMessage({ id: 'global.table.columnSetting.tooltip' })}
				/>
			</PopoverTrigger>
			<PopoverContent align='end' className='column-settings-popover no-print'>
				<div className='column-settings-content'>
					<div className='column-settings-header'>
						<b className='column-settings-title'>{intl.formatMessage({ id: 'global.table.columnSetting.title' })}</b>
						<Popconfirm
							title={intl.formatMessage({ id: 'global.table.columnSetting.reset.confirm' })}
							onConfirm={resetSettings}
							placement='bottomRight'
						>
							<Button variant='link' size='sm' className='column-settings-reset'>
								{intl.formatMessage({ id: 'global.table.columnSetting.reset' })}
							</Button>
						</Popconfirm>
					</div>

					<Separator className='column-settings-divider' />

					<div className='column-settings-list'>
						<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
							<SortableContext
								items={tempSettings.map((i: IColumnSetting) => i.key)}
								strategy={verticalListSortingStrategy}
							>
								{tempSettings.map((setting: IColumnSetting) => {
									const colDef = columns.find((col: IColumn<any>, idx: number) => getColumnKey(col, idx) === setting.key);
									return (
										<SortableItem
											key={setting.key}
											id={setting.key}
											label={(colDef?.title as string) || setting.key}
											visible={setting.visible}
											onToggle={toggleVisibility}
										/>
									);
								})}
							</SortableContext>
						</DndContext>
					</div>

					<Separator className='column-settings-divider' />

					<div className='column-settings-footer'>
						<div className='column-settings-footer-actions'>
							<Button variant='outline' size='sm' onClick={() => setVisible(false)}>
								{intl.formatMessage({ id: 'global.table.columnSetting.cancel' })}
							</Button>
							<Button variant='default' size='sm' onClick={handleApply}>
								{intl.formatMessage({ id: 'global.table.columnSetting.apply' })}
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
