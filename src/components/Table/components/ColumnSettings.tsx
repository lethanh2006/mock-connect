import { HolderOutlined, SettingOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Checkbox, Popover, Divider, Space, Popconfirm } from 'antd';
import React from 'react';
import { useIntl } from 'umi';
import { IColumnSetting, useTableContext } from './TableContext';
import { IColumn } from '../typing';

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
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    background: isDragging ? '#f5f5f5' : 'white',
    borderRadius: '4px',
    zIndex: isDragging ? 1 : 0,
    marginBottom: '2px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <HolderOutlined
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab', marginRight: 8, color: '#bfbfbf' }}
      />
      <Checkbox checked={visible} onChange={() => onToggle(id)}>
        <span style={{ fontSize: '13px' }}>{label}</span>
      </Checkbox>
    </div>
  );
};

export const ColumnSettings: React.FC = () => {
  const intl = useIntl();
  const { columnSettings, setColumnSettings, setColumnsWidth, columns, size } = useTableContext();
  const [visible, setVisible] = React.useState(false);
  const [tempSettings, setTempSettings] = React.useState<IColumnSetting[]>(columnSettings);
  const [shouldResetWidths, setShouldResetWidths] = React.useState(false);

  // Sync tempSettings khi mở Popover
  React.useEffect(() => {
    if (visible) {
      setTempSettings(columnSettings);
      setShouldResetWidths(false);
    }
  }, [visible, columnSettings]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
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
      items.map((item: IColumnSetting) => (item.key === key ? { ...item, visible: !item.visible } : item))
    );
  };

  const resetSettings = () => {
    const defaultSettings: IColumnSetting[] = columns.map((col: IColumn<any>) => ({
      key: String(col.key ?? (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string))),
      visible: col.hide !== true,
    }));
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

  const content = (
    <div style={{ width: 250 }}>
      <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <b style={{ fontSize: '14px' }}>
          {intl.formatMessage({ id: 'global.table.columnSetting.title' })}
        </b>
        <Popconfirm
          title={intl.formatMessage({ id: 'global.table.columnSetting.reset.confirm' })}
          onConfirm={resetSettings}
          placement='bottomRight'
        >
          <Button type='link' size='small' style={{ padding: 0 }}>
            {intl.formatMessage({ id: 'global.table.columnSetting.reset' })}
          </Button>
        </Popconfirm>
      </div>
      <Divider style={{ margin: '0' }} />
      <div style={{ maxHeight: 300, overflowY: 'auto', padding: '8px' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tempSettings.map((i: IColumnSetting) => i.key)} strategy={verticalListSortingStrategy}>
            {tempSettings.map((setting: IColumnSetting) => {
              const colDef = columns.find(
                (col: IColumn<any>) =>
                  String(
                    col.key ??
                    (Array.isArray(col.dataIndex) ? col.dataIndex.join('.') : (col.dataIndex as string) ?? col.title)
                  ) === setting.key
              );
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
      <Divider style={{ margin: '0' }} />
      <div style={{ padding: '8px 12px', textAlign: 'right' }}>
        <Space>
          <Button size='small' onClick={() => setVisible(false)}>
            {intl.formatMessage({ id: 'global.table.columnSetting.cancel' })}
          </Button>
          <Button size='small' type='primary' onClick={handleApply}>
            {intl.formatMessage({ id: 'global.table.columnSetting.apply' })}
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      placement='bottomRight'
      arrow={{ pointAtCenter: true }}
      open={visible}
      onOpenChange={setVisible}
      overlayStyle={{ padding: 0 }}
    >
      <Button
        icon={<SettingOutlined />}
        size={size}
        title={intl.formatMessage({ id: 'global.table.columnSetting.tooltip' })}
      />
    </Popover>
  );
};
